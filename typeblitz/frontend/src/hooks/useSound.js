/**
 * hooks/useSound.js
 *
 * Sons de teclado gerados via Web Audio API.
 * Não depende de nenhum arquivo de áudio externo.
 *
 * Tipos de som:
 *   'normal'   → clique suave (tecla correta)
 *   'error'    → tom grave (tecla errada)
 *   'complete' → tom agudo (teste concluído)
 */

import { useRef, useCallback } from 'react';

export function useSound() {
  const ctxRef = useRef(null);

  /* Cria o AudioContext apenas na primeira chamada (lazy) */
  function obterContexto() {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctxRef.current;
  }

  const play = useCallback((tipo = 'normal') => {
    try {
      const ctx  = obterContexto();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (tipo === 'error') {
        /* Erro: som grave e levemente dissonante */
        osc.frequency.value = 180;
        gain.gain.value     = 0.06;
        osc.type            = 'sawtooth';
      } else if (tipo === 'complete') {
        /* Conclusão: som agudo e limpo */
        osc.frequency.value = 1200;
        gain.gain.value     = 0.04;
        osc.type            = 'sine';
      } else {
        /* Tecla normal: clique curto com frequência aleatória */
        osc.frequency.value = 750 + Math.random() * 250;
        gain.gain.value     = 0.018;
        osc.type            = 'sine';
      }

      const agora = ctx.currentTime;
      gain.gain.setValueAtTime(gain.gain.value, agora);
      gain.gain.exponentialRampToValueAtTime(0.0001, agora + 0.06);
      osc.start(agora);
      osc.stop(agora + 0.07);
    } catch (_) {
      /* Ignora erros de autoplay — navegador pode bloquear antes do clique */
    }
  }, []);

  return { play };
}
