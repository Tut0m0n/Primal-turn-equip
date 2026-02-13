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

// Screen 2 players
const playersOptions = document.getElementById("playersOptions");
const btnPlayersCancel = document.getElementById("btnPlayersCancel");
const btnPlayersNext = document.getElementById("btnPlayersNext");

// Screen 3 monster
const monsterOptions = document.getElementById("monsterOptions");
const btnMonsterCancel = document.getElementById("btnMonsterCancel");
const btnMonsterNext = document.getElementById("btnMonsterNext");

// Screen Level
const levelOptions = document.getElementById("levelOptions");
const btnLevelCancel = document.getElementById("btnLevelCancel");
const btnLevelNext = document.getElementById("btnLevelNext");

// Screen 4 tracker
const roundCounter = document.getElementById("roundCounter");
const playerTurnCounter = document.getElementById("playerTurnCounter");
const postureCounter = document.getElementById("postureCounter");
const woundCounter = document.getElementById("woundCounter");
const damageCounter = document.getElementById("damageCounter");
const woundMessage = document.getElementById("woundMessage");

// Controls
const btnPostureDown = document.getElementById("btnPostureDown");
const btnPostureUp = document.getElementById("btnPostureUp");

const btnWoundDown = document.getElementById("btnWoundDown");
const btnWoundUp = document.getElementById("btnWoundUp");

const btnDamageDown = document.getElementById("btnDamageDown");
const btnDamageUp = document.getElementById("btnDamageUp");

// Phase center
const phaseTitle = document.getElementById("phaseTitle");
const phaseContent = document.getElementById("phaseContent");
const btnPrevPhase = document.getElementById("btnPrevPhase");
const btnNextPhase = document.getElementById("btnNextPhase");

// Turn order list
const turnOrderList = document.getElementById("turnOrderList");

// Glossary modal
const btnGlossary = document.getElementById("btnGlossary");
const glossaryModal = document.getElementById("glossaryModal");
const btnCloseGlossary = document.getElementById("btnCloseGlossary");

// Music
const bgMusic = document.getElementById("bgMusic");
const volumeControl = document.getElementById("volumeControl");
const btnMusicToggle = document.getElementById("btnMusicToggle");

// ===============================
// FUNCTIONS
// ===============================
function showScreen(screenId) {
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[screenId].classList.add("active");
}

function createOption(container, text, value, onSelect) {
  const option = document.createElement("div");
  option.className = "option-row";
  option.dataset.value = value;

  const label = document.createElement("span");
  label.textContent = text;

  const checkbox = document.createElement("div");
  checkbox.className = "checkbox";

  option.appendChild(label);
  option.appendChild(checkbox);

  option.addEventListener("click", () => {
    [...container.children].forEach(child => child.classList.remove("selected"));
    option.classList.add("selected");
    onSelect(value);
  });

  container.appendChild(option);
}

function updateTrackerUI() {
  roundCounter.textContent = round;
  postureCounter.textContent = posture;
  playerTurnCounter.textContent = `TURNO DEL JUGADOR: ${getPlayerTurn()}`;

  woundCounter.textContent = `${wounds} / ${MAX_WOUNDS}`;

  const maxDamage = getMaxDamage();
  damageCounter.textContent = `${damage} / ${maxDamage}`;

  updateWoundMessage();
}

function updateWoundMessage() {
  woundMessage.textContent = "";

  if (wounds === 3) {
    woundMessage.textContent = "CAMBIO DE POSTURA en el monstruo, prepárense...";
    woundMessage.style.color = "#c40000";
  }

  if (wounds === 7) {
    woundMessage.textContent = "CAMBIO DE POSTURA en el monstruo, prepárense… Se ve encabronado!!";
    woundMessage.style.color = "#c40000";
  }

  if (wounds >= 10) {
    woundMessage.textContent = "Felicidades han vencido a su presa, Cazadores. Ahora merecen un pequeño descanso...";
    woundMessage.style.color = "#0b3dff";
  }
}

function getMaxDamage() {
  if (!selectedPlayers || selectedLevel === null || !selectedMonster) return 0;

  // Only Vyraxen data implemented (as requested)
  if (selectedMonster !== "Vyraxen") return 0;

  const multiplier = VYRAXEN_DAMAGE_TABLE[selectedLevel][posture];
  return multiplier * selectedPlayers;
}

function getPlayerTurn() {
  if (!selectedPlayers) return 1;

  // Turn based on phase index (simple approach)
  return ((currentPhaseIndex % selectedPlayers) + 1);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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
  phaseTitle.textContent = phases[currentPhaseIndex].title;
  phaseContent.textContent = phases[currentPhaseIndex].content;

  document.querySelectorAll(".phase-item").forEach((el, index) => {
    el.classList.toggle("active", index === currentPhaseIndex);
  });

  updateTrackerUI();
}

