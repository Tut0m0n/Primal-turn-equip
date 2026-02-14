// ===============================
// GLOBAL STATE
// ===============================
let selectedPlayers = null;
let selectedMonster = null;
let selectedLevel = null;

let round = 1;
let posture = 1;
let wounds = 0;
let damage = 0;

const MAX_WOUNDS = 10;

// Vyraxen multipliers per posture depending on level
const VYRAXEN_DAMAGE_TABLE = {
  0: { 1: 2, 2: 3, 3: 4 },
  1: { 1: 5, 2: 7, 3: 10 },
  2: { 1: 10, 2: 15, 3: 20 },
  3: { 1: 18, 2: 24, 3: 30 }
};

// ===============================
// DOM ELEMENTS
// ===============================
const screens = {
  screen1: document.getElementById("screen1"),
  screen2: document.getElementById("screen2"),
  screen3: document.getElementById("screen3"),
  screenLevel: document.getElementById("screenLevel"),
  screen4: document.getElementById("screen4"),
};

const btnEnter = document.getElementById("btnEnter");

// Screen 2
const btnBackTo1 = document.getElementById("btnBackTo1");
const btnPlayersNext = document.getElementById("btnPlayersNext");

// Screen 3
const btnBackTo2 = document.getElementById("btnBackTo2");
const btnMonsterNext = document.getElementById("btnMonsterNext");

// Screen Level
const btnBackTo3 = document.getElementById("btnBackTo3");
const btnLevelNext = document.getElementById("btnLevelNext");

// Screen 4 tracker
const roundCounter = document.getElementById("roundCounter");
const playerTurnCounter = document.getElementById("playerTurnCounter");
const postureCounter = document.getElementById("postureCounter");

const woundsCounter = document.getElementById("woundsCounter");
const damageCounter = document.getElementById("damageCounter");
const damageMax = document.getElementById("damageMax");

const woundMessage = document.getElementById("woundMessage");
const monsterMessage = document.getElementById("monsterMessage");

// Controls
const btnPostureDown = document.getElementById("btnPostureDown");
const btnPostureUp = document.getElementById("btnPostureUp");

const btnWoundDown = document.getElementById("btnWoundDown");
const btnWoundUp = document.getElementById("btnWoundUp");

const btnDmgMinus = document.getElementById("btnDmgMinus");
const btnDmgPlus = document.getElementById("btnDmgPlus");

const btnReset = document.getElementById("btnReset");

// Phase center
const phaseTitle = document.getElementById("phaseTitle");
const phaseText = document.getElementById("phaseText");
const btnPrevPhase = document.getElementById("btnPrevPhase");
const btnNextPhase = document.getElementById("btnNextPhase");

// Turn order list
const turnList = document.getElementById("turnList");

// Glossary modal
const btnGlossary = document.getElementById("btnGlossary");
const glossaryModal = document.getElementById("glossaryModal");
const btnCloseGlossary = document.getElementById("btnCloseGlossary");

// Extra buttons
const btnPlants = document.getElementById("btnPlants");
const btnSetup = document.getElementById("btnSetup");

// Overlay
const overlayPosture = document.getElementById("overlayPosture");

// Music
const bgMusic = document.getElementById("bgMusic");
const volumeControl = document.getElementById("volumeControl");
const musicToggleBtn = document.getElementById("musicToggleBtn");

