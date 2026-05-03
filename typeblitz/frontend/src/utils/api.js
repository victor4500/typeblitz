/**
 * utils/api.js
 *
 * Cliente HTTP para comunicação com o backend TypeBlitz.
 * Usa fetch nativo — sem dependência extra.
 *
 * Em desenvolvimento (Vite): as chamadas /api são
 * redirecionadas automaticamente para localhost:3001
 * pelo proxy configurado no vite.config.js.
 *
 * Em produção (Docker/nginx): o nginx redireciona
 * /api para o container do backend.
 *
 * IMPORTANTE: Todas as funções capturam erros silenciosamente.
 * O backend pode estar offline — o app não pode quebrar por isso.
 */

const BASE = '/api';

/* ── Função base de requisição ────────────────── */
async function requisicao(metodo, caminho, corpo) {
  try {
    const res = await fetch(BASE + caminho, {
      method:  metodo,
      headers: { 'Content-Type': 'application/json' },
      body:    corpo ? JSON.stringify(corpo) : undefined,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    return res.json();
  } catch (e) {
    /* Backend offline em modo local — não quebra o app */
    console.warn('[API]', metodo, caminho, e.message);
    return null;
  }
}

/* ══ Ranking ══════════════════════════════════ */

/**
 * Busca o ranking global.
 * @param {object} filtros - { type, diff, limit }
 */
export async function fetchRanking({ type, diff, limit = 50 } = {}) {
  const params = new URLSearchParams();
  if (type)  params.set('type',  type);
  if (diff)  params.set('diff',  diff);
  if (limit) params.set('limit', limit);
  return requisicao('GET', `/ranking?${params}`);
}

/**
 * Envia um resultado para o ranking global.
 * @param {object} entrada - { wpm, acc, errors, diff, mode, type, lang, nickname }
 */
export async function submitScore(entrada) {
  return requisicao('POST', '/ranking', entrada);
}

/**
 * Retorna o top 10 separado por tipo (normal e code).
 */
export async function fetchTopRanking() {
  return requisicao('GET', '/ranking/top');
}

/* ══ Estatísticas ═════════════════════════════ */

/**
 * Retorna resumo geral do servidor (médias, totais, melhor WPM).
 */
export async function fetchStatsSummary() {
  return requisicao('GET', '/stats/summary');
}

/* ══ Health check ═════════════════════════════ */

/**
 * Verifica se o backend está online.
 * Útil para mostrar indicador de conexão na UI.
 */
export async function checkHealth() {
  return requisicao('GET', '/health');
}
