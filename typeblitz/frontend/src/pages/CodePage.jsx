/**
 * pages/CodePage.jsx
 *
 * Aba de treino de digitação de código.
 * Suporta Python, JavaScript, HTML/CSS, Java e C.
 *
 * Funcionalidades:
 * - Exibe o trecho de código para digitar
 * - Mostra explicação didática do que o código faz
 * - Mede WPM e precisão em tempo real
 * - Salva ranking local e envia para o backend
 */

import { useState, useEffect, useRef, useCallback } from 'react';

import StatCard, { StatRow } from '../components/StatCard.jsx';
import ProgressBar           from '../components/ProgressBar.jsx';
import RankTable             from '../components/RankTable.jsx';

import { CODE_SNIPPETS } from '../data/codeSnippets.js';
import { useSound }      from '../hooks/useSound.js';
import {
  addHistoryEntry,
  getBestCodeWpm,
  updateBestCodeWpm,
} from '../hooks/useStorage.js';
import {
  calcWpm, calcAccuracy, countErrors, pickRandom,
} from '../utils/typing.js';
import { submitScore } from '../utils/api.js';

import lay  from '../styles/layout.module.css';
import comp from '../styles/components.module.css';
import c    from '../styles/code.module.css';
import s    from '../styles/stats.module.css';

/* ── Linguagens disponíveis ───────────────────── */
const LANGS = [
  { id: 'python',     label: 'Python',     cor: '#3b82f6' },
  { id: 'javascript', label: 'JavaScript', cor: '#f59e0b' },
  { id: 'html',       label: 'HTML/CSS',   cor: '#f97316' },
  { id: 'java',       label: 'Java',       cor: '#ef4444' },
  { id: 'c',          label: 'C',          cor: '#8b5cf6' },
];

const CODE_DIFFS = [
  { id: 'simple', label: 'Simples' },
  { id: 'medium', label: 'Médio'   },
];

