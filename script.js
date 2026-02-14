// ======================================
// PRIMAL COMPANION - SCRIPT FUNCIONAL
// ======================================

// SCREENS
const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");
const screen3 = document.getElementById("screen3");
const screenLevel = document.getElementById("screenLevel");
const screen4 = document.getElementById("screen4");

// BUTTONS
const btnEnter = document.getElementById("btnEnter");
const btnBackTo1 = document.getElementById("btnBackTo1");
const btnPlayersNext = document.getElementById("btnPlayersNext");

const btnBackTo2 = document.getElementById("btnBackTo2");
const btnMonsterNext = document.getElementById("btnMonsterNext");

const btnBackTo3 = document.getElementById("btnBackTo3");
const btnLevelNext = document.getElementById("btnLevelNext");

// TRACKER BUTTONS
const btnPrevPhase = document.getElementById("btnPrevPhase");
const btnNextPhase = document.getElementById("btnNextPhase");
const btnReset = document.getElementById("btnReset");

// AUDIO
const bgMusic = document.getElementById("bgMusic");
const musicToggleBtn = document.getElementById("musicToggleBtn");
const volumeControl = document.getElementById("volumeControl");

// OVERLAY MESSAGE
const overlayMessage = document.getElementById("overlayMessage");
const overlayText = document.getElementById("overlayText");

// UI ELEMENTS SCREEN4
const roundCounter = document.getElementById("roundCounter");
const playerTurnCounter = document.getElementById("playerTurnCounter");

const phaseTitle = document.getElementById("phaseTitle");
const phaseText = document.getElementById("phaseText");

const woundsCounter = document.getElementById("woundsCounter");
const damageCounter = document.getElementById("damageCounter");
const damageMaxEl = document.getElementById("damageMax");

const effortCounter = document.getElementById("effortCounter");
const accelCounter = document.getElementById("accelCounter");

const btnDmgMinus = document.getElementById("btnDmgMinus");
const btnDmgPlus = document.getElementById("btnDmgPlus");

const btnEffMinus = document.getElementById("btnEffMinus");
const btnEffPlus = document.getElementById("btnEffPlus");

const btnAccMinus = document.getElementById("btnAccMinus");
const btnAccPlus = document.getElementById("btnAccPlus");

// STATE
let selectedPlayers = null;
let selectedMonster = null;
let selectedLevel = null;

let totalPlayers = 2;
let currentRound = 1;
let currentPhaseIndex = 0;
let currentPlayerTurn = 1;

let wounds = 0;
let damage = 0;
let effort = 0;
let accel = 0;

let damageMax = 0;

// ======================================
// SHOW SCREEN
// ======================================

function showScreen(screen) {
  [screen1, screen2, screen3, screenLevel, screen4].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

// ======================================
// MUSIC CONTROL
// ======================================

let musicPlaying = false;

function startMusic() {
  bgMusic.volume = parseFloat(volumeControl.value);

  bgMusic.play().then(() => {
    musicPlaying = true;
    musicToggleBtn.textContent = "🔊";
  }).catch(() => {
    musicPlaying = false;
    musicToggleBtn.textContent = "🔇";
  });
}

musicToggleBtn.addEventListener("click", () => {
  if (!musicPlaying) {
    startMusic();
  } else {
    bgMusic.pause();
    musicPlaying = false;
    musicToggleBtn.textContent = "🔇";
  }
});

volumeControl.addEventListener("input", () => {
  bgMusic.volume = parseFloat(volumeControl.value);
});

// ======================================
// OVERLAY MESSAGE FUNCTION
// ======================================

function showOverlayMessage(message, duration = 15000) {
  overlayText.textContent = message;
  overlayMessage.classList.remove("hidden");

  setTimeout(() => {
    overlayMessage.classList.add("hidden");
  }, duration);
}

// ======================================
// SELECTION HANDLERS
// ======================================

function setupRadioSelection(name, callback) {
  const radios = document.querySelectorAll(`input[name="${name}"]`);

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      callback(radio.value);
    });
  });
}

setupRadioSelection("players", (val) => {
  selectedPlayers = val;
});

