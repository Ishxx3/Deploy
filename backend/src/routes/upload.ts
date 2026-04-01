import { Router } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { authMiddleware } from "../middleware/auth.js";
import { uploadsDir } from "../lib/paths.js";
import { imagesAreInline } from "../lib/env.js";

export { uploadsDir };

const limits = { fileSize: 10 * 1024 * 1024, files: 120 };

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Seules les images sont acceptées"));
    return;
  }
  cb(null, true);
};

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const safe = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)
      ? ext
      : ".jpg";
    cb(null, `${randomUUID()}${safe}`);
  },
});

const diskUpload = multer({
  storage: diskStorage,
  limits,
  fileFilter,
});

const memUpload = multer({
  storage: multer.memoryStorage(),
  limits,
  fileFilter,
});

function getUploader() {
  return imagesAreInline() ? memUpload : diskUpload;
}

const router = Router();
router.use(authMiddleware);

router.post(
  "/upload",
  (req, res, next) => {
    getUploader().array("files", 80)(req, res, (err: unknown) => {
      if (err) {
        const msg = err instanceof Error ? err.message : "Upload impossible";
        return res.status(400).json({ error: msg });
      }
      next();
    });
  },
  (req, res) => {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files?.length) {
      return res.status(400).json({ error: "Aucun fichier" });
    }
    if (imagesAreInline()) {
      const urls = files.map((f) => {
        const buf = f.buffer;
        if (!buf) {
          return "";
        }
        return `data:${f.mimetype};base64,${buf.toString("base64")}`;
      }).filter(Boolean);
      return res.json({ urls });
    }
    const urls = files.map((f) => `/uploads/${f.filename}`);
    return res.json({ urls });
  }
);

export default router;
