# UI Testing & Verification

Cross-Browser
- Validate on latest Chrome, Firefox, Safari, Edge.
- Check CSS features (backdrop-filter, scrollbars) with graceful fallbacks.

Responsive
- Test `sm`, `md`, `lg`, `xl`, `2xl` breakpoints.
- Verify touch targets ≥ 44×44px and RTL layout correctness.

Animation Performance
- Profile with DevTools Performance; target 60fps.
- Use `will-change` sparingly; avoid animating layout-affecting properties.
- Confirm GSAP `ScrollTrigger` cleans up on unmount.

Accessibility
- Run Lighthouse, Axe DevTools; aim for WCAG 2.1 AA.
- Keyboard navigation: tab order, escape to close, focus management.
- ARIA: roles, `aria-live` for loading/status; labels for inputs.

