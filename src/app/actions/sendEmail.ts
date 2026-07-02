"use server";

import { Resend } from "resend";
import { PRIMARY_EMAIL } from "@/data/profile";
import { validateContactInput } from "@/lib/validation";

type SendContactEmailResult = { success: true } | { error: string };

export async function sendContactEmail(
  formData: FormData
): Promise<SendContactEmailResult> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const message = String(formData.get("message") ?? "");
  const botField = String(formData.get("botField") ?? "");

  // 1. Perform validation (Honeypot, Presence, Lengths, Email Format)
  const validation = validateContactInput({ name, email, message, botField });
  if (!validation.isValid) {
    return { error: validation.error || "Validation failed." };
  }

  // 2. Perform safe Resend config verification
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[ERROR] Contact system cannot route email: RESEND_API_KEY is not configured.");
    return { error: "Email service is temporarily offline. Please try again later." };
  }

  const toEmail = process.env.RESEND_TO_EMAIL || PRIMARY_EMAIL;
  if (!toEmail) {
    return { error: "Recipient email address is not configured." };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [toEmail],
      replyTo: email.trim(),
      subject: `New portfolio contact from ${name.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("[ERROR] Unhandled exception sending email:", err);
    return { error: "Failed to route message. Transceiver gateway error." };
  }
}

