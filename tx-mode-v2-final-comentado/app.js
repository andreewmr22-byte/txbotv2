/* =========================================================
   TX MODE V2 — APP.JS
   Aqui ficam telas, textos, produtos, clientes, módulos e permissões.

   PONTOS PRINCIPAIS PARA ALTERAR:
   1. BRAND_CONFIG: nome da marca, slogan e WhatsApp
   2. data.produtos: produtos exibidos no app
   3. data.avisos: avisos para cliente/equipe
   4. data.clientes: CRM
   5. permissions: quem vê cada módulo
   6. Funções home(), produtos(), crm(), dashboard() para mudar layout
   ========================================================= */

const TG = window.Telegram?.WebApp;
if (TG) {
  TG.ready();
  TG.expand();
  TG.setHeaderColor("#020604");
  TG.setBackgroundColor("#020604");
}

/* ALTERAR: dados principais da marca e contato */
const BRAND_CONFIG = {
  appName: "Equipe TX",
  subtitle: "MiniApp Mobile-First",
  whatsappNumber: "5599999999999", // ALTERAR: coloque o número com país + DDD
  defaultProfile: "gestor"
};

const app = document.getElementById("app");
const profileLabel = document.getElementById("profileLabel");
document.getElementById("brandName").textContent = BRAND_CONFIG.appName;

/* ALTERAR: perfis disponíveis no botão escudo */
const profiles = ["cliente", "equipe", "gestor"];

const state = {
  page: "home",
  profile: localStorage.getItem("txProfile") || BRAND_CONFIG.defaultProfile
};

/* ALTERAR: regras de permissão por perfil */
const permissions = {
  cliente: ["home", "produtos", "avisos", "equipe"],
  equipe: ["home", "produtos", "avisos", "equipe", "crm", "estoque"],
  gestor: ["home", "produtos", "avisos", "equipe", "mais", "dashboard", "crm", "financeiro", "estoque", "integracoes", "configuracoes"]
};

/* ALTERAR: conteúdo do app */
const data = {
  produtos: [
    // formato: [ícone, nome, descrição, status]
    ["👕", "Camisa TX Premium", "R$129,90 • estoque 48", "OK"],
    ["👖", "Calça Cargo TX", "R$189,90 • estoque 32", "OK"],
    ["🧢", "Boné TX Aba Curva", "R$89,90 • estoque 67", "OK"],
    ["📦", "Kit TX Oficial", "R$349,90 • estoque 12", "Baixo"]
  ],
  avisos: [
    ["♢", "Novo catálogo disponível", "Atualização semanal publicada.", "Ativo"],
    ["⚡", "Promoção relâmpago", "Válida até 23:59 de hoje.", "Ativo"],
    ["👥", "Aviso para equipe", "Reunião de alinhamento às 19h.", "Interno"]
  ],
  equipe: [
    ["✅", "Responder clientes", "Prioridade do período atual.", "09:00"],
    ["📦", "Atualizar estoque", "Revisar itens baixos e pausados.", "17:00"],
    ["📊", "Conferir relatório", "Analisar entradas e pedidos.", "Hoje"]
  ],
  clientes: [
    ["👤", "João Silva", "23 pedidos registrados", "VIP"],
    ["👤", "Maria Santos", "12 pedidos registrados", "Ativo"],
    ["👤", "Lucas Mendes", "8 pedidos registrados", "Novo"]
  ]
};

function setProfileLabel() {
  const label = state.profile[0].toUpperCase() + state.profile.slice(1);
  profileLabel.textContent = `Perfil: ${label}`;
  localStorage.setItem("txProfile", state.profile);
}

document.getElementById("profileBtn").onclick = () => {
  const index = profiles.indexOf(state.profile);
  state.profile = profiles[(index + 1) % profiles.length];
  setProfileLabel();
  toast(`Perfil alterado para ${state.profile}`);
  render();
};

