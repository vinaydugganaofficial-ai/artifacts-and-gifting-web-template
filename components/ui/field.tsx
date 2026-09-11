import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

/**
 * Form primitives.
 *
 * Each control takes an `invalid` flag rather than reading form state itself,
 * so they stay presentational and reusable with any form library.
 */

const controlBase =
  "w-full border-0 border-b bg-transparent px-0 text-sm tracking-wide text-deep-brown placeholder:text-deep-brown/40 focus:outline-none transition-colors";

const controlTone = (invalid?: boolean) =>
  invalid
    ? "border-b-danger focus:border-b-danger"
    : "border-b-deep-brown/25 focus:border-b-terracotta";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(controlBase, controlTone(invalid), "h-12", className)}
      {...props}
    />
  );
}

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function Textarea({ className, invalid, rows = 5, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(controlBase, controlTone(invalid), "resize-y py-3", className)}
      {...props}
    />
  );
}

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export function Select({ className, invalid, children, ...props }: SelectProps) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={cn(controlBase, controlTone(invalid), "h-12 cursor-pointer", className)}
      {...props}
    >
      {children}
    </select>
  );
}

export type FieldProps = {
  /** Must match the control's `id` so the label is programmatically associated. */
  htmlFor: string;
  label: string;
  /** Visually hides the label while keeping it available to screen readers. */
  hideLabel?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Label + control + message. The error is wired to the control by convention:
 * pass `aria-describedby={`${id}-error`}` on the control when `error` is set.
 */
export function Field({
  htmlFor,
  label,
  hideLabel = false,
  error,
  hint,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2 text-left", className)}>
      <label
        htmlFor={htmlFor}
        className={cn(
          "text-[10px] uppercase tracking-[0.22em] text-deep-brown/60",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </label>

      {children}

      {hint && !error ? (
        <p id={`${htmlFor}-hint`} className="text-xs text-deep-brown/50">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
