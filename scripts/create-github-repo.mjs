import { ReplitConnectors } from "@replit/connectors-sdk";

const connectors = new ReplitConnectors();

async function main() {
  // Get authenticated user first
  const userResp = await connectors.proxy("github", "/user", { method: "GET" });
  const user = await userResp.json();
  console.log("Authenticated as:", user.login);

  // Create the repo
  const createResp = await connectors.proxy("github", "/user/repos", {
    method: "POST",
    body: JSON.stringify({
      name: "CS-X-GEM",
      description: "FinVault Investment Group — CS X GEM financial services platform",
      private: false,
      auto_init: true,
    }),
  });

  const repo = await createResp.json();

  if (repo.html_url) {
    console.log("✅ Repo created:", repo.html_url);
    console.log("Clone URL:", repo.clone_url);
    console.log("Full name:", repo.full_name);
  } else {
    // Might already exist
    console.log("Response:", JSON.stringify(repo, null, 2));
    if (repo.message?.includes("already exists")) {
      // Get existing repo
      const existResp = await connectors.proxy("github", `/repos/${user.login}/CS-X-GEM`, { method: "GET" });
      const existing = await existResp.json();
      console.log("✅ Existing repo found:", existing.html_url);
      console.log("Clone URL:", existing.clone_url);
    }
  }
}

main().catch(console.error);
