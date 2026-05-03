# ⌨️ TypeBlitz

> Typing speed trainer progressivo — do iniciante ao nível impossível.

---

## 📁 Estrutura do Projeto

```
typeblitz/
├── backend/          # API Node.js + Express (ranking global, stats)
├── frontend/         # React + Vite + CSS Modules
├── mobile/           # React Native (futuro)
├── docs/             # Documentação técnica e de design
├── .gitignore
└── README.md
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- npm 9+

### 1. Clone / extraia o projeto

```bash
cd typeblitz
```

### 2. Suba o Backend

```bash
cd backend
npm install
npm run dev
# Rodando em http://localhost:3001
```

### 3. Suba o Frontend

```bash
cd ../frontend
npm install
npm run dev
# Rodando em http://localhost:5173
```

---

## 🖥️ Como Subir no Servidor Caseiro

### Opção A — Com Docker (recomendado)

```bash
# Na raiz do projeto
docker-compose up -d
# Acesse: http://SEU-IP:80
```

### Opção B — Manual (sem Docker)

**Backend:**
```bash
cd backend
npm install
npm run build   # compila TypeScript (se aplicável)
npm start       # porta 3001
```

**Frontend:**
```bash
cd frontend
npm install
npm run build   # gera pasta dist/
# Sirva a pasta dist/ com nginx ou qualquer servidor estático
```

**Nginx config mínimo:**
```nginx
server {
    listen 80;
    server_name SEU-IP ou DOMINIO;

    # Frontend (arquivos estáticos)
    location / {
        root /caminho/para/typeblitz/frontend/dist;
        try_files $uri /index.html;
    }

    # Backend (API)
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## ✨ Funcionalidades

| Feature | Status |
|---|---|
| Treino com 4 níveis de dificuldade | ✅ |
| WPM + Precisão em tempo real | ✅ |
| Modo temporizador (30s/60s/120s) | ✅ |
| Modo Hardcore (sem apagar erros) | ✅ |
| Sons de teclado | ✅ |
| Code Typing (Python, JS, HTML/CSS) | ✅ |
| Ranking local (localStorage) | ✅ |
| Ranking global (backend API) | ✅ |
| Histórico e estatísticas | ✅ |
| Gráfico de evolução WPM | ✅ |
| Mobile (React Native) | 🔜 |

---

## 🛠 Stack

- **Frontend:** React 18, Vite, CSS Modules
- **Backend:** Node.js, Express, lowdb (JSON file DB)
- **Estilo:** CSS custom puro (sem Tailwind — mais leve)
- **Deploy:** Docker + Nginx

---

## 📄 Licença

MIT — use à vontade.
