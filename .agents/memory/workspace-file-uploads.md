---
name: Large connected-service uploads
description: Avoid data-transfer limits when sending workspace files through a connected-service API.
---

For large or binary workspace files uploaded through a connected-service proxy, read them with Node `fs` inside the same `"use impure"` function that makes the API request. Return only compact summaries to the durable context, and verify each upload against the expected content hash before committing.

**Why:** Moving file contents through `shellExec` or other file callbacks can exceed the durable runtime's aggregate per-block transfer budget even when each individual output is below its limit. Workspace files are accessible directly from Node `fs` inside an impure function, so the bytes can go straight to the connected service.

**How to apply:** Use this pattern for bulk asset or source uploads through an integration proxy. First confirm a workspace path is readable, then upload directly and validate the resulting object hashes.