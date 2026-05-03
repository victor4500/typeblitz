/**
 * components/Header.jsx
 *
 * Barra de navegação superior fixa.
 * Contém o logo, as abas de navegação e o botão de som.
 */

import lay  from '../styles/layout.module.css';
import comp from '../styles/components.module.css';

const PAGINAS = [
  { id: 'typing', label: '⌨ Treino'  },
  { id: 'code',   label: '{ } Code'  },
  { id: 'stats',  label: '📊 Stats'  },
];

export default function Header({ pagina, aoNavegar, somLigado, aoAlternarSom }) {
  return (
    <header className={lay.header}>

      {/* Logo com gradiente */}
      <div className={lay.logo}>
        Type<span className={lay.logoDim}>Blitz</span>
      </div>

      {/* Abas de navegação */}
      <nav className={lay.nav}>
        {PAGINAS.map(p => (
          <button
            key={p.id}
            className={`${lay.navBtn} ${pagina === p.id ? lay.navBtnActive : ''}`}
            onClick={() => aoNavegar(p.id)}
            aria-current={pagina === p.id ? 'page' : undefined}
          >
            {p.label}
          </button>
        ))}
      </nav>

      {/* Toggle de som */}
      <div
        className={comp.toggleWrap}
        onClick={aoAlternarSom}
        title={somLigado ? 'Desligar sons de teclado' : 'Ligar sons de teclado'}
        role="button"
        aria-label="Alternar sons"
      >
        <div className={`${comp.toggleSwitch} ${somLigado ? comp.toggleSwitchOn : ''}`} />
        <span className={comp.toggleLabel}>{somLigado ? '🔊' : '🔇'}</span>
      </div>

    </header>
  );
}
