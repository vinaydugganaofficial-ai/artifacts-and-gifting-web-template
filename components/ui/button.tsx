import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold",
  {
    variants: {
      variant: {
        primary: "bg-charcoal text-ivory hover:bg-charcoal-soft",
        ivory: "bg-ivory text-charcoal hover:bg-ivory-deep",
        outline:
          "border border-charcoal/25 bg-transparent text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-ivory",
        outlineIvory:
          "border border-ivory/35 bg-transparent text-ivory hover:border-ivory hover:bg-ivory hover:text-charcoal",
        ghost: "bg-transparent text-charcoal hover:text-gold",
        gold: "bg-transparent text-gold hover:text-gold-soft",
      },
      size: {
        default: "h-12 px-7",
        sm: "h-10 px-5",
        lg: "h-14 px-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantProps & {
    /** Renders a busy state and blocks interaction while a request is in flight. */
    loading?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  type = "button",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      // `aria-busy` announces the pending state; `disabled` prevents the
      // double-submit that a slow network otherwise invites.
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
