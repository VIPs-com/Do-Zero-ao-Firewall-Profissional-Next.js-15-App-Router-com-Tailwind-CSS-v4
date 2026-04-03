# ⚡ Quick Start Guide: Workshop Linux

Resumo de 1 página para desenvolvedores e administradores.

---

## 🚀 Início Rápido (3 Passos)

1.  **Instalar:** `npm install`
2.  **Desenvolver:** `npm run dev` (Acesse em `http://localhost:3000`)
3.  **Build:** `npm run build`

---

## 📂 Estrutura Crítica

-   `/app`: Rotas e Layouts (App Router).
-   `/src/components`: UI e Lógica Visual.
-   `/src/context`: Sistema de Badges (Gamificação).
-   `/src/data`: Conteúdo da Busca e Tópicos.

---

## 🛠️ Comandos de Desenvolvimento

-   **Nova Rota:** Criar pasta em `/app` + `page.tsx`.
-   **Nova Badge:** Adicionar ID em `src/context/BadgeContext.tsx`.
-   **Novo Item de Busca:** Adicionar em `src/data/searchItems.ts`.
-   **Estilização:** Use classes Tailwind diretamente no JSX.

---

## ✅ Checklist de Deploy

- [ ] `npm install` (Instalação limpa)
- [ ] `npm run lint` (Verificação de tipos)
- [ ] `npm run build` (Geração do pacote)
- [ ] Configurar `.env.production` no servidor.
- [ ] Configurar PM2/Docker para rodar `npm run start`.

---

## 🔒 Regras de Ouro (Segurança)

1.  **Variáveis:** Use `NEXT_PUBLIC_` apenas para o que o navegador PRECISA ler.
2.  **Tokens:** NUNCA suba chaves privadas no código. Use `.env`.
3.  **Sanitização:** Sempre limpe inputs de usuário antes de salvar no `localStorage`.
4.  **Firewall:** Em produção, bloqueie tudo por padrão (`iptables -P INPUT DROP`).

---

## 📡 Arquitetura Simplificada

`Usuário` ➔ `Nginx` ➔ `Next.js Server` ➔ `Browser (LocalStorage)`

---

## 💡 Mensagens-Chave

- **Leve hoje:** Arquitetura otimizada e rápida.
- **Escalável amanhã:** Pronto para crescer com banco de dados.
- **Seguro sempre:** Auditoria constante e boas práticas.

---

*Para detalhes completos, consulte o arquivo `DOCUMENTATION.md`.*
