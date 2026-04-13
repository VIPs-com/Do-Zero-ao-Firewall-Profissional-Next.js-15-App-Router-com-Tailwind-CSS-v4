# Workflow Git do Projeto

## Regra de ouro: nunca commitar direto na `main`

```bash
# 1. Criar branch para o trabalho
git checkout -b feat/nome-da-feature
# ou
git checkout -b fix/nome-do-bug

# 2. Fazer as alteracoes e commitar
git add arquivo1.tsx arquivo2.css
git commit -m "fix(tema): descricao curta em uma linha"

# 3. Subir para o GitHub
git push origin feat/nome-da-feature

# 4. Merge limpo na main (squash = 1 commit por feature)
git checkout main
git merge --squash feat/nome-da-feature
git commit -m "feat(modulo): descricao final do que foi feito"
git push origin main

# 5. Limpeza de branches
git branch -D feat/nome-da-feature
git push origin --delete feat/nome-da-feature
```

## Prefixos semanticos de commit

| Prefixo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade ou modulo |
| `fix` | Correcao de bug |
| `docs` | Alteracao em documentacao |
| `style` | CSS, formatacao, sem mudanca de logica |
| `refactor` | Refatoracao sem mudanca de comportamento |
| `chore` | Dependencias, configuracao, build |

## Atencao: PowerShell e aspas multilinha

```powershell
# ERRO — Enter dentro de aspas abre modo multilinha. Commit fica preso.
git commit -m "mensagem
continuacao"   <- nunca faca isso

# CORRETO — sempre em uma unica linha
git commit -m "fix(tema): corrige dark mode html.light e badge night-owl"
```

Se ficar preso no modo multilinha (`>>`), pressione `Ctrl+C` para cancelar e tente novamente em uma linha.

---
[<- Voltar ao indice](README.md)
