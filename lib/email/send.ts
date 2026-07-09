import { Resend } from "resend";

export async function sendAutoReply(to: string, subject: string, body: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("Resend not configured — skipping auto-reply send", { to, subject });
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "Religious Tours <inquiries@religioustours.com>",
    to,
    subject: `Re: ${subject}`,
    text: body,
  });
}
