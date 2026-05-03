/**
 * utils/typing.js
 * Funções puras de cálculo para o sistema de digitação.
 * Sem efeitos colaterais — recebe dados, devolve resultado.
 */

/**
 * Calcula WPM (Palavras Por Minuto).
 * Fórmula padrão da indústria: (caracteres corretos / 5) / minutos.
 * Divide por 5 porque a "palavra padrão" tem 5 caracteres.
 */
export function calcWpm(digitado, alvo, inicioTempo) {
  if (!inicioTempo) return 0;
  const minutos = (Date.now() - inicioTempo) / 60_000;
  if (minutos < 0.001) return 0;
  const corretos = [...digitado].filter((c, i) => c === alvo[i]).length;
  return Math.round((corretos / 5) / minutos);
}

/**
 * Calcula precisão (accuracy) em porcentagem.
 * Compara cada caractere digitado com o esperado na mesma posição.
 */
export function calcAccuracy(digitado, alvo) {
  if (!digitado.length) return 100;
  const corretos = [...digitado].filter((c, i) => c === alvo[i]).length;
  return Math.round((corretos / digitado.length) * 100);
}

/**
 * Conta erros: posições onde o caractere digitado difere do esperado.
 */
export function countErrors(digitado, alvo) {
  return [...digitado].filter((c, i) => c !== alvo[i]).length;
}

/**
 * Rank baseado no WPM:
 * S ≥ 120 | A ≥ 80 | B ≥ 50 | C < 50
 */
export function getRank(wpm) {
  if (wpm >= 120) return 'S';
  if (wpm >= 80)  return 'A';
  if (wpm >= 50)  return 'B';
  return 'C';
}

/**
 * Retorna a variável CSS de cor baseada na precisão.
 * Verde ≥ 95% | Amarelo ≥ 80% | Vermelho < 80%
 */
export function accColor(acc) {
  if (acc >= 95) return 'var(--green)';
  if (acc >= 80) return 'var(--yellow)';
  return 'var(--red)';
}

/**
 * Retorna um item aleatório de um array.
 */
export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Formata timestamp (ms) em data/hora legível em pt-BR.
 * Ex: "15/01/2025 14:32"
 */
export function fmtDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return (
    d.toLocaleDateString('pt-BR') +
    ' ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );
}
