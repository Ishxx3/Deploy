/**
 * Build Render : frontend (Vite) → backend/public, puis API (tsc + Prisma).
 * Tout est servi sur la même URL (plus de VITE_API_URL / Netlify obligatoire).
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const run = (cmd, cwd = root) => {
  execSync(cmd, { cwd, stdio: "inherit", shell: true });
};

/**
 * Render fixe souvent NODE_ENV=production au build : sans ça, npm omet les
 * devDependencies → pas de vite/typescript/@types → échec de `tsc` / `vite build`.
 */
run("npm install --prefix frontend --include=dev");
run("npm run build --prefix frontend");
run("npm install --prefix backend --include=dev");

const pub = path.join(root, "backend", "public");
const dist = path.join(root, "frontend", "dist");
if (!existsSync(dist)) {
  throw new Error("frontend/dist introuvable après le build");
}
if (existsSync(pub)) rmSync(pub, { recursive: true });
mkdirSync(pub, { recursive: true });
cpSync(dist, pub, { recursive: true });

mkdirSync(path.join(root, "backend", "data"), { recursive: true });

run("npx prisma generate && npx prisma db push && npm run build", path.join(root, "backend"));
