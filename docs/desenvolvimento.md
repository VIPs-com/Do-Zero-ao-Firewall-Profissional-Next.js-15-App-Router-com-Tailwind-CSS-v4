# Como Desenvolver — Tarefas Comuns

## Adicionar uma nova página

```
1. Criar pasta:  /app/nova-rota/
2. Criar arquivo: /app/nova-rota/page.tsx
3. Adicionar 'use client'; se precisar de hooks/interatividade
4. Registrar no menu: src/components/ClientLayout.tsx → NAV_LINKS
5. Indexar na busca: src/data/searchItems.ts → SEARCH_ITEMS
```

```tsx
// /app/nova-rota/page.tsx — estrutura mínima
'use client';

export default function NovaRota() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="section-title">Título</h1>
      <p className="text-text-2">Conteúdo</p>
    </div>
  );
}
```

## Adicionar ao menu de navegação

```typescript
// src/components/ClientLayout.tsx — array NAV_LINKS
const NAV_LINKS = [
  // ... links existentes
  { href: '/nova-rota', label: 'Nova Rota', icon: '🔧' },
];
```

## Usar componentes existentes

```tsx
import { CodeBlock }    from '@/components/ui/CodeBlock';
import { Steps }        from '@/components/ui/Steps';
import { ProgressBar }  from '@/components/ui/ProgressBar';
import { FluxoCard }    from '@/components/ui/FluxoCard';
import { LayerBadge }   from '@/components/ui/LayerBadge';

// Classes de box (definidas em globals.css)
<div className="info-box">     Informação azul      </div>
<div className="warn-box">     Aviso amarelo         </div>
<div className="highlight-box"> Destaque laranja     </div>
```

## Variáveis de ambiente

```bash
# .env.local (desenvolvimento — nunca commitar)
NEXT_PUBLIC_API_URL=https://api.meuprojeto.com   # Visível no browser
STRIPE_SECRET_KEY=sk_test_...                     # NUNCA no cliente

# .env.example (commitar — serve como modelo)
NEXT_PUBLIC_API_URL=
```

```tsx
// No componente — uso correto
const apiUrl = process.env.NEXT_PUBLIC_API_URL;  // ✅ funciona no browser
const secret = process.env.STRIPE_SECRET_KEY;    // ✅ undefined no browser (seguro)
```

## Prevenção de XSS em inputs

```tsx
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // Remove tags HTML antes de salvar no localStorage
  const sanitized = e.target.value.replace(/<[^>]*>?/gm, '').trim();
  localStorage.setItem('chave', sanitized);
};
```

---
[← Voltar ao indice](README.md)
