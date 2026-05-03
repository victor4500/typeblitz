/**
 * pages/TypingPage.jsx
 *
 * Página principal de treino de digitação.
 *
 * Fluxo completo:
 *  1. Usuário escolhe dificuldade (fácil/médio/difícil/extremo)
 *  2. Escolhe modo de tempo (∞, 30s, 60s, 120s) e opções extras
 *  3. Texto é renderizado caractere por caractere
 *  4. Um input oculto captura o teclado (evita autocomplete/IME)
 *  5. Ao digitar o primeiro caractere, o cronômetro inicia
 *  6. Cada caractere é comparado ao esperado em tempo real
 *  7. Ao terminar (tempo esgotado ou texto completo):
 *     - Calcula WPM, precisão e erros
 *     - Salva no localStorage
 *     - Envia para o backend (fogo-e-esqueça)
 *     - Exibe o modal de resultado
 */

import { useState, useEffect, useRef, useCallback } from 'react';

import StatCard, { StatRow } from '../components/StatCard.jsx';
import ProgressBar           from '../components/ProgressBar.jsx';
import TimerRing             from '../components/TimerRing.jsx';
import ResultOverlay         from '../components/ResultOverlay.jsx';

import { TEXTS }        from '../data/texts.js';
import { useSound }     from '../hooks/useSound.js';
import {
  addHistoryEntry,
  getBestWpm,
  updateBestWpm,
} from '../hooks/useStorage.js';
import {
  calcWpm, calcAccuracy, countErrors, pickRandom,
} from '../utils/typing.js';
import { submitScore } from '../utils/api.js';

import lay  from '../styles/layout.module.css';
import comp from '../styles/components.module.css';
import t    from '../styles/typing.module.css';

/* ── Opções de dificuldade ──────────────────── */
const DIFICULDADES = [
  { id: 'easy',    label: 'Fácil'       },
  { id: 'medium',  label: 'Médio'       },
  { id: 'hard',    label: 'Difícil'     },
  { id: 'extreme', label: 'Extremo 🔥'  },
];

/* ── Opções de tempo ────────────────────────── */
const TEMPOS = [
  { seg: 0,   label: '∞'    },
  { seg: 30,  label: '30s'  },
  { seg: 60,  label: '60s'  },
  { seg: 120, label: '120s' },
];

