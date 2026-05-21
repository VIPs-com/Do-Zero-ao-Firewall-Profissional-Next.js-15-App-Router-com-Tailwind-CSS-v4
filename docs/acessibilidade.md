# Acessibilidade — WCAG 2.1 AA (Sprint C)

O projeto tem conformidade **WCAG 2.1 AA** implementada, validada estaticamente pelo
`eslint-plugin-jsx-a11y` **e em runtime pelo axe-core** — 0 violações nas 92 rotas
(ver seção "Baseline axe em runtime" no fim).

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

## Baseline axe em runtime (Sprints A11Y + A11Y-EXT)

O lint estático é complementado por uma verificação **em runtime** com `@axe-core/playwright`:
o spec **`e2e/25-a11y-baseline.spec.ts`** roda o motor axe-core sob as tags WCAG 2.1 A/AA em
**todas as 92 rotas do `ROUTE_SEO`** (importa as chaves — rota nova entra de graça, como o
smoke test 15). O `KNOWN_BASELINE` está **vazio**: o spec exige **zero violações** — qualquer
violação, em qualquer rota, quebra o CI.

A dívida histórica foi eliminada na fonte:
- **color-contrast** — token `--color-accent-strong` p/ fundos de botão (branco 4.5:1),
  `--color-text-3` elevado, `.code-lang`/links/indigo/`var(--mod)` ajustados.
- **nested-interactive** — SVG da topologia `role="group"`, accordions com toggle e link
  como irmãos, abas com `role="tablist"`.
- **aria-required-children** — `TroubleshootingCard` com `role="list"` só de `listitem`.
- **scrollable-region-focusable** — `<pre>` do CodeBlock com `tabIndex={0}` + `role="region"`.

**Estado:** 0 violações axe-core WCAG 2.1 A/AA em 100% das rotas. Se uma regressão exigir
dívida temporária, adicione o id ao `KNOWN_BASELINE` **com comentário e issue** — nunca em silêncio.

---
[← Voltar ao indice](README.md)
