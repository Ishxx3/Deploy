import path from "node:path";

/**
 * Dossier des fichiers uploadés.
 * En production (Render, etc.) : définir DATA_DIR (ex. /var/data) → fichiers dans DATA_DIR/uploads.
 */
export const uploadsDir = process.env.DATA_DIR?.trim()
  ? path.join(process.env.DATA_DIR.trim(), "uploads")
  : path.join(process.cwd(), "uploads");
