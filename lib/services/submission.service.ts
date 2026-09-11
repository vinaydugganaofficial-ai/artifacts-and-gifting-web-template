import "server-only";

import { logger } from "@/lib/observability/logger";
import type { SubmissionReceipt } from "@/types/api";
import type { ContactInput, NewsletterInput } from "@/lib/api/schemas";

/**
 * Inbound submissions: newsletter sign-ups and correspondence.
 *
 * INTEGRATION SEAM: each function is where a real system is wired in — an ESP
 * for the newsletter, a ticketing inbox for contact. Until then they record an
 * auditable log line and return a receipt, so the UI contract is already final
 * and swapping in a real backend changes nothing above this layer.
 *
 * Orders are NOT handled here — they live in `order.service.ts`, which prices
 * and persists them.
 */

function receipt(prefix: string, message: string): SubmissionReceipt {
  return {
    id: `${prefix}_${globalThis.crypto.randomUUID()}`,
    receivedAt: new Date().toISOString(),
    message,
  };
}

export async function subscribeToNewsletter(
  input: NewsletterInput,
): Promise<SubmissionReceipt> {
  const result = receipt(
    "nl",
    "You are on the list. We write rarely, and only when it matters.",
  );

  // The address itself is redacted by the logger; the domain is enough to spot
  // an abusive sign-up pattern without retaining personal data in the logs.
  logger.info("Newsletter subscription received", {
    submissionId: result.id,
    emailDomain: input.email.split("@")[1] ?? "unknown",
  });

  return result;
}

export async function submitContactMessage(
  input: ContactInput,
): Promise<SubmissionReceipt> {
  const result = receipt(
    "msg",
    "Your message has reached the atelier. We reply to everything, usually within two working days.",
  );

  logger.info("Contact message received", {
    submissionId: result.id,
    subject: input.subject,
    messageLength: input.message.length,
  });

  return result;
}