export default function CodePage({ soundOn }) {
  const [lang,     setLang]     = useState('python');
  const [codeDiff, setCodeDiff] = useState('simple');

  /* ── Trecho atual (objeto com code, title, explain) ── */
  const [snippet,  setSnippet]  = useState({ code: '', title: '', explain: '' });
  const [typed,    setTyped]    = useState('');
  const [started,  setStarted]  = useState(false);
  const [finished, setFinished] = useState(false);
  const [flash,    setFlash]    = useState(false);

  /* ── Métricas ao vivo ─────────────────────── */
  const [liveWpm, setLiveWpm] = useState(0);
  const [liveAcc, setLiveAcc] = useState(100);
  const [liveErr, setLiveErr] = useState(0);

  /* ── Mostrar/esconder explicação ──────────── */
  const [showExplain, setShowExplain] = useState(true);

  /* ── Ranking local (apenas code) ─────────── */
  const [rankHistory, setRankHistory] = useState([]);

  const inputRef     = useRef(null);
  const startTimeRef = useRef(null);
  const snippetRef   = useRef({ code: '', title: '', explain: '' });
  const typedRef     = useRef('');
  const finishedRef  = useRef(false);

  const { play } = useSound();

  /* ── Carrega histórico code ───────────────── */
  function carregarHistorico() {
    try {
      const tudo = JSON.parse(localStorage.getItem('typeblitz_v1') || '{}');
      const hist = (tudo.history || []).filter(x => x.type === 'code');
      setRankHistory(hist.sort((a, b) => b.wpm - a.wpm).slice(0, 10));
    } catch { setRankHistory([]); }
  }

  /* ── Resetar teste ────────────────────────── */
  const resetarCodigo = useCallback((mesmoCodigo = false) => {
    finishedRef.current = false;

    const pool = CODE_SNIPPETS[lang][codeDiff];
    const obj  = mesmoCodigo ? snippetRef.current : pickRandom(pool);

    snippetRef.current = obj;
    typedRef.current   = '';

    setSnippet(obj);
    setTyped('');
    setStarted(false);
    setFinished(false);
    setFlash(false);
    setLiveWpm(0);
    setLiveAcc(100);
    setLiveErr(0);

    if (inputRef.current) inputRef.current.value = '';
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [lang, codeDiff]);

  /* ── Re-inicializa quando muda lang ou dificuldade ── */
  useEffect(() => {
    resetarCodigo();
    carregarHistorico();
  }, [lang, codeDiff]); // eslint-disable-line

  /* ── Atualiza métricas a cada 300ms ──────── */
  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => {
      setLiveWpm(calcWpm(typedRef.current, snippetRef.current.code, startTimeRef.current));
      setLiveAcc(calcAccuracy(typedRef.current, snippetRef.current.code));
      setLiveErr(countErrors(typedRef.current, snippetRef.current.code));
    }, 300);
    return () => clearInterval(id);
  }, [started, finished]);

  /* ── Finaliza teste ───────────────────────── */
  function finalizarCodigo() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFinished(true);
    if (inputRef.current) inputRef.current.value = '';

    const wpm    = calcWpm(typedRef.current, snippetRef.current.code, startTimeRef.current);
    const acc    = calcAccuracy(typedRef.current, snippetRef.current.code);
    const errors = countErrors(typedRef.current, snippetRef.current.code);

    updateBestCodeWpm(wpm);
    const entrada = { wpm, acc, errors, lang, diff: codeDiff, type: 'code' };
    addHistoryEntry(entrada);
    submitScore(entrada); // fogo-e-esqueça

    carregarHistorico();
    if (soundOn) play('complete');
    setFlash(true);
    setTimeout(() => setFlash(false), 1000);
  }

  /* ── Handler de input ─────────────────────── */
  function aoDigitar(e) {
    if (finishedRef.current) return;
    const val = e.target.value;

    // Inicia cronômetro no primeiro char
    if (!started && val.length > 0) {
      setStarted(true);
      startTimeRef.current = Date.now();
    }

    // Feedback sonoro
    const novoChar   = val[val.length - 1];
    const esperado   = snippetRef.current.code[val.length - 1];
    if (novoChar && novoChar !== esperado && soundOn) play('error');
    else if (novoChar && soundOn) play('normal');

    typedRef.current = val;
    setTyped(val);

    // Termina quando preencher tudo
    if (val.length >= snippetRef.current.code.length) finalizarCodigo();
  }

  /* ── Trata Tab (2 espaços) e Enter (\n) ──── */
  function aoApertarTecla(e) {
    if (finishedRef.current) return;

    let proximo = null;

    if (e.key === 'Tab') {
      e.preventDefault();
      proximo = typedRef.current + '  '; // 2 espaços = tab
    } else if (e.key === 'Enter') {
      e.preventDefault();
      proximo = typedRef.current + '\n';
    }

    if (proximo !== null) {
      typedRef.current = proximo;
      if (inputRef.current) inputRef.current.value = proximo;
      setTyped(proximo);
      if (!started) { setStarted(true); startTimeRef.current = Date.now(); }
      if (proximo.length >= snippetRef.current.code.length) finalizarCodigo();
    }
  }

  /* ── Renderiza os chars do código ─────────── */
  function renderizarChars() {
    return [...snippet.code].map((ch, i) => {
      let cls = c.charPending;
      if (i < typed.length) {
        cls = typed[i] === ch ? c.charCorrect : c.charWrong;
      } else if (i === typed.length) {
        cls = c.charCursor;
      }
      return (
        <span key={i} className={`${c.char} ${cls}`}>
          {ch}
        </span>
      );
    });
  }

  const progresso = snippet.code.length
    ? (typed.length / snippet.code.length) * 100
    : 0;

  /* ── Cor da linguagem atual ───────────────── */
  const langAtual = LANGS.find(l => l.id === lang);

  return (
    <>
      {/* ── Métricas ── */}
      <StatRow>
        <StatCard label="WPM atual"       value={liveWpm}          unit="wpm" accent="var(--accent)" />
        <StatCard label="Precisão"        value={liveAcc}          unit="%" />
        <StatCard label="Melhor Code WPM" value={getBestCodeWpm()} unit="wpm" />
      </StatRow>

      {/* ── Seleção de linguagem ── */}
      <div className={lay.controls}>
        <div className={comp.chipGroup}>
          {LANGS.map(l => (
            <button
              key={l.id}
              className={`${comp.chip} ${lang === l.id ? comp.chipActive : ''}`}
              style={lang === l.id ? { background: l.cor, borderColor: l.cor } : {}}
              onClick={() => setLang(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className={comp.sep} />

        <div className={comp.chipGroup}>
          {CODE_DIFFS.map(d => (
            <button
              key={d.id}
              className={`${comp.chip} ${codeDiff === d.id ? comp.chipActive : ''}`}
              onClick={() => setCodeDiff(d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className={comp.sep} />

        {/* Toggle da explicação */}
        <button
          className={`${comp.chip} ${showExplain ? comp.chipActive : ''}`}
          onClick={() => setShowExplain(v => !v)}
          title="Mostrar/esconder explicação"
        >
          💡 Explicação
        </button>
      </div>

      {/* ── Título do conceito ── */}
      {snippet.title && (
        <div style={{
          marginBottom: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <span style={{
            fontWeight: 800,
            fontSize: '1rem',
            color: 'var(--text)',
          }}>
            {snippet.title}
          </span>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: langAtual?.cor ?? 'var(--muted)',
            background: `${langAtual?.cor ?? 'var(--muted)'}18`,
            border: `1px solid ${langAtual?.cor ?? 'var(--muted)'}40`,
            padding: '0.2rem 0.6rem',
            borderRadius: '20px',
          }}>
            {langAtual?.label}
          </span>
        </div>
      )}

      {/* ── Explicação didática ── */}
      {showExplain && snippet.explain && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderLeft: `3px solid ${langAtual?.cor ?? 'var(--accent)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: '0.9rem 1.2rem',
          marginBottom: '1rem',
          fontSize: '0.86rem',
          color: 'var(--text2)',
          lineHeight: 1.65,
        }}>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            display: 'block',
            marginBottom: '0.35rem',
          }}>
            O que esse código faz
          </span>
          {snippet.explain}
        </div>
      )}

      {/* ── Barra de progresso ── */}
      <ProgressBar pct={progresso} />

      {/* ── Caixa de código ── */}
      <div
        className={`${c.codeBox} ${flash ? c.codeBoxComplete : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          className={c.hiddenInput}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          onInput={aoDigitar}
          onKeyDown={aoApertarTecla}
          disabled={finished}
          aria-label="Campo de digitação de código"
        />
        <div
          className={c.langTag}
          style={{ color: langAtual?.cor, borderColor: `${langAtual?.cor}40` }}
        >
          {lang}
        </div>
        <div className={c.codeDisplay} aria-hidden="true">
          {renderizarChars()}
        </div>
      </div>

      {/* ── Mensagem de conclusão ── */}
      {finished && (
        <div style={{
          textAlign: 'center',
          padding: '0.8rem',
          background: 'rgba(57,217,138,0.1)',
          border: '1px solid var(--green)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--green)',
          fontWeight: 700,
          fontSize: '0.9rem',
          marginBottom: '0.5rem',
        }}>
          ✅ Concluído! {liveWpm} WPM · {liveAcc}% precisão
        </div>
      )}

      {/* ── Botões de ação ── */}
      <div className={lay.actionBar}>
        <button
          className={`${comp.btn} ${comp.btnPrimary}`}
          onClick={() => resetarCodigo(false)}
        >
          ↺ Novo trecho
        </button>
        <button
          className={`${comp.btn} ${comp.btnGhost}`}
          onClick={() => resetarCodigo(true)}
        >
          Repetir
        </button>

        <div className={lay.actionBarRight}>
          <span>WPM <span className={`${lay.liveVal} ${lay.liveAccent}`}>{liveWpm}</span></span>
          <span>ERR <span className={`${lay.liveVal} ${lay.liveRed}`}>{liveErr}</span></span>
        </div>
      </div>

      <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.8rem' }}>
        Tab = 2 espaços &nbsp;·&nbsp; Enter = nova linha &nbsp;·&nbsp; Clique no campo para focar
      </p>

      {/* ── Ranking local código ── */}
      <div className={s.rankSection} style={{ marginTop: '2.5rem' }}>
        <h3 style={{
          fontSize: '0.75rem', color: 'var(--muted)',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          fontWeight: 700, marginBottom: '1rem',
        }}>
          🏆 Ranking Code — Melhores resultados
        </h3>
        <RankTable
          entries={rankHistory}
          columns={['wpm', 'acc', 'lang', 'diff', 'date']}
        />
      </div>
    </>
  );
}
