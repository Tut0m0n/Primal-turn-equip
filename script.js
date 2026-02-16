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

// ✅ CAMBIO: override manual para fases especiales
let manualPostureOverride = false;

// ===============================
// DAMAGE TABLES
// ===============================

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
  0: { 1: 2, 2: 3, 3: 3 },
  1: { 1: 4, 2: 7, 3: 8 },
  2: { 1: 10, 2: 16, 3: 18 },
  3: { 1: 15, 2: 24, 3: 28 }
};

// Jekoros multipliers per posture depending on level
const JEKOROS_DAMAGE_TABLE = {
  0: { 1: 2, 2: 4, 3: 5 },
  1: { 1: 7, 2: 8, 3: 12 },
  2: { 1: 12, 2: 17, 3: 22 },
  3: { 1: 20, 2: 25, 3: 30 }
};

// Zekath multipliers per posture depending on level
const ZEKATH_DAMAGE_TABLE = {
  0: { 1: 2, 2: 3, 3: 3 },
  1: { 1: 4, 2: 7, 3: 8 },
  2: { 1: 10, 2: 16, 3: 18 },
  3: { 1: 15, 2: 24, 3: 28 }
};

// Xitheros multipliers per posture depending on level
const XITHEROS_DAMAGE_TABLE = {
  0: { 1: 3, 2: 4, 3: 5 },
  1: { 1: 7, 2: 8, 3: 12 },
  2: { 1: 15, 2: 20, 3: 25 },
  3: { 1: 20, 2: 25, 3: 35 }
};

// Tarragua multipliers per posture depending on level
const TARRAGUA_DAMAGE_TABLE = {
  0: { 1: 2, 2: 3, 3: 4 },
  1: { 1: 6, 2: 7, 3: 8 },
  2: { 1: 10, 2: 14, 3: 18 },
  3: { 1: 16, 2: 18, 3: 22 }
};

// Hurom multipliers per posture depending on level
const HUROM_DAMAGE_TABLE = {
  0: { 1: 2, 2: 3, 3: 3 },
  1: { 1: 4, 2: 6, 3: 7 },
  2: { 1: 9, 2: 14, 3: 17 },
  3: { 1: 15, 2: 20, 3: 25 }
};

// Sirkajj multipliers per posture depending on level
const SIRKAJJ_DAMAGE_TABLE = {
  0: { 1: 2, 2: 3, 3: 3 },
  1: { 1: 5, 2: 6, 3: 9 },
  2: { 1: 13, 2: 16, 3: 20 },
  3: { 1: 22, 2: 25, 3: 28 }
};

// Mamuraak multipliers per posture depending on level
const MAMURAAK_DAMAGE_TABLE = {
  0: { 1: 3, 2: 4, 3: 5 },
  1: { 1: 6, 2: 8, 3: 10 },
  2: { 1: 12, 2: 18, 3: 20 },
  3: { 1: 20, 2: 25, 3: 30 }
};

// Kharja multipliers per posture depending on level
const KHARJA_DAMAGE_TABLE = {
  0: { 1: 2, 2: 3, 3: 5 },
  1: { 1: 5, 2: 7, 3: 12 },
  2: { 1: 10, 2: 16, 3: 20 },
  3: { 1: 15, 2: 25, 3: 30 }
};

// Taraska multipliers per posture depending on level
const TARASKA_DAMAGE_TABLE = {
  0: { 1: 5, 2: 3, 3: 3 },
  1: { 1: 9, 2: 8, 3: 7 },
  2: { 1: 20, 2: 16, 3: 14 },
  3: { 1: 28, 2: 25, 3: 22 }
};

// Pazis multipliers per posture depending on level
const PAZIS_DAMAGE_TABLE = {
  0: { 1: 2, 2: 2, 3: 3 },
  1: { 1: 4, 2: 5, 3: 7 },
  2: { 1: 10, 2: 13, 3: 17 },
  3: { 1: 18, 2: 20, 3: 25 }
};

