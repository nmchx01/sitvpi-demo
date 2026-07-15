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
      <div class="field-icon ${icon}" aria-hidden="true"></div>
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
      <aside class="simulation-banner"><span aria-hidden="true">SIM</span><p>Recopilación simulada: no se está consultando ninguna entidad ni registro real.</p></aside>
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
      <div class="report-cell" data-label="Lo que declaró"><p>${displayValue(profile.declarado[declaredKey])}</p></div>
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
