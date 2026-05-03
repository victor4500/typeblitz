/**
 * components/WpmChart.jsx
 *
 * Gráfico de linha que mostra a evolução do WPM ao longo do tempo.
 *
 * Implementado com Canvas nativo — zero dependências externas.
 *
 * O que é desenhado:
 *   1. Linhas de grade horizontais com valores de referência
 *   2. Área preenchida com gradiente abaixo da linha
 *   3. Linha principal conectando os pontos
 *   4. Pontos circulares em cada registro
 *
 * Props:
 *   data → array de números (WPM de cada teste, do mais antigo ao mais recente)
 */

import { useEffect, useRef } from 'react';
import s from '../styles/stats.module.css';

export default function WpmChart({ data = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const W   = canvas.offsetWidth || 800;
    const H   = 110;
    canvas.width  = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    /* Mensagem quando não há dados */
    if (!data.length) {
      ctx.fillStyle = '#6b6b8a';
      ctx.font      = '13px Syne, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Nenhum dado ainda — faça seu primeiro teste!', W / 2, H / 2);
      return;
    }

    const maximo = Math.max(...data, 1);
    const PAD    = 10;

    /* Calcula a posição (x, y) de cada ponto no canvas */
    const pontos = data.map((v, i) => ({
      x: PAD + (i / (data.length - 1 || 1)) * (W - PAD * 2),
      y: H - PAD - (v / maximo) * (H - PAD * 2),
    }));

    /* ── Grade de referência ── */
    ctx.strokeStyle = '#2a2a40';
    ctx.lineWidth   = 1;
    [0.25, 0.5, 0.75, 1].forEach(fator => {
      const y = H - PAD - fator * (H - PAD * 2);
      ctx.beginPath();
      ctx.moveTo(PAD, y);
      ctx.lineTo(W - PAD, y);
      ctx.stroke();

      /* Label do valor de referência */
      ctx.fillStyle  = '#6b6b8a';
      ctx.font       = '10px Space Mono, monospace';
      ctx.textAlign  = 'right';
      ctx.fillText(Math.round(fator * maximo), PAD - 2, y + 3);
    });

    /* ── Área preenchida com gradiente ── */
    const gradiente = ctx.createLinearGradient(0, 0, 0, H);
    gradiente.addColorStop(0,   'rgba(124,92,252,0.38)');
    gradiente.addColorStop(1,   'rgba(124,92,252,0)');

    ctx.beginPath();
    ctx.moveTo(pontos[0].x, H);
    pontos.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pontos[pontos.length - 1].x, H);
    ctx.closePath();
    ctx.fillStyle = gradiente;
    ctx.fill();

    /* ── Linha principal ── */
    ctx.beginPath();
    ctx.strokeStyle = '#7c5cfc';
    ctx.lineWidth   = 2.5;
    ctx.lineJoin    = 'round';
    ctx.lineCap     = 'round';
    pontos.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();

    /* ── Pontos circulares ── */
    pontos.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle   = '#7c5cfc';
      ctx.strokeStyle = '#0a0a0f';
      ctx.lineWidth   = 1.5;
      ctx.fill();
      ctx.stroke();
    });

  }, [data]);

  return (
    <div className={s.chartWrap}>
      <h3>Evolução WPM — últimos {data.length} testes</h3>
      <canvas ref={canvasRef} className={s.chart} />
    </div>
  );
}
