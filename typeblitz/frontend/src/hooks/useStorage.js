/**
 * hooks/useStorage.js
 *
 * Ponto central de persistência do app no localStorage.
 * Toda leitura e escrita de dados locais passa por aqui.
 *
 * Chave usada: 'typeblitz_v1'
 * Estrutura do objeto salvo:
 * {
 *   history:      Array de resultados (máx 300)
 *   bestWpm:      Melhor WPM no treino normal
 *   bestCodeWpm:  Melhor WPM no treino de código
 *   nickname:     Apelido do usuário (opcional)
 * }
 */

const CHAVE = 'typeblitz_v1';

/* ── Lê tudo do localStorage ──────────────────── */
function carregar() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) || '{}');
  } catch {
    return {};
  }
}

/* ── Salva tudo no localStorage ───────────────── */
function salvar(dados) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch (e) {
    console.warn('Erro ao salvar no localStorage:', e);
  }
}

/* ══ Histórico ════════════════════════════════ */

/** Retorna todos os registros do histórico. */
export function getHistory() {
  return carregar().history || [];
}

/**
 * Adiciona um novo resultado ao histórico.
 * Mantém no máximo 300 entradas (as mais recentes).
 */
export function addHistoryEntry(entrada) {
  const s = carregar();
  s.history = s.history || [];
  s.history.unshift({ ...entrada, ts: Date.now() });
  if (s.history.length > 300) s.history = s.history.slice(0, 300);
  salvar(s);
}

/* ══ Melhor WPM — Treino Normal ═══════════════ */

/** Retorna o melhor WPM já registrado no treino normal. */
export function getBestWpm() {
  return carregar().bestWpm || 0;
}

/**
 * Atualiza o melhor WPM se o novo for maior.
 * Retorna true se for um novo recorde.
 */
export function updateBestWpm(wpm) {
  const s = carregar();
  if (wpm > (s.bestWpm || 0)) {
    s.bestWpm = wpm;
    salvar(s);
    return true; // novo recorde!
  }
  return false;
}

/* ══ Melhor WPM — Code Typing ═════════════════ */

/** Retorna o melhor WPM no treino de código. */
export function getBestCodeWpm() {
  return carregar().bestCodeWpm || 0;
}

/**
 * Atualiza o melhor WPM de código se o novo for maior.
 * Retorna true se for um novo recorde.
 */
export function updateBestCodeWpm(wpm) {
  const s = carregar();
  if (wpm > (s.bestCodeWpm || 0)) {
    s.bestCodeWpm = wpm;
    salvar(s);
    return true;
  }
  return false;
}

/* ══ Apelido (nickname) ═══════════════════════ */

/** Retorna o apelido salvo (ou string vazia). */
export function getNickname() {
  return carregar().nickname || '';
}

/** Salva o apelido (máx 20 caracteres). */
export function setNickname(nome) {
  const s = carregar();
  s.nickname = nome.slice(0, 20);
  salvar(s);
}

/* ══ Limpar tudo ══════════════════════════════ */

/** Remove todos os dados do app do localStorage. */
export function clearAll() {
  localStorage.removeItem(CHAVE);
}