setupRadioSelection("monster", (val) => {
  selectedMonster = val;
});

setupRadioSelection("monsterLevel", (val) => {
  selectedLevel = val;
});

// ======================================
// PHASE DATA
// ======================================

const phases = [
  { title: "1. INICIO DE LA RONDA", text: "Inicio de la ronda...\n(Remover Confusión)\n\nDetonar habilidades AL COMIENZO DE LA RONDA." },
  { title: "2. CONSUMIR", text: "Cada jugador puede consumir una poción y removerla del juego." },
  { title: "3. MANTENIMIENTO DEL MONSTRUO", text: "Refrescar comportamiento.\n+1 Esfuerzo por jugador.\n+1 Esfuerzo por aceleración." },
  { title: "4. TURNO DEL JUGADOR", text: "El jugador con AGRESIVIDAD va primero.\nChequeos del jugador y efectos del monstruo." },
  { title: "5. FASE DE MOVIMIENTO", text: "Moverse cuesta resistencia.\nSi no te mueves, obtienes AMENAZADO." },
  { title: "6. FASE DE ACCIÓN", text: "Puedes jugar hasta 5 cartas.\nAcciones, asistencia, agresividad, etc." },
  { title: "7. FASE DE DESGASTE", text: "Roba cartas de desgaste.\nSi no tienes suficientes defensas, sufres daño." },
  { title: "8. FIN DEL TURNO DEL JUGADOR", text: "Descarta secuencia.\nRellena mano.\nChequeo de efectos." },
  { title: "9. FIN DE LA RONDA", text: "Resolver habilidades AL FINAL DE LA RONDA.\nAvanzar marcador." }
];

// ======================================
// UPDATE UI SCREEN4
// ======================================

function updateRoundUI() {
  roundCounter.textContent = `${currentRound} / 10`;
}

function updatePlayerTurnUI() {
  playerTurnCounter.textContent = `${currentPlayerTurn} / ${totalPlayers}`;
}

function updatePhaseUI() {
  phaseTitle.textContent = phases[currentPhaseIndex].title;
  phaseText.textContent = phases[currentPhaseIndex].text;
}

function updateCountersUI() {
  woundsCounter.textContent = wounds;
  damageCounter.textContent = damage;
  effortCounter.textContent = effort;
  accelCounter.textContent = accel;

  damageMaxEl.textContent = damageMax;
}

// ======================================
// DAMAGE MAX LOGIC (VYRAXEN)
// ======================================

function calculateDamageMax() {
  if (!selectedMonster || !selectedLevel) return 0;

  if (selectedMonster !== "VYRAXEN") {
    return 10 * totalPlayers;
  }

  const lvl = parseInt(selectedLevel);

  const table = {
    0: [2, 3, 4],
    1: [5, 7, 10],
    2: [10, 15, 20],
    3: [18, 24, 30]
  };

  const posture = getMonsterPosture();
  const multiplier = table[lvl][posture - 1];

  return multiplier * totalPlayers;
}

function getMonsterPosture() {
  if (wounds < 3) return 1;
  if (wounds < 7) return 2;
  return 3;
}

// ======================================
// POSTURE EVENTS / MESSAGES
// ======================================

function checkMonsterPostureMessages() {
  if (selectedMonster !== "VYRAXEN") return;

  if (wounds === 3) {
    showOverlayMessage("CAMBIO DE POSTURA en el monstruo, prepárense...");
  }

  if (wounds === 7) {
    showOverlayMessage("CAMBIO DE POSTURA en el monstruo, prepárense… Se ve encabronado!!");
  }

  if (wounds === 10) {
    showOverlayMessage("Felicidades han vencido a su presa, Cazadores. Ahora merecen un pequeño descanso...");
  }
}

// ======================================
// COUNTER BUTTONS
// ======================================

btnDmgPlus.addEventListener("click", () => {
  damage++;

  if (damage >= damageMax) {
    damage = 0;
    wounds++;
    if (wounds > 10) wounds = 10;

    checkMonsterPostureMessages();
    damageMax = calculateDamageMax();
  }

  updateCountersUI();
});

