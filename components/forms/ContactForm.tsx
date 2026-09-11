"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { contactSchema, CONTACT_SUBJECTS, type ContactInput } from "@/lib/api/schemas";
import { submitContact } from "@/lib/api/client";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

/** Correspondence form. Validated with the same schema `/api/contact` enforces. */
export function ContactForm() {
  const [receipt, setReceipt] = useState<{ id: string; message: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "commission",
      message: "",
      company: "",
    },
  });

  async function onSubmit(values: ContactInput) {
    setSubmitError(null);

    const result = await submitContact(values);

    if (result.ok) {
      setReceipt({ id: result.data.id, message: result.data.message });
      return;
    }

    setSubmitError(result.error.message);
  }

  if (receipt) {
    return (
      <div className="border border-gold/40 p-8 sm:p-10" role="status">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Sent</p>
        <h2 className="mt-4 font-display text-3xl leading-snug">
          Thank you for writing.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-charcoal/70">{receipt.message}</p>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-charcoal/45">
          Reference {receipt.id}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <Field htmlFor="contact-name" label="Your name" error={errors.name?.message}>
        <Input
          id="contact-name"
          autoComplete="name"
          invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          {...register("name")}
        />
      </Field>

      <Field htmlFor="contact-email" label="Email" error={errors.email?.message}>
        <Input
          id="contact-email"
          type="email"
          autoComplete="email"
          invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          {...register("email")}
        />
      </Field>

      <Field htmlFor="contact-subject" label="About" error={errors.subject?.message}>
        <Select
          id="contact-subject"
          invalid={Boolean(errors.subject)}
          {...register("subject")}
        >
          {CONTACT_SUBJECTS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        htmlFor="contact-message"
        label="Message"
        hint="For a commission, the form, approximate size and where it will stand are the most useful things to include."
        error={errors.message?.message}
      >
        <Textarea
          id="contact-message"
          rows={6}
          invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? "contact-message-error" : "contact-message-hint"
          }
          {...register("message")}
        />
      </Field>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      {submitError ? (
        <p role="alert" className="text-sm text-danger">
          {submitError}
        </p>
      ) : null}

      <Button
        type="submit"
        loading={isSubmitting}
        className="w-full sm:w-auto sm:min-w-52"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
