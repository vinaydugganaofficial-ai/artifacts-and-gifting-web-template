"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import { layout } from "@/config/theme";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

/**
 * Restrained micro-dot cursor for fine-pointer desktop devices.
 * A tiny 6px dot that softly expands to 14px on interactive elements,
 * with no distracting text, glowing circles, or aggressive scaling.
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const finePointer = useMediaQuery(
    `(min-width: ${layout.cursorMinWidth}px) and (pointer: fine) and (hover: hover)`,
  );
  const enabled = finePointer && !reduce;

  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 450, damping: 35, mass: 0.15 });
  const springY = useSpring(y, { stiffness: 450, damping: 35, mass: 0.15 });

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);

      const target = (event.target as HTMLElement | null)?.closest(
        "a, button, [data-interactive], [role='button'], input, select",
      );
      setHovering(Boolean(target));
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[var(--z-cursor)] hidden md:block"
      style={{ x: springX, y: springY }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="rounded-full bg-forest pointer-events-none shadow-sm"
        animate={{
          width: hovering ? 12 : 6,
          height: hovering ? 12 : 6,
          x: hovering ? -6 : -3,
          y: hovering ? -6 : -3,
          backgroundColor: hovering ? "#a94f35" : "#243a2d",
          opacity: hovering ? 0.75 : 0.85,
        }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}
