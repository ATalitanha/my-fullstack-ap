# Animations

- Libraries: GSAP (`gsap`), Framer Motion (`motion`, `AnimatePresence`).
- Entrances: use GSAP for hero fade and slide (`opacity: 0→1`, `y: 20→0`, `duration: 0.8`, `ease: power2.out`).
- Micro-interactions: scale `1→1.05` on hover, `1→0.95` on tap.
- Easing: `power2.out` for general UI, `expo.out` for spotlight reveals.
- Duration: 180–300ms for small interactions; 500–800ms for hero.
- Stagger: `0.05–0.15s` for lists to convey continuity.
- Accessibility: respect `prefers-reduced-motion`; avoid essential content hidden behind animation.

