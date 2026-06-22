"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/i18n/types";

type FormLabels = Dictionary["contact"]["form"];

interface ContactFormProps {
  className?: string;
  labels: FormLabels;
}

export function ContactForm({ className, labels }: ContactFormProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to send message");
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/50 px-4 py-3 text-sm text-black placeholder:text-[var(--color-text-dim)] transition-colors focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40";

  const labelClass = "mb-2 block aw-label text-[var(--color-text-dim)]";

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            {labels.name} *
          </label>
          <input
            id="name"
            name="name"
            required
            className={inputClass}
            placeholder={labels.placeholders.name}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            {labels.email} *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
            placeholder={labels.placeholders.email}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className={labelClass}>
            {labels.company}
          </label>
          <input
            id="company"
            name="company"
            className={inputClass}
            placeholder={labels.placeholders.company}
          />
        </div>
        <div>
          <label htmlFor="subject" className={labelClass}>
            {labels.subject} *
          </label>
          <input
            id="subject"
            name="subject"
            required
            className={inputClass}
            placeholder={labels.placeholders.subject}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={labelClass}>
          {labels.message} *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${inputClass} resize-none`}
          placeholder={labels.placeholders.message}
        />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          variant="accent"
          size="lg"
          disabled={status === "loading"}
        >
          {status === "loading" ? labels.submitting : labels.submit}
        </Button>

        {status === "success" && (
          <p className="text-sm font-medium text-emerald-700">{labels.success}</p>
        )}

        {status === "error" && (
          <p className="text-sm font-medium text-red-600">{errorMessage}</p>
        )}
      </div>
    </form>
  );
}
