import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-2xl flex-col justify-center px-5 py-32">
      <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-terracotta">404</p>

      <h1 className="mt-4 font-display text-5xl text-forest">This piece is not here.</h1>

      <span className="mt-6 block h-px w-16 bg-terracotta" aria-hidden />

      <p className="mt-6 text-deep-brown/75">
        The page may have moved, or the artifact has not yet entered our curated collection.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/shop" className={cn(buttonVariants({ variant: "forest" }))}>
          Browse the collection
        </Link>
        <Link href="/" className={cn(buttonVariants({ variant: "sand" }))}>
          Return home
        </Link>
      </div>
    </section>
  );
}
