import { useState, useEffect, useCallback } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const API = "https://seu-backend.onrender.com/api"; // Troque pela URL do Render
const WHATSAPP_LINK = "https://wa.me/message/2IJ2DPIUTOH4P1";
const INSTAGRAM = "https://instagram.com/mateusducorte.00";
const MAPS_LINK = "https://maps.google.com/?q=Matheus+Barbearia+Recife";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const GOLD = "#C9A84C";
const DARK = "#0D0D0D";
const DARKGRAY = "#161616";
const MIDGRAY = "#1E1E1E";
const LIGHTGRAY = "#2A2A2A";
const TEXT = "#F0EDE8";
const TEXTMUTED = "#8A8480";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:${DARK};color:${TEXT};font-family:'Inter',sans-serif;overflow-x:hidden}
  
  h1,h2,h3{font-family:'Cormorant Garamond',serif}
  .bebas{font-family:'Bebas Neue',sans-serif;letter-spacing:2px}
  
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:${DARK}}
  ::-webkit-scrollbar-thumb{background:${GOLD};border-radius:2px}
  
  .gold{color:${GOLD}}
  .btn-gold{
    background:linear-gradient(135deg,#C9A84C,#E8CC7A);
    color:#0D0D0D;
    border:none;
    padding:14px 32px;
    font-family:'Inter',sans-serif;
    font-weight:600;
    font-size:14px;
    letter-spacing:1.5px;
    text-transform:uppercase;
    cursor:pointer;
    transition:all 0.3s;
    clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
  }
  .btn-gold:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(201,168,76,0.4)}
  .btn-outline{
    background:transparent;
    color:${GOLD};
    border:1px solid ${GOLD};
    padding:12px 28px;
    font-family:'Inter',sans-serif;
    font-weight:500;
    font-size:13px;
    letter-spacing:1px;
    text-transform:uppercase;
    cursor:pointer;
    transition:all 0.3s;
  }
  .btn-outline:hover{background:${GOLD};color:#0D0D0D}
  
  input,select,textarea{
    background:${LIGHTGRAY};
    border:1px solid #333;
    color:${TEXT};
    padding:12px 16px;
    font-family:'Inter',sans-serif;
    font-size:14px;
    width:100%;
    outline:none;
    transition:border-color 0.2s;
  }
  input:focus,select:focus,textarea:focus{border-color:${GOLD}}
  select option{background:${MIDGRAY}}
  
  .toast{
    position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
    padding:14px 28px;border-radius:4px;font-size:14px;font-weight:500;
    z-index:9999;animation:slideUp 0.3s ease;
    pointer-events:none;
  }
  .toast-success{background:#1a3a1a;color:#4ade80;border:1px solid #2d5a2d}
  .toast-error{background:#3a1a1a;color:#f87171;border:1px solid #5a2d2d}
  @keyframes slideUp{from{transform:translateX(-50%) translateY(20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
  
  .nav{
    position:fixed;top:0;left:0;right:0;z-index:100;
    display:flex;align-items:center;justify-content:space-between;
    padding:16px 60px;
    transition:all 0.3s;
  }
  .nav.scrolled{background:rgba(13,13,13,0.95);backdrop-filter:blur(20px);border-bottom:1px solid #1f1f1f}
  .nav-logo{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:3px;color:${GOLD};text-decoration:none}
  .nav-links{display:flex;gap:32px;list-style:none}
  .nav-links a{color:${TEXTMUTED};text-decoration:none;font-size:13px;letter-spacing:1px;text-transform:uppercase;transition:color 0.2s}
  .nav-links a:hover{color:${TEXT}}
  
  .hero{
    min-height:100vh;display:flex;align-items:center;
    padding:0 60px;position:relative;overflow:hidden;
  }
  .hero-bg{
    position:absolute;inset:0;
    background:linear-gradient(135deg,#0D0D0D 0%,#161616 50%,#1a1208 100%);
  }
  .hero-pattern{
    position:absolute;inset:0;
    background-image:repeating-linear-gradient(
      45deg,transparent,transparent 35px,rgba(201,168,76,0.03) 35px,rgba(201,168,76,0.03) 70px
    );
  }
  .hero-content{position:relative;z-index:1;max-width:700px}
  .hero-badge{
    display:inline-block;background:rgba(201,168,76,0.1);color:${GOLD};
    border:1px solid rgba(201,168,76,0.3);padding:6px 16px;
    font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:24px;
  }
  .hero h1{
    font-size:clamp(60px,8vw,110px);font-weight:300;line-height:0.9;
    margin-bottom:24px;letter-spacing:-2px;
  }
  .hero h1 span{color:${GOLD};font-weight:700}
  .hero-sub{font-size:17px;color:${TEXTMUTED};line-height:1.7;margin-bottom:40px;max-width:500px}
  .hero-actions{display:flex;gap:16px;align-items:center}
  
  .section{padding:100px 60px}
  .section-label{
    font-size:11px;letter-spacing:4px;text-transform:uppercase;
    color:${GOLD};margin-bottom:16px;display:block;
  }
  .section-title{font-size:clamp(36px,4vw,56px);font-weight:300;margin-bottom:16px}
  .section-title strong{color:${GOLD};font-weight:700}
  
  .services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1px;background:#1a1a1a;margin-top:60px}
  .service-card{
    background:${DARKGRAY};padding:40px 32px;transition:all 0.3s;cursor:pointer;
    position:relative;overflow:hidden;
  }
  .service-card::before{
    content:'';position:absolute;bottom:0;left:0;right:0;height:2px;
    background:linear-gradient(90deg,transparent,${GOLD},transparent);
    transform:scaleX(0);transition:transform 0.3s;
  }
  .service-card:hover{background:${MIDGRAY}}
  .service-card:hover::before{transform:scaleX(1)}
  .service-num{font-family:'Bebas Neue';font-size:60px;color:#1f1f1f;position:absolute;top:20px;right:24px}
  .service-name{font-size:22px;font-weight:600;margin-bottom:8px}
  .service-desc{font-size:13px;color:${TEXTMUTED};margin-bottom:20px;line-height:1.6}
  .service-footer{display:flex;justify-content:space-between;align-items:center}
  .service-price{font-size:28px;font-family:'Cormorant Garamond';color:${GOLD};font-weight:600}
  .service-time{font-size:12px;color:${TEXTMUTED};letter-spacing:1px}
  
  .booking-section{
    background:linear-gradient(135deg,${DARKGRAY},#1a1208);
    border-top:1px solid #1f1f1f;border-bottom:1px solid #1f1f1f;
  }
  .booking-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;margin-top:60px}
  .booking-form{display:flex;flex-direction:column;gap:16px}
  .booking-info h3{font-size:32px;font-weight:300;margin-bottom:16px}
  .booking-info p{color:${TEXTMUTED};line-height:1.8;margin-bottom:24px}
  .info-item{display:flex;gap:12px;margin-bottom:16px;align-items:flex-start}
  .info-icon{color:${GOLD};font-size:16px;margin-top:2px}
  .info-text{font-size:14px;color:${TEXTMUTED};line-height:1.6}
  
  .slots-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px}
  .slot{
    padding:10px 8px;text-align:center;font-size:13px;cursor:pointer;
    border:1px solid #2a2a2a;transition:all 0.2s;background:${LIGHTGRAY};
  }
  .slot:hover{border-color:${GOLD};color:${GOLD}}
  .slot.selected{background:${GOLD};color:#0D0D0D;border-color:${GOLD};font-weight:600}
  .slot.loading{opacity:0.5;cursor:not-allowed}
  
  .reviews-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-top:60px}
  .review-card{background:${DARKGRAY};padding:32px;border:1px solid #1f1f1f;position:relative}
  .review-quote{font-size:60px;font-family:'Cormorant Garamond';color:rgba(201,168,76,0.2);position:absolute;top:16px;right:24px;line-height:1}
  .review-text{font-size:15px;color:${TEXTMUTED};line-height:1.8;margin-bottom:20px}
  .review-author{display:flex;align-items:center;gap:12px}
  .review-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,${GOLD},#8B6914);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#0D0D0D}
  .review-name{font-weight:600;font-size:14px}
  .review-stars{color:${GOLD};font-size:12px;letter-spacing:2px}
  
  .footer{background:${DARKGRAY};padding:60px;border-top:1px solid #1f1f1f}
  .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:60px;margin-bottom:40px}
  .footer-brand{font-family:'Bebas Neue';font-size:32px;color:${GOLD};margin-bottom:12px;display:block}
  .footer-desc{color:${TEXTMUTED};font-size:13px;line-height:1.8}
  .footer-title{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${GOLD};margin-bottom:20px}
  .footer-links{list-style:none;display:flex;flex-direction:column;gap:10px}
  .footer-links a{color:${TEXTMUTED};text-decoration:none;font-size:13px;transition:color 0.2s}
  .footer-links a:hover{color:${TEXT}}
  .footer-bottom{border-top:1px solid #1f1f1f;padding-top:24px;display:flex;justify-content:space-between;align-items:center}
  .footer-copy{color:${TEXTMUTED};font-size:12px}
  
  .wa-float{
    position:fixed;bottom:32px;right:32px;z-index:999;
    width:60px;height:60px;border-radius:50%;
    background:linear-gradient(135deg,#25D366,#128C7E);
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;box-shadow:0 8px 30px rgba(37,211,102,0.4);
    transition:all 0.3s;text-decoration:none;border:none;
  }
  .wa-float:hover{transform:scale(1.1);box-shadow:0 12px 40px rgba(37,211,102,0.5)}
  .wa-float svg{width:28px;height:28px;fill:white}
  
  .admin-layout{display:grid;grid-template-columns:260px 1fr;min-height:100vh}
  .admin-sidebar{background:${DARKGRAY};border-right:1px solid #1f1f1f;padding:32px 24px}
  .admin-content{padding:40px;overflow-y:auto}
  .admin-nav-item{
    display:flex;align-items:center;gap:12px;padding:12px 16px;
    cursor:pointer;transition:all 0.2s;border-radius:4px;margin-bottom:4px;
    font-size:14px;color:${TEXTMUTED};
  }
  .admin-nav-item:hover{background:rgba(201,168,76,0.08);color:${TEXT}}
  .admin-nav-item.active{background:rgba(201,168,76,0.12);color:${GOLD}}
  .admin-card{background:${DARKGRAY};border:1px solid #1f1f1f;padding:24px;margin-bottom:20px}
  .admin-table{width:100%;border-collapse:collapse}
  .admin-table th{text-align:left;padding:12px 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${TEXTMUTED};border-bottom:1px solid #1f1f1f}
  .admin-table td{padding:14px 16px;font-size:13px;border-bottom:1px solid #111}
  .admin-table tr:hover td{background:rgba(255,255,255,0.02)}
  .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500}
  .badge-green{background:rgba(74,222,128,0.1);color:#4ade80}
  .badge-red{background:rgba(248,113,113,0.1);color:#f87171}
  .badge-gray{background:rgba(138,132,128,0.15);color:${TEXTMUTED}}
  .stat-card{background:${MIDGRAY};border:1px solid #1f1f1f;padding:24px;text-align:center}
  .stat-num{font-family:'Bebas Neue';font-size:48px;color:${GOLD};line-height:1}
  .stat-label{font-size:12px;color:${TEXTMUTED};letter-spacing:1px;text-transform:uppercase;margin-top:4px}
  
  .login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:${DARK}}
  .login-box{background:${DARKGRAY};border:1px solid #1f1f1f;padding:48px;width:100%;max-width:400px}
  
  .spinner{
    width:20px;height:20px;border:2px solid rgba(201,168,76,0.2);
    border-top-color:${GOLD};border-radius:50%;
    animation:spin 0.8s linear infinite;display:inline-block;
  }
  @keyframes spin{to{transform:rotate(360deg)}}
  
  .skeleton{background:linear-gradient(90deg,#1a1a1a 25%,#252525 50%,#1a1a1a 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;height:16px;border-radius:2px;margin-bottom:8px}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  
  @media(max-width:768px){
    .nav{padding:16px 24px}.nav-links{display:none}
    .hero{padding:0 24px;padding-top:80px}
    .hero h1{font-size:54px}
    .section{padding:60px 24px}
    .booking-grid{grid-template-columns:1fr;gap:40px}
    .footer-grid{grid-template-columns:1fr;gap:32px}
    .footer{padding:40px 24px}
    .admin-layout{grid-template-columns:1fr}
    .admin-sidebar{display:none}
    .slots-grid{grid-template-columns:repeat(3,1fr)}
  }
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  if (!msg) return null;
  return <div className={`toast toast-${type}`}>{msg}</div>;
}

function Spinner() { return <span className="spinner" />; }

const REVIEWS = [
  { name: "Carlos Silva", text: "Melhor barbearia da área! O Matheus é um artista. Meu cabelo nunca ficou tão bem feito. Recomendo demais!", stars: 5 },
  { name: "João Pedro", text: "Agendei pelo site, super fácil. Atendimento nota 10, ambiente incrível e o resultado superou as expectativas.", stars: 5 },
  { name: "Rodrigo Alves", text: "Fiz o desenho na cabeça e ficou perfeito! Matheus tem um talento único. Já sou cliente fiel há meses.", stars: 5 },
  { name: "André Santos", text: "Pigmentação ficou perfeita, super natural. Ambiente clean e profissional. Só aqui mesmo.", stars: 5 },
  { name: "Felipe Lima", text: "Meu filho adora o corte que faz aqui. Atendimento excelente e preço justo. Lugar referência!", stars: 5 },
  { name: "Diego Costa", text: "Arte no cabelo é aqui! Fiz o desenho do Vegeta e ficou incrível. Todo mundo perguntando onde fiz.", stars: 5 },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <a className="nav-logo" href="#" onClick={() => setPage('home')}>MATHEUS</a>
      <ul className="nav-links">
        <li><a href="#servicos">Serviços</a></li>
        <li><a href="#agendamento">Agendamento</a></li>
        <li><a href="#avaliacoes">Avaliações</a></li>
        <li><a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram</a></li>
      </ul>
      <button className="btn-gold" onClick={() => document.getElementById('agendamento')?.scrollIntoView({ behavior: 'smooth' })}>
        Agendar
      </button>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg" />
      <div className="hero-pattern" />
      <div className="hero-content">
        <div className="hero-badge">✦ Barbearia Premium — Recife/PE</div>
        <h1>MATHEUS<br /><span>BARBEARIA</span></h1>
        <p className="hero-sub">Arte, estilo e precisão em cada corte. Experiência premium do agendamento ao acabamento final.</p>
        <div className="hero-actions">
          <button className="btn-gold" onClick={() => document.getElementById('agendamento')?.scrollIntoView({ behavior: 'smooth' })}>
            Agendar Horário
          </button>
          <a className="btn-outline" href={INSTAGRAM} target="_blank" rel="noreferrer">Ver Portfólio</a>
        </div>
      </div>
    </section>
  );
}

function Services({ servicos, loading }) {
  return (
    <section className="section" id="servicos">
      <span className="section-label">✦ O que oferecemos</span>
      <h2 className="section-title">Nossos <strong>Serviços</strong></h2>
      <p style={{ color: TEXTMUTED, maxWidth: 500 }}>Do corte clássico ao design artístico. Cada serviço executado com precisão e dedicação.</p>
      <div className="services-grid">
        {loading ? [1,2,3,4].map(i => (
          <div key={i} className="service-card">
            <div className="skeleton" style={{ height: 24, width: '60%', marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 14, width: '80%' }} />
          </div>
        )) : servicos.map((s, i) => (
          <div key={s._id || i} className="service-card">
            <div className="service-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="service-name">{s.nome}</div>
            <div className="service-desc">{s.descricao}</div>
            <div className="service-footer">
              <div className="service-price">R$ {s.preco}</div>
              <div className="service-time">⏱ {s.duracao} min</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Booking({ servicos, toast }) {
  const [form, setForm] = useState({ nome: '', telefone: '', servico: '', data: '', horario: '' });
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!form.data) return;
    setLoadingSlots(true);
    setForm(f => ({ ...f, horario: '' }));
    fetch(`${API}/horarios-disponiveis?data=${form.data}`)
      .then(r => r.json())
      .then(data => setSlots(Array.isArray(data) ? data : []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [form.data]);

  const handleSubmit = async () => {
    if (!form.nome || !form.telefone || !form.servico || !form.data || !form.horario) {
      toast('Preencha todos os campos', 'error'); return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/agendamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Erro ao agendar');
      }
      toast('Agendamento confirmado! Redirecionando para WhatsApp...', 'success');
      const servNome = servicos.find(s => s._id === form.servico || s.nome === form.servico)?.nome || form.servico;
      const msg = encodeURIComponent(`Olá, gostaria de confirmar meu agendamento:\n\nNome: ${form.nome}\nServiço: ${servNome}\nData: ${form.data.split('-').reverse().join('/')}\nHorário: ${form.horario}`);
      setTimeout(() => window.open(`https://wa.me/message/2IJ2DPIUTOH4P1?text=${msg}`, '_blank'), 1500);
      setForm({ nome: '', telefone: '', servico: '', data: '', horario: '' });
      setSlots([]);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section booking-section" id="agendamento">
      <span className="section-label">✦ Reserve seu horário</span>
      <h2 className="section-title">Agendamento <strong>Online</strong></h2>
      <div className="booking-grid">
        <div>
          <div className="booking-form">
            <input placeholder="Seu nome completo" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
            <input placeholder="WhatsApp (com DDD)" value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} />
            <select value={form.servico} onChange={e => setForm(f => ({ ...f, servico: e.target.value }))}>
              <option value="">Selecione o serviço</option>
              {servicos.map(s => (
                <option key={s._id || s.nome} value={s._id || s.nome}>{s.nome} — R$ {s.preco}</option>
              ))}
            </select>
            <input type="date" min={today} value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
            {form.data && (
              <div>
                <div style={{ fontSize: 12, color: TEXTMUTED, marginBottom: 8, letterSpacing: '1px', textTransform: 'uppercase' }}>Horários disponíveis</div>
                {loadingSlots ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 40, flex: 1 }} />)}
                  </div>
                ) : slots.length === 0 ? (
                  <div style={{ color: TEXTMUTED, fontSize: 13, padding: '12px 0' }}>Nenhum horário disponível nesta data.</div>
                ) : (
                  <div className="slots-grid">
                    {slots.map(s => (
                      <div key={s} className={`slot ${form.horario === s ? 'selected' : ''}`} onClick={() => setForm(f => ({ ...f, horario: s }))}>
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button className="btn-gold" onClick={handleSubmit} disabled={submitting} style={{ marginTop: 8, width: '100%', clipPath: 'none', padding: '16px', justifyContent: 'center', display: 'flex', gap: 8, alignItems: 'center' }}>
              {submitting ? <><Spinner /> Agendando...</> : 'Confirmar Agendamento →'}
            </button>
          </div>
        </div>
        <div className="booking-info">
          <h3>Sua experiência começa <strong style={{ color: GOLD }}>aqui</strong></h3>
          <p>Agende com facilidade e comodidade. Após confirmar, você será redirecionado para nosso WhatsApp para finalizar.</p>
          <div className="info-item">
            <div className="info-icon">◆</div>
            <div className="info-text"><strong>Segunda a Sábado</strong><br />09h às 20h — Sem intervalos</div>
          </div>
          <div className="info-item">
            <div className="info-icon">◆</div>
            <div className="info-text"><strong>Agendamento imediato</strong><br />Confirmação em tempo real</div>
          </div>
          <div className="info-item">
            <div className="info-icon">◆</div>
            <div className="info-text"><strong>Localização</strong><br />Recife, Pernambuco</div>
          </div>
          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="btn-outline">WhatsApp</a>
            <a href={MAPS_LINK} target="_blank" rel="noreferrer" className="btn-outline">Ver no Mapa</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="section" id="avaliacoes" style={{ background: DARKGRAY, borderTop: '1px solid #1a1a1a' }}>
      <span className="section-label">✦ O que falam de nós</span>
      <h2 className="section-title">Avaliações dos <strong>Clientes</strong></h2>
      <div className="reviews-grid">
        {REVIEWS.map((r, i) => (
          <div key={i} className="review-card">
            <div className="review-quote">"</div>
            <p className="review-text">{r.text}</p>
            <div className="review-author">
              <div className="review-avatar">{r.name.split(' ').map(n => n[0]).join('')}</div>
              <div>
                <div className="review-name">{r.name}</div>
                <div className="review-stars">{'★'.repeat(r.stars)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <span className="footer-brand">MATHEUS BARBEARIA</span>
          <p className="footer-desc">Barbearia premium em Recife/PE. Arte, estilo e precisão em cada corte. Agende seu horário e experimente o melhor.</p>
          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn-outline" style={{ fontSize: 11 }}>Instagram</a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="btn-gold" style={{ fontSize: 11, clipPath: 'none', padding: '10px 20px' }}>WhatsApp</a>
          </div>
        </div>
        <div>
          <div className="footer-title">Navegação</div>
          <ul className="footer-links">
            <li><a href="#servicos">Serviços</a></li>
            <li><a href="#agendamento">Agendamento</a></li>
            <li><a href="#avaliacoes">Avaliações</a></li>
            <li><a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-title">Horários</div>
          <ul className="footer-links">
            <li><a>Segunda a Sexta: 09h – 20h</a></li>
            <li><a>Sábado: 09h – 18h</a></li>
            <li><a>Domingo: Fechado</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">© 2024 Matheus Barbearia — Todos os direitos reservados</div>
        <div className="footer-copy">Desenvolvido com ♥ em Recife/PE</div>
      </div>
    </footer>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ usuario: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('mb_token', data.token);
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="bebas" style={{ fontSize: 32, color: GOLD }}>MATHEUS</div>
          <div style={{ fontSize: 12, color: TEXTMUTED, letterSpacing: '3px', textTransform: 'uppercase' }}>Painel Administrativo</div>
        </div>
        {error && <div style={{ background: '#1a0505', border: '1px solid #5a1a1a', color: '#f87171', padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input placeholder="Usuário" value={form.usuario} onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))} />
          <input type="password" placeholder="Senha" value={form.senha} onChange={e => setForm(f => ({ ...f, senha: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          <button className="btn-gold" onClick={handleLogin} disabled={loading} style={{ marginTop: 8, width: '100%', clipPath: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            {loading ? <><Spinner /> Entrando...</> : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ token, onLogout }) {
  const [tab, setTab] = useState('agendamentos');
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [filtroData, setFiltroData] = useState('');
  const [novoServico, setNovoServico] = useState({ nome: '', preco: '', duracao: '', descricao: '' });

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  const showToast = (msg, type = 'success') => { setToastMsg(msg); setToastType(type); };

  const fetchAgendamentos = useCallback(async () => {
    setLoading(true);
    const url = filtroData ? `${API}/agendamentos?data=${filtroData}` : `${API}/agendamentos`;
    const res = await fetch(url, { headers });
    const data = await res.json();
    setAgendamentos(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [filtroData, token]);

  const fetchServicos = useCallback(async () => {
    const res = await fetch(`${API}/servicos`);
    const data = await res.json();
    setServicos(Array.isArray(data) ? data : []);
  }, []);

  const fetchConfig = useCallback(async () => {
    const res = await fetch(`${API}/config`, { headers });
    setConfig(await res.json());
  }, [token]);

  useEffect(() => {
    if (tab === 'agendamentos') fetchAgendamentos();
    if (tab === 'servicos') fetchServicos();
    if (tab === 'config') fetchConfig();
  }, [tab, fetchAgendamentos, fetchServicos, fetchConfig]);

  const cancelarAgendamento = async (id) => {
    await fetch(`${API}/agendamento/${id}`, { method: 'DELETE', headers });
    showToast('Agendamento cancelado');
    fetchAgendamentos();
  };

  const adicionarServico = async () => {
    if (!novoServico.nome || !novoServico.preco) { showToast('Preencha nome e preço', 'error'); return; }
    await fetch(`${API}/servicos`, { method: 'POST', headers, body: JSON.stringify({ ...novoServico, preco: Number(novoServico.preco), duracao: Number(novoServico.duracao) || 30 }) });
    showToast('Serviço adicionado');
    setNovoServico({ nome: '', preco: '', duracao: '', descricao: '' });
    fetchServicos();
  };

  const removerServico = async (id) => {
    await fetch(`${API}/servicos/${id}`, { method: 'DELETE', headers });
    showToast('Serviço removido');
    fetchServicos();
  };

  const salvarConfig = async () => {
    await fetch(`${API}/config`, { method: 'PUT', headers, body: JSON.stringify(config) });
    showToast('Configurações salvas');
  };

  const ativos = agendamentos.filter(a => a.status === 'confirmado');
  const cancelados = agendamentos.filter(a => a.status === 'cancelado');

  const navItems = [
    { id: 'agendamentos', label: 'Agendamentos', icon: '📅' },
    { id: 'servicos', label: 'Serviços', icon: '✂️' },
    { id: 'config', label: 'Configurações', icon: '⚙️' },
  ];

  return (
    <div className="admin-layout">
      <Toast msg={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      <aside className="admin-sidebar">
        <div className="bebas" style={{ fontSize: 24, color: GOLD, marginBottom: 8 }}>MATHEUS</div>
        <div style={{ fontSize: 11, color: TEXTMUTED, letterSpacing: '2px', marginBottom: 32 }}>PAINEL ADMIN</div>
        {navItems.map(item => (
          <div key={item.id} className={`admin-nav-item ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>
            <span>{item.icon}</span> {item.label}
          </div>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 32 }}>
          <a href="/" className="admin-nav-item" style={{ display: 'flex' }}>🌐 Ver Site</a>
          <div className="admin-nav-item" onClick={onLogout} style={{ color: '#f87171' }}>🚪 Sair</div>
        </div>
      </aside>

      <main className="admin-content">
        {tab === 'agendamentos' && (
          <div>
            <h2 style={{ marginBottom: 24 }}>Agendamentos</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
              <div className="stat-card"><div className="stat-num">{agendamentos.length}</div><div className="stat-label">Total</div></div>
              <div className="stat-card"><div className="stat-num" style={{ color: '#4ade80' }}>{ativos.length}</div><div className="stat-label">Confirmados</div></div>
              <div className="stat-card"><div className="stat-num" style={{ color: '#f87171' }}>{cancelados.length}</div><div className="stat-label">Cancelados</div></div>
            </div>
            <div className="admin-card">
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
                <input type="date" style={{ maxWidth: 200 }} value={filtroData} onChange={e => setFiltroData(e.target.value)} />
                <button className="btn-outline" onClick={fetchAgendamentos}>{loading ? <Spinner /> : 'Filtrar'}</button>
                {filtroData && <button className="btn-outline" onClick={() => setFiltroData('')}>Limpar</button>}
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Cliente</th><th>Serviço</th><th>Data</th><th>Horário</th><th>Telefone</th><th>Status</th><th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentos.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: TEXTMUTED, padding: '32px' }}>Nenhum agendamento encontrado</td></tr>
                  ) : agendamentos.map(a => (
                    <tr key={a._id}>
                      <td style={{ fontWeight: 500 }}>{a.nome}</td>
                      <td>{a.servico}</td>
                      <td>{a.data?.split('-').reverse().join('/')}</td>
                      <td style={{ color: GOLD }}>{a.horario}</td>
                      <td><a href={`https://wa.me/55${a.telefone?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{ color: '#4ade80', textDecoration: 'none' }}>{a.telefone}</a></td>
                      <td>
                        <span className={`badge ${a.status === 'confirmado' ? 'badge-green' : a.status === 'cancelado' ? 'badge-red' : 'badge-gray'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        {a.status === 'confirmado' && (
                          <button onClick={() => cancelarAgendamento(a._id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12 }}>Cancelar</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'servicos' && (
          <div>
            <h2 style={{ marginBottom: 24 }}>Gerenciar Serviços</h2>
            <div className="admin-card" style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXTMUTED, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>Adicionar Serviço</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: 12, marginBottom: 12 }}>
                <input placeholder="Nome" value={novoServico.nome} onChange={e => setNovoServico(f => ({ ...f, nome: e.target.value }))} />
                <input placeholder="Preço (R$)" type="number" value={novoServico.preco} onChange={e => setNovoServico(f => ({ ...f, preco: e.target.value }))} />
                <input placeholder="Duração (min)" type="number" value={novoServico.duracao} onChange={e => setNovoServico(f => ({ ...f, duracao: e.target.value }))} />
                <input placeholder="Descrição" value={novoServico.descricao} onChange={e => setNovoServico(f => ({ ...f, descricao: e.target.value }))} />
              </div>
              <button className="btn-gold" onClick={adicionarServico} style={{ clipPath: 'none' }}>+ Adicionar</button>
            </div>
            <div className="admin-card">
              <table className="admin-table">
                <thead><tr><th>Nome</th><th>Preço</th><th>Duração</th><th>Descrição</th><th>Ação</th></tr></thead>
                <tbody>
                  {servicos.map(s => (
                    <tr key={s._id}>
                      <td style={{ fontWeight: 500 }}>{s.nome}</td>
                      <td style={{ color: GOLD }}>R$ {s.preco}</td>
                      <td>{s.duracao} min</td>
                      <td style={{ color: TEXTMUTED }}>{s.descricao}</td>
                      <td><button onClick={() => removerServico(s._id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12 }}>Remover</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'config' && config && (
          <div>
            <h2 style={{ marginBottom: 24 }}>Configurações</h2>
            <div className="admin-card">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: 11, color: TEXTMUTED, letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Abertura</label>
                  <input type="time" value={config.horarioAbertura} onChange={e => setConfig(c => ({ ...c, horarioAbertura: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: TEXTMUTED, letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Fechamento</label>
                  <input type="time" value={config.horarioFechamento} onChange={e => setConfig(c => ({ ...c, horarioFechamento: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: TEXTMUTED, letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Intervalo (min)</label>
                  <input type="number" value={config.intervalo} onChange={e => setConfig(c => ({ ...c, intervalo: Number(e.target.value) }))} />
                </div>
              </div>
              <button className="btn-gold" onClick={salvarConfig} style={{ clipPath: 'none' }}>Salvar Configurações</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState(() => window.location.pathname === '/admin' ? 'admin' : 'home');
  const [token, setToken] = useState(() => localStorage.getItem('mb_token'));
  const [servicos, setServicos] = useState([]);
  const [loadingServicos, setLoadingServicos] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = useCallback((msg, type = 'success') => { setToastMsg(msg); setToastType(type); }, []);

  useEffect(() => {
    fetch(`${API}/servicos`)
      .then(r => r.json())
      .then(d => setServicos(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoadingServicos(false));
  }, []);

  if (page === 'admin') {
    if (!token) return <AdminLogin onLogin={t => setToken(t)} />;
    return <AdminPanel token={token} onLogout={() => { localStorage.removeItem('mb_token'); setToken(null); }} />;
  }

  return (
    <>
      <style>{css}</style>
      <Toast msg={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      <Nav page={page} setPage={setPage} />
      <Hero />
      <Services servicos={servicos} loading={loadingServicos} />
      <Booking servicos={servicos} toast={showToast} />
      <Reviews />
      <Footer />
      <a className="wa-float" href={WHATSAPP_LINK} target="_blank" rel="noreferrer" title="WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </>
  );
}