btnDmgMinus.addEventListener("click", () => {
  damage--;
  if (damage < 0) damage = 0;
  updateCountersUI();
});

btnEffPlus.addEventListener("click", () => {
  effort++;
  if (effort > 10) effort = 10;
  updateCountersUI();
});

btnEffMinus.addEventListener("click", () => {
  effort--;
  if (effort < 0) effort = 0;
  updateCountersUI();
});

btnAccPlus.addEventListener("click", () => {
  accel++;
  if (accel > 10) accel = 10;
  updateCountersUI();
});

btnAccMinus.addEventListener("click", () => {
  accel--;
  if (accel < 0) accel = 0;
  updateCountersUI();
});

// ======================================
// PHASE NAVIGATION
// ======================================

function updatePlayerTurnFromPhase() {
  // fases 0-2 son inicio global
  if (currentPhaseIndex <= 2) {
    currentPlayerTurn = 1;
    return;
  }

  // fases 3-7 son turno jugador, movimiento, acción, desgaste, fin turno
  if (currentPhaseIndex >= 3 && currentPhaseIndex <= 7) {
    currentPlayerTurn = 1;
    return;
  }

  if (currentPhaseIndex === 8) {
    currentPlayerTurn = totalPlayers;
  }
}

btnNextPhase.addEventListener("click", () => {
  currentPhaseIndex++;

  if (currentPhaseIndex >= phases.length) {
    currentPhaseIndex = 0;
    currentRound++;
    if (currentRound > 10) currentRound = 10;
  }

  updatePlayerTurnFromPhase();
  updateRoundUI();
  updatePlayerTurnUI();
  updatePhaseUI();
});

btnPrevPhase.addEventListener("click", () => {
  currentPhaseIndex--;
  if (currentPhaseIndex < 0) currentPhaseIndex = 0;

  updatePlayerTurnFromPhase();
  updatePlayerTurnUI();
  updatePhaseUI();
});

btnReset.addEventListener("click", () => {
  currentRound = 1;
  currentPhaseIndex = 0;
  currentPlayerTurn = 1;

  wounds = 0;
  damage = 0;
  effort = 0;
  accel = 0;

  damageMax = calculateDamageMax();

  updateRoundUI();
  updatePlayerTurnUI();
  updatePhaseUI();
  updateCountersUI();
});

// ======================================
// FLOW BUTTONS (SCREEN 1 -> 4)
// ======================================

btnEnter.addEventListener("click", () => {
  startMusic();
  showScreen(screen2);
});

btnBackTo1.addEventListener("click", () => {
  selectedPlayers = null;
  showScreen(screen1);
});

btnPlayersNext.addEventListener("click", () => {
  if (!selectedPlayers) {
    alert("Debes seleccionar número de jugadores.");
    return;
  }

  totalPlayers = parseInt(selectedPlayers);
  showScreen(screen3);
});

btnBackTo2.addEventListener("click", () => {
  selectedMonster = null;
  showScreen(screen2);
});

btnMonsterNext.addEventListener("click", () => {
  if (!selectedMonster) {
    alert("Debes seleccionar un monstruo.");
    return;
  }

  showScreen(screenLevel);
});

btnBackTo3.addEventListener("click", () => {
  selectedLevel = null;
  showScreen(screen3);
});

btnLevelNext.addEventListener("click", () => {
  if (selectedLevel === null) {
    alert("Debes seleccionar un nivel.");
    return;
  }

  // iniciar tracker
  currentRound = 1;
  currentPhaseIndex = 0;
  currentPlayerTurn = 1;

  wounds = 0;
  damage = 0;
  effort = 0;
  accel = 0;

  damageMax = calculateDamageMax();

  updateRoundUI();
  updatePlayerTurnUI();
  updatePhaseUI();
  updateCountersUI();

  showScreen(screen4);
});

// ======================================
// INIT
// ======================================

showScreen(screen1);
musicToggleBtn.textContent = "🔇";
updatePhaseUI();
updateRoundUI();
updatePlayerTurnUI();
updateCountersUI();
