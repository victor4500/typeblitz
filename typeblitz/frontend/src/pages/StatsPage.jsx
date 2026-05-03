/**
 * pages/StatsPage.jsx
 *
 * Página de estatísticas completas do usuário.
 *
 * Exibe:
 *   - Cards com melhor WPM, média, melhor precisão e total de testes
 *   - Gráfico de linha com evolução do WPM nos últimos 30 testes
 *   - Resumo do servidor (se o backend estiver online)
 *   - Histórico dos 25 testes mais recentes
 *   - Ranking local top 10 — treino normal
 *   - Ranking local top 10 — code typing
 *   - Ranking global top 10 (vindo do backend)
 */

import { useState, useEffect } from 'react';

import WpmChart  from '../components/WpmChart.jsx';
import RankTable from '../components/RankTable.jsx';

import { getHistory, clearAll } from '../hooks/useStorage.js';
import { fmtDate }              from '../utils/typing.js';
import { fetchTopRanking, fetchStatsSummary } from '../utils/api.js';

import s    from '../styles/stats.module.css';
import comp from '../styles/components.module.css';

export default function StatsPage() {
  const [historico,    setHistorico]    = useState([]);
  const [rankGlobal,   setRankGlobal]   = useState({ normal: [], code: [] });
  const [statsServidor,setStatsServidor]= useState(null);

  /* ── Carrega dados locais do localStorage ─── */
  function carregarLocal() {
    setHistorico(getHistory());
  }

  /* ── Busca dados do backend (opcional) ──────── */
  async function carregarServidor() {
    const [rank, stats] = await Promise.all([
      fetchTopRanking(),
      fetchStatsSummary(),
    ]);
    if (rank?.ok)  setRankGlobal(rank.data);
    if (stats?.ok) setStatsServidor(stats.data);
  }

  useEffect(() => {
    carregarLocal();
    carregarServidor();
  }, []);

  /* ── Cálculos sobre os dados locais ─────────── */
  const normal = historico.filter(h => h.type === 'normal' || !h.type);
  const code   = historico.filter(h => h.type === 'code');

  const melhorWpm = normal.length ? Math.max(...normal.map(h => h.wpm)) : 0;
  const mediaWpm  = normal.length
    ? Math.round(normal.reduce((s, h) => s + h.wpm, 0) / normal.length)
    : 0;
  const melhorAcc = normal.length ? Math.max(...normal.map(h => h.acc)) : 0;

  /* Últimos 30 testes normais em ordem cronológica para o gráfico */
  const dadosGrafico = normal
    .slice()
    .reverse()
    .slice(-30)
    .map(h => h.wpm);

  /* Top 10 locais para o ranking */
  const topLocal     = [...normal].sort((a, b) => b.wpm - a.wpm).slice(0, 10);
  const topCodeLocal = [...code].sort((a, b) => b.wpm - a.wpm).slice(0, 10);

  /* ── Limpar histórico ───────────────────────── */
  function limparTudo() {
    if (!confirm('Apagar TODO o histórico local? Esta ação não pode ser desfeita.')) return;
    clearAll();
    setHistorico([]);
  }

  return (
    <>
      {/* ── Cabeçalho ── */}
      <div className={s.header}>
        <h2>Suas Estatísticas</h2>
        <p>Histórico completo de desempenho salvo localmente</p>
      </div>

      {/* ── Cards de destaque ── */}
      <div className={s.bestRow}>
        <div className={s.bestCard}>
          <div className={s.lbl}>Melhor WPM</div>
          <div className={s.val} style={{ color: 'var(--accent)' }}>{melhorWpm}</div>
        </div>
        <div className={s.bestCard}>
          <div className={s.lbl}>Média WPM</div>
          <div className={s.val}>{mediaWpm}</div>
        </div>
        <div className={s.bestCard}>
          <div className={s.lbl}>Melhor Precisão</div>
          <div className={s.val} style={{ color: 'var(--green)' }}>{melhorAcc}%</div>
        </div>
        <div className={s.bestCard}>
          <div className={s.lbl}>Total de Testes</div>
          <div className={s.val}>{normal.length}</div>
        </div>
      </div>

      {/* ── Gráfico de evolução ── */}
      <WpmChart data={dadosGrafico} />

      {/* ── Resumo do servidor (quando backend está online) ── */}
      {statsServidor && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--accent)',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem 1.4rem',
          marginBottom: '2rem',
          fontSize: '0.85rem',
          color: 'var(--text2)',
        }}>
          <span style={{ color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>
            🌐 Servidor conectado
          </span>
          Total global: <strong style={{ color: 'var(--text)' }}>{statsServidor.total}</strong> testes
          &nbsp;·&nbsp;
          Melhor WPM global: <strong style={{ color: 'var(--accent)' }}>
            {statsServidor.normal?.bestWpm ?? '—'}
          </strong>
          &nbsp;·&nbsp;
          Média global: <strong style={{ color: 'var(--text)' }}>
            {statsServidor.normal?.avgWpm ?? '—'} wpm
          </strong>
        </div>
      )}

      {/* ── Histórico recente ── */}
      <div className={s.historySection}>
        <div className={s.historyHead}>
          <h3>Histórico recente</h3>
          <button
            className={`${comp.btn} ${comp.btnDanger}`}
            style={{ fontSize: '0.76rem', padding: '0.35rem 0.85rem' }}
            onClick={limparTudo}
          >
            Limpar tudo
          </button>
        </div>

        {normal.length === 0 ? (
          <div className={s.emptyState}>
            Nenhum teste ainda. Volte ao treino! 💪
          </div>
        ) : (
          <div className={s.historyList}>
            {normal.slice(0, 25).map((h, i) => (
              <div className={s.historyItem} key={i}>
                <span className={s.hWpm}>{h.wpm} wpm</span>
                <span className={s.hAcc}>{h.acc}%</span>
                <span className={s.hMode}>
                  {h.diff ?? '?'} · {h.mode ?? '?'}
                  {h.hardcore && (
                    <span style={{ color: 'var(--red)', marginLeft: '0.4rem', fontSize: '0.72rem', fontWeight: 700 }}>
                      HC
                    </span>
                  )}
                </span>
                <span className={s.hTime}>{fmtDate(h.ts)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Ranking local — Treino ── */}
      <div className={s.rankSection}>
        <h3>🏆 Seus melhores tempos — Treino</h3>
        <RankTable
          entries={topLocal}
          columns={['wpm', 'acc', 'diff', 'mode', 'date']}
        />
      </div>

      {/* ── Ranking local — Code Typing ── */}
      {topCodeLocal.length > 0 && (
        <div className={s.rankSection}>
          <h3>💻 Seus melhores tempos — Code Typing</h3>
          <RankTable
            entries={topCodeLocal}
            columns={['wpm', 'acc', 'lang', 'diff', 'date']}
          />
        </div>
      )}

      {/* ── Ranking global — Treino (backend) ── */}
      {rankGlobal.normal.length > 0 && (
        <div className={s.rankSection}>
          <h3>🌐 Ranking Global — Treino</h3>
          <RankTable
            entries={rankGlobal.normal}
            columns={['wpm', 'acc', 'diff', 'mode', 'date']}
          />
        </div>
      )}

      {/* ── Ranking global — Code (backend) ── */}
      {rankGlobal.code.length > 0 && (
        <div className={s.rankSection}>
          <h3>🌐 Ranking Global — Code Typing</h3>
          <RankTable
            entries={rankGlobal.code}
            columns={['wpm', 'acc', 'lang', 'diff', 'date']}
          />
        </div>
      )}

    </>
  );
}
