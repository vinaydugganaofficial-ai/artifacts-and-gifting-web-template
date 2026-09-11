"use client";

import type { ReactNode } from "react";

import { CustomCursor } from "@/components/shared/CustomCursor";
import { Toast } from "@/components/shared/Toast";
import { QuickView } from "@/components/products/QuickView";

/**
 * App-wide singletons mounted once beneath the root layout.
 *
 * Each reads what it needs from the UI store rather than taking props, so they
 * can be triggered from anywhere in the tree without prop drilling.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <QuickView />
      <Toast />
      <CustomCursor />
    </>
  );
}
