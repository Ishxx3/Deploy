import fs from "node:fs";
import path from "node:path";
import express from "express";
import "express-async-errors";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import vehiclesRoutes from "./routes/vehicles.js";
import inquiriesRoutes from "./routes/inquiries.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";
import { uploadsDir } from "./lib/paths.js";
import { imagesAreInline } from "./lib/env.js";

export type CreateAppOptions = {
  /** API seule (Netlify Functions), pas de fichiers statiques ni SPA */
  apiOnly?: boolean;
};

export function createApp(options: CreateAppOptions = {}): express.Express {
  const apiOnly = options.apiOnly ?? false;
  const app = express();
  const publicDir = path.join(process.cwd(), "public");
  const bundledSite =
    !apiOnly && fs.existsSync(path.join(publicDir, "index.html"));
  const inline = imagesAreInline();

  if (!inline) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const corsOrigins = [
    "http://localhost:5173",
    ...(process.env.FRONTEND_ORIGIN?.split(",")
      .map((o) => o.trim())
      .filter(Boolean) ?? []),
  ];

  app.use(
    cors({
      origin:
        apiOnly || (bundledSite && !process.env.FRONTEND_ORIGIN)
          ? true
          : corsOrigins.length
            ? corsOrigins
            : ["http://localhost:5173"],
      credentials: true,
    })
  );
  app.use(express.json({ limit: inline ? "25mb" : "2mb" }));

  if (!inline) {
    app.use("/uploads", express.static(uploadsDir));
  }

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "RAA API" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/vehicles", vehiclesRoutes);
  app.use("/api/inquiries", inquiriesRoutes);
  app.use("/api/admin", uploadRoutes);
  app.use("/api/admin", adminRoutes);

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error("[RAA API]", err);
      if (res.headersSent) return;
      const message =
        err instanceof Error ? err.message : "Erreur serveur";
      res.status(500).json({ error: message });
    }
  );

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  if (bundledSite) {
    app.use(express.static(publicDir, { index: false }));
    app.use((req, res, next) => {
      if (req.method !== "GET") {
        return next();
      }
      if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
        return next();
      }
      res.sendFile(path.join(publicDir, "index.html"));
    });
    app.use((_req, res) => {
      res.status(404).json({ error: "Not found" });
    });
  } else {
    app.use((_req, res) => {
      res.status(404).json({ error: "Not found" });
    });
  }

  return app;
}
