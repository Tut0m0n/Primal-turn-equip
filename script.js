// ===========================================
// PRIMAL - ORDEN DE TURNO TRACKER
// ===========================================

const TOTAL_RONDAS = 10;

// FASES DE LA RONDA
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
      "Después de otros detonantes: comienzan los efectos de inicio del turno del jugador",
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


// ===========================================
// ESTADO
// ===========================================

let rondaActual = 1;
let faseActual = 0;


// ===========================================
// ELEMENTOS DEL DOM
// ===========================================

const phaseListEl = document.getElementById("phaseList");
const phaseTitleEl = document.getElementById("phaseTitle");
const phaseDetailsEl = document.getElementById("phaseDetails");
const roundCounterEl = document.getElementById("roundCounter");

const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnReset = document.getElementById("btnReset");


// ===========================================
// FUNCIONES PRINCIPALES
// ===========================================

function renderListaFases() {
  phaseListEl.innerHTML = "";

  fases.forEach((fase, index) => {
    const div = document.createElement("div");
    div.classList.add("phase-item");

    div.textContent = fase.titulo;

    if (index === faseActual) {
      div.classList.add("active");
    }

    phaseListEl.appendChild(div);
  });
}

function renderFaseCentral() {
  const fase = fases[faseActual];

  phaseTitleEl.textContent = fase.titulo;
  phaseDetailsEl.innerHTML = "";

  fase.detalles.forEach(texto => {
    const li = document.createElement("li");
    li.textContent = texto;
    phaseDetailsEl.appendChild(li);
  });
}

function renderRonda() {
  roundCounterEl.textContent = `${rondaActual} / ${TOTAL_RONDAS}`;
}

function actualizarVista() {
  renderListaFases();
  renderFaseCentral();
  renderRonda();
}

function siguiente() {
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

function anterior() {
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
  rondaActual = 1;
  faseActual = 0;
  actualizarVista();
}


// ===========================================
// EVENTOS
// ===========================================

btnNext.addEventListener("click", siguiente);
btnPrev.addEventListener("click", anterior);
btnReset.addEventListener("click", resetear);


// ===========================================
// INICIO
// ===========================================

actualizarVista();
