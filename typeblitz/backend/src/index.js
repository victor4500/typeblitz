/**
 * TypeBlitz — Ponto de entrada do Backend
 *
 * Tecnologia: Node.js + Express
 * Porta padrão: 3001 (configurável via variável de ambiente PORT)
 *
 * Rotas disponíveis:
 *   GET  /api/health          → verifica se o servidor está rodando
 *   GET  /api/ranking         → lista ranking global
 *   POST /api/ranking         → salva novo resultado
 *   GET  /api/ranking/top     → top 10 por tipo
 *   GET  /api/stats/summary   → resumo de estatísticas globais
 */

const express = require('express');
const cors    = require('cors');

const rotasRanking = require('./routes/ranking');
const rotasStats   = require('./routes/stats');

const app  = express();
const PORTA = process.env.PORT || 3001;

/* ── Middlewares ──────────────────────────────── */

/* Permite requisições de qualquer origem (necessário para o frontend) */
app.use(cors());

/* Interpreta JSON no corpo das requisições */
app.use(express.json());

/* Log simples de todas as requisições recebidas */
app.use((req, _res, next) => {
  const agora = new Date().toISOString();
  console.log(`[${agora}] ${req.method} ${req.url}`);
  next();
});

/* ── Rotas ────────────────────────────────────── */
app.use('/api/ranking', rotasRanking);
app.use('/api/stats',   rotasStats);

/* Verificação de saúde — confirma que o servidor está rodando */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: Date.now() });
});

/* ── Inicia o servidor ────────────────────────── */
app.listen(PORTA, () => {
  console.log(`\n⌨️  TypeBlitz API rodando em http://localhost:${PORTA}`);
  console.log(`   Banco de dados: backend/data/db.json\n`);
});
