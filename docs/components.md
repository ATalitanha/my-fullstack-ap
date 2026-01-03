# Components & Props

- Button: uses `class-variance-authority` variants `variant` and `size`.
- Input: props extend native input, size variants `sm|md|lg`.
- Card: wraps content with elevated surface and border.
- Dialog: Radix-based primitives `Dialog`, `DialogTrigger`, `DialogContent`.
- Header: Radix `NavigationMenu`, `DropdownMenu`, auth-aware actions.
- Footer: links, copy, and policy; responsive grid layout.

Usage Guidelines
- Keep components headless and composable; prefer Radix primitives.
- Accept `className` for extension; avoid inline styles unless dynamic.
- Prefer semantic elements: `button`, `nav`, `header`, `main`, `footer`.
- Provide `aria-label`, `aria-expanded`, `aria-current` where applicable.

