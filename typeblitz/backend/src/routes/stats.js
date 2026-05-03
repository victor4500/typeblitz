/**
 * routes/stats.js
 *
 * Fornece resumo estatístico dos dados globais do servidor.
 *
 * Endpoints:
 *   GET /api/stats/summary → total de testes, médias e melhores WPMs
 */

const express = require('express');
const db      = require('../config/db');

const router = express.Router();

/* ── GET /api/stats/summary ───────────────────── */
router.get('/summary', (_req, res) => {
  const todos = db.get('ranking').value();

  /* Se não houver dados, retorna zeros */
  if (!todos.length) {
    return res.json({
      ok: true,
      data: { total: 0, avgWpm: 0, bestWpm: 0, avgAcc: 0 },
    });
  }

  /* Separa treino normal do code typing */
  const normal = todos.filter(r => r.type === 'normal' || !r.type);
  const code   = todos.filter(r => r.type === 'code');

  /* Funções auxiliares de cálculo */
  const media = (arr, campo) =>
    arr.length
      ? Math.round(arr.reduce((s, r) => s + r[campo], 0) / arr.length)
      : 0;

  const maximo = (arr, campo) =>
    arr.length ? Math.max(...arr.map(r => r[campo])) : 0;

  res.json({
    ok: true,
    data: {
      total: todos.length,
      normal: {
        total:   normal.length,
        avgWpm:  media(normal, 'wpm'),
        bestWpm: maximo(normal, 'wpm'),
        avgAcc:  media(normal, 'acc'),
      },
      code: {
        total:   code.length,
        avgWpm:  media(code, 'wpm'),
        bestWpm: maximo(code, 'wpm'),
        avgAcc:  media(code, 'acc'),
      },
    },
  });
});

module.exports = router;
