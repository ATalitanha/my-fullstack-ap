"use client";
import { useEffect, useRef } from "react";
let _gsap: any = null;
async function loadGsap() {
  if (_gsap) return _gsap;
  const { default: gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);
  _gsap = gsap;
  return gsap;
}

export function useGsapContext() {
  const ctx = useRef<any>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const gsap = await loadGsap();
      if (!mounted) return;
      ctx.current = gsap.context(() => {});
    })();
    return () => {
      mounted = false;
      ctx.current?.revert?.();
    };
  }, []);
  return ctx;
}

export async function scrollReveal(target: any, vars: any = {}) {
  const gsap = await loadGsap();
  return gsap.from(target, {
    opacity: 0,
    y: 24,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: target as Element,
      start: "top 85%",
      toggleActions: "play none none none",
    },
    ...vars,
  });
}

export async function pageTransitionIn(overlay: Element | null) {
  if (!overlay) return;
  const gsap = await loadGsap();
  gsap.set(overlay, { yPercent: 100, opacity: 0, pointerEvents: "none" });
  return gsap.timeline()
    .set(overlay, { opacity: 1, pointerEvents: "auto" })
    .to(overlay, { yPercent: 0, duration: 0.35, ease: "power3.out" })
    .to(overlay, { opacity: 0, duration: 0.25, ease: "power2.out" }, ">-0.1")
    .set(overlay, { yPercent: 100, pointerEvents: "none" });
}

export async function pageTransitionOut(overlay: Element | null, onComplete?: () => void) {
  if (!overlay) return;
  const gsap = await loadGsap();
  gsap.set(overlay, { yPercent: 100, opacity: 0, pointerEvents: "none" });
  return gsap.timeline({ onComplete })
    .set(overlay, { opacity: 1, pointerEvents: "auto" })
    .to(overlay, { yPercent: 0, duration: 0.35, ease: "power3.out" });
}

