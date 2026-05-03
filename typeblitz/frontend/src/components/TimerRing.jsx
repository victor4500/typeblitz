/**
 * components/TimerRing.jsx
 *
 * Anel circular animado para exibir o countdown do temporizador.
 *
 * Funcionamento:
 *   - Usa SVG com dois círculos: trilha (fundo) e progresso (frente)
 *   - stroke-dashoffset controla quanto do anel está preenchido
 *   - A cor muda de roxo → amarelo → vermelho conforme o tempo acaba
 *
 * Props:
 *   total     → tempo total em segundos (ex: 30)
 *   remaining → tempo restante em segundos
 */

import t from '../styles/typing.module.css';

/* Circunferência do círculo: 2π × raio(22) ≈ 138.2 */
const CIRCUNFERENCIA = 138.2;

export default function TimerRing({ total, remaining }) {
  const proporcao = total > 0 ? remaining / total : 1;
  const offset    = CIRCUNFERENCIA * (1 - proporcao);

  /* Cor muda conforme o tempo se esgota */
  const corAtual =
    proporcao > 0.5  ? 'var(--accent)' :
    proporcao > 0.25 ? 'var(--yellow)' :
    'var(--red)';

  return (
    <div className={t.timerWrap} aria-label={`${remaining} segundos restantes`}>
      <svg
        className={t.timerSvg}
        width="50"
        height="50"
        viewBox="0 0 52 52"
        aria-hidden="true"
      >
        {/* Trilha cinza de fundo */}
        <circle className={t.timerTrack} cx="26" cy="26" r="22" />
        {/* Arco colorido que vai diminuindo */}
        <circle
          className={t.timerProg}
          cx="26" cy="26" r="22"
          strokeDasharray={CIRCUNFERENCIA}
          strokeDashoffset={offset}
          style={{ stroke: corAtual }}
        />
      </svg>
      {/* Número no centro */}
      <div className={t.timerText}>{remaining}</div>
    </div>
  );
}
