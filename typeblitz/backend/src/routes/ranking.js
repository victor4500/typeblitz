/**
 * routes/ranking.js
 *
 * Gerencia o ranking global de resultados.
 *
 * Endpoints:
 *   GET  /api/ranking        → lista resultados (filtros: type, diff, limit)
 *   POST /api/ranking        → salva novo resultado
 *   GET  /api/ranking/top    → top 10 separado por tipo (normal / code)
 */

const express       = require('express');
const { v4: uuidv4 } = require('uuid');
const db            = require('../config/db');

const router = express.Router();

/* ── GET /api/ranking ─────────────────────────── */
/* Retorna lista de resultados ordenada por WPM (maior primeiro) */
router.get('/', (req, res) => {
  const { type, diff, limit = 50 } = req.query;

  let dados = db.get('ranking').value();

  /* Filtros opcionais */
  if (type) dados = dados.filter(r => r.type === type);
  if (diff) dados = dados.filter(r => r.diff === diff);

  /* Ordena por WPM decrescente e limita a quantidade */
  dados = dados
    .sort((a, b) => b.wpm - a.wpm)
    .slice(0, Number(limit));

  res.json({ ok: true, data: dados });
});

/* ── GET /api/ranking/top ─────────────────────── */
/* Retorna top 10 para cada tipo (treino normal e code typing) */
router.get('/top', (_req, res) => {
  const todos = db.get('ranking').value();

  const top10 = (tipo) =>
    todos
      .filter(r => r.type === tipo)
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, 10);

  res.json({
    ok: true,
    data: {
      normal: top10('normal'),
      code:   top10('code'),
    },
  });
});

/* ── POST /api/ranking ────────────────────────── */
/* Recebe e salva um novo resultado no banco */
router.post('/', (req, res) => {
  const { nickname, wpm, acc, errors, time, diff, mode, type, lang } = req.body;

  /* Validação básica dos dados recebidos */
  if (!wpm || wpm < 0 || wpm > 300) {
    return res.status(400).json({ ok: false, error: 'WPM inválido (deve ser entre 0 e 300)' });
  }
  if (acc < 0 || acc > 100) {
    return res.status(400).json({ ok: false, error: 'Precisão inválida (deve ser entre 0 e 100)' });
  }

  /* Monta o objeto de entrada */
  const entrada = {
    id:       uuidv4(),
    nickname: (nickname || 'Anônimo').slice(0, 20),
    wpm:      Math.round(wpm),
    acc:      Math.round(acc),
    errors:   errors || 0,
    time:     time   || 0,
    diff:     diff   || 'medium',
    mode:     mode   || 'normal',
    type:     type   || 'normal',
    lang:     lang   || null,
    ts:       Date.now(),
  };

  /* Salva no banco */
  db.get('ranking').push(entrada).write();

  /*
   * Controle de tamanho: mantém apenas os 500 melhores resultados.
   * Evita que o arquivo db.json cresça indefinidamente.
   */
  const todos = db.get('ranking').value().sort((a, b) => b.wpm - a.wpm);
  if (todos.length > 500) {
    db.set('ranking', todos.slice(0, 500)).write();
  }

  res.status(201).json({ ok: true, data: entrada });
});

module.exports = router;
