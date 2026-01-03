# Style Guide

- Typography: fluid scale (`--text-fluid-*`), headings use `text-[clamp(...)]`.
- Color System: light/dark variables, ensure contrast AA.
- Spacing: 8px base; components follow 12–24px paddings.
- Elevation: soft/strong shadows via tokens; borders at `white/40` or `gray-700/40`.
- Radius: `--radius-md` default; interactive elements rounded-2xl.
- Motion: GSAP for entrances, Framer Motion for layout; reduced-motion supported.
- Icons: `lucide-react` sized to text; use semantic labels.
- RTL: `dir="rtl"` root; alignments right-first.

Components
- Button: gradient primary, soft neutral; disabled state 60% opacity.
- Input: sizes `sm|md|lg`, focus ring consistent, icon-leading padding.
- Card: surface `bg-white/80`, border, blur backdrop.
- Dialog: overlay `bg-black/40`, rounded content.

Breakpoints
- `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.

