import nodemailer from "nodemailer";

export type InquiryMailPayload = {
  name: string;
  email: string;
  phone: string | null;
  message: string;
  vehicleTitle: string | null;
};

function getTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) return null;

  const port = Number(process.env.SMTP_PORT) || 587;
  const secure =
    process.env.SMTP_SECURE === "true" || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });
}

function parseRecipients(): string[] {
  const raw =
    process.env.MAIL_TO ||
    process.env.NOTIFY_EMAIL ||
    "";
  return raw
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Envoie une notification par e-mail pour une nouvelle demande RAA.
 * Si SMTP n’est pas configuré, ne fait rien (les données restent en base).
 */
export async function sendInquiryNotification(
  data: InquiryMailPayload
): Promise<{ sent: boolean; error?: string }> {
  const transporter = getTransporter();
  const recipients = parseRecipients();

  if (!transporter || recipients.length === 0) {
    console.warn(
      "[mail] SMTP_HOST ou MAIL_TO manquant — e-mail non envoyé (demande enregistrée en base)."
    );
    return { sent: false };
  }

  const from =
    process.env.MAIL_FROM?.trim() ||
    process.env.SMTP_USER ||
    "RAA <noreply@localhost>";

  const subject = data.vehicleTitle
    ? `[RAA] Demande — ${data.vehicleTitle}`
    : "[RAA] Nouvelle demande (contact)";

  const text = [
    "Nouvelle demande sur la plateforme RAA",
    "",
    `Nom : ${data.name}`,
    `E-mail : ${data.email}`,
    data.phone ? `Téléphone : ${data.phone}` : "Téléphone : —",
    data.vehicleTitle
      ? `Véhicule : ${data.vehicleTitle}`
      : "Type : contact général",
    "",
    "Message :",
    data.message,
    "",
    "---",
    "Renaissance Automobile Africaine",
  ].join("\n");

  const html = `
  <div style="font-family:system-ui,Segoe UI,sans-serif;font-size:15px;line-height:1.5;color:#1a1a1a;">
    <p style="margin:0 0 12px;font-weight:600;color:#1a3c34;">Nouvelle demande — RAA</p>
    <table style="border-collapse:collapse;margin-bottom:16px;">
      <tr><td style="padding:4px 12px 4px 0;color:#666;">Nom</td><td><strong>${escapeHtml(data.name)}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666;">E-mail</td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666;">Téléphone</td><td>${data.phone ? escapeHtml(data.phone) : "—"}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666;">Contexte</td><td>${data.vehicleTitle ? escapeHtml(data.vehicleTitle) : "Contact général"}</td></tr>
    </table>
    <p style="margin:0 0 8px;font-weight:600;">Message</p>
    <div style="padding:12px 14px;background:#f6f1e7;border-radius:8px;border:1px solid #e8e0d4;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
    <p style="margin:20px 0 0;font-size:12px;color:#888;">Renaissance Automobile Africaine — notification automatique</p>
  </div>`;

  try {
    await transporter.sendMail({
      from,
      to: recipients,
      replyTo: data.email,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[mail] Échec envoi e-mail:", msg);
    return { sent: false, error: msg };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
