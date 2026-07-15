import { PROFILES, SOURCES } from "./data.js";

const app = document.querySelector("#app");
const announcer = document.querySelector("#announcer");
const state = { profile: null, timers: [] };

const declarationFields = [
  ["Ingresos mensuales", "ingresosMensuales", "income"],
  ["Bienes inmuebles", "bienesInmuebles", "property"],
  ["Vehículos", "vehiculos", "vehicle"],
  ["Deudas totales", "deudasTotales", "debt"],
  ["Negocios jurídicos recientes", "negociosRecientes", "business"],
  ["Información relevante", "informacionRelevante", "info"]
];

const fieldIcons = {
  income: `<svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="8.5"/><path d="M15 8.5c-.7-.7-1.7-1-3-1-1.7 0-3 .8-3 2s1 1.8 3 2.2 3 1 3 2.3-1.3 2.5-3 2.5c-1.4 0-2.6-.4-3.4-1.2M12 5.5v13"/></svg>`,
  property: `<svg viewBox="0 0 24 24" focusable="false"><path d="M3 10.5 12 3l9 7.5M5.5 9v11h13V9M9.5 20v-6h5v6"/></svg>`,
  vehicle: `<svg viewBox="0 0 24 24" focusable="false"><path d="m5 10 1.6-4h10.8l1.6 4M3.5 11.5h17v6h-17zM6.5 17.5v2M17.5 17.5v2M7 14.5h.01M17 14.5h.01"/></svg>`,
  debt: `<svg viewBox="0 0 24 24" focusable="false"><path d="M4 6.5h14a2 2 0 0 1 2 2v9H4a2 2 0 0 1-2-2v-11M4 6.5a2 2 0 1 1 0-4h12v4M15 11h7v4h-7a2 2 0 1 1 0-4Z"/></svg>`,
  business: `<svg viewBox="0 0 24 24" focusable="false"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3M3 12h18M10 12v2h4v-2"/></svg>`,
  info: `<svg viewBox="0 0 24 24" focusable="false"><path d="M6 2.5h8l4 4v15H6zM14 2.5v4h4M9 12l2 2 4-4M9 18h6"/></svg>`
};

const sourceMeta = {
  VUR: ["Bienes inmuebles", "bienesInmuebles", "VUR"],
  RNAT: ["Vehículos", "vehiculos", "RNAT"],
  DIAN: ["Ingresos mensuales", "ingresosMensuales", "DIAN"],
  OPEN_FINANCE: ["Deudas totales", "deudasTotales", "Open Finance"],
  RUES: ["Negocios jurídicos recientes", "negociosRecientes", "RUES"],
  ESTADO_CIVIL: ["Información relevante", "informacionRelevante", "Estado civil"],
  MOVIMIENTOS: ["Información relevante", "informacionRelevante", "Movimientos financieros"]
};

function normalizeId(value) {
  return value.replace(/[.\s-]/g, "");
}

function displayValue(value) {
  return Array.isArray(value) ? value.join(" · ") : value;
}

