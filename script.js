// ==============================
// PRIMAL - ORDEN DE RONDA TRACKER
// script.js
// ==============================

const fases = [
  {
    titulo: "1) Comienzo de la ronda",
    detalles: [
      "Remover Confusión",
      "Chequeo de Postura del Monstruo",
      "Chequeo de Postura del Monstruo y Peligros por efectos",
      "Efectos de inicio de ronda"
    ]
  },
  {
    titulo: "2) Consumir",
    detalles: [
      "Cada jugador puede usar una habilidad de consumo"
    ]
  },
  {
    titulo: "3) Mantenimiento del monstruo",
    detalles: [
      "Se refresca el comportamiento del monstruo (Descarta el número más bajo de comportamiento)",
      "+1 Esfuerzo por jugador",
      "+1 Esfuerzo por aceleración"
    ]
  },
  {
    titulo: "4) Turno del jugador",
    detalles: [
      "Recordatorio: el jugador con la ficha de Amenaza va primero y gana la ficha de Primer Jugador al comenzar la nueva ronda.",
      "Remover Ceguera",
      "Chequeo del comportamiento del monstruo por sus efectos",
      "Chequeo de los objetivos del monstruo por efectos",
      "Chequeo de las cartas del jugador por efectos (equipamiento, cartas de acción, maestría)",
      "Después de otros detonantes: comienzan los efectos de inicio del turno del jugador",
      "Chequeo del terreno o plantas del sector por efectos",
      "Salir de la Meseta (Terreno)"
    ]
  },
  {
    titulo: "5) Fase de movimiento",
    detalles: [
      "Gasta 1 de Resistencia para moverte 1 sector (si lo haces, remueve Atado)",
      "Gasta 2 de Resistencia para moverte 1 sector si es Arena (Terreno)",
      "Si no te mueves, ganas la ficha Atado",
      "Chequeo del comportamiento del monstruo por efectos",
      "Escóndete en un arbusto (rellenar después según el tipo de arbusto)"
    ]
  },
  {
    titulo: "6) Fase de acción",
    detalles: [
      "Máximo 5 cartas de acción (salvo que alguna carta/habilidad diga lo contrario)",
      "Máximo 3 cartas de acción en Agua",
      "No puedes jugar cartas si estás sobre Fuego (Terreno)",
      "Chequeo del comportamiento del monstruo por efectos",
      "+1 Resistencia si 2 o más cartas se mantienen en tu mano al final de la fase de acción"
    ]
  },
  {
    titulo: "7) Fase de Desgaste",
    detalles: [
      "Roba 1 carta de Desgaste (2 si estás AMENAZADO)",
      "Puedes remover una ROCA (Terreno) para prevenir el daño de Desgaste",
      "Chequeo de efectos del comportamiento del monstruo",
      "Después de otros detonantes: Termina la fase de efectos de Desgaste"
    ]
  },
  {
    titulo: "8) Fin del turno del jugador",
    detalles: [
      "Descarta la secuencia jugada (de la carta más vieja a la más nueva, dejando arriba la más nueva)",
      "Rellena tu mano: roba/descarta hasta tener tu tamaño (por defecto 5)",
      "El monstruo gira hacia el jugador con la AMENAZA",
      "Chequeo de efectos del comportamiento del monstruo",
      "Después de otros detonantes: Termina el turno de efectos del jugador",
      "Chequeo de efectos de PLANTA/TERRENO en el sector",
      "Subirse a una MESETA"
    ]
  },
  {
    titulo: "9) Fin de la ronda",
    detalles: [
      "Chequeo de Postura, Peligro y efectos de comportamiento del monstruo",
      "Avanza el Marcador de Turno",
      "Después de otras detonaciones: Terminan los efectos de fin de ronda"
    ]
  }
];

// Estado
let pasoActual = 0;
let rondaActual = 1;

// LocalStorage keys
const STORAGE_STEP = "primal_paso_actual";
const STORAGE_ROUND = "primal_ronda_actual";