// ===============================
// FUNCTIONS
// ===============================
function showScreen(screenId) {
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[screenId].classList.add("active");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// ===============================
// DAMAGE SYSTEM
// ===============================
function getMaxDamage() {
  if (!selectedPlayers || selectedLevel === null || !selectedMonster) return 0;

  if (selectedMonster !== "Vyraxen") return 0;

  const multiplier = VYRAXEN_DAMAGE_TABLE[selectedLevel][posture];
  return multiplier * selectedPlayers;
}

// ===============================
// PLAYER TURN SYSTEM
// ===============================
function getPlayerTurn() {
  if (!selectedPlayers) return 1;
  return ((currentPhaseIndex % selectedPlayers) + 1);
}

// ===============================
// UI UPDATE
// ===============================
function updateTrackerUI() {
  if (roundCounter) roundCounter.textContent = round;
  if (postureCounter) postureCounter.textContent = posture;

  if (playerTurnCounter) {
    playerTurnCounter.textContent = getPlayerTurn();
  }

  if (woundsCounter) woundsCounter.textContent = wounds;

  const maxDamage = getMaxDamage();
  if (damageMax) damageMax.textContent = maxDamage;
  if (damageCounter) damageCounter.textContent = damage;

  updateWoundMessage();
}

// ===============================
// WOUND MESSAGE + OVERLAY 15s
// ===============================
function showOverlayFor15Seconds(text) {
  if (!overlayPosture) return;

  overlayPosture.querySelector("p").textContent = text;

  overlayPosture.classList.add("active");

  setTimeout(() => {
    overlayPosture.classList.remove("active");
  }, 15000);
}

function updateWoundMessage() {
  if (!woundMessage) return;

  woundMessage.textContent = "";
  woundMessage.style.color = "#c40000";

  if (wounds === 3) {
    woundMessage.textContent = "CAMBIO DE POSTURA en el monstruo, prepárense...";
    showOverlayFor15Seconds("CAMBIO DE POSTURA en el monstruo, prepárense...");
  }

  if (wounds === 7) {
    woundMessage.textContent = "CAMBIO DE POSTURA en el monstruo, prepárense… Se ve encabronado!!";
    showOverlayFor15Seconds("CAMBIO DE POSTURA en el monstruo, prepárense… Se ve encabronado!!");
  }

  if (wounds >= 10) {
    woundMessage.textContent = "Felicidades han vencido a su presa, Cazadores. Ahora merecen un pequeño descanso...";
    woundMessage.style.color = "#0b3dff";
  }
}

// ===============================
// PHASE SYSTEM
// ===============================
const phases = [
  {
    title: "INICIO DE RONDA",
    content: "Comienza una nueva ronda.\n\n- Ajusta contadores.\n- Prepara al grupo."
  },
  {
    title: "FASE DE CAZADORES",
    content: "Los cazadores actúan.\n\n- Mover\n- Atacar\n- Usar habilidades"
  },
  {
    title: "FASE DEL MONSTRUO",
    content: "El monstruo realiza su acción.\n\n- Aplica IA\n- Ejecuta ataques"
  },
  {
    title: "FINAL DE RONDA",
    content: "Cierre de ronda.\n\n- Efectos finales\n- Preparar siguiente ronda"
  }
];

let currentPhaseIndex = 0;

function updatePhaseUI() {
  if (phaseTitle) phaseTitle.textContent = phases[currentPhaseIndex].title;
  if (phaseText) phaseText.textContent = phases[currentPhaseIndex].content;

  document.querySelectorAll(".phase-item").forEach((el, index) => {
    el.classList.toggle("active", index === currentPhaseIndex);
  });

  updateTrackerUI();
}

function buildTurnList() {
  if (!turnList) return;

  turnList.innerHTML = "";

  phases.forEach((phase, index) => {
    const item = document.createElement("div");
    item.className = "phase-item";
    item.textContent = phase.title;

    item.addEventListener("click", () => {
      currentPhaseIndex = index;
      updatePhaseUI();
    });

    turnList.appendChild(item);
  });
}

// ===============================
// MUSIC SYSTEM
// ===============================
let musicPlaying = false;

function startMusic() {
  if (!bgMusic) return;

  bgMusic.volume = parseFloat(volumeControl.value);

  bgMusic.play().then(() => {
    musicPlaying = true;
    musicToggleBtn.textContent = "🔊";
  }).catch(() => {
    musicPlaying = false;
    musicToggleBtn.textContent = "🔇";
  });
}

function toggleMusic() {
  if (!bgMusic) return;

  if (!musicPlaying) {
    startMusic();
  } else {
    bgMusic.pause();
    musicPlaying = false;
    musicToggleBtn.textContent = "🔇";
  }
}

// ===============================
// PLAYER SELECTION
// ===============================
function initPlayerSelection() {
  const radios = document.querySelectorAll("input[name='players']");
  radios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      const val = e.target.value;

      // SOLO significa 2 jugadores
      if (val === "SOLO") {
        selectedPlayers = 2;
      } else {
        selectedPlayers = parseInt(val);
      }
    });
  });
}

