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
  /** Render : écouter sur 0.0.0.0 (obligatoire pour le health check) */
  const onRender = Boolean(process.env.RENDER);
  const publicDir = path.join(process.cwd(), "public");
  const bundledSite = fs.existsSync(path.join(publicDir, "index.html"));
  const where = bundledSite ? "site + API" : "API";
  const onListen = () => {
    console.log(`RAA ${where} → port ${port}${onRender ? " (0.0.0.0)" : ""}`);
    try {
      const portFile = path.join(__dirname, "../../.api-port");
      fs.writeFileSync(portFile, String(port), "utf8");
    } catch {
      /* ignore */
    }
  };
  if (onRender) {
    server.listen(port, "0.0.0.0", onListen);
  } else {
    server.listen(port, onListen);
  }
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