// Elementos HTML
let faseTituloEl;
let faseDetallesEl;
let progresoEl;
let sidebarListEl;

let btnAnterior;
let btnSiguiente;
let btnReset;

let roundNumberEl;
let btnRoundMinus;
let btnRoundPlus;


// ------------------ FUNCIONES ------------------

function cargarDatosGuardados() {
  const stepGuardado = localStorage.getItem(STORAGE_STEP);
  const rondaGuardada = localStorage.getItem(STORAGE_ROUND);

  if (stepGuardado !== null) {
    const val = parseInt(stepGuardado);
    if (!isNaN(val) && val >= 0 && val < fases.length) {
      pasoActual = val;
    }
  }

  if (rondaGuardada !== null) {
    const val = parseInt(rondaGuardada);
    if (!isNaN(val) && val >= 1 && val <= 10) {
      rondaActual = val;
    }
  }
}

function guardarDatos() {
  localStorage.setItem(STORAGE_STEP, pasoActual.toString());
  localStorage.setItem(STORAGE_ROUND, rondaActual.toString());
}

function renderSidebar() {
  sidebarListEl.innerHTML = "";

  fases.forEach((fase, index) => {
    const div = document.createElement("div");
    div.classList.add("sidebar-phase");
    div.textContent = fase.titulo;

    if (index === pasoActual) {
      div.classList.add("active");
    }

    sidebarListEl.appendChild(div);
  });
}

function renderFaseActual() {
  faseTituloEl.textContent = fases[pasoActual].titulo;

  faseDetallesEl.innerHTML = "";
  fases[pasoActual].detalles.forEach((detalle) => {
    const li = document.createElement("li");
    li.textContent = "- " + detalle;
    faseDetallesEl.appendChild(li);
  });

  progresoEl.textContent = `${pasoActual + 1} / ${fases.length}`;

  roundNumberEl.textContent = rondaActual;

  btnAnterior.disabled = pasoActual === 0;
  btnSiguiente.disabled = pasoActual === fases.length - 1;
}

function actualizarVista() {
  renderSidebar();
  renderFaseActual();
  guardarDatos();
}

function siguientePaso() {
  if (pasoActual < fases.length - 1) {
    pasoActual++;
    actualizarVista();
  }
}

function pasoAnterior() {
  if (pasoActual > 0) {
    pasoActual--;
    actualizarVista();
  }
}

function resetear() {
  pasoActual = 0;
  rondaActual = 1;
  actualizarVista();
}

function subirRonda() {
  if (rondaActual < 10) {
    rondaActual++;
    actualizarVista();
  }
}

function bajarRonda() {
  if (rondaActual > 1) {
    rondaActual--;
    actualizarVista();
  }
}


// ------------------ INIT ------------------

document.addEventListener("DOMContentLoaded", () => {
  faseTituloEl = document.getElementById("faseTitulo");
  faseDetallesEl = document.getElementById("faseDetalles");
  progresoEl = document.getElementById("progreso");
  sidebarListEl = document.getElementById("sidebarList");

  btnAnterior = document.getElementById("btnAnterior");
  btnSiguiente = document.getElementById("btnSiguiente");
  btnReset = document.getElementById("btnReset");

  roundNumberEl = document.getElementById("roundNumber");
  btnRoundMinus = document.getElementById("btnRoundMinus");
  btnRoundPlus = document.getElementById("btnRoundPlus");

  if (!faseTituloEl || !faseDetallesEl || !sidebarListEl) {
    console.error("Faltan elementos HTML. Revisa el index.html");
    return;
  }

  cargarDatosGuardados();

  btnAnterior.addEventListener("click", pasoAnterior);
  btnSiguiente.addEventListener("click", siguientePaso);
  btnReset.addEventListener("click", resetear);

  btnRoundMinus.addEventListener("click", bajarRonda);
  btnRoundPlus.addEventListener("click", subirRonda);

  actualizarVista();
});
