import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const releaseRoot = path.join(root, "release");
const name = `Mindo-v${pkg.version}`;
const staging = path.join(releaseRoot, name);
const zipPath = path.join(releaseRoot, `${name}.zip`);

fs.rmSync(staging, { recursive: true, force: true });
fs.rmSync(zipPath, { force: true });
fs.mkdirSync(staging, { recursive: true });

const copyItems = [
  "app",
  "electron",
  "docs",
  "scripts",
  "capacitor.config.json",
  "README.md",
  "GITHUB_RELEASE.md",
  "package.json"
];

for (const item of copyItems) {
  fs.cpSync(path.join(root, item), path.join(staging, item), { recursive: true });
}

fs.writeFileSync(path.join(staging, "INSTALL.txt"), `Mindo ${pkg.version}

Static version:
1. Open app/index.html in a browser.

Desktop development version:
1. Run npm install
2. Run npm run start

GitHub release notes:
See docs/API_CONTRACT.md for reserved native interfaces.
`);

execFileSync("zip", ["-qr", zipPath, name], { cwd: releaseRoot });
console.log(`Created ${zipPath}`);
