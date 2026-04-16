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
          <label htmlFor="name" className="text-sm font-medium text-zinc-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="w-full rounded-xl border border-[#e5d5bf] bg-[#fbf7ef] px-4 py-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-violet-300/60 focus:ring-2 focus:ring-violet-300/30"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-[#e5d5bf] bg-[#fbf7ef] px-4 py-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-violet-300/60 focus:ring-2 focus:ring-violet-300/30"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-zinc-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            placeholder="Tell me about your idea..."
            className="w-full resize-none rounded-xl border border-[#e5d5bf] bg-[#fbf7ef] px-4 py-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-violet-300/60 focus:ring-2 focus:ring-violet-300/30"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
