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
import { CodeBlock }                        from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox }   from '@/components/ui/Boxes';
import { FluxoCard }                        from '@/components/ui/FluxoCard';
import { Steps }                            from '@/components/ui/Steps';
import { ProgressBar }                      from '@/components/ui/ProgressBar';
import { LayerBadge }                       from '@/components/ui/LayerBadge';
import { TroubleshootingCard }              from '@/components/ui/TroubleshootingCard';

// Boxes de conteúdo (preferir os componentes em vez das classes brutas)
<InfoBox title="Título">Informação azul</InfoBox>
<WarnBox title="⚠️ Atenção">Aviso amarelo</WarnBox>
<HighlightBox title="💡 Pulo do Gato">Destaque laranja</HighlightBox>

// FluxoCard — diagrama de fluxo horizontal com setas automáticas
<FluxoCard
  title="Título opcional"
  steps={[
    { label: 'Passo 1', sub: 'detalhe', icon: <Icon className="w-4 h-4" />, color: 'border-ok/50' },
    { label: 'Passo 2', sub: 'detalhe', icon: <Icon className="w-4 h-4" />, color: 'border-accent/50' },
  ]}
/>

// Cores disponíveis para FluxoCard.steps[].color (classes Tailwind):
// 'border-ok/50'    → verde (sucesso)
// 'border-accent/50' → laranja (destaque)
// 'border-err/50'   → vermelho (erro/risco)
// 'border-[var(--color-layer-N)]' onde N = 3, 4, 5, 6, 7 (camadas OSI)

// TroubleshootingCard — escada OSI interativa (expand/collapse por camada)
// Props: steps: TroubleshootingStep[]
//   { layer: 1..7, name: string, symptom: string, command: string, detail?: string }
// Cada step: badge colorido (--color-layer-N) + sintoma + comando + detalhe expansível
// aria-expanded/aria-controls, role="list"/"listitem" — totalmente acessível
<TroubleshootingCard
  steps={[
    { layer: 1, name: 'Física',     symptom: 'sem link',   command: 'ip link show',       detail: 'cabo / VM conectada?' },
    { layer: 2, name: 'Enlace',     symptom: 'sem ARP',    command: 'ip neigh show',      detail: 'bridge/switch OK?' },
    { layer: 3, name: 'Rede',       symptom: 'sem rota',   command: 'ip route show',      detail: 'rota default existe?' },
    { layer: 4, name: 'Transporte', symptom: 'porta fecha', command: 'ss -tlnp',           detail: 'nc -zv HOST PORTA' },
    { layer: 5, name: 'Sessão',     symptom: 'TLS falha',  command: 'openssl s_client',   detail: 'curl -v URL' },
    { layer: 6, name: 'Apresentação', symptom: 'erro cert', command: 'openssl x509 -text', detail: 'validade e CN' },
    { layer: 7, name: 'Aplicação',  symptom: 'HTTP 5xx',   command: 'curl -I URL',        detail: 'nginx -t; journalctl' },
  ]}
/>
```

> **Regra de ouro:** sempre usar os componentes importados, nunca `<div className="code-block">` ou `<div className="info-box">` diretamente — garante consistência visual e facilita refatorações futuras.

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
