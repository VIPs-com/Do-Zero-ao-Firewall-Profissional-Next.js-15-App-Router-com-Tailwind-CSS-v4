# Acessibilidade — WCAG 2.1 AA (Sprint C)

O projeto tem conformidade **WCAG 2.1 AA** implementada e validada estaticamente pelo `eslint-plugin-jsx-a11y`.

## Modais (`DeepDiveModal`, `GlobalSearch`)

- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` + `aria-describedby`
- Focus trap via `useFocusTrap()` em `src/lib/useFocusTrap.ts`:
  - Tab/Shift+Tab circulam entre elementos focáveis
  - ESC fecha
  - Foco retorna ao elemento que abriu o modal (WCAG 3.2.1)
- `GlobalSearch` segue o padrão WAI-ARIA **combobox + listbox**:
  - `aria-activedescendant`, `aria-expanded`, `aria-controls`
  - Setas navegam resultados, Enter seleciona, ESC fecha

## Animações

- `useReducedMotion()` da `motion/react` aplicado nos modais
- Bloco `@media (prefers-reduced-motion: reduce)` global em `globals.css` zera:
  - `animation-duration`, `animation-iteration-count`
  - `transition-duration`
  - `scroll-behavior`
- Atende WCAG 2.3.3 (Animation from Interactions)

## Foco visível

```css
/* globals.css */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

Atende WCAG 2.4.7 (Focus Visible). Usa `:focus-visible` (não `:focus`) para não poluir interações de mouse.

## Lint estático

`eslint.config.mjs` (flat config) ativa `eslint-plugin-jsx-a11y` com regras estritas:

- `aria-props`, `aria-proptypes`, `aria-unsupported-elements`
- `role-has-required-aria-props`, `role-supports-aria-props`
- `tabindex-no-positive`
- `label-has-associated-control`
- `no-autofocus`, `no-redundant-roles`
- `click-events-have-key-events`, `no-noninteractive-element-interactions`

**Comando:** `npm run lint:eslint` — zero warnings é o alvo. Qualquer regressão de a11y é pega no CI antes do merge.

---
[← Voltar ao indice](README.md)