document.querySelectorAll(".nav").forEach(btn => {
  btn.onclick = () => setPage(btn.dataset.page);
});

function canAccess(page) {
  return permissions[state.profile].includes(page);
}

function setPage(page) {
  if (!canAccess(page) && page !== "mais") {
    toast("Acesso restrito para este perfil");
    return;
  }
  state.page = page;
  document.querySelectorAll(".nav").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });
  render();
}

function render() {
  setProfileLabel();
  const pages = { home, produtos, avisos, equipe, mais };
  app.innerHTML = pages[state.page]();
}

function home() {
  return `
  <div class="page">
    <label class="search"><span>⌕</span><input placeholder="Buscar por nome, código ou categoria." /></label>

    <section class="hero">
      <span class="badge">✦ Mobile-first</span>
      <h2>Menos tela cheia. Mais ação rápida.</h2>
      <p>O dashboard entra como camada de gestão, enquanto cliente e equipe veem só o necessário.</p>
    </section>

    <div class="quick-grid">
      <button class="quick" onclick="setPage('produtos')"><i>⌕</i><b>Buscar</b><small>Produtos</small></button>
      <button class="quick" onclick="abrirAtendimento()"><i>☏</i><b>Atendimento</b><small>Fluxo guiado</small></button>
      <button class="quick" onclick="setPage('avisos')"><i>♢</i><b>Avisos</b><small>Comunicados</small></button>
    </div>

    ${state.profile === "gestor" ? `
    <div class="section"><h3>Visão rápida</h3><span>ao vivo</span></div>
    <div class="kpis">
      ${kpi("Pedidos ativos", "12", "▲ 12,4%")}
      ${kpi("Faturamento", "R$48.750", "▲ 18,6%")}
      ${kpi("Lucro líquido", "R$12.540", "▲ 21,4%")}
      ${kpi("Avisos ativos", "3", "Equipe")}
    </div>` : ""}

    <div class="section"><h3>Ações do dia</h3><span>essencial</span></div>
    <div class="stack">
      ${item("⚡", "Responder clientes", "Prioridade alta para manter a operação girando.", "Agora", "gold")}
      ${item("📦", "Atualizar catálogo", "Revisar produtos e disponibilidade.", "Hoje")}
    </div>
  </div>`;
}

function produtos() {
  return `<div class="page"><label class="search"><span>⌕</span><input placeholder="Buscar produto..." /></label><div class="section"><h3>Produtos</h3><span>${data.produtos.length} itens</span></div><div class="stack">${data.produtos.map(p => item(...p, p[3] === "Baixo" ? "red" : "")).join("")}</div></div>`;
}

function avisos() {
  const list = state.profile === "cliente" ? data.avisos.filter(a => a[3] !== "Interno") : data.avisos;
  return `<div class="page"><div class="section"><h3>Avisos</h3><span>${list.length} ativos</span></div><div class="stack">${list.map(a => item(...a, a[3] === "Interno" ? "gold" : "")).join("")}</div></div>`;
}

function equipe() {
  if (state.profile === "cliente") {
    return `<div class="page"><section class="hero"><span class="badge">Atendimento TX</span><h2>Fale com a equipe sem se perder.</h2><p>O cliente entra por botão, sem precisar digitar mensagem longa.</p></section><br><button class="quick" style="width:100%;min-height:88px" onclick="abrirAtendimento()"><i>☏</i><b>Chamar atendimento</b><small>Abre o fluxo guiado</small></button></div>`;
  }
  return `<div class="page"><div class="section"><h3>Equipe</h3><span>operação</span></div><div class="stack">${data.equipe.map(e => item(...e, e[3] === "Hoje" ? "gold" : "")).join("")}</div></div>`;
}

