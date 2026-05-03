# TypeBlitz — Arquitetura Técnica

## Visão geral

```
Browser ──── React (Vite) ──── /api ──── Express ──── lowdb (JSON)
                │
           localStorage
         (histórico local,
          melhor WPM, nick)
```

---

## Frontend

| Arquivo | Responsabilidade |
|---|---|
| `src/App.jsx` | Roteamento entre páginas, estado global |
| `src/pages/TypingPage.jsx` | Lógica completa do teste de digitação |
| `src/pages/CodePage.jsx` | Treino de código |
| `src/pages/StatsPage.jsx` | Estatísticas e rankings |
| `src/components/` | UI pura, sem lógica de negócio |
| `src/hooks/useStorage.js` | Toda persistência no localStorage |
| `src/hooks/useSound.js` | Web Audio API |
| `src/utils/typing.js` | Cálculos puros (WPM, accuracy, rank) |
| `src/utils/api.js` | HTTP client para o backend |
| `src/data/texts.js` | Textos por dificuldade |
| `src/data/codeSnippets.js` | Trechos de código |
| `src/styles/` | CSS Modules por domínio |

---

## Backend

| Arquivo | Responsabilidade |
|---|---|
| `src/index.js` | Entry point, middlewares, listen |
| `src/config/db.js` | lowdb setup, schema inicial |
| `src/routes/ranking.js` | CRUD de resultados |
| `src/routes/stats.js` | Sumarização de stats globais |
| `data/db.json` | Banco de dados JSON (gitignored) |

### Endpoints

```
GET  /api/health            → status do servidor
GET  /api/ranking           → lista resultados (query: type, diff, limit)
POST /api/ranking           → salva resultado
GET  /api/ranking/top       → top 10 por tipo (normal/code)
GET  /api/stats/summary     → médias e totais globais
```

---

## Fluxo de dados — Teste de digitação

```
1. Usuário escolhe dificuldade / tempo / modo
2. pickRandom(TEXTS[diff]) → texto exibido
3. Input oculto captura teclado (evita IME/autocomplete)
4. Primeiro char → inicia cronômetro
5. A cada char:
   - compara typed[i] vs text[i]
   - atualiza char class (correct/wrong/cursor)
   - soa feedback (Web Audio)
6. Término (tempo ou texto completo):
   - calcWpm, calcAccuracy, countErrors
   - addHistoryEntry(localStorage)
   - submitScore(API)  ← fire-and-forget, não bloqueia
   - exibe ResultOverlay
```

---

## Deploy no servidor caseiro

### Com Docker (recomendado)

```bash
# Instale docker e docker-compose
# Na raiz do projeto:
docker-compose up -d

# Ver logs
docker-compose logs -f

# Rebuild após alterações
docker-compose up -d --build
```

### Sem Docker

```bash
# Backend
cd backend && npm install && node src/index.js &

# Frontend
cd frontend && npm install && npm run build
# Sirva dist/ com nginx ou:
npx serve dist -p 80
```

---

## Variáveis de ambiente

| Var | Default | Descrição |
|---|---|---|
| `PORT` | `3001` | Porta do backend |
| `NODE_ENV` | `development` | Ambiente |

Crie `backend/.env` para sobrescrever:
```env
PORT=3001
NODE_ENV=production
```
