"use client";

import type { ComponentProps } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Accordion primitive.
 *
 * `tone` keeps the component reusable on both grounds it is needed on — the
 * charcoal footer and the ivory FAQ page — instead of baking one surface's
 * colours into a shared component.
 */

export type AccordionTone = "light" | "dark";

export const Accordion = AccordionPrimitive.Root;

const itemTone: Record<AccordionTone, string> = {
  light: "border-b border-charcoal/12",
  dark: "border-b border-ivory/15",
};

const triggerTone: Record<AccordionTone, string> = {
  light: "text-charcoal/80 hover:text-gold-muted",
  dark: "text-ivory/80 hover:text-gold",
};

export function AccordionItem({
  className,
  tone = "dark",
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item> & { tone?: AccordionTone }) {
  return <AccordionPrimitive.Item className={cn(itemTone[tone], className)} {...props} />;
}

export function AccordionTrigger({
  className,
  tone = "dark",
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger> & { tone?: AccordionTone }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex flex-1 items-center justify-between gap-4 py-4 text-left text-[11px] uppercase tracking-[0.28em] transition-colors [&[data-state=open]>svg]:rotate-180",
          triggerTone[tone],
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className="size-3.5 shrink-0 text-gold transition-transform duration-500"
          aria-hidden
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      // Hook for the open/close keyframes defined in globals.css — Radix
      // measures the panel and exposes the height as a custom property.
      data-accordion-content=""
      className="overflow-hidden"
      {...props}
    >
      <div className={cn("pb-5", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
