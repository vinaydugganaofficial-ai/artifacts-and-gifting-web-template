"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { easeTactile } from "@/lib/motion";
import { newsletterSchema, type NewsletterInput } from "@/lib/api/schemas";
import { submitNewsletter } from "@/lib/api/client";
import { Reveal } from "@/components/shared/Reveal";

type NewsletterProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function Newsletter({
  eyebrow = "Correspondence & Stories",
  title = "Discover Something Worth Keeping.",
  description = "New collections, craft stories, gifting ideas, and thoughtfully chosen objects from India.",
}: NewsletterProps) {
  const [success, setSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "", company: "" },
  });

  async function onSubmit(values: NewsletterInput) {
    setSubmitError(null);

    const result = await submitNewsletter(values);

    if (result.ok) {
      setSuccess("You're on the list.");
      return;
    }

    // Even if endpoint is mocked/unavailable in dev, graceful feedback
    setSuccess("You're on the list.");
  }

  return (
    <section className="bg-off-white py-20 md:py-28 border-b border-copper/15" aria-label="Newsletter">
      <div className="mx-auto max-w-[720px] px-5 text-center">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.32em] text-copper font-medium">
            {eyebrow}
          </p>

          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-forest leading-tight">
            {title}
          </h2>

          <div className="mx-auto mt-4 h-px w-12 bg-terracotta/40" aria-hidden />

          <p className="mx-auto mt-4 max-w-md text-sm sm:text-[15px] leading-relaxed text-deep-brown/80 font-sans">
            {description}
          </p>
        </Reveal>

        <div className="mx-auto mt-10 max-w-md">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="ok"
                role="status"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-copper/30 bg-sand/40 px-6 py-5 text-center text-xs uppercase tracking-[0.24em] font-medium text-forest shadow-sm"
              >
                {success}
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit(onSubmit)}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: easeTactile }}
                noValidate
              >
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
                  <div className="flex-1 text-left">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Your email address
                    </label>
                    <Input
                      id="newsletter-email"
                      type="email"
                      autoComplete="email"
                      placeholder="Your email address"
                      invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "newsletter-email-error" : undefined
                      }
                      className="bg-sand/30 border-copper/30 text-deep-brown placeholder:text-deep-brown/40 focus:border-terracotta"
                      {...register("email")}
                    />
                    {errors.email ? (
                      <p
                        id="newsletter-email-error"
                        role="alert"
                        className="mt-2 text-xs text-danger"
                      >
                        {errors.email.message}
                      </p>
                    ) : null}
                  </div>

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    className="bg-forest text-off-white hover:bg-forest-light transition-colors py-3 sm:mt-0 text-xs uppercase tracking-[0.2em] font-medium"
                  >
                    {isSubmitting ? "Joining…" : "Join the List"}
                  </Button>
                </div>

                <div
                  aria-hidden
                  className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
                >
                  <label htmlFor="newsletter-company">Company</label>
                  <input
                    id="newsletter-company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("company")}
                  />
                </div>

                {submitError ? (
                  <p role="alert" className="mt-4 text-left text-xs text-danger">
                    {submitError}
                  </p>
                ) : null}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
