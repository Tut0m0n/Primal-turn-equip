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
let effort = 0;
let accel = 0;

const MAX_WOUNDS = 10;
const MAX_EFFORT = 10;
const MAX_ACCEL = 10;

// Vyraxen multipliers per posture depending on level
const VYRAXEN_DAMAGE_TABLE = {
  0: { 1: 2, 2: 3, 3: 4 },
  1: { 1: 5, 2: 7, 3: 10 },
  2: { 1: 10, 2: 15, 3: 20 },
  3: { 1: 18, 2: 24, 3: 30 }
};

// Ozew multipliers per posture depending on level
const OZEW_DAMAGE_TABLE = {
  0: { 1: 3, 2: 2, 3: 2 },
  1: { 1: 7, 2: 5, 3: 3 },
  2: { 1: 16, 2: 12, 3: 9 },
  3: { 1: 25, 2: 18, 3: 15 }
};

// Toramat multipliers per posture depending on level
const TORAMAT_DAMAGE_TABLE = {
  0: { 1: 2, 2: 3, 3: 3 },
  1: { 1: 4, 2: 6, 3: 9 },
  2: { 1: 10, 2: 16, 3: 20 },
  3: { 1: 18, 2: 25, 3: 30 }
};

// Dygorax multipliers per posture depending on level
const DYGORAX_DAMAGE_TABLE = {
  0: { 1: 2, 2: 3, 3: 4 },
  1: { 1: 5, 2: 7, 3: 10 },
  2: { 1: 9, 2: 14, 3: 18 },
  3: { 1: 15, 2: 20, 3: 25 }
};

// Orouxen multipliers per posture depending on level
const OROUXEN_DAMAGE_TABLE = {
  0: { 1: 2, 2: 3, 3: 4 },
  1: { 1: 6, 2: 7, 3: 8 },
  2: { 1: 10, 2: 15, 3: 20 },
  3: { 1: 20, 2: 22, 3: 26 }
};

// Korowon multipliers per posture depending on level
const KOROWON_DAMAGE_TABLE = {
  0: { 1: 2, 2: 0, 3: 4 },
  1: { 1: 6, 2: 0, 3: 8 },
  2: { 1: 13, 2: 0, 3: 16 },
  3: { 1: 20, 2: 0, 3: 20 }
};

// Morkraas multipliers per posture depending on level
const MORKRASS_DAMAGE_TABLE = {
  0: { 1: 5, 2: 3, 3: 2 },
  1: { 1: 10, 2: 8, 3: 6 },
  2: { 1: 20, 2: 16, 3: 14 },
  3: { 1: 30, 2: 25, 3: 20 }
};

// Felaxir multipliers per posture depending on level
const FELAXIR_DAMAGE_TABLE = {
  0: { 1: 2, 2: 3, 3: 4 },
  1: { 1: 6, 2: 7, 3: 9 },
  2: { 1: 12, 2: 14, 3: 20 },
  3: { 1: 18, 2: 25, 3: 28 }
};