function setView(markup, title) {
  app.innerHTML = markup;
  document.title = `${title} · SITVPI`;
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelTimers() {
  state.timers.forEach(window.clearTimeout);
  state.timers = [];
}

function reset() {
  cancelTimers();
  state.profile = null;
  renderSearch();
}

function backButton(label = "Nueva consulta") {
  return `<button class="text-button" type="button" data-reset aria-label="${label}">
    <span aria-hidden="true">←</span> ${label}
  </button>`;
}

function renderSearch() {
  setView(`
    <section class="search-view" aria-labelledby="search-title">
      <div class="brand-lockup" aria-hidden="true"><span>SV</span></div>
      <p class="eyebrow">Consulta patrimonial simulada</p>
      <h1 id="search-title">SITVPI</h1>
      <p class="hero-subtitle">Sistema Interoperable de Transparencia y Verificación Patrimonial</p>
      <form id="search-form" class="search-form" novalidate>
        <label for="cedula">Número de cédula del solicitante</label>
        <div class="input-wrap">
          <span aria-hidden="true">CC</span>
          <input id="cedula" name="cedula" type="text" inputmode="numeric" autocomplete="off" placeholder="Número de cédula del solicitante" aria-describedby="search-message" />
        </div>
        <p id="search-message" class="form-message" role="status"></p>
        <button class="primary-button" type="submit">Consultar SITVPI <span aria-hidden="true">→</span></button>
      </form>
    </section>
  `, "Consulta");

  const form = document.querySelector("#search-form");
  const input = document.querySelector("#cedula");
  const message = document.querySelector("#search-message");
  input.focus();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = normalizeId(input.value);
    if (!id || !/^\d+$/.test(id)) {
      message.textContent = "Ingresa un número de cédula válido.";
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }
    const profile = PROFILES[id];
    if (!profile) {
      message.textContent = "No se encontraron datos para esta cédula.";
      input.setAttribute("aria-invalid", "true");
      return;
    }
    input.removeAttribute("aria-invalid");
    state.profile = profile;
    renderDeclaration();
  });
}

function renderDeclaration() {
  const { profile } = state;
  const cards = declarationFields.map(([label, key, icon]) => `
    <article class="declaration-card">
      <div class="field-icon ${icon}" aria-hidden="true">${fieldIcons[icon]}</div>
      <div><h3>${label}</h3><p>${displayValue(profile.declarado[key])}</p></div>
    </article>`).join("");

  setView(`
    <section class="content-view" aria-labelledby="declaration-title">
      <header class="view-header">
        ${backButton("Volver a la búsqueda")}
        <div class="step" aria-label="Paso 2 de 4"><span></span><span class="active"></span><span></span><span></span></div>
      </header>
      <div class="title-block">
        <p class="eyebrow">Declaración juramentada</p>
        <h1 id="declaration-title">C.C. ${profile.cedulaFormateada}</h1>
        <p class="person-name">${profile.nombre}</p>
        <p class="context-copy">Información suministrada por el solicitante bajo la gravedad de juramento.</p>
      </div>
      <div class="declaration-grid">${cards}</div>
      <aside class="notice"><span aria-hidden="true">i</span><p>Estos datos fueron precargados para la demostración. En un escenario real, serían diligenciados por el operador.</p></aside>
      <button id="verify-button" class="primary-button" type="button">Verificar con SITVPI <span aria-hidden="true">→</span></button>
    </section>
  `, "Declaración");
  bindReset();
  document.querySelector("#verify-button").addEventListener("click", renderVerification);
}

function renderVerification() {
  cancelTimers();
  const cards = SOURCES.map((source, index) => `
    <article class="source-card" data-source="${source.id}" data-status="waiting">
      <div class="source-logo"><img src="${source.logo}" alt="" /></div>
      <div class="source-copy"><h3>${source.name}</h3><p>${source.subtitle}</p></div>
      <div class="source-status"><span class="status-icon" aria-hidden="true">${index + 1}</span><span class="status-label">En espera</span></div>
    </article>`).join("");

  setView(`
    <section class="content-view verification-view" aria-labelledby="verification-title">
      <header class="view-header">
        ${backButton("Cancelar consulta")}
        <div class="step" aria-label="Paso 3 de 4"><span></span><span></span><span class="active"></span><span></span></div>
      </header>
      <div class="title-block">
        <p class="eyebrow">Interoperabilidad simulada</p>
        <h1 id="verification-title">Consultando fuentes de datos<span class="ellipsis" aria-hidden="true">…</span></h1>
        <p class="context-copy">Validando la declaración de <strong>${state.profile.nombre}</strong> en cinco sistemas.</p>
      </div>
      <div class="source-list">${cards}</div>
      <div class="progress-summary"><span id="progress-copy">0 de 5 fuentes consultadas</span><div class="progress-track"><span id="progress-bar"></span></div></div>
    </section>
  `, "Verificación");
  bindReset();
  runVerification();
}

