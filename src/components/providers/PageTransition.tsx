"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { pageTransitionIn, pageTransitionOut } from "@/lib/animations";

export default function PageTransition() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<any>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    let mounted = true;
    (async () => {
      const tl = await pageTransitionIn(overlay);
      if (!mounted) {
        tl?.kill?.();
        return;
      }
      tlRef.current = tl;
    })();
    return () => {
      mounted = false;
      tlRef.current?.kill?.();
      tlRef.current = null;
    };
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-50 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 opacity-0"
    />
  );
}
