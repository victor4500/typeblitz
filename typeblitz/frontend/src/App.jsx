/**
 * App.jsx
 *
 * Componente raiz da aplicação.
 * Gerencia qual página está ativa e o estado global de som.
 *
 * Páginas:
 *   'typing' → Treino de digitação (padrão)
 *   'code'   → Code Typing (Python, JS, HTML, Java, C)
 *   'stats'  → Estatísticas e histórico
 */

import { useState } from 'react';
import Header      from './components/Header.jsx';
import TypingPage  from './pages/TypingPage.jsx';
import CodePage    from './pages/CodePage.jsx';
import StatsPage   from './pages/StatsPage.jsx';

import lay from './styles/layout.module.css';

export default function App() {
  const [pagina,  setPagina]  = useState('typing');
  const [somLigado, setSomLigado] = useState(false);

  return (
    <>
      <Header
        pagina={pagina}
        aoNavegar={setPagina}
        somLigado={somLigado}
        aoAlternarSom={() => setSomLigado(s => !s)}
      />

      <main className={lay.main}>
        {pagina === 'typing' && (
          <div className={lay.page}>
            <TypingPage somLigado={somLigado} />
          </div>
        )}
        {pagina === 'code' && (
          <div className={lay.page}>
            <CodePage somLigado={somLigado} />
          </div>
        )}
        {pagina === 'stats' && (
          <div className={lay.page}>
            <StatsPage />
          </div>
        )}
      </main>
    </>
  );
}
