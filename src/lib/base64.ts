/**
 * Codificador/decodificador Base64 — lógica pura (Sprint Ferramentas v4).
 *
 * Seguro para UTF-8 (usa TextEncoder/TextDecoder, não apenas btoa/atob que
 * só lidam com Latin-1). Útil para inspecionar Secrets do Kubernetes/Docker,
 * que armazenam valores em Base64. Zero React, totalmente testável.
 */

export interface Base64Result {
  /** `true` se a operação teve sucesso. */
  ok: boolean;
  /** Texto resultante (`''` em caso de erro). */
  output: string;
  /** Mensagem de erro (`''` quando `ok`). */
  error: string;
}

/** Codifica texto UTF-8 em Base64. */
export function encodeBase64(text: string): Base64Result {
  try {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    for (const b of bytes) binary += String.fromCharCode(b);
    return { ok: true, output: btoa(binary), error: '' };
  } catch (err) {
    return { ok: false, output: '', error: (err as Error).message };
  }
}

/** Decodifica uma string Base64 em texto UTF-8. */
export function decodeBase64(b64: string): Base64Result {
  const trimmed = b64.trim();
  if (trimmed === '') return { ok: true, output: '', error: '' };
  try {
    const binary = atob(trimmed);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const output = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return { ok: true, output, error: '' };
  } catch {
    return { ok: false, output: '', error: 'Base64 inválido — verifique o conteúdo colado.' };
  }
}