function mais() {
  const modules = [
    ["dashboard", "▣", "Dashboard", "Métricas e gestão"],
    ["crm", "♙", "CRM", "Clientes e histórico"],
    ["financeiro", "$", "Financeiro", "Entradas e metas"],
    ["estoque", "□", "Estoque", "Disponibilidade"],
    ["integracoes", "◎", "Integrações", "WhatsApp, API e automações"],
    ["configuracoes", "⚙", "Configurações", "Permissões e ajustes"]
  ].filter(m => canAccess(m[0]));

  return `<div class="page"><div class="section"><h3>Mais</h3><span>módulos</span></div><div class="menu">${modules.map(m => `<button onclick="openModule('${m[0]}')"><i>${m[1]}</i><div><b>${m[2]}</b><small>${m[3]}</small></div></button>`).join("")}</div></div>`;
}

function openModule(module) {
  if (!canAccess(module)) { toast("Acesso restrito para este perfil"); return; }
  document.querySelectorAll(".nav").forEach(btn => btn.classList.remove("active"));
  const routes = { dashboard, crm, financeiro, estoque, integracoes, configuracoes };
  app.innerHTML = routes[module] ? routes[module]() : `<p>Em construção.</p>`;
}

function dashboard() { return `<div class="page"><div class="section"><h3>Dashboard</h3><span>gestor</span></div><div class="kpis">${kpi("Faturamento", "R$48.750", "▲ 18,6%")}${kpi("Lucro", "R$12.540", "▲ 21,4%")}${kpi("Pedidos", "156", "▲ 12,4%")}${kpi("Ticket médio", "R$312", "▲ 7,5%")}</div><br><section class="card"><small>Meta do mês</small><strong>R$48.750 / R$80.000</strong><div class="progress"><span style="width:60%"></span></div></section></div>`; }
function crm() { return `<div class="page"><div class="section"><h3>CRM</h3><span>clientes</span></div><div class="stack">${data.clientes.map(c => item(...c, c[3] === "VIP" ? "gold" : "")).join("")}</div></div>`; }
function financeiro() { return `<div class="page"><div class="section"><h3>Financeiro</h3><span>resumo</span></div><div class="kpis">${kpi("Entradas", "R$4.659", "Hoje")}${kpi("Saídas", "R$650", "Hoje")}${kpi("Lucro", "R$4.009", "Dia")}${kpi("Margem", "86%", "Atual")}</div></div>`; }
function estoque() { return `<div class="page"><div class="section"><h3>Estoque</h3><span>alertas</span></div><div class="stack">${data.produtos.map(p => item(p[0], p[1], p[2], p[3], p[3] === "Baixo" ? "red" : "")).join("")}</div></div>`; }
function integracoes() { return `<div class="page"><div class="section"><h3>Integrações</h3><span>status</span></div><div class="stack">${item("🟢", "WhatsApp Bot", "Fluxo de atendimento.", "Conectado")}${item("⚙️", "Automação", "Rotinas e webhooks.", "Ativo")}${item("TX", "API TX Mode", "Base para CRM e dashboard.", "Ativo", "gold")}</div></div>`; }
function configuracoes() { return `<div class="page"><div class="section"><h3>Configurações</h3><span>gestor</span></div><div class="stack">${item("🔐", "Permissões", "Cliente, equipe e gestor.", "Editar", "gold")}${item("🎨", "Identidade", "Cores, logo e textos.", "Editar")}${item("🔔", "Notificações", "Avisos para cliente/equipe.", "Ativo")}</div></div>`; }

function kpi(label, value, up) { return `<section class="card"><small>${label}</small><strong>${value}</strong><span class="up">${up}</span></section>`; }
function item(icon, title, desc, status, pill = "") { return `<article class="item"><div class="thumb">${icon}</div><div><h4>${title}</h4><p>${desc}</p></div><span class="pill ${pill}">${status}</span></article>`; }
function abrirAtendimento() { const msg = "Salve, vim pelo MiniApp TX e quero iniciar atendimento."; window.open(`https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank"); }
function toast(text) { const t = document.getElementById("toast"); t.textContent = text; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 1600); }

render();
