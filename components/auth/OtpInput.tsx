"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  /** Fired once the last box is filled, so the customer need not press submit. */
  onComplete?: (value: string) => void;
  length: number;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  "aria-describedby"?: string;
};

/**
 * Segmented code entry.
 *
 * Rendered as ONE input behind a row of boxes rather than one input per digit.
 * That keeps paste, autofill, SMS one-time-code autofill and screen readers
 * working normally — per-digit inputs break all four and are a common source of
 * accessibility complaints.
 */
export function OtpInput({
  value,
  onChange,
  onComplete,
  length,
  invalid = false,
  disabled = false,
  id = "otp-code",
  "aria-describedby": describedBy,
}: OtpInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const completedFor = useRef<string | null>(null);

  useEffect(() => {
    if (value.length !== length) {
      completedFor.current = null;
      return;
    }

    // Guarded so re-renders cannot fire the same completion twice.
    if (completedFor.current === value) return;
    completedFor.current = value;
    onComplete?.(value);
  }, [value, length, onComplete]);

  const digits = Array.from({ length }, (_, index) => value[index] ?? "");
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <div
      className="relative"
      onClick={() => inputRef.current?.focus()}
      role="presentation"
    >
      <input
        ref={inputRef}
        id={id}
        // `one-time-code` is what lets iOS and Android offer the code from the
        // SMS directly above the keyboard.
        autoComplete="one-time-code"
        inputMode="numeric"
        pattern="\d*"
        maxLength={length}
        value={value}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-label={`Verification code, ${length} digits`}
        onChange={(event) =>
          onChange(event.target.value.replace(/\D/g, "").slice(0, length))
        }
        // Transparent and stretched across the boxes: the caret and native
        // selection stay real, the boxes are pure decoration.
        className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
      />

      <div aria-hidden className="flex gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <span
            key={index}
            className={cn(
              "grid h-14 flex-1 place-items-center border text-xl tabular-nums transition-colors",
              invalid
                ? "border-danger text-danger"
                : digit
                  ? "border-gold/60 text-charcoal"
                  : "border-charcoal/20 text-charcoal/30",
              !disabled && index === activeIndex && !invalid && "border-gold",
              disabled && "opacity-50",
            )}
          >
            {digit || "·"}
          </span>
        ))}
      </div>
    </div>
  );
}
