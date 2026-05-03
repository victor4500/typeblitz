/**
 * components/RankTable.jsx
 *
 * Tabela de ranking reutilizável.
 * Usada nas páginas de Stats e Code para exibir os melhores resultados.
 *
 * Props:
 *   entries → array de objetos com os resultados
 *   columns → quais colunas mostrar:
 *             'wpm' | 'acc' | 'diff' | 'mode' | 'lang' | 'date'
 */

import { fmtDate } from '../utils/typing.js';
import s from '../styles/stats.module.css';

/* Medalhas para as 3 primeiras posições */
const MEDALHAS    = ['🥇', '🥈', '🥉'];
const CLASSES_POS = [s.rankPosGold, s.rankPosSilver, s.rankPosBronze];

export default function RankTable({ entries = [], columns = ['wpm', 'acc', 'diff', 'mode', 'date'] }) {

  if (!entries.length) {
    return (
      <div className={s.emptyState}>
        Nenhum resultado registrado ainda. Hora de treinar! 💪
      </div>
    );
  }

  return (
    <table className={s.rankTable}>
      <thead>
        <tr>
          <th>#</th>
          {columns.includes('wpm')  && <th>WPM</th>}
          {columns.includes('acc')  && <th>Precisão</th>}
          {columns.includes('diff') && <th>Dificuldade</th>}
          {columns.includes('mode') && <th>Modo</th>}
          {columns.includes('lang') && <th>Linguagem</th>}
          {columns.includes('date') && <th>Data</th>}
        </tr>
      </thead>
      <tbody>
        {entries.map((entrada, i) => (
          <tr key={entrada.id || entrada.ts || i}>

            {/* Posição com medalha nos 3 primeiros */}
            <td className={`${s.rankPos} ${CLASSES_POS[i] || ''}`}>
              {MEDALHAS[i] ?? i + 1}
            </td>

            {columns.includes('wpm') && (
              <td className={s.rankWpm}>{entrada.wpm}</td>
            )}
            {columns.includes('acc') && (
              <td style={{ color: 'var(--green)' }}>{entrada.acc}%</td>
            )}
            {columns.includes('diff') && (
              <td style={{ color: 'var(--muted)' }}>{entrada.diff || '—'}</td>
            )}
            {columns.includes('mode') && (
              <td style={{ color: 'var(--muted)' }}>{entrada.mode || '—'}</td>
            )}
            {columns.includes('lang') && (
              <td style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                {entrada.lang || '—'}
              </td>
            )}
            {columns.includes('date') && (
              <td style={{ color: 'var(--muted)', fontSize: '0.74rem' }}>
                {fmtDate(entrada.ts)}
              </td>
            )}

          </tr>
        ))}
      </tbody>
    </table>
  );
}