export default function TypingPage({ somLigado }) {

  /* ── Configuração do teste ──────────────────── */
  const [dificuldade, setDificuldade] = useState('easy');
  const [tempoSeg,    setTempoSeg]    = useState(30);
  const [hardcore,    setHardcore]    = useState(false);

  /* ── Estado do teste ────────────────────────── */
  const [textoAtual,  setTextoAtual]  = useState('');
  const [digitado,    setDigitado]    = useState('');
  const [iniciado,    setIniciado]    = useState(false);
  const [finalizado,  setFinalizado]  = useState(false);
  const [resultado,   setResultado]   = useState(null);   // null = modal fechado
  const [erroFlash,   setErroFlash]   = useState(false);  // pisca borda vermelha

  /* ── Temporizador ───────────────────────────── */
  const [restando, setRestando] = useState(30);

  /* ── Métricas ao vivo ───────────────────────── */
  const [wpmAoVivo,  setWpmAoVivo]  = useState(0);
  const [accAoVivo,  setAccAoVivo]  = useState(100);
  const [errosAoVivo,setErrosAoVivo]= useState(0);

  /* ── Refs (evitam closures desatualizadas) ──── */
  const inputRef       = useRef(null);
  const inicioTempoRef = useRef(null);
  const intervaloRef   = useRef(null);
  const decorridoRef   = useRef(0);      // segundos no modo livre
  const textoRef       = useRef('');
  const digitadoRef    = useRef('');
  const finalizadoRef  = useRef(false);

  const { play } = useSound();

  /* ── Seleciona um texto aleatório ──────────── */
  function sortearTexto(pool) {
    return pickRandom(TEXTS[pool]);
  }

  /* ══ RESETAR TESTE ══════════════════════════ */
  const resetarTeste = useCallback((mesmoCodigo = false) => {
    clearInterval(intervaloRef.current);
    finalizadoRef.current = false;
    decorridoRef.current  = 0;

    /* Mantém o mesmo texto se for "Repetir", senão sorteia novo */
    const texto = mesmoCodigo ? textoRef.current : sortearTexto(dificuldade);
    textoRef.current    = texto;
    digitadoRef.current = '';

    setTextoAtual(texto);
    setDigitado('');
    setIniciado(false);
    setFinalizado(false);
    setResultado(null);
    setRestando(tempoSeg);
    setWpmAoVivo(0);
    setAccAoVivo(100);
    setErrosAoVivo(0);
    setErroFlash(false);

    setTimeout(() => inputRef.current?.focus(), 50);
  }, [dificuldade, tempoSeg]);

  /* Reseta quando o usuário muda dificuldade ou tempo */
  useEffect(() => { resetarTeste(); }, [dificuldade, tempoSeg]); // eslint-disable-line

  /* ══ ATUALIZA MÉTRICAS AO VIVO ══════════════ */
  useEffect(() => {
    if (!iniciado || finalizado) return;
    const id = setInterval(() => {
      setWpmAoVivo(calcWpm(digitadoRef.current, textoRef.current, inicioTempoRef.current));
      setAccAoVivo(calcAccuracy(digitadoRef.current, textoRef.current));
      setErrosAoVivo(countErrors(digitadoRef.current, textoRef.current));
    }, 300);
    return () => clearInterval(id);
  }, [iniciado, finalizado]);

  /* ══ INICIAR COUNTDOWN ══════════════════════ */
  function iniciarCountdown() {
    if (tempoSeg === 0) return;
    setRestando(tempoSeg);
    intervaloRef.current = setInterval(() => {
      setRestando(prev => {
        if (prev <= 1) {
          clearInterval(intervaloRef.current);
          if (!finalizadoRef.current) finalizarTeste();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  /* ══ CRONÔMETRO MODO LIVRE ══════════════════ */
  function iniciarCronometroLivre() {
    intervaloRef.current = setInterval(() => {
      decorridoRef.current += 1;
    }, 1000);
  }

  /* ══ FINALIZAR TESTE ════════════════════════ */
  function finalizarTeste() {
    if (finalizadoRef.current) return;
    finalizadoRef.current = true;
    clearInterval(intervaloRef.current);
    setFinalizado(true);

    /* Limpa o input oculto */
    if (inputRef.current) inputRef.current.value = '';

    /* Calcula métricas finais */
    const wpm    = calcWpm(digitadoRef.current, textoRef.current, inicioTempoRef.current);
    const acc    = calcAccuracy(digitadoRef.current, textoRef.current);
    const erros  = countErrors(digitadoRef.current, textoRef.current);
    const tempo  = tempoSeg > 0 ? tempoSeg : decorridoRef.current;
    const palavras = Math.round(digitadoRef.current.length / 5);

    /* Monta entrada para salvar */
    const entrada = {
      wpm, acc, errors: erros, time: tempo, words: palavras,
      diff: dificuldade,
      mode: tempoSeg > 0 ? `${tempoSeg}s` : 'livre',
      hardcore,
      type: 'normal',
    };

    /* Salva localmente e envia ao servidor */
    updateBestWpm(wpm);
    addHistoryEntry(entrada);
    submitScore(entrada); // não bloqueia se o backend estiver offline

    if (somLigado) play('complete');
    setResultado({ wpm, acc, errors: erros, time: tempo, words: palavras });
  }

  /* ══ HANDLER DE INPUT ═══════════════════════ */
  function aoDigitar(e) {
    if (finalizadoRef.current) return;
    const val = e.target.value;

    /* Modo Hardcore: bloqueia backspace */
    if (hardcore && val.length < digitadoRef.current.length) {
      e.target.value = digitadoRef.current;
      acionarErroFlash();
      if (somLigado) play('error');
      return;
    }

    /* Feedback sonoro do caractere digitado */
    const novoChar  = val[val.length - 1];
    const esperado  = textoRef.current[val.length - 1];
    if (novoChar && novoChar !== esperado) {
      if (somLigado) play('error');
      acionarErroFlash();
    } else if (novoChar && somLigado) {
      play('normal');
    }

    /* Inicia cronômetro no primeiro caractere */
    if (!iniciado && val.length > 0) {
      setIniciado(true);
      inicioTempoRef.current = Date.now();
      tempoSeg > 0 ? iniciarCountdown() : iniciarCronometroLivre();
    }

    digitadoRef.current = val;
    setDigitado(val);

    /* Modo livre: finaliza ao completar o texto */
    if (tempoSeg === 0 && val.length >= textoRef.current.length) {
      finalizarTeste();
    }
  }

  /* Tab → reinicia */
  function aoApertarTecla(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      resetarTeste();
    }
  }

  /* Pisca borda vermelha por 320ms */
  function acionarErroFlash() {
    setErroFlash(true);
    setTimeout(() => setErroFlash(false), 320);
  }

  /* ══ RENDERIZA OS CARACTERES DO TEXTO ═══════ */
  function renderizarChars() {
    return [...textoAtual].map((ch, i) => {
      let cls = t.charPending;
      if (i < digitado.length) {
        cls = digitado[i] === ch ? t.charCorrect : t.charWrong;
      } else if (i === digitado.length) {
        cls = t.charCursor;
      }
      return (
        <span key={i} className={`${t.char} ${cls}`}>
          {ch}
        </span>
      );
    });
  }

  /* Progresso percentual (modo livre) */
  const progresso = textoAtual.length
    ? (digitado.length / textoAtual.length) * 100
    : 0;

  return (
    <>
      {/* ── Cards de métricas ── */}
      <StatRow>
        <StatCard label="WPM atual"  value={wpmAoVivo}    unit="wpm" accent="var(--accent)" />
        <StatCard label="Precisão"   value={accAoVivo}    unit="%" />
        <StatCard label="Melhor WPM" value={getBestWpm()} unit="wpm" />
      </StatRow>

      {/* ── Controles ── */}
      <div className={lay.controls}>

        {/* Dificuldade */}
        <div className={comp.chipGroup}>
          {DIFICULDADES.map(d => (
            <button
              key={d.id}
              className={`${comp.chip} ${dificuldade === d.id ? comp.chipActive : ''}`}
              onClick={() => setDificuldade(d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className={comp.sep} />

        {/* Tempo */}
        <div className={comp.chipGroup}>
          {TEMPOS.map(tm => (
            <button
              key={tm.seg}
              className={`${comp.chip} ${tempoSeg === tm.seg ? comp.chipActive : ''}`}
              onClick={() => setTempoSeg(tm.seg)}
            >
              {tm.label}
            </button>
          ))}
        </div>

        <div className={comp.sep} />

        {/* Modo Hardcore */}
        <button
          className={`${comp.chip} ${hardcore ? comp.chipActive : ''}`}
          style={hardcore ? { background: 'var(--red)', borderColor: 'var(--red)' } : {}}
          onClick={() => setHardcore(h => !h)}
          title="Sem apagar erros — para os corajosos!"
        >
          Hardcore
        </button>

      </div>

      {/* ── Barra de progresso (modo livre) ── */}
      {tempoSeg === 0 && <ProgressBar pct={progresso} />}

      {/* ── Caixa de digitação ── */}
      <div
        className={`${t.typingBox} ${erroFlash ? t.typingBoxError : ''}`}
        onClick={() => inputRef.current?.focus()}
        role="textbox"
        aria-label="Área de digitação"
      >
        {/* Input oculto — captura o teclado sem exibir o cursor do browser */}
        <input
          ref={inputRef}
          className={t.hiddenInput}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          onInput={aoDigitar}
          onKeyDown={aoApertarTecla}
          disabled={finalizado}
          aria-hidden="true"
        />
        {/* Exibição visual dos caracteres com cores */}
        <div className={t.textDisplay} aria-hidden="true">
          {renderizarChars()}
        </div>
      </div>

      {/* ── Barra de ações ── */}
      <div className={lay.actionBar}>
        <button
          className={`${comp.btn} ${comp.btnPrimary}`}
          onClick={() => resetarTeste(false)}
        >
          ↺ Novo texto
        </button>
        <button
          className={`${comp.btn} ${comp.btnGhost}`}
          onClick={() => resetarTeste(true)}
        >
          Repetir
        </button>

        {/* Badge hardcore visível durante o teste */}
        {hardcore && (
          <span className={comp.hardcoreBadge}>HARDCORE</span>
        )}

        {/* Timer + métricas ao vivo */}
        <div className={lay.actionBarRight}>
          {tempoSeg > 0 && (
            <TimerRing total={tempoSeg} remaining={restando} />
          )}
          <span>WPM <span className={`${lay.liveVal} ${lay.liveAccent}`}>{wpmAoVivo}</span></span>
          <span>ERR <span className={`${lay.liveVal} ${lay.liveRed}`}>{errosAoVivo}</span></span>
        </div>
      </div>

      <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.8rem' }}>
        Dica: <strong style={{color:'var(--text)'}}>Tab</strong> = novo texto &nbsp;·&nbsp;
        Clique na caixa para focar &nbsp;·&nbsp;
        Hardcore = sem apagar erros
      </p>

      {/* ── Modal de resultado ── */}
      {resultado && (
        <ResultOverlay
          result={resultado}
          onNew={()   => { setResultado(null); resetarTeste(false); }}
          onRetry={() => { setResultado(null); resetarTeste(true);  }}
          onClose={()  => setResultado(null)}
        />
      )}
    </>
  );
}
