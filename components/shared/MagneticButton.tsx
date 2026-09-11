"use client";

import type { MouseEvent, MouseEventHandler, ReactNode } from "react";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonVariantProps } from "@/components/ui/button";

type MagneticButtonProps = ButtonVariantProps & {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit";
  ariaLabel?: string;
  disabled?: boolean;
};

/**
 * Button that drifts toward the pointer.
 *
 * The offset is written to motion values, so tracking the cursor costs no React
 * renders. Disabled entirely under reduced motion.
 */
export function MagneticButton({
  children,
  className,
  variant,
  size,
  onClick,
  type = "button",
  ariaLabel,
  disabled,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.2 });

  function onMove(event: MouseEvent<HTMLButtonElement>) {
    if (reduce || disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.18);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.18);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      style={{ x: springX, y: springY }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </motion.button>
  );
}
