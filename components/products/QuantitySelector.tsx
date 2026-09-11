"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  /** Named for screen readers, e.g. "Quantity for Brass Nataraja". */
  label?: string;
  className?: string;
};

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = siteConfig.commerce.maxQuantityPerItem,
  disabled = false,
  label = "Quantity",
  className,
}: QuantitySelectorProps) {
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center border border-charcoal/20",
        disabled && "opacity-40",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || atMin}
        className="grid size-11 place-items-center text-charcoal/70 transition-colors hover:text-charcoal disabled:cursor-not-allowed disabled:text-charcoal/25"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="size-3.5" />
      </button>

      {/* Announced as a live value so keyboard users hear the change. */}
      <span aria-live="polite" className="min-w-8 text-center text-sm tabular-nums">
        {value}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || atMax}
        className="grid size-11 place-items-center text-charcoal/70 transition-colors hover:text-charcoal disabled:cursor-not-allowed disabled:text-charcoal/25"
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
