/**
 * components/ProgressBar.jsx
 *
 * Barra de progresso linear.
 * Usada no modo sem temporizador para mostrar
 * quanto do texto já foi digitado.
 *
 * Props:
 *   pct → porcentagem de 0 a 100
 */

import comp from '../styles/components.module.css';

export default function ProgressBar({ pct }) {
  const largura = Math.min(100, Math.max(0, pct));
  return (
    <div className={comp.progressWrap}>
      <div className={comp.progressTrack}>
        <div
          className={comp.progressFill}
          style={{ width: `${largura}%` }}
          role="progressbar"
          aria-valuenow={Math.round(largura)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
