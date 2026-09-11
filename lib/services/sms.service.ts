import "server-only";

import { maskPhone } from "@/lib/auth/phone";
import { siteConfig } from "@/config/site";
import { logger } from "@/lib/observability/logger";

/**
 * SMS delivery.
 *
 * INTEGRATION SEAM: this is the one place a provider (Twilio, MSG91, AWS SNS)
 * is wired in. Nothing above it knows how a code travels.
 *
 * With no provider configured:
 *  - outside production the code is logged and returned to the caller, so the
 *    template can be used end to end without an SMS account;
 *  - in production that is refused, because silently "sending" nothing would
 *    lock every customer out with no visible cause.
 *
 * `ALLOW_CONSOLE_OTP=true` lifts the production refusal for a demo or staging
 * deployment. It is deliberately a separate, explicitly-named switch rather
 * than something that can be reached by accident: with it on, every code is
 * written to the log AND returned in the API response, so anyone who can read
 * either can sign in as anyone. Never set it on a real deployment.
 */

export type SendOtpInput = {
  phone: string;
  code: string;
  expiresInSeconds: number;
};

export type SendOtpResult = {
  channel: "sms" | "console";
  /** Non-production only, so the UI can show the code. Never set in production. */
  revealedCode?: string;
};

function isProviderConfigured(): boolean {
  return Boolean(process.env.SMS_PROVIDER_API_KEY);
}

/** Whether codes may be revealed instead of sent. */
function consoleDeliveryAllowed(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.ALLOW_CONSOLE_OTP === "true";
}

export async function sendOtpSms(input: SendOtpInput): Promise<SendOtpResult> {
  const minutes = Math.round(input.expiresInSeconds / 60);
  const message = `${input.code} is your ${siteConfig.name} verification code. It expires in ${minutes} minutes. Do not share it with anyone.`;

  if (isProviderConfigured()) {
    // ---------------------------------------------------------------------
    // Replace with your provider's client, e.g.
    //   await twilio.messages.create({ to: input.phone, from: …, body: message });
    // Throw on failure: `requestOtp` must not report success for a code that
    // was never sent.
    // ---------------------------------------------------------------------
    logger.info("OTP dispatched via SMS provider", {
      phone: maskPhone(input.phone),
      length: message.length,
    });

    return { channel: "sms" };
  }

  if (!consoleDeliveryAllowed()) {
    throw new Error(
      "No SMS provider is configured. Set SMS_PROVIDER_API_KEY and implement sendOtpSms before running in production, or set ALLOW_CONSOLE_OTP=true for a demo deployment.",
    );
  }

  if (process.env.NODE_ENV === "production") {
    logger.warn(
      "ALLOW_CONSOLE_OTP is on: verification codes are being revealed rather than sent. Never use this on a real deployment.",
    );
  }

  // No provider: the code goes to the server log and back to the browser.
  logger.info("OTP (no SMS provider configured — not for real deployments)", {
    phone: maskPhone(input.phone),
    code: input.code,
    expiresInSeconds: input.expiresInSeconds,
  });

  return { channel: "console", revealedCode: input.code };
}