function buildTurnOrderList() {
  turnOrderList.innerHTML = "";

  phases.forEach((phase, index) => {
    const item = document.createElement("div");
    item.className = "phase-item";
    item.textContent = phase.title;

    item.addEventListener("click", () => {
      currentPhaseIndex = index;
      updatePhaseUI();
    });

    turnOrderList.appendChild(item);
  });
}

// ===============================
// MUSIC SYSTEM
// ===============================
let musicPlaying = false;

function startMusic() {
  bgMusic.volume = parseFloat(volumeControl.value);
  bgMusic.play().then(() => {
    musicPlaying = true;
    btnMusicToggle.textContent = "🔊";
  }).catch(() => {
    // Autoplay blocked, user must click
    musicPlaying = false;
    btnMusicToggle.textContent = "🔇";
  });
}

function toggleMusic() {
  if (!musicPlaying) {
    startMusic();
  } else {
    bgMusic.pause();
    musicPlaying = false;
    btnMusicToggle.textContent = "🔇";
  }
}

// ===============================
// INIT OPTIONS
// ===============================
function buildPlayersOptions() {
  playersOptions.innerHTML = "";
  [1, 2, 3, 4].forEach(num => {
    createOption(playersOptions, `${num}`, num, (val) => {
      selectedPlayers = parseInt(val);
    });
  });
}

function buildMonsterOptions() {
  monsterOptions.innerHTML = "";
  const monsters = ["Vyraxen"]; // Only Vyraxen requested
  monsters.forEach(monster => {
    createOption(monsterOptions, monster, monster, (val) => {
      selectedMonster = val;
    });
  });
}

function buildLevelOptions() {
  levelOptions.innerHTML = "";
  [0, 1, 2, 3].forEach(level => {
    createOption(levelOptions, `${level}`, level, (val) => {
      selectedLevel = parseInt(val);
    });
  });
}

// ===============================
// EVENTS
// ===============================

// Enter button
btnEnter.addEventListener("click", () => {
  showScreen("screen2");
  startMusic();
});

// Players cancel -> back home
btnPlayersCancel.addEventListener("click", () => {
  showScreen("screen1");
});

// Players next
btnPlayersNext.addEventListener("click", () => {
  if (selectedPlayers === null) {
    alert("Selecciona la cantidad de jugadores.");
    return;
  }
  showScreen("screen3");
});

// Monster cancel -> back players
btnMonsterCancel.addEventListener("click", () => {
  showScreen("screen2");
});

// Monster next
btnMonsterNext.addEventListener("click", () => {
  if (!selectedMonster) {
    alert("Selecciona un monstruo.");
    return;
  }
  showScreen("screenLevel");
});

// Level cancel -> back monster
btnLevelCancel.addEventListener("click", () => {
  showScreen("screen3");
});

// Level next -> go tracker
btnLevelNext.addEventListener("click", () => {
  if (selectedLevel === null) {
    alert("Selecciona el nivel del monstruo.");
    return;
  }

  showScreen("screen4");

  buildTurnOrderList();
  updatePhaseUI();

  // reset counters
  round = 1;
  posture = 1;
  wounds = 0;
  damage = 0;

  updateTrackerUI();
});

// Posture control
btnPostureDown.addEventListener("click", () => {
  posture = clamp(posture - 1, 1, 3);

  // when posture changes, reset damage because new max damage changes
  damage = clamp(damage, 0, getMaxDamage());
  updateTrackerUI();
});

btnPostureUp.addEventListener("click", () => {
  posture = clamp(posture + 1, 1, 3);
  damage = clamp(damage, 0, getMaxDamage());
  updateTrackerUI();
});

// Wounds control
btnWoundDown.addEventListener("click", () => {
  wounds = clamp(wounds - 1, 0, MAX_WOUNDS);
  updateTrackerUI();
});

btnWoundUp.addEventListener("click", () => {
  wounds = clamp(wounds + 1, 0, MAX_WOUNDS);
  updateTrackerUI();
});

// Damage control
btnDamageDown.addEventListener("click", () => {
  damage = clamp(damage - 1, 0, getMaxDamage());
  updateTrackerUI();
});

btnDamageUp.addEventListener("click", () => {
  damage = clamp(damage + 1, 0, getMaxDamage());
  updateTrackerUI();
});

// Phase navigation
btnPrevPhase.addEventListener("click", () => {
  currentPhaseIndex = clamp(currentPhaseIndex - 1, 0, phases.length - 1);
  updatePhaseUI();
});

btnNextPhase.addEventListener("click", () => {
  currentPhaseIndex = clamp(currentPhaseIndex + 1, 0, phases.length - 1);
  updatePhaseUI();
});

// Glossary
btnGlossary.addEventListener("click", () => {
  glossaryModal.classList.add("active");
});

btnCloseGlossary.addEventListener("click", () => {
  glossaryModal.classList.remove("active");
});

// Music controls
btnMusicToggle.addEventListener("click", toggleMusic);

volumeControl.addEventListener("input", () => {
  bgMusic.volume = parseFloat(volumeControl.value);
});

// ===============================
// STARTUP
// ===============================
buildPlayersOptions();
buildMonsterOptions();
buildLevelOptions();
