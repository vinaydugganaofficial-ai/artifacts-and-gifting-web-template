"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User as UserIcon } from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

import type { NavLink } from "@/config/site";
import { layout } from "@/config/theme";
import { cn } from "@/lib/utils";
import {
  useCommerceStore,
  selectCartCount,
  selectWishlistCount,
} from "@/lib/store/commerce";
import { useUIStore } from "@/lib/store/ui";
import { useStoreBase } from "@/lib/use-store-base";
import { useSession } from "@/lib/hooks/use-session";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { SearchOverlay } from "@/components/navigation/SearchOverlay";
import { GiftingMegaMenu } from "@/components/navigation/GiftingMegaMenu";

type HeaderProps = {
  wordmark: string;
  navLinks: readonly NavLink[];
  utilityLinks: readonly NavLink[];
  searchSuggestions: readonly string[];
};

export function Header({
  wordmark,
  navLinks,
  utilityLinks,
  searchSuggestions,
}: HeaderProps) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [giftingMenuOpen, setGiftingMenuOpen] = useState(false);

  const cartCount = useStoreBase(useCommerceStore, selectCartCount, 0);
  const wishlistCount = useStoreBase(useCommerceStore, selectWishlistCount, 0);
  const cartPulse = useUIStore((state) => state.cartPulse);
  const { user } = useSession();

  const condensed = scrolled && !reduce;

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > layout.scrollThreshold);
  });

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-8 z-[var(--z-header)] transition-[background,border,box-shadow] duration-500",
          scrolled
            ? "border-b border-copper/15 bg-off-white/95 backdrop-blur-md shadow-sm"
            : "border-b border-copper/10 bg-sand/80 backdrop-blur-sm",
        )}
        initial={{ height: layout.header.base }}
        animate={{ height: condensed ? layout.header.condensed : layout.header.base }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 md:px-8 lg:px-12">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex flex-col text-forest group transition-opacity hover:opacity-90"
          >
            <span className="font-display text-2xl md:text-[1.65rem] tracking-[0.24em] font-medium leading-none">
              {wordmark}
            </span>
            <span className="text-[9px] uppercase tracking-[0.32em] text-copper/90 mt-1">
              Indian Heritage & Gifting
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {navLinks.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              const isGifting = link.hasMegaMenu || link.label.toLowerCase() === "gifting";

              if (isGifting) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setGiftingMenuOpen(true)}
                  >
                    <button
                      type="button"
                      onClick={() => setGiftingMenuOpen((prev) => !prev)}
                      aria-expanded={giftingMenuOpen}
                      className={cn(
                        "link-underline flex items-center gap-1 text-[11px] uppercase tracking-[0.26em] font-medium transition-colors py-2",
                        active || giftingMenuOpen
                          ? "text-terracotta"
                          : "text-forest hover:text-terracotta",
                      )}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={cn(
                          "size-3 transition-transform duration-300",
                          giftingMenuOpen && "rotate-180",
                        )}
                      />
                    </button>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "link-underline text-[11px] uppercase tracking-[0.26em] font-medium transition-colors py-2",
                    active ? "text-terracotta" : "text-forest hover:text-terracotta",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions (Search, Account, Wishlist, Cart) */}
          <div className="flex items-center gap-1 sm:gap-2 text-forest">
            <IconButton label="Search the collection" onClick={() => setSearchOpen(true)}>
              <Search className="size-[18px]" />
            </IconButton>

            <span className="hidden sm:inline">
              <IconLink
                href={user ? "/account" : "/sign-in"}
                label={user ? `Account, signed in as ${user.name}` : "Sign in"}
              >
                <UserIcon className="size-[18px]" />
              </IconLink>
            </span>

            <span className="hidden sm:inline">
              <IconLink
                href="/wishlist"
                label={
                  wishlistCount > 0
                    ? `Wishlist, ${wishlistCount} saved`
                    : "Wishlist, empty"
                }
              >
                <span className="relative">
                  <Heart className="size-[18px]" />
                  {wishlistCount > 0 ? <Count>{wishlistCount}</Count> : null}
                </span>
              </IconLink>
            </span>

            <IconLink
              href="/cart"
              label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart, empty"}
            >
              <motion.span
                key={cartPulse}
                animate={reduce ? undefined : { scale: [1, 1.15, 1] }}
                className="relative inline-flex"
              >
                <ShoppingBag className="size-[18px]" />
                {cartCount > 0 ? <Count>{cartCount}</Count> : null}
              </motion.span>
            </IconLink>

            <button
              type="button"
              className="grid size-11 place-items-center lg:hidden text-forest"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        {/* Gifting Mega Menu */}
        <GiftingMegaMenu
          isOpen={giftingMenuOpen}
          onClose={() => setGiftingMenuOpen(false)}
        />
      </motion.header>

      <MobileMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        wordmark={wordmark}
        navLinks={navLinks}
        utilityLinks={utilityLinks}
        userName={user?.name ?? null}
      />

      <SearchOverlay
        open={searchOpen}
        onOpenChange={setSearchOpen}
        suggestions={searchSuggestions}
      />
    </>
  );
}

const iconClass =
  "grid size-10 place-items-center text-forest/90 hover:text-terracotta transition-colors rounded-full hover:bg-forest/5";

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} aria-label={label} className={iconClass}>
      {children}
    </Link>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className={iconClass}>
      {children}
    </button>
  );
}

function Count({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 font-sans text-[9px] font-medium text-off-white"
    >
      {children}
    </span>
  );
}
