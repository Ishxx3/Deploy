import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const preferredPort = Number(process.env.PORT) || 4000;
const app = createApp();

function startServer(port: number) {
  const server = http.createServer(app);
  server.listen(port, () => {
    const publicDir = path.join(process.cwd(), "public");
    const bundledSite = fs.existsSync(path.join(publicDir, "index.html"));
    const where = bundledSite ? "site + API" : "API";
    console.log(`RAA ${where} → http://localhost:${port}`);
    try {
      const portFile = path.join(__dirname, "../../.api-port");
      fs.writeFileSync(portFile, String(port), "utf8");
    } catch {
      /* ignore */
    }
  });
  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE" && port < 4020) {
      console.warn(
        `Port ${port} occupé — tentative sur ${port + 1}. (Fermez l’autre instance ou fixez PORT dans .env.)`
      );
      startServer(port + 1);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
}

startServer(preferredPort);
