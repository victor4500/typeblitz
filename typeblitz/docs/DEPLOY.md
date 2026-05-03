# TypeBlitz — Guia de Deploy no Servidor Caseiro

## Pré-requisitos

- Linux (Ubuntu/Debian recomendado)
- Docker + Docker Compose **ou** Node.js 18+
- Porta 80 (e opcionalmente 443 para HTTPS) aberta no firewall

---

## Opção 1 — Docker Compose (mais fácil)

```bash
# 1. Clone ou copie o projeto
cd /opt && git clone <seu-repo> typeblitz
cd typeblitz

# 2. Suba tudo
docker-compose up -d

# 3. Acesse no navegador
http://SEU-IP-LOCAL
```

**Gerenciar:**
```bash
docker-compose logs -f          # logs em tempo real
docker-compose restart          # reiniciar
docker-compose down             # parar
docker-compose up -d --build    # rebuild + restart
```

---

## Opção 2 — Manual com nginx

### Backend

```bash
cd /opt/typeblitz/backend
npm install
npm start &   # roda em background na porta 3001
```

Para manter rodando após reboot, crie um serviço systemd:

```ini
# /etc/systemd/system/typeblitz-api.service
[Unit]
Description=TypeBlitz API
After=network.target

[Service]
WorkingDirectory=/opt/typeblitz/backend
ExecStart=/usr/bin/node src/index.js
Restart=always
User=www-data
Environment=NODE_ENV=production PORT=3001

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable typeblitz-api
sudo systemctl start typeblitz-api
```

### Frontend (build)

```bash
cd /opt/typeblitz/frontend
npm install
npm run build
# Pasta dist/ gerada
```

### Nginx

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/typeblitz
```

Cole:
```nginx
server {
    listen 80;
    server_name _;    # ou seu IP/domínio

    root /opt/typeblitz/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/typeblitz /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## Acessar de fora da sua rede local

1. **Descubra o IP local** do servidor: `hostname -I`
2. **Configure port forwarding** no seu roteador: porta 80 → IP do servidor
3. Acesse via seu **IP público** ou use um serviço de DNS dinâmico (DuckDNS, etc.)

Para HTTPS gratuito use **Certbot + Let's Encrypt** (requer domínio):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com
```

---

## Atualizar o projeto

```bash
cd /opt/typeblitz
git pull
docker-compose up -d --build   # com Docker

# Ou sem Docker:
cd frontend && npm run build
sudo systemctl restart typeblitz-api
```
