const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/matheus-barbearia')
  .then(() => {
    console.log('✅ MongoDB conectado');
    seedServicos();
  })
  .catch(err => console.error('❌ Erro MongoDB:', err));

// ─── Schemas ──────────────────────────────────────────────────────────────────
const agendamentoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String, required: true },
  servico: { type: String, required: true },
  data: { type: String, required: true },
  horario: { type: String, required: true },
  status: { type: String, default: 'confirmado', enum: ['confirmado', 'cancelado', 'concluido'] },
  criadoEm: { type: Date, default: Date.now }
});

const servicoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  duracao: { type: Number, required: true },
  descricao: String,
  ativo: { type: Boolean, default: true }
});

const configSchema = new mongoose.Schema({
  horarioAbertura: { type: String, default: '09:00' },
  horarioFechamento: { type: String, default: '20:00' },
  intervalo: { type: Number, default: 30 },
  diasFuncionamento: { type: [Number], default: [1,2,3,4,5,6] }
});

const Agendamento = mongoose.model('Agendamento', agendamentoSchema);
const Servico = mongoose.model('Servico', servicoSchema);
const Config = mongoose.model('Config', configSchema);

// ─── Auth Middleware ──────────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET || 'matheus_secret_2024');
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { usuario, senha } = req.body;
  const adminUser = process.env.ADMIN_USER || 'matheus';
  const adminPass = process.env.ADMIN_PASS || 'barbearia2024';

  if (usuario !== adminUser || senha !== adminPass) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ usuario }, process.env.JWT_SECRET || 'matheus_secret_2024', { expiresIn: '7d' });
  res.json({ token });
});

// ─── Agendamentos Routes ──────────────────────────────────────────────────────
app.post('/api/agendamento', async (req, res) => {
  try {
    const { nome, telefone, servico, data, horario } = req.body;
    const conflito = await Agendamento.findOne({ data, horario, status: { $ne: 'cancelado' } });
    if (conflito) return res.status(409).json({ error: 'Horário já reservado' });
    const agendamento = await Agendamento.create({ nome, telefone, servico, data, horario });
    res.status(201).json(agendamento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/agendamentos', authMiddleware, async (req, res) => {
  const { data } = req.query;
  const filtro = data ? { data } : {};
  const agendamentos = await Agendamento.find(filtro).sort({ data: 1, horario: 1 });
  res.json(agendamentos);
});

app.get('/api/horarios-disponiveis', async (req, res) => {
  try {
    const { data } = req.query;
    if (!data) return res.status(400).json({ error: 'Data obrigatória' });

    let config = await Config.findOne();
    if (!config) config = new Config();

    const slots = [];
    const hAbre = parseInt(config.horarioAbertura.split(':')[0]);
    const mAbre = parseInt(config.horarioAbertura.split(':')[1]);
    const hFecha = parseInt(config.horarioFechamento.split(':')[0]);
    const mFecha = parseInt(config.horarioFechamento.split(':')[1]);

    let cur = hAbre * 60 + mAbre;
    const fim = hFecha * 60 + mFecha;

    while (cur < fim) {
      const h = Math.floor(cur / 60).toString().padStart(2, '0');
      const m = (cur % 60).toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
      cur += config.intervalo;
    }

    const ocupados = await Agendamento.find({ data, status: { $ne: 'cancelado' } }).select('horario');
    const horariosOcupados = ocupados.map(a => a.horario);
    const disponiveis = slots.filter(s => !horariosOcupados.includes(s));
    res.json(disponiveis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/agendamento/:id', authMiddleware, async (req, res) => {
  await Agendamento.findByIdAndUpdate(req.params.id, { status: 'cancelado' });
  res.json({ success: true });
});

app.patch('/api/agendamento/:id', authMiddleware, async (req, res) => {
  const agendamento = await Agendamento.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(agendamento);
});

// ─── Serviços Routes ──────────────────────────────────────────────────────────
app.get('/api/servicos', async (req, res) => {
  const servicos = await Servico.find({ ativo: true });
  res.json(servicos);
});

app.post('/api/servicos', authMiddleware, async (req, res) => {
  const servico = await Servico.create(req.body);
  res.status(201).json(servico);
});

app.put('/api/servicos/:id', authMiddleware, async (req, res) => {
  const servico = await Servico.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(servico);
});

app.delete('/api/servicos/:id', authMiddleware, async (req, res) => {
  await Servico.findByIdAndUpdate(req.params.id, { ativo: false });
  res.json({ success: true });
});

// ─── Config Routes ────────────────────────────────────────────────────────────
app.get('/api/config', authMiddleware, async (req, res) => {
  let config = await Config.findOne();
  if (!config) config = await Config.create({});
  res.json(config);
});

app.put('/api/config', authMiddleware, async (req, res) => {
  let config = await Config.findOne();
  if (!config) config = new Config();
  Object.assign(config, req.body);
  await config.save();
  res.json(config);
});

// ─── Seed inicial de serviços ─────────────────────────────────────────────────
async function seedServicos() {
  try {
    const count = await Servico.countDocuments();
    if (count === 0) {
      await Servico.insertMany([
        { nome: 'Corte', preco: 35, duracao: 30, descricao: 'Corte masculino completo' },
        { nome: 'Barba', preco: 25, duracao: 30, descricao: 'Modelagem e hidratação da barba' },
        { nome: 'Corte + Barba', preco: 55, duracao: 60, descricao: 'Combo completo corte e barba' },
        { nome: 'Sobrancelha', preco: 15, duracao: 15, descricao: 'Design de sobrancelha' },
        { nome: 'Pigmentação', preco: 80, duracao: 60, descricao: 'Coloração e pigmentação' },
      ]);
      console.log('✅ Serviços iniciais criados');
    }
  } catch (err) {
    console.error('⚠️ Seed ignorado:', err.message);
  }
}

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Backend rodando na porta ${PORT}`));