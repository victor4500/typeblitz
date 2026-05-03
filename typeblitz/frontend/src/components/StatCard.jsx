/**
 * components/StatCard.jsx
 *
 * Card de métrica individual (WPM, Precisão, etc.)
 * Usado em grupos de 3 no topo de cada página.
 *
 * Props:
 *   label   → rótulo descritivo (ex: "WPM atual")
 *   value   → valor principal a exibir
 *   unit    → unidade opcional (ex: "wpm", "%")
 *   accent  → cor CSS opcional para o valor (ex: "var(--accent)")
 */

import comp from '../styles/components.module.css';
import lay  from '../styles/layout.module.css';

export default function StatCard({ label, value, unit, accent }) {
  return (
    <div className={comp.statCard}>
      <div className={comp.statLabel}>{label}</div>
      <div
        className={comp.statValue}
        style={accent ? { color: accent } : undefined}
      >
        {value}
        {unit && <span className={comp.statUnit}>{unit}</span>}
      </div>
    </div>
  );
}

/**
 * StatRow — container de 3 colunas para os cards de métricas.
 * Uso: <StatRow><StatCard ... /><StatCard ... /><StatCard ... /></StatRow>
 */
export function StatRow({ children }) {
  return <div className={lay.statRow}>{children}</div>;
}
