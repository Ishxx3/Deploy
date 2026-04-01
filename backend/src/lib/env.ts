/** Images en data-URL (DB) : obligatoire sur Netlify Functions (pas de disque persistant). */
export function imagesAreInline(): boolean {
  return (
    process.env.IMAGES_INLINE === "1" ||
    process.env.NETLIFY === "true"
  );
}