// Nagarjas multipliers per posture depending on level
const NAGARJAS_DAMAGE_TABLE = {
  0: { 1: 4, 2: 4, 3: 5 },
  1: { 1: 5, 2: 6, 3: 7 },
  2: { 1: 11, 2: 15, 3: 16 },
  3: { 1: 18, 2: 22, 3: 28 }
};

// Reikal multipliers per posture depending on level
const REIKAL_DAMAGE_TABLE = {
  0: { 1: 2, 2: 3, 3: 5 },
  1: { 1: 6, 2: 8, 3: 10 },
  2: { 1: 12, 2: 16, 3: 20 },
  3: { 1: 18, 2: 22, 3: 30 }
};

// Hydar multipliers per posture depending on level
const HYDAR_DAMAGE_TABLE = {
  0: { 1: 2, 2: 3, 3: 3 },
  1: { 1: 4, 2: 6, 3: 8 },
  2: { 1: 12, 2: 15, 3: 18 },
  3: { 1: 18, 2: 22, 3: 28 }
};

// ===============================
// Reglas Fase Monstruos (BASE)
// ===============================
const MONSTER_PHASE_RULES = {
  VYRAXEN: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  OZEW: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  KOROWON: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  XITHEROS: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  JEKOROS: {
    0: { woundMessages: [], phaseChanges: { 2: 999, 3: 999 } },
    1: { woundMessages: [], phaseChanges: { 2: 999, 3: 999 } },
    2: { woundMessages: [], phaseChanges: { 2: 999, 3: 999 } },
    3: { woundMessages: [], phaseChanges: { 2: 999, 3: 999 } }
  },

  TORAMAT: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  DYGORAX: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  OROUXEN: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  REIKAL: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  NAGARJAS: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  FELAXIR: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  HUROM: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  SIRKAAJ: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  ZEKATH: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  ZEKALITH: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  HYDAR: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  PAZIS: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  TARASKA: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  KHARJA: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  MORKRAAS: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  TARRAGUA: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  },

  MAMURAAK: {
    0: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    1: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    2: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } },
    3: { woundMessages: [3, 7], phaseChanges: { 2: 3, 3: 7 } }
  }
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
const monsterPhaseCounter = document.getElementById("monsterPhaseCounter");
const damageCounter = document.getElementById("damageCounter");
const damageMax = document.getElementById("damageMax");
const effortCounter = document.getElementById("effortCounter");
const accelCounter = document.getElementById("accelCounter");
const woundMessage = document.getElementById("woundMessage");
const effortWarning = document.getElementById("effortWarning");

// BOTÓN ESPECIAL
const btnChangePhase = document.getElementById("btnChangePhase");

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

function createOption(container, text, value, onSelect, className = "option-compact", iconPath = null) {
  const option = document.createElement("div");
  option.className = className;
  option.dataset.value = value;

  // LEFT (icon + name)
  const left = document.createElement("div");
  left.className = "option-left";

  if (iconPath) {
    const icon = document.createElement("img");
    icon.src = iconPath;
    icon.className = "monster-icon";
    icon.alt = text;

    // Si el icono no carga, no rompe nada
    icon.onerror = () => {
      icon.style.display = "none";
    };

    left.appendChild(icon);
  }

  const label = document.createElement("span");
  label.textContent = text;
  left.appendChild(label);

  // Checkbox
  const checkbox = document.createElement("div");
  checkbox.className = "checkbox";

  option.appendChild(left);
  option.appendChild(checkbox);

  option.addEventListener("click", () => {
    [...container.children].forEach(child => child.classList.remove("selected"));
    option.classList.add("selected");
    onSelect(value);
  });

  container.appendChild(option);
}

