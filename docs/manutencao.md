# Manutencao Preventiva

## Integração Contínua (CI)

O workflow `.github/workflows/ci.yml` (GitHub Actions) roda em **todo push/PR para a `main`**
e espelha o "Checklist Antes de Qualquer Commit":

- Job `validate` — `npm ci` → `tsc --noEmit` → `eslint` → `vitest` → `next build`
- Job `e2e` — instala o chromium do Playwright, roda os 25 specs E2E e publica o
  `playwright-report` como artifact (7 dias)
- `concurrency` cancela execuções antigas do mesmo ref

A `main` está blindada: regressões silenciosas (contadores defasados, testes quebrados)
são pegas no PR. O script `scripts/check-constants.ts` reconcilia os contadores
hardcoded contra os arrays reais — rode `npx tsx scripts/check-constants.ts` antes de
qualquer mudança que mexa em rotas, badges, checkpoints, quiz ou busca.

## Cronograma de auditoria

### Semanal
- [ ] Verificar se novas variaveis `NEXT_PUBLIC_` adicionadas sao realmente necessarias no cliente
- [ ] Validar logs do Nginx em busca de brute-force ou scans automatizados
- [ ] Confirmar que `.env` de producao nao foi exposto ou alterado

### Mensal
- [ ] `npm audit` — manter em **0 vulnerabilidades** (estado atual: Next 16.2.6 +
      `overrides.postcss ^8.5.10` no `package.json`)
- [ ] Revisar permissoes de escrita nos diretorios do servidor
- [ ] Validar sanitizacao de XSS em novos inputs adicionados

### Trimestral
- [ ] Revisar regras de `iptables` do servidor de producao
- [ ] Renovar certificados SSL (se nao forem auto-renovaveis)
- [ ] Testar restore de backups de configuracao (disaster recovery)

---
[<- Voltar ao indice](README.md)
