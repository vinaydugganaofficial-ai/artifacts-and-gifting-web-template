import { siteConfig } from "@/config/site";

/**
 * Phone number handling.
 *
 * Numbers are stored in E.164 (`+919820011223`) — one canonical form, so the
 * same person typing "98200 11223", "+91 98200 11223" or "0091-9820011223"
 * always resolves to the same account.
 *
 * Deliberately dependency-free and NOT `server-only`: the sign-in form uses the
 * same normaliser before it displays a number back to the customer, so client
 * and server can never disagree about what was entered.
 *
 * SCOPE: this validates shape, not existence — it accepts any plausible E.164
 * number. Swap in `libphonenumber-js` if you need per-country length rules.
 */

/** `+` followed by a country digit and 7–14 more. The E.164 maximum is 15. */
const E164 = /^\+[1-9]\d{7,14}$/;

export type PhoneParseResult = { ok: true; e164: string } | { ok: false; reason: string };

/**
 * Normalises user input to E.164.
 *
 * `defaultCountryCode` is applied only when the input carries no prefix of its
 * own, so an explicit `+44` is never overwritten by the default.
 */
export function normalizePhone(
  input: string,
  defaultCountryCode: string = siteConfig.auth.defaultCountryCode,
): PhoneParseResult {
  // Strip the punctuation people use for readability.
  const cleaned = input.replace(/[\s()\-.]/g, "");

  if (cleaned.length === 0) {
    return { ok: false, reason: "Enter your mobile number." };
  }

  if (/[^\d+]/.test(cleaned)) {
    return { ok: false, reason: "A number can only contain digits." };
  }

  let candidate: string;

  if (cleaned.startsWith("+")) {
    candidate = cleaned;
  } else if (cleaned.startsWith("00")) {
    // The international access prefix used across much of the world.
    candidate = `+${cleaned.slice(2)}`;
  } else {
    // A single leading zero is a national trunk prefix and is dropped.
    const national = cleaned.replace(/^0+/, "");
    candidate = `${defaultCountryCode}${national}`;
  }

  if (!E164.test(candidate)) {
    return { ok: false, reason: "That does not look like a mobile number." };
  }

  return { ok: true, e164: candidate };
}

/**
 * Splits E.164 into country code and national number.
 *
 * A regex cannot do this: country codes are 1–3 digits with no self-delimiting
 * marker, so `\d{1,3}` greedily eats a digit of the national number (turning
 * `+919820011223` into `+919` + `820011223`). The only correct approach is to
 * match against a known list, longest prefix first.
 */
function splitE164(e164: string): { country: string; national: string } | null {
  if (!e164.startsWith("+")) return null;

  const known = [...siteConfig.auth.countryCodes]
    .map((entry) => entry.code)
    .sort((a, b) => b.length - a.length);

  for (const code of known) {
    if (e164.startsWith(code) && e164.length > code.length) {
      return { country: code, national: e164.slice(code.length) };
    }
  }

  // Unknown code: assume the common 2-digit case rather than mangling it.
  const match = e164.match(/^(\+\d{2})(\d+)$/);
  return match ? { country: match[1], national: match[2] } : null;
}

/**
 * Groups a number for display: `+91 98200 11223`.
 *
 * Presentation only — never store the result.
 */
export function formatPhone(e164: string): string {
  const parts = splitE164(e164);
  if (!parts) return e164;

  const { country, national } = parts;

  if (national.length === 10) {
    return `${country} ${national.slice(0, 5)} ${national.slice(5)}`;
  }

  return `${country} ${national.replace(/(\d{3,4})(?=\d)/g, "$1 ")}`.trim();
}

/**
 * Masks a number for display where the full value is not needed:
 * `+91 •••••• 1223`.
 *
 * Always leaves exactly the last four digits visible — enough for the owner to
 * recognise their own number, not enough for anyone else to reconstruct it.
 */
export function maskPhone(e164: string): string {
  const parts = splitE164(e164);

  if (!parts) {
    // Unparseable: reveal nothing rather than guessing where to cut.
    return "•".repeat(Math.max(4, e164.length));
  }

  const { country, national } = parts;
  const visible = national.slice(-4);
  const hidden = "•".repeat(Math.max(0, national.length - 4));

  return `${country} ${hidden} ${visible}`.replace(/\s+/g, " ").trim();
}