function runVerification() {
  const cards = [...document.querySelectorAll(".source-card")];
  let completed = 0;
  cards.forEach((card, index) => {
    const start = window.setTimeout(() => {
      card.dataset.status = "loading";
      card.querySelector(".status-label").textContent = "Consultando…";
      card.querySelector(".status-icon").textContent = "";
      announcer.textContent = `Consultando ${SOURCES[index].name}`;
    }, index * 1500 + 300);
    const finish = window.setTimeout(() => {
      card.dataset.status = "ready";
      card.querySelector(".status-label").textContent = "Listo";
      card.querySelector(".status-icon").textContent = "✓";
      completed += 1;
      document.querySelector("#progress-copy").textContent = `${completed} de 5 fuentes consultadas`;
      document.querySelector("#progress-bar").style.width = `${completed * 20}%`;
      if (completed === cards.length) {
        announcer.textContent = "Consulta completada. Preparando reporte.";
        state.timers.push(window.setTimeout(renderReport, 850));
      }
    }, index * 1500 + 1400);
    state.timers.push(start, finish);
  });
}

function resultLabel(result) {
  if (result === "inconsistencia_grave") return "Inconsistencia grave";
  if (result === "inconsistencia") return "Inconsistencia";
  return "Coincide";
}

function renderReport() {
  cancelTimers();
  const { profile } = state;
  const rows = Object.entries(profile.encontrado).map(([source, finding], index) => {
    const [category, declaredKey, sourceName] = sourceMeta[source];
    return `<article class="report-row" style="--row:${index}" aria-label="${category}">
      <div class="mobile-category"><span>${category}</span><small>${sourceName}</small></div>
      <div class="report-cell declared-cell" data-label="Lo que declaró"><div><span class="desktop-category">${category}</span><p>${displayValue(profile.declarado[declaredKey])}</p></div></div>
      <div class="report-cell finding" data-label="Lo que encontró el SITVPI"><p>${finding.detalle}</p></div>
      <div class="report-cell result-cell" data-label="Resultado"><span class="result-badge ${finding.result}">${resultLabel(finding.result)}</span></div>
    </article>`;
  }).join("");
  const count = profile.inconsistencias.length;
  const verdict = profile.veredicto;
  const verdictTitle = verdict === "aprobado" ? "APROBADO" : verdict === "amarilla" ? `ALERTA AMARILLA — ${count} inconsistencias menores` : `ALERTA ROJA — ${count} inconsistencias graves`;

  setView(`
    <section class="content-view report-view" aria-labelledby="report-title">
      <header class="view-header">
        ${backButton()}
        <div class="step" aria-label="Paso 4 de 4"><span></span><span></span><span></span><span class="active"></span></div>
      </header>
      <div class="report-heading">
        <div class="title-block">
          <p class="eyebrow">Análisis completado</p>
          <h1 id="report-title">Reporte de consistencia</h1>
          <p class="person-name">${profile.nombre} · C.C. ${profile.cedulaFormateada}</p>
        </div>
        <span class="case-chip ${verdict}">CASO ${profile.caso}</span>
      </div>
      <section class="verdict ${verdict} verdict-top" aria-labelledby="verdict-title">
        <div class="verdict-symbol" aria-hidden="true">${verdict === "aprobado" ? "✓" : "!"}</div>
        <div><p class="verdict-kicker">Resultado de la verificación</p><h2 id="verdict-title">${verdictTitle}</h2><p>${profile.mensajeFinal}</p></div>
      </section>
      <div class="report-table" role="table" aria-label="Comparación de la declaración y los hallazgos">
        <div class="report-header" role="row"><span role="columnheader">Lo que declaró</span><span role="columnheader">Lo que encontró el SITVPI</span><span role="columnheader">Resultado</span></div>
        <div class="report-body">${rows}</div>
      </div>
      <button class="secondary-button" type="button" data-reset><span aria-hidden="true">↻</span> Nueva consulta</button>
    </section>
  `, "Reporte");
  bindReset();
}

function bindReset() {
  document.querySelectorAll("[data-reset]").forEach((button) => button.addEventListener("click", reset));
}

renderSearch();