// ===============================
// MONSTER SELECTION
// ===============================
function initMonsterSelection() {
  const radios = document.querySelectorAll("input[name='monster']");
  radios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      selectedMonster = e.target.value;

      // Solo Vyraxen implementado en tabla daño por ahora
      if (selectedMonster !== "Vyraxen") {
        monsterMessage.textContent = "⚠ Solo Vyraxen tiene daño dinámico implementado.";
      } else {
        monsterMessage.textContent = "";
      }
    });
  });
}

// ===============================
// LEVEL SELECTION
// ===============================
function initLevelSelection() {
  const radios = document.querySelectorAll("input[name='monsterLevel']");
  radios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      selectedLevel = parseInt(e.target.value);
    });
  });
}

// ===============================
// EVENTS
// ===============================
btnEnter.addEventListener("click", () => {
  showScreen("screen2");
  startMusic();
});

btnBackTo1.addEventListener("click", () => {
  showScreen("screen1");
});

btnPlayersNext.addEventListener("click", () => {
  if (selectedPlayers === null) {
    alert("Selecciona la cantidad de jugadores.");
    return;
  }
  showScreen("screen3");
});

btnBackTo2.addEventListener("click", () => {
  showScreen("screen2");
});

btnMonsterNext.addEventListener("click", () => {
  if (!selectedMonster) {
    alert("Selecciona un monstruo.");
    return;
  }
  showScreen("screenLevel");
});

btnBackTo3.addEventListener("click", () => {
  showScreen("screen3");
});

btnLevelNext.addEventListener("click", () => {
  if (selectedLevel === null) {
    alert("Selecciona el nivel del monstruo.");
    return;
  }

  showScreen("screen4");

  // Reset counters
  round = 1;
  posture = 1;
  wounds = 0;
  damage = 0;
  currentPhaseIndex = 0;

  buildTurnList();
  updatePhaseUI();
});

// Posture
btnPostureDown.addEventListener("click", () => {
  posture = clamp(posture - 1, 1, 3);
  damage = clamp(damage, 0, getMaxDamage());
  updateTrackerUI();
});

btnPostureUp.addEventListener("click", () => {
  posture = clamp(posture + 1, 1, 3);
  damage = clamp(damage, 0, getMaxDamage());
  updateTrackerUI();
});

// Wounds
btnWoundDown.addEventListener("click", () => {
  wounds = clamp(wounds - 1, 0, MAX_WOUNDS);
  updateTrackerUI();
});

btnWoundUp.addEventListener("click", () => {
  wounds = clamp(wounds + 1, 0, MAX_WOUNDS);
  updateTrackerUI();
});

// Damage
btnDmgMinus.addEventListener("click", () => {
  damage = clamp(damage - 1, 0, getMaxDamage());
  updateTrackerUI();
});

btnDmgPlus.addEventListener("click", () => {
  damage = clamp(damage + 1, 0, getMaxDamage());
  updateTrackerUI();
});

// Phases
btnPrevPhase.addEventListener("click", () => {
  currentPhaseIndex = clamp(currentPhaseIndex - 1, 0, phases.length - 1);
  updatePhaseUI();
});

btnNextPhase.addEventListener("click", () => {
  currentPhaseIndex = clamp(currentPhaseIndex + 1, 0, phases.length - 1);

  // Cuando pasa la última fase, aumenta ronda
  if (currentPhaseIndex === phases.length - 1) {
    round++;
  }

  updatePhaseUI();
});

// Reset
btnReset.addEventListener("click", () => {
  round = 1;
  posture = 1;
  wounds = 0;
  damage = 0;
  currentPhaseIndex = 0;

  updatePhaseUI();
});

// Glossary
btnGlossary.addEventListener("click", () => {
  glossaryModal.classList.add("active");
});

btnCloseGlossary.addEventListener("click", () => {
  glossaryModal.classList.remove("active");
});

// Extra buttons
btnPlants.addEventListener("click", () => {
  alert("Aquí irá la sección Plantas y Terreno (pendiente).");
});

btnSetup.addEventListener("click", () => {
  alert("Aquí irá la sección Setup Monstruo (pendiente).");
});

// Music controls
musicToggleBtn.addEventListener("click", toggleMusic);

volumeControl.addEventListener("input", () => {
  bgMusic.volume = parseFloat(volumeControl.value);
});

// ===============================
// STARTUP
// ===============================
initPlayerSelection();
initMonsterSelection();
initLevelSelection();
