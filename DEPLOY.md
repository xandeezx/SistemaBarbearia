# 🚀 Matheus Barbearia — Guia de Deploy Completo

## 📁 Estrutura do Projeto

```
matheus-barbearia/
├── frontend/          → Deploy na Vercel
│   ├── src/
│   │   ├── App.jsx    → Aplicação completa (site + painel admin)
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── backend/           → Deploy no Render
    ├── server.js      → API REST completa
    ├── package.json
    └── .env.example   → Variáveis de ambiente
```

---

## 🗄️ PASSO 1 — MongoDB Atlas (Banco de Dados)

1. Acesse [mongodb.com/atlas](https://mongodb.com/atlas) e crie conta gratuita
2. Crie um **Cluster** gratuito (M0 Free)
3. Em **Database Access**: crie usuário e senha
4. Em **Network Access**: adicione `0.0.0.0/0` (permite acesso de qualquer IP)
5. Clique em **Connect → Connect your application**
6. Copie a connection string:
   ```
   mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/matheus-barbearia
   ```

---

## ⚙️ PASSO 2 — Backend no Render

1. Acesse [render.com](https://render.com) e crie conta gratuita
2. **New → Web Service**
3. Conecte ao seu repositório GitHub (ou faça upload)
4. Configure:
   - **Name**: `matheus-barbearia-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Adicione as **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | sua connection string do Atlas |
   | `JWT_SECRET` | uma string aleatória e segura |
   | `ADMIN_USER` | matheus |
   | `ADMIN_PASS` | sua senha segura |
   | `PORT` | 3001 |

6. Clique **Deploy** — aguarde o deploy finalizar
7. Copie a URL gerada (ex: `https://matheus-barbearia-api.onrender.com`)

---

## 🌐 PASSO 3 — Frontend na Vercel

1. No arquivo `frontend/src/App.jsx`, **atualize a linha**:
   ```js
   const API = "https://matheus-barbearia-api.onrender.com/api";
   ```
   (substitua pela URL real do Render)

2. Acesse [vercel.com](https://vercel.com) e crie conta gratuita
3. **New Project → Import Git Repository**
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Clique **Deploy**
6. Seu site estará em: `https://matheus-barbearia.vercel.app`

---

## 🖥️ PASSO 4 — Desenvolvimento Local

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com suas variáveis
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🔐 Painel Administrativo

Acesse: `https://seusite.vercel.app/admin`

**Credenciais padrão** (altere no .env):
- Usuário: `matheus`
- Senha: `barbearia2024`

### Funcionalidades do painel:
- 📅 Ver todos os agendamentos com filtro por data
- 📊 Estatísticas (total, confirmados, cancelados)
- ❌ Cancelar agendamentos
- ✂️ Criar e remover serviços
- ⚙️ Configurar horários e intervalos de funcionamento

---

## 📱 Personalizar o Site

No `frontend/src/App.jsx`, edite as constantes no topo:

```js
const API = "sua-url-do-render/api";
const WHATSAPP_LINK = "https://wa.me/message/2IJ2DPIUTOH4P1";  // já configurado
const INSTAGRAM = "https://instagram.com/mateusducorte.00";      // já configurado
const MAPS_LINK = "https://maps.google.com/?q=Matheus+Barbearia+Recife";
```

---

## 🛣️ Rotas da API

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/api/auth/login` | Login admin | ❌ |
| `GET` | `/api/servicos` | Listar serviços | ❌ |
| `POST` | `/api/servicos` | Criar serviço | ✅ |
| `DELETE` | `/api/servicos/:id` | Remover serviço | ✅ |
| `POST` | `/api/agendamento` | Criar agendamento | ❌ |
| `GET` | `/api/agendamentos` | Listar agendamentos | ✅ |
| `DELETE` | `/api/agendamento/:id` | Cancelar agendamento | ✅ |
| `GET` | `/api/horarios-disponiveis?data=YYYY-MM-DD` | Slots disponíveis | ❌ |
| `GET` | `/api/config` | Configurações | ✅ |
| `PUT` | `/api/config` | Atualizar configurações | ✅ |

---

## ⚠️ Observações Importantes

1. **Render Free Tier**: O backend "dorme" após 15 min de inatividade. Na primeira request pode demorar ~30s para acordar. Para evitar isso, faça upgrade para o plano pago ou use um serviço de ping (ex: UptimeRobot).

2. **MongoDB Atlas Free**: 512MB de armazenamento — mais que suficiente para uma barbearia.

3. **Segurança**: Troque as variáveis padrão no `.env` antes do deploy em produção.

---

## 📞 Suporte

Instagram: [@mateusducorte.00](https://instagram.com/mateusducorte.00)
WhatsApp: [Contato direto](https://wa.me/message/2IJ2DPIUTOH4P1)
