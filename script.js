// ========================================
// PRIMAL - TRACKER ORDEN DE RONDA
// ========================================

const TOTAL_RONDAS = 10;

const fases = [
  {
    titulo: "1) Comienzo de la ronda",
    detalles: [
      "Remover Confusión",
      "Chequeo de Postura del Monstruo",
      "Chequeo de Postura del Monstruo y Peligros por efectos",
      "Después de otros detonantes: Efectos de inicio de ronda"
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
      "Se refresca el comportamiento del monstruo (descarta el número más bajo de comportamiento)",
      "+1 Esfuerzo por jugador",
      "+1 Esfuerzo por aceleración"
    ]
  },
  {
    titulo: "4) Turno del jugador",
    detalles: [
      "Recordatorio: El jugador con la ficha de AMENAZA va primero y gana la ficha de Primer Jugador al comenzar la nueva ronda",
      "Remover Ceguera",
      "Chequeo del comportamiento del monstruo por sus efectos",
      "Chequeo de los objetivos del monstruo por efectos",
      "Chequeo de cartas del jugador por efectos (equipamiento, cartas de acción, maestría)",
      "Después de otros detonantes: Comienzan los efectos de inicio del turno del jugador",
      "Chequeo del terreno o plantas del sector por efectos",
      "Salir de la MESETA (Terreno)"
    ]
  },
  {
    titulo: "5) Fase de movimiento",
    detalles: [
      "El jugador puede gastar 1 Resistencia para moverse 1 sector (si lo hace, remueve ATADO)",
      "El jugador debe gastar 2 Resistencia para moverse 1 sector si es ARENA (Terreno)",
      "Si el jugador NO se mueve, gana la ficha ATADO",
      "Chequeo del comportamiento del monstruo por efectos",
      "Escóndete en un ARBUSTO (según tipo de arbusto)"
    ]
  },
  {
    titulo: "6) Fase de acción",
    detalles: [
      "Máximo 5 cartas de acción (salvo que un efecto indique lo contrario)",
      "Máximo 3 cartas de acción en AGUA",
      "No se pueden jugar cartas estando sobre FUEGO (Terreno)",
      "Chequeo del comportamiento del monstruo por efectos",
      "+1 Resistencia si 2 o más cartas se mantienen en mano al final de la fase de acción"
    ]
  },
  {
    titulo: "7) Fase de desgaste (Attrition)",
    detalles: [
      "Roba 1 carta de desgaste (2 si estás AMENAZADO)",
      "Puedes remover una ROCA (Terreno) para prevenir el daño de desgaste",
      "Chequeo de efectos del comportamiento del monstruo",
      "Después de otros detonantes: Termina la fase de efectos de desgaste"
    ]
  },
  {
    titulo: "8) Fin del turno del jugador",
    detalles: [
      "Descarta la secuencia jugada (desde la carta más vieja a la nueva, dejando arriba la más nueva)",
      "Rellena tu mano: roba/descarta hasta tener tu tamaño (por defecto 5)",
      "El MONSTRUO gira al jugador que tenga la AMENAZA",
      "Chequeo de efectos del comportamiento del monstruo",
      "Después de otros detonantes: Termina el turno de efectos del jugador",
      "Chequeo para los efectos de PLANTA/TERRENO en el sector",
      "Subirse a una MESETA"
    ]
  },
  {
    titulo: "9) Fin de la ronda",
    detalles: [
      "Chequeo de POSTURA, PELIGRO y efectos de comportamiento del monstruo",
      "Avanza el marcador de turno",
      "Después de otros detonantes: Terminan los efectos de fin de ronda"
    ]
  }
];


// ========================================
// ESTADO
// ========================================

const STORAGE_KEY = "primal_turn_tracker_state";

let faseActual = 0;
let rondaActual = 1;


// ========================================
// ELEMENTOS HTML
// ========================================

const phaseListEl = document.getElementById("phaseList");
const phaseTitleEl = document.getElementById("phaseTitle");
const phaseDetailsEl = document.getElementById("phaseDetails");
const phaseProgressEl = document.getElementById("phaseProgress");
const roundCounterEl = document.getElementById("roundCounter");

const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnReset = document.getElementById("btnReset");


// ========================================
// FUNCIONES
// ========================================

function guardarEstado() {
  const state = { faseActual, rondaActual };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function cargarEstado() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return;

  try {
    const state = JSON.parse(data);

    if (typeof state.faseActual === "number") faseActual = state.faseActual;
    if (typeof state.rondaActual === "number") rondaActual = state.rondaActual;

    if (faseActual < 0) faseActual = 0;
    if (faseActual > fases.length - 1) faseActual = fases.length - 1;

    if (rondaActual < 1) rondaActual = 1;
    if (rondaActual > TOTAL_RONDAS) rondaActual = TOTAL_RONDAS;

  } catch (error) {
    console.log("Error cargando estado:", error);
  }
}

function renderSidebar() {
  phaseListEl.innerHTML = "";

  fases.forEach((fase, index) => {
    const item = document.createElement("div");
    item.classList.add("phase-item");

    if (index === faseActual) {
      item.classList.add("active");
    }

    item.textContent = fase.titulo;

    item.addEventListener("click", () => {
      faseActual = index;
      actualizarVista();
    });

    phaseListEl.appendChild(item);
  });
}

function renderFaseActual() {
  const fase = fases[faseActual];

  phaseTitleEl.textContent = fase.titulo;
  phaseDetailsEl.innerHTML = "";

  fase.detalles.forEach(det => {
    const li = document.createElement("li");
    li.textContent = det;
    phaseDetailsEl.appendChild(li);
  });

  phaseProgressEl.textContent = `${faseActual + 1} / ${fases.length}`;
}

function renderRonda() {
  roundCounterEl.textContent = `${rondaActual} / ${TOTAL_RONDAS}`;
}

function actualizarBotones() {
  btnPrev.disabled = (faseActual === 0 && rondaActual === 1);
  btnNext.disabled = (faseActual === fases.length - 1 && rondaActual === TOTAL_RONDAS);
}

function siguienteFase() {
  if (faseActual < fases.length - 1) {
    faseActual++;
  } else {
    if (rondaActual < TOTAL_RONDAS) {
      rondaActual++;
      faseActual = 0;
    }
  }

  actualizarVista();
}

function faseAnterior() {
  if (faseActual > 0) {
    faseActual--;
  } else {
    if (rondaActual > 1) {
      rondaActual--;
      faseActual = fases.length - 1;
    }
  }

  actualizarVista();
}

function resetear() {
  faseActual = 0;
  rondaActual = 1;
  actualizarVista();
}

function actualizarVista() {
  renderSidebar();
  renderFaseActual();
  renderRonda();
  actualizarBotones();
  guardarEstado();
}


// ========================================
// EVENTOS
// ========================================

btnNext.addEventListener("click", siguienteFase);
btnPrev.addEventListener("click", faseAnterior);
btnReset.addEventListener("click", resetear);


// ========================================
// INIT
// ========================================

cargarEstado();
actualizarVista();
