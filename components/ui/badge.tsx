import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.24em]",
  {
    variants: {
      tone: {
        neutral: "bg-deep-brown/8 text-deep-brown/80",
        gold: "bg-saffron/15 text-saffron",
        saffron: "bg-saffron/15 text-saffron",
        terracotta: "bg-terracotta/15 text-terracotta font-medium",
        forest: "bg-forest/15 text-forest font-medium",
        soldOut: "bg-deep-brown text-off-white",
        onIvory: "bg-off-white/95 text-deep-brown border border-deep-brown/10",
        onOffWhite: "bg-off-white/95 text-deep-brown border border-deep-brown/10",
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
