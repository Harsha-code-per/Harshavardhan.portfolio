"use client";

import { LoaderCircle } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { sendContactEmail } from "@/app/actions/sendEmail";

export function ContactForm() {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsPending(true);
    try {
      const result = await sendContactEmail(formData);

      if ("success" in result && result.success) {
        toast.success("Message sent successfully.");
        form.reset();
        return;
      }

      if ("error" in result) {
        toast.error(result.error);
      }
    } catch {
      toast.error("Unable to send message right now.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-[var(--text-secondary)]">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] px-[18px] py-[14px] text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:shadow-[0_0_0_3px_var(--accent-primary-glow)]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-[var(--text-secondary)]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] px-[18px] py-[14px] text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:shadow-[0_0_0_3px_var(--accent-primary-glow)]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-[var(--text-secondary)]">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            placeholder="Tell me about your idea..."
            className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] px-[18px] py-[14px] text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:shadow-[0_0_0_3px_var(--accent-primary-glow)]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] px-5 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary-glow)] disabled:cursor-not-allowed disabled:opacity-70"
        style={{ background: "var(--accent-primary)" }}
        onMouseEnter={(event) => {
          event.currentTarget.style.background = "var(--accent-primary-light)";
          event.currentTarget.style.boxShadow = "0 0 30px var(--accent-primary-glow)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.background = "var(--accent-primary)";
          event.currentTarget.style.boxShadow = "none";
        }}
      >
        {isPending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin text-[var(--accent-tertiary)]" />
            Sending...
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
