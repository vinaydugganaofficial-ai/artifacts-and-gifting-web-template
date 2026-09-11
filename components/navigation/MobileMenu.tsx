"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion } from "framer-motion";

import type { NavLink } from "@/config/site";
import { easeTactile } from "@/lib/motion";

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wordmark: string;
  navLinks: readonly NavLink[];
  utilityLinks: readonly NavLink[];
  userName: string | null;
};

export function MobileMenu({
  open,
  onOpenChange,
  wordmark,
  navLinks,
  utilityLinks,
  userName,
}: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[var(--z-overlay)] bg-forest/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className="fixed inset-y-0 right-0 z-[var(--z-dialog)] w-[min(100vw,380px)] border-l border-copper/20 bg-off-white focus:outline-none shadow-2xl"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.35, ease: easeTactile }}
              >
                <VisuallyHidden>
                  <DialogPrimitive.Title>Menu</DialogPrimitive.Title>
                  <DialogPrimitive.Description>
                    Site navigation and gifting categories
                  </DialogPrimitive.Description>
                </VisuallyHidden>

                <div className="flex h-full flex-col px-6 py-6 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-copper/15 pb-4">
                    <span className="font-display text-xl tracking-[0.2em] font-medium text-forest">
                      {wordmark}
                    </span>
                    <DialogPrimitive.Close
                      aria-label="Close menu"
                      className="grid size-10 place-items-center text-forest/70 hover:text-forest hover:bg-forest/5 rounded-full"
                    >
                      <X className="size-5" />
                    </DialogPrimitive.Close>
                  </div>

                  <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
                    {navLinks.map((link, index) => {
                      const active =
                        link.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(link.href);

                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.05 * index,
                            duration: 0.3,
                            ease: easeTactile,
                          }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => onOpenChange(false)}
                            data-active={active}
                            aria-current={active ? "page" : undefined}
                            className="block py-2.5 font-display text-2xl text-forest hover:text-terracotta data-[active=true]:text-terracotta transition-colors"
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>

                  {/* Curated Gifting Quicklinks on Mobile */}
                  <div className="mt-8 rounded-lg bg-sand/40 p-4 border border-copper/15">
                    <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-terracotta">
                      Gifting by Occasion
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <Link
                        href="/gifting/corporate"
                        onClick={() => onOpenChange(false)}
                        className="text-deep-brown hover:text-terracotta"
                      >
                        Corporate
                      </Link>
                      <Link
                        href="/gifting/wedding"
                        onClick={() => onOpenChange(false)}
                        className="text-deep-brown hover:text-terracotta"
                      >
                        Wedding
                      </Link>
                      <Link
                        href="/gifting/festivals"
                        onClick={() => onOpenChange(false)}
                        className="text-deep-brown hover:text-terracotta"
                      >
                        Festivals
                      </Link>
                      <Link
                        href="/gifting/housewarming"
                        onClick={() => onOpenChange(false)}
                        className="text-deep-brown hover:text-terracotta"
                      >
                        Housewarming
                      </Link>
                    </div>
                  </div>

                  <div className="mt-auto space-y-4 border-t border-copper/15 pt-6 text-[11px] uppercase tracking-[0.22em] text-deep-brown/70">
                    {userName ? (
                      <p className="text-terracotta font-medium">Signed in as {userName}</p>
                    ) : (
                      <Link
                        href="/sign-in"
                        onClick={() => onOpenChange(false)}
                        className="block text-terracotta font-medium transition-colors hover:text-terracotta-dark"
                      >
                        Sign in / Register
                      </Link>
                    )}

                    {utilityLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => onOpenChange(false)}
                        className="block transition-colors hover:text-terracotta"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
