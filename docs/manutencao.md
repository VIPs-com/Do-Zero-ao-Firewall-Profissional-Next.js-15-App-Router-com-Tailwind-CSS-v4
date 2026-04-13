# Manutencao Preventiva

## Cronograma de auditoria

### Semanal
- [ ] Verificar se novas variaveis `NEXT_PUBLIC_` adicionadas sao realmente necessarias no cliente
- [ ] Validar logs do Nginx em busca de brute-force ou scans automatizados
- [ ] Confirmar que `.env` de producao nao foi exposto ou alterado

### Mensal
- [ ] `npm audit` — corrigir vulnerabilidades criticas e altas
- [ ] Revisar permissoes de escrita nos diretorios do servidor
- [ ] Validar sanitizacao de XSS em novos inputs adicionados

### Trimestral
- [ ] Revisar regras de `iptables` do servidor de producao
- [ ] Renovar certificados SSL (se nao forem auto-renovaveis)
- [ ] Testar restore de backups de configuracao (disaster recovery)

---
[<- Voltar ao indice](README.md)
