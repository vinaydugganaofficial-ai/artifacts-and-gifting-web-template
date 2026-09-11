import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-terracotta",
  {
    variants: {
      variant: {
        primary: "bg-forest text-off-white hover:bg-forest-light shadow-sm",
        forest: "bg-forest text-off-white hover:bg-forest-light shadow-sm",
        terracotta: "bg-terracotta text-off-white hover:bg-terracotta-dark shadow-sm",
        sand: "bg-sand text-deep-brown hover:bg-sand-muted",
        ivory: "bg-off-white text-deep-brown hover:bg-sand border border-deep-brown/10",
        outline:
          "border border-deep-brown/25 bg-transparent text-deep-brown hover:border-forest hover:bg-forest hover:text-off-white",
        outlineIvory:
          "border border-sand/40 bg-transparent text-sand hover:border-sand hover:bg-sand hover:text-deep-brown",
        ghost: "bg-transparent text-deep-brown hover:text-terracotta",
        gold: "bg-transparent text-terracotta hover:text-terracotta-dark",
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
