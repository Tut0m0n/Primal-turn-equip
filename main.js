// ===============================
// DATOS DE LAS FASES (EL "CEREBRO")
// ===============================

const phases = [
  {
    title: "Inicio de la ronda",
    description: "Aplica efectos generales al inicio de la ronda.",
    checklist: [
      "Remover Confusión",
      "Chequeo de Postura del Monstruo",
      "Chequeo de Postura del Monstruo y Peligros por efectos",
      "Efectos de inicio de ronda"
    ]
  },
  {
    title: "Consumir",
    description: "Cada jugador puede usar una habilidad de consumo.",
    checklist: [
      "Cada jugador puede usar una habilidad de consumo"
    ]
  },
  {
    title: "Mantenimiento del monstruo",
    description: "Refresca el comportamiento del monstruo y aplica esfuerzo.",
    checklist: [
      "Se refresca el comportamiento del monstruo (descarta el número más bajo)",
      "+1 Esfuerzo por jugador",
      "+1 Esfuerzo por aceleración"
    ]
  },
  {
    title: "Turno del jugador",
    description: "Chequeos importantes antes de actuar.",
    checklist: [
      "Recordatorio: el jugador con la ficha de Amenaza va primero y gana la ficha de Primer Jugador al comenzar la nueva ronda",
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
    title: "Fase de movimiento",
    description: "Gasta resistencia para moverte entre sectores.",
    checklist: [
      "Gastar 1 de Resistencia para moverse un sector (si esto pasa, remover Amenazado)",
      "Gastar 2 de Resistencia para moverse un sector si es Arena (Terreno)",
      "Si el jugador no se mueve, gana la ficha Amenazado",
      "Chequeo del comportamiento del monstruo por efectos",
      "Escóndete en un arbusto (rellenar después según el tipo de arbusto)"
    ]
  },
  {
    title: "Fase de acción",
    description: "Juega cartas y realiza acciones.",
    checklist: [
      "Máxima cantidad de cartas de acción a jugar es 5 (salvo habilidad/carta lo contrario)",
      "Máxima cantidad de cartas de acción en Agua es 3",
      "No se pueden jugar cartas cuando estás sobre Fuego (Terreno)",
      "Chequeo del comportamiento del monstruo por efectos",
      "+1 ficha de Resistencia si 2 o más cartas se mantienen en tu mano al final de la fase de acción"
    ]
  }
];

// ===============================
// ELEMENTOS HTML
// ===============================

const phaseNumberEl = document.getElementById("phaseNumber");
const phaseTitleEl = document.getElementById("phaseTitle");
const phaseDescriptionEl = document.getElementById("phaseDescription");
const checklistEl = document.getElementById("checklist");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");

// ===============================
// ESTADO DE LA APP
// ===============================

let currentPhaseIndex = 0;
let checklistState = {};

// ===============================
// GUARDAR Y CARGAR DATOS (LOCALSTORAGE)
// ===============================

function saveProgress() {
  const data = {
    currentPhaseIndex,
    checklistState
  };

  localStorage.setItem("primalTurnTracker", JSON.stringify(data));
}

function loadProgress() {
  const saved = localStorage.getItem("primalTurnTracker");

  if (saved) {
    try {
      const data = JSON.parse(saved);

      if (data.currentPhaseIndex !== undefined) {
        currentPhaseIndex = data.currentPhaseIndex;
      }

      if (data.checklistState) {
        checklistState = data.checklistState;
      }
    } catch (error) {
      console.error("Error cargando datos guardados:", error);
    }
  }
}

// ===============================
// RENDERIZAR LA PANTALLA
// ===============================

function renderPhase() {
  const phase = phases[currentPhaseIndex];

  // Título y descripción
  phaseTitleEl.textContent = phase.title.toUpperCase();
  phaseDescriptionEl.textContent = phase.description;

  // Número de paso
  phaseNumberEl.textContent = `Paso ${currentPhaseIndex + 1} / ${phases.length}`;

  // Limpiar checklist anterior
  checklistEl.innerHTML = "";

  // Crear checklist dinámico
  phase.checklist.forEach((itemText, index) => {
    const checkId = `${currentPhaseIndex}-${index}`;

    // Si no existe en el estado, lo inicializamos en false
    if (checklistState[checkId] === undefined) {
      checklistState[checkId] = false;
    }

    const div = document.createElement("div");
    div.classList.add("check-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = checkId;
    checkbox.checked = checklistState[checkId];

    checkbox.addEventListener("change", () => {
      checklistState[checkId] = checkbox.checked;
      saveProgress();
    });

    const label = document.createElement("label");
    label.setAttribute("for", checkId);
    label.textContent = itemText;

    div.appendChild(checkbox);
    div.appendChild(label);

    checklistEl.appendChild(div);
  });

  // Deshabilitar botones según fase
  prevBtn.disabled = currentPhaseIndex === 0;
  nextBtn.disabled = currentPhaseIndex === phases.length - 1;

  saveProgress();
}

// ===============================
// BOTONES
// ===============================

nextBtn.addEventListener("click", () => {
  if (currentPhaseIndex < phases.length - 1) {
    currentPhaseIndex++;
    renderPhase();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentPhaseIndex > 0) {
    currentPhaseIndex--;
    renderPhase();
  }
});

resetBtn.addEventListener("click", () => {
  if (confirm("¿Seguro que quieres reiniciar la ronda completa?")) {
    currentPhaseIndex = 0;
    checklistState = {};
    saveProgress();
    renderPhase();
  }
});

// ===============================
// INICIO
// ===============================

loadProgress();
renderPhase();

