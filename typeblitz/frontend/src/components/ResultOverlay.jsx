/**
 * components/ResultOverlay.jsx
 *
 * Modal de resultado exibido ao final de cada teste.
 *
 * Exibe:
 *   - WPM com gradiente e rank (S / A / B / C)
 *   - Precisão, erros, tempo e palavras digitadas
 *   - Botões: Novo texto, Repetir, Fechar
 *
 * Pode ser fechado com a tecla Escape ou clicando fora do card.
 *
 * Props:
 *   result   → { wpm, acc, errors, time, words }
 *   onNew    → callback ao clicar "Novo"
 *   onRetry  → callback ao clicar "Repetir"
 *   onClose  → callback ao fechar
 */

import { useEffect } from 'react';
import { getRank, accColor } from '../utils/typing.js';
import t    from '../styles/typing.module.css';
import comp from '../styles/components.module.css';

/* Mapeia o rank para a classe CSS correspondente */
const CLASSE_RANK = { S: comp.rankS, A: comp.rankA, B: comp.rankB, C: comp.rankC };

export default function ResultOverlay({ result, onRetry, onNew, onClose }) {
  const { wpm, acc, errors, time, words } = result;
  const rank = getRank(wpm);

  /* Fecha ao pressionar Escape */
  useEffect(() => {
    const fecharComEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fecharComEsc);
    return () => window.removeEventListener('keydown', fecharComEsc);
  }, [onClose]);

  /* Cor da precisão: verde ≥95%, amarelo ≥80%, vermelho <80% */
  const corAcc = accColor(acc);

  return (
    <div
      className={t.overlay}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Resultado do teste"
    >
      <div className={t.resultCard}>

        {/* Cabeçalho */}
        <div className={t.resultTitle}>Resultado do Teste</div>

        {/* Badge de rank */}
        <span className={`${comp.rankBadge} ${CLASSE_RANK[rank]}`}>
          Rank {rank}
        </span>

        {/* WPM em destaque */}
        <div className={t.resultWpm}>{wpm}</div>
        <div className={t.resultSub}>palavras por minuto</div>

        {/* Grid 2×2 com métricas */}
        <div className={t.resultGrid}>

          <div className={t.resultStat}>
            <div style={estiloLabel}>Precisão</div>
            <div style={{ ...estiloValor, color: corAcc }}>{acc}%</div>
          </div>

          <div className={t.resultStat}>
            <div style={estiloLabel}>Erros</div>
            <div style={{ ...estiloValor, color: 'var(--red)' }}>{errors}</div>
          </div>

          <div className={t.resultStat}>
            <div style={estiloLabel}>Tempo</div>
            <div style={estiloValor}>{time}s</div>
          </div>

          <div className={t.resultStat}>
            <div style={estiloLabel}>Palavras</div>
            <div style={estiloValor}>{words}</div>
          </div>

        </div>

        {/* Botões de ação */}
        <div className={t.resultBtns}>
          <button className={`${comp.btn} ${comp.btnPrimary}`} onClick={onNew}>
            ↺ Novo texto
          </button>
          <button className={`${comp.btn} ${comp.btnGhost}`} onClick={onRetry}>
            Repetir
          </button>
          <button className={`${comp.btn} ${comp.btnGhost}`} onClick={onClose}>
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}

/* Estilos inline reutilizados nas células do grid */
const estiloLabel = {
  fontSize: '0.67rem',
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '0.25rem',
};

const estiloValor = {
  fontFamily: 'var(--font-mono)',
  fontSize: '1.5rem',
  fontWeight: 700,
  color: 'var(--text)',
};