function getMonsterDamageTable() {
  switch (selectedMonster) {
    case "VYRAXEN": return VYRAXEN_DAMAGE_TABLE;
    case "OZEW": return OZEW_DAMAGE_TABLE;
    case "TORAMAT": return TORAMAT_DAMAGE_TABLE;
    case "DYGORAX": return DYGORAX_DAMAGE_TABLE;
    case "OROUXEN": return OROUXEN_DAMAGE_TABLE;
    case "KOROWON": return KOROWON_DAMAGE_TABLE;
    case "MORKRAAS": return MORKRASS_DAMAGE_TABLE;
    case "FELAXIR": return FELAXIR_DAMAGE_TABLE;
    case "ZEKALITH": return ZEKALITH_DAMAGE_TABLE;
    case "JEKOROS": return JEKOROS_DAMAGE_TABLE;
    case "ZEKATH": return ZEKATH_DAMAGE_TABLE;
    case "XITHEROS": return XITHEROS_DAMAGE_TABLE;
    case "TARRAGUA": return TARRAGUA_DAMAGE_TABLE;
    case "HUROM": return HUROM_DAMAGE_TABLE;
    case "SIRKAAJ": return SIRKAJJ_DAMAGE_TABLE;
    case "MAMURAAK": return MAMURAAK_DAMAGE_TABLE;
    case "KHARJA": return KHARJA_DAMAGE_TABLE;
    case "TARASKA": return TARASKA_DAMAGE_TABLE;
    case "PAZIS": return PAZIS_DAMAGE_TABLE;
    case "NAGARJAS": return NAGARJAS_DAMAGE_TABLE;
    case "REIKAL": return REIKAL_DAMAGE_TABLE;
    case "HYDAR": return HYDAR_DAMAGE_TABLE;
    default: return null;
  }
}

// ===============================
// ESPECIALES (NUEVO SISTEMA)
// ===============================
function isKorowonPhase2() {
  return selectedMonster === "KOROWON" && posture === 2;
}

function shouldShowChangePhaseButton() {
  if (!selectedMonster) return false;

  // JEKOROS siempre puede cambiar manualmente
  if (selectedMonster === "JEKOROS") return true;

  // KOROWON solo necesita botón en fase 2 para pasar a fase 3
  if (selectedMonster === "KOROWON" && posture === 2) return true;

  return false;
}

function getMaxDamage() {
  if (!selectedPlayers || selectedLevel === null || !selectedMonster) return 10;

  // Korowon en fase 2 NO recibe daño
  if (isKorowonPhase2()) return 0;

  const table = getMonsterDamageTable();
  if (!table) return 10;

  const multiplier = table[selectedLevel][posture];
  return multiplier * selectedPlayers;
}

function updateMonsterPosture() {
  const monsterRules = MONSTER_PHASE_RULES[selectedMonster];
  if (!monsterRules || selectedLevel === null) return;

  const rulesByLevel = monsterRules[selectedLevel];
  if (!rulesByLevel) return;

  const changes = rulesByLevel.phaseChanges;

  if (wounds >= changes[3]) posture = 3;
  else if (wounds >= changes[2]) posture = 2;
  else posture = 1;
}

function updateTrackerUI() {

  // ✅ CAMBIO: si JEKOROS o KOROWON usaron botón manual, no recalcular postura automáticamente
  if (!(manualPostureOverride && (selectedMonster === "JEKOROS" || selectedMonster === "KOROWON"))) {
    updateMonsterPosture();
  }

  roundCounter.textContent = round;
  playerTurnCounter.textContent = `Turno Jugador 1 / ${selectedPlayers}`;

  woundsCounter.textContent = wounds;
  monsterPhaseCounter.textContent = posture;

  // Mostrar siempre el daño
  damageCounter.style.display = "inline-block";
  damageMax.style.display = "inline-block";

  // Botón especial según regla correcta
  if (shouldShowChangePhaseButton()) {
    btnChangePhase.style.display = "inline-block";
  } else {
    btnChangePhase.style.display = "none";
  }

  // Korowon fase 2: mostrar 0/0 y bloquear daño
  if (isKorowonPhase2()) {
    damageCounter.textContent = 0;
    damageMax.textContent = 0;
  } else {
    const maxDamage = getMaxDamage();
    damageCounter.textContent = damage;
    damageMax.textContent = maxDamage;
  }

  effortCounter.textContent = effort;
  accelCounter.textContent = accel;

  updateWoundMessage();
  updateEffortWarning();
}

