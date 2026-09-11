import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.24em]",
  {
    variants: {
      tone: {
        neutral: "bg-charcoal/8 text-charcoal/70",
        gold: "bg-gold/15 text-gold-muted",
        soldOut: "bg-charcoal text-ivory",
        onIvory: "bg-ivory/90 text-charcoal",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export type BadgeProps = VariantProps<typeof badgeVariants> & {
  children: React.ReactNode;
  className?: string;
};

export function Badge({ tone, className, children }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)}>{children}</span>;
}
