/**
 * config/db.js
 *
 * Configura o banco de dados JSON usando lowdb.
 * O arquivo de dados fica em: backend/data/db.json
 *
 * lowdb é uma biblioteca simples que persiste dados num arquivo JSON.
 * É ideal para projetos pessoais e servidores caseiros — sem necessidade
 * de instalar PostgreSQL ou MongoDB.
 *
 * Estrutura do banco:
 * {
 *   ranking: [  ← lista de resultados enviados pelos usuários
 *     { id, nickname, wpm, acc, errors, time, diff, mode, type, lang, ts }
 *   ]
 * }
 */

const low      = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path     = require('path');
const fs       = require('fs');

/* Garante que a pasta data/ existe antes de criar o arquivo */
const pastaData = path.join(__dirname, '../../data');
if (!fs.existsSync(pastaData)) {
  fs.mkdirSync(pastaData, { recursive: true });
}

/* Cria o adaptador apontando para o arquivo JSON */
const adaptador = new FileSync(path.join(pastaData, 'db.json'));
const db        = low(adaptador);

/* Define a estrutura inicial caso o arquivo esteja vazio */
db.defaults({
  ranking: [],   // resultados de treino dos usuários
}).write();

module.exports = db;