// Zekalith multipliers per posture depending on level
const ZEKALITH_DAMAGE_TABLE = {
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
const woundsCounter = document.getElementById("woundsCounter");
const damageCounter = document.getElementById("damageCounter");
const damageMax = document.getElementById("damageMax");
const effortCounter = document.getElementById("effortCounter");
const accelCounter = document.getElementById("accelCounter");
const woundMessage = document.getElementById("woundMessage");
const effortWarning = document.getElementById("effortWarning");

// Controls
const btnDamageDown = document.getElementById("btnDamageDown");
const btnDamageUp = document.getElementById("btnDamageUp");

const btnEffortDown = document.getElementById("btnEffortDown");
const btnEffortUp = document.getElementById("btnEffortUp");

const btnAccelDown = document.getElementById("btnAccelDown");
const btnAccelUp = document.getElementById("btnAccelUp");

// Phase center
const phaseTitle = document.getElementById("phaseTitle");
const phaseContent = document.getElementById("phaseContent");
const btnPrevPhase = document.getElementById("btnPrevPhase");
const btnNextPhase = document.getElementById("btnNextPhase");
const btnReset = document.getElementById("btnReset");

// Turn order list
const turnOrderList = document.getElementById("turnOrderList");

// Glossary buttons
const btnGlossary = document.getElementById("btnGlossary");
const btnPlants = document.getElementById("btnPlants");
const btnSetup = document.getElementById("btnSetup");

// Music
const bgMusic = document.getElementById("bgMusic");
const volumeControl = document.getElementById("volumeControl");
const btnMusicToggle = document.getElementById("btnMusicToggle");

// Reset modal
const resetModal = document.getElementById("resetModal");
const resetYesBtn = document.getElementById("resetYesBtn");
const resetNoBtn = document.getElementById("resetNoBtn");

// ===============================
// FUNCTIONS
// ===============================
function showScreen(screenId) {
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[screenId].classList.add("active");
}

function createOption(container, text, value, onSelect, className = "option-compact") {
  const option = document.createElement("div");
  option.className = className;
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
  playerTurnCounter.textContent = `Turno Jugador 1 / ${selectedPlayers}`;

  woundsCounter.textContent = wounds;

  const maxDamage = getMaxDamage();
  damageCounter.textContent = damage;
  damageMax.textContent = maxDamage;

  effortCounter.textContent = effort;
  accelCounter.textContent = accel;

  updateWoundMessage();
  updateEffortWarning();
}

function updateWoundMessage() {
  woundMessage.textContent = "";
  woundMessage.style.color = "#000";

  if (wounds === 3) {
    woundMessage.textContent = "CAMBIO DE POSTURA en el monstruo, prepárense...";
    woundMessage.style.color = "#c40000";
  } else if (wounds === 7) {
    woundMessage.textContent = "CAMBIO DE POSTURA en el monstruo, prepárense… Se ve encabronado!!";
    woundMessage.style.color = "#c40000";
  } else if (wounds >= 10) {
    woundMessage.textContent = "Felicidades han vencido a su presa, Cazadores. Ahora merecen un pequeño descanso...";
    woundMessage.style.color = "#0b3dff";
  }
}

function updateEffortWarning() {
  if (effort >= 10) {
    effortWarning.textContent = "DESATADO!! Genera el daño del monstruo a todos los jugadores!!";
    effortWarning.style.color = "#c40000";
  } else {
    effortWarning.textContent = "";
  }
}

function getMaxDamage() {
  if (!selectedPlayers || selectedLevel === null || !selectedMonster) return 10;

  if (selectedMonster !== "VYRAXEN") return 10;

  const multiplier = VYRAXEN_DAMAGE_TABLE[selectedLevel][posture];
  return multiplier * selectedPlayers;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// ===============================
// PHASE SYSTEM
// ===============================
const phases = [
  {
    title: "1. Inicio de la ronda",
    content: "(Remover Confusión)\n\n- Detonar: habilidades de AL COMIENZO DE LA RONDA\n   - Chequeo de POSTURA del Monstruo\n   - Chequeo PELIGROS por efectos de la POSTURA del monstruo\n- Chequeo habilidades del Cazador\n- Chequeo de habilidades de Objetivos\n- Remover ficha de CONFUSION"
  },
  {
    title: "2. Consumir",
    content: "- Cada jugador puede usar una habilidad de CONSUMIR una POCION y removerla del juego (regresa al jugador si falla el escenario)"
  },
  {
    title: "3. Mantenimiento del monstruo",
    content: "- Se refrescan las cartas de COMPORTAMIENTO del monstruo, descarta el número más bajo de comportamiento. Si hay empate, se cambian las iguales.\n- +1 ESFUERZO por jugador.\n- +1 ESFUERZO por aceleración"
  },
  {
    title: "4. Turno del jugador",
    content: "Recordatorio: el jugador con la ficha de AGRESIVIDAD va primero.\n\n- Salir de la Meseta (Terreno)\n- Chequeo del COMPORTAMIENTO del monstruo por sus efectos\n- Termino de CAPTURA, si el jugador estaba capturado.\n- Chequeo de los objetivos del monstruo por efectos\n- Remover CEGUERA"
  },
  {
    title: "5. Fase de movimiento",
    content: "- El jugador puede gastar 1 de RESISTENCIA para moverse 1 sector\n- Si no se mueve, gana la ficha AMENAZADO\n- Chequeo del comportamiento del monstruo por efectos"
  },
  {
    title: "6. Fase de acción",
    content: "Recordatorio: La máxima cantidad de cartas de acción a jugar es 5\n\n- Puedes LEVANTAR a aliados NOQUEADOS\n- Cuando juegues una carta con AGRESIVIDAD, obtienes la ficha\n- Detona COLOR:HABILIDAD"
  },
  {
    title: "7. Fase de Desgaste",
    content: "- Roba 1 carta de Desgaste (2 si estás AMENAZADO)\n- Si tienes cartas DEFENSIVAS suficientes, no sufres daño\n- Detonar: habilidades de TERMINO FASE DESGASTE"
  },
  {
    title: "8. Fin del turno del jugador",
    content: "- Descarta la secuencia jugada\n- Rellena tu mano hasta 5 cartas\n- El MONSTRUO se gira al jugador que tenga AGRESIVIDAD"
  },
  {
    title: "9. Fin de la ronda",
    content: "- Detonar: habilidades de AL FINAL DE LA RONDA\n- Avanza el Marcador de Turno"
  }
];

let currentPhaseIndex = 0;

function updatePhaseUI() {
  phaseTitle.textContent = phases[currentPhaseIndex].title;
  phaseContent.textContent = phases[currentPhaseIndex].content;

  document.querySelectorAll(".phase-item").forEach((el, index) => {
    el.classList.toggle("active", index === currentPhaseIndex);
  });
}

function buildTurnOrderList() {
  turnOrderList.innerHTML = "";

  phases.forEach((phase, index) => {
    const item = document.createElement("div");
    item.className = "phase-item";
    item.textContent = phase.title;
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
  const playerOptions = [
    { text: "SOLO", value: 2 },
    { text: "2", value: 2 },
    { text: "3", value: 3 },
    { text: "4", value: 4 },
    { text: "5", value: 5 }
  ];
  
  playerOptions.forEach(option => {
    createOption(playersOptions, option.text, option.value, (val) => {
      selectedPlayers = parseInt(val);
    });
  });
}

function buildMonsterOptions() {
  monsterOptions.innerHTML = "";
  const monsters = ["VYRAXEN", "KOROWON", "OZEW", "HYDAR", "PAZIS", "TARASKA", "KHARJA", "OROUXEN", "JEKOROS", "REIKAL", "NAGARJAS", "XITHEROS", "TORAMAT", "FELAXIR", "HUROM", "SIRKAAJ", "ZEKATH", "DYGORAX", "MORKRAAS", "TARRAGUA", "MAMURAAK", "ZEKALITH"];
  monsters.forEach(monster => {
    createOption(monsterOptions, monster, monster, (val) => {
      selectedMonster = val;
    }, "monster-option");
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

// Players
btnPlayersCancel.addEventListener("click", () => {
  selectedPlayers = null;
  showScreen("screen1");
});

btnPlayersNext.addEventListener("click", () => {
  if (selectedPlayers === null) {
    alert("Selecciona la cantidad de jugadores.");
    return;
  }
  showScreen("screen3");
});

// Monster
btnMonsterCancel.addEventListener("click", () => {
  selectedMonster = null;
  showScreen("screen2");
});

btnMonsterNext.addEventListener("click", () => {
  if (!selectedMonster) {
    alert("Selecciona un monstruo.");
    return;
  }
  showScreen("screenLevel");
});

// Level
btnLevelCancel.addEventListener("click", () => {
  selectedLevel = null;
  showScreen("screen3");
});

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
  effort = 0;
  accel = 0;

  updateTrackerUI();
});

// Damage control
btnDamageDown.addEventListener("click", () => {
  damage = clamp(damage - 1, 0, getMaxDamage());
  updateTrackerUI();
});

btnDamageUp.addEventListener("click", () => {
  damage = clamp(damage + 1, 0, getMaxDamage());
  if (damage >= getMaxDamage()) {
    damage = 0;
    wounds = clamp(wounds + 1, 0, MAX_WOUNDS);
  }
  updateTrackerUI();
});

// Effort control
btnEffortDown.addEventListener("click", () => {
  effort = clamp(effort - 1, 0, MAX_EFFORT);
  updateTrackerUI();
});

btnEffortUp.addEventListener("click", () => {
  effort = clamp(effort + 1, 0, MAX_EFFORT);
  updateTrackerUI();
});

// Accel control
btnAccelDown.addEventListener("click", () => {
  accel = clamp(accel - 1, 0, MAX_ACCEL);
  updateTrackerUI();
});

btnAccelUp.addEventListener("click", () => {
  accel = clamp(accel + 1, 0, MAX_ACCEL);
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

// Reset
btnReset.addEventListener("click", () => {
  resetModal.classList.add("active");
});

resetYesBtn.addEventListener("click", () => {
  resetModal.classList.remove("active");
  
  round = 1;
  posture = 1;
  wounds = 0;
  damage = 0;
  effort = 0;
  accel = 0;
  currentPhaseIndex = 0;
  
  updateTrackerUI();
  updatePhaseUI();
});

resetNoBtn.addEventListener("click", () => {
  resetModal.classList.remove("active");
});

// Glossary buttons (placeholders)
btnGlossary.addEventListener("click", () => {
  alert("Glosario - Pendiente de implementar");
});

btnPlants.addEventListener("click", () => {
  alert("Plantas y Terreno - Pendiente de implementar");
});

btnSetup.addEventListener("click", () => {
  alert("Setup Monstruo - Pendiente de implementar");
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