"use client";

import { cn } from "@/lib/utils";

export type CountryCode = {
  code: string;
  label: string;
};

type PhoneFieldProps = {
  id: string;
  label: string;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  value: string;
  onChange: (value: string) => void;
  countryCodes: readonly CountryCode[];
  error?: string;
  hint?: string;
  disabled?: boolean;
  autoFocus?: boolean;
};

/**
 * Country code + national number.
 *
 * Split into two controls so the customer never has to think about the
 * international prefix. The two are recombined before submission, and the
 * server normalises whatever arrives with `normalizePhone`, so a pasted full
 * international number still works.
 */
export function PhoneField({
  id,
  label,
  countryCode,
  onCountryCodeChange,
  value,
  onChange,
  countryCodes,
  error,
  hint,
  disabled = false,
  autoFocus = false,
}: PhoneFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="flex flex-col gap-2 text-left">
      <label
        htmlFor={id}
        className="text-[10px] uppercase tracking-[0.22em] text-charcoal/50"
      >
        {label}
      </label>

      <div
        className={cn(
          "flex items-stretch border-b transition-colors",
          error ? "border-b-danger" : "border-b-charcoal/25 focus-within:border-b-gold",
        )}
      >
        <label htmlFor={`${id}-country`} className="sr-only">
          Country code
        </label>

        <select
          id={`${id}-country`}
          value={countryCode}
          disabled={disabled}
          onChange={(event) => onCountryCodeChange(event.target.value)}
          className="h-12 shrink-0 cursor-pointer border-0 bg-transparent pr-3 text-sm tabular-nums text-charcoal/80 focus:outline-none"
        >
          {countryCodes.map((entry) => (
            <option key={entry.code} value={entry.code}>
              {entry.code}
            </option>
          ))}
        </select>

        <span aria-hidden className="my-3 w-px bg-charcoal/15" />

        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          autoFocus={autoFocus}
          disabled={disabled}
          value={value}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          placeholder="98200 11223"
          // Digits and separators only; the server has the final say on shape.
          onChange={(event) => onChange(event.target.value.replace(/[^\d\s-]/g, ""))}
          className="h-12 w-full min-w-0 border-0 bg-transparent px-3 text-sm tracking-wide text-charcoal placeholder:text-charcoal/35 focus:outline-none"
        />
      </div>

      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-charcoal/50">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
