"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendContactEmailResult = { success: true } | { error: string };

export async function sendContactEmail(
  formData: FormData
): Promise<SendContactEmailResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }

  const toEmail = process.env.RESEND_TO_EMAIL;

  if (!toEmail) {
    return { error: "RESEND_TO_EMAIL is not configured." };
  }

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: [toEmail],
    replyTo: email,
    subject: `New portfolio contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

