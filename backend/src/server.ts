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
  /**
   * Render (et la plupart des PaaS) définissent PORT. Le health check interne
   * tape l’app sur ce port : il faut écouter sur 0.0.0.0, pas seulement localhost.
   * (process.env.RENDER n’est pas toujours présent selon les images.)
   */
  const bindAllInterfaces = process.env.PORT != null && process.env.PORT !== "";
  const publicDir = path.join(process.cwd(), "public");
  const bundledSite = fs.existsSync(path.join(publicDir, "index.html"));
  const where = bundledSite ? "site + API" : "API";
  const onListen = () => {
    console.log(
      `RAA ${where} → port ${port}${bindAllInterfaces ? " (0.0.0.0)" : ""}`
    );
    try {
      const portFile = path.join(__dirname, "../../.api-port");
      fs.writeFileSync(portFile, String(port), "utf8");
    } catch {
      /* ignore */
    }
  };
  if (bindAllInterfaces) {
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