function updateWoundMessage() {
  woundMessage.textContent = "";
  woundMessage.style.color = "#000";

  if (wounds >= 10) {
    woundMessage.textContent =
      `Felicidades han vencido a su presa, un ${selectedMonster}. Muy bien Cazadores. Ahora merecen un pequeño descanso...`;
    woundMessage.style.color = "#0b3dff";
    return;
  }

  const monsterRules = MONSTER_PHASE_RULES[selectedMonster];
  if (!monsterRules || selectedLevel === null) {
    if (wounds === 3 || wounds === 7) {
      woundMessage.textContent = `⚠️ CAMBIO DE POSTURA de ${selectedMonster}, prepárense... ⚠️`;
      woundMessage.style.color = "#c40000";
    }
    return;
  }

  const rulesByLevel = monsterRules[selectedLevel];
  if (!rulesByLevel) return;

  if (rulesByLevel.woundMessages.includes(wounds)) {
    woundMessage.textContent = `⚠️ CAMBIO DE POSTURA de ${selectedMonster} ⚠️`;
    woundMessage.style.color = "#c40000";
  }
}

function updateEffortWarning() {
  if (effort >= 10) {
    effortWarning.textContent = `⚠️ ${selectedMonster} esta DESATADO!! ⚠️ Genera el daño del monstruo a todos los jugadores!! `;
    effortWarning.style.color = "#c40000";
  } else {
    effortWarning.textContent = "";
  }
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
    content:
`(Remover Confusión)
- Chequeo de Postura del Monstruo
- Chequeo de Postura del Monstruo y Peligros por efectos
- Efectos de inicio de ronda`
  },
  {
    title: "2. Consumir",
    content:
`- Cada jugador puede usar una habilidad de consumo`
  },
  {
    title: "3. Mantenimiento del monstruo",
    content:
`- Se refrescan las cartas de COMPORTAMIENTO del monstruo, descarta el número más bajo de comportamiento.
  Si hay un empate, se cambian las iguales.
- +1 Esfuerzo por jugador
- +1 Esfuerzo por aceleración`
  },
  {
    title: "4. Turno del jugador",
    content:
`(Remover Ceguera)

Recordatorio: el jugador con la ficha de AMENAZA va primero y gana la ficha de Primer Jugador al comenzar la nueva ronda.

Noqueado:
Si el jugador está NOQUEADO, con la ficha en rojo, salta su turno y da vuelta la ficha.
Si la ficha es de color blanco, LEVÁNTATE, remueve la ficha, roba tu mano (5 máximo), y coloca nuevamente la miniatura del jugador en pie.

- Chequeo del COMPORTAMIENTO del monstruo por sus efectos
- Chequeo de los objetivos del monstruo por efectos
- Chequeo de las cartas del jugador por efectos
  (equipamiento, cartas de acción, maestría)
- Después de otros detonantes: comienzan los efectos de inicio del turno del jugador
- Chequeo del terreno o plantas del sector por efectos
- Salir de la Meseta (Terreno)`
  },
  {
    title: "5. Fase de movimiento",
    content:
`- El jugador puede gastar 1 de Resistencia para moverse 1 sector
  (Si esto pasa, remueve Atado)
- El jugador debe gastar 2 de Resistencia para moverse 1 sector si es Arena (Terreno)
- Si el jugador no se mueve, el jugador gana la ficha Atado
- Chequeo del comportamiento del monstruo por efectos
- Escóndete en un arbusto
  (Rellenar después según el tipo de arbusto)`
  },
  {
    title: "6. Fase de acción",
    content:
`- La máxima cantidad de cartas de acción a jugar es 5
  (salvo que alguna habilidad o carta diga lo contrario)
- La máxima cantidad de cartas de acción que puedas jugar en el Agua es 3
- Los jugadores no pueden jugar cartas cuando están sobre Fuego (Terreno)
- Chequeo del comportamiento del monstruo por efectos
- +1 ficha de Resistencia si 2 o más cartas se mantienen en tu mano al final de la fase de acción`
  },
  {
    title: "7. Fase de Desgaste",
    content:
`- Roba 1 carta de Desgaste (2 si estás AMENAZADO)
- Puedes remover una ROCA (Terreno) para prevenir el daño de Desgaste
- Chequeo de efectos del comportamiento del monstruo
- Después de otros detonantes: Termina la fase de efectos de Desgaste
  (Fin de los efectos de la fase de Desgaste)`
  },
  {
    title: "8. Fin del turno del jugador",
    content:
`- Descarta la secuencia jugada
  (desde la carta más vieja a la nueva jugada, dejando arriba la más nueva)
- Rellena tu mano: roba/descarta hasta tener tu tamaño
  (por defecto el tamaño de la mano es 5, a no ser que alguna carta o efecto diga lo contrario)
- El MONSTRUO gira al jugador que tenga la AMENAZA
- Chequeo de efectos del comportamiento del monstruo
- Después de otros detonantes: Termina el turno de efectos del jugador
  (Fin de los efectos del turno del jugador)
- Chequeo para los efectos de PLANTA/TERRENO en el sector
- Subirse a una MESETA`
  },
  {
    title: "9. Fin de la ronda",
    content:
`- Chequeo de Postura, Peligro y efectos de comportamiento del monstruo
- Avanza el Marcador de Turno
- Después de otras detonaciones: Terminan los efectos de fin de ronda
  (Fin de los efectos de la ronda)`
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

  phases.forEach((phase) => {
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

  const monsters = [
    "VYRAXEN", "KOROWON", "OZEW", "HYDAR", "PAZIS", "TARASKA",
    "KHARJA", "OROUXEN", "JEKOROS", "REIKAL", "NAGARJAS", "XITHEROS",
    "TORAMAT", "FELAXIR", "HUROM", "SIRKAAJ", "ZEKATH", "DYGORAX",
    "MORKRAAS", "TARRAGUA", "MAMURAAK", "ZEKALITH"
  ];

  monsters.forEach(monster => {
    createOption(
      monsterOptions,
      monster,
      monster,
      (val) => { selectedMonster = val; },
      "monster-option",
      `assets/images/${monster.toLowerCase()}.svg`
    );
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
  currentPhaseIndex = 0;

  // ✅ CAMBIO: reset override manual
  manualPostureOverride = false;

  updateTrackerUI();
});

// ===============================
// BOTÓN ESPECIAL: CAMBIAR DE FASE
// ===============================
btnChangePhase.addEventListener("click", () => {

  // JEKOROS: siempre puede cambiar fase manualmente
  if (selectedMonster === "JEKOROS") {
    manualPostureOverride = true; // ✅ CAMBIO
    if (posture < 3) {
      posture++;
      updateTrackerUI();
    }
    return;
  }

  // KOROWON: solo puede cambiar de fase si está en postura 2
  if (selectedMonster === "KOROWON") {
    if (posture === 2) {
      manualPostureOverride = true; // ✅ CAMBIO
      posture = 3;
      damage = 0;
      updateTrackerUI();
    }
    return;
  }

});

// Damage control
btnDamageDown.addEventListener("click", () => {

  // Korowon fase 2: no recibe daño
  if (isKorowonPhase2()) {
    updateTrackerUI();
    return;
  }

  damage = clamp(damage - 1, 0, getMaxDamage());
  updateTrackerUI();
});

btnDamageUp.addEventListener("click", () => {

  // Korowon fase 2: no recibe daño
  if (isKorowonPhase2()) {
    updateTrackerUI();
    return;
  }

  // JEKOROS: daño infinito pero NO cambia fase con +
  if (selectedMonster === "JEKOROS") {
    damage = clamp(damage + 1, 0, 999);
    updateTrackerUI();
    return;
  }

  // XITHEROS: daño infinito
  if (selectedMonster === "XITHEROS") {
    damage = clamp(damage + 1, 0, 999);
    updateTrackerUI();
    return;
  }

  // KOROWON (fase 1 y 3): daño normal
  const maxDmg = getMaxDamage();

  damage = clamp(damage + 1, 0, maxDmg);

  if (damage >= maxDmg) {
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

  // ✅ CAMBIO: reset override manual
  manualPostureOverride = false;

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
