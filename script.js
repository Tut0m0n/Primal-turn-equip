// ======================================
// PRIMAL - Companion (FIXED VERSION)
// Compatible con tu HTML actual
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

const btnPrevPhase = document.getElementById("btnPrevPhase");
const btnNextPhase = document.getElementById("btnNextPhase");
const btnReset = document.getElementById("btnReset");

// AUDIO
const bgMusic = document.getElementById("bgMusic");
const musicToggleBtn = document.getElementById("musicToggleBtn");
const volumeControl = document.getElementById("volumeControl");

// SELECTIONS
const playersSelection = document.getElementById("playersSelection");
const monsterSelection = document.getElementById("monsterSelection");
const levelSelection = document.getElementById("levelSelection");

// TRACKER ELEMENTS
const roundCounter = document.getElementById("roundCounter");
const playerTurnCounter = document.getElementById("playerTurnCounter");
const turnList = document.getElementById("turnList");

const phaseTitle = document.getElementById("phaseTitle");
const phaseText = document.getElementById("phaseText");

const woundsCounter = document.getElementById("woundsCounter");
const damageCounter = document.getElementById("damageCounter");
const effortCounter = document.getElementById("effortCounter");
const accelCounter = document.getElementById("accelCounter");

const damageMaxSpan = document.getElementById("damageMax");

const btnDmgMinus = document.getElementById("btnDmgMinus");
const btnDmgPlus = document.getElementById("btnDmgPlus");

const btnEffMinus = document.getElementById("btnEffMinus");
const btnEffPlus = document.getElementById("btnEffPlus");

const btnAccMinus = document.getElementById("btnAccMinus");
const btnAccPlus = document.getElementById("btnAccPlus");

// APP STATE
let selectedPlayers = null;
let selectedMonster = null;
let selectedMonsterLevel = null;

let totalPlayers = 2;
let currentPlayer = 1;

let currentRound = 1;
let currentPhaseIndex = 0;

let wounds = 0;
let damage = 0;
let effort = 0;
let accel = 0;

let damageMax = 10;

let musicPlaying = false;

// ======================================
// SCREEN CONTROL
// ======================================

function showScreen(screenToShow) {
  [screen1, screen2, screen3, screenLevel, screen4].forEach(s => {
    s.classList.remove("active");
  });

  screenToShow.classList.add("active");
}

// ======================================
// MUSIC CONTROL
// ======================================

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
// FORMAT TEXT
// ======================================

function formatText(content) {
  let formatted = content;

  formatted = formatted.replace(/Recordatorio:(.*)/gi, `<span class="reminder">Recordatorio:$1</span>`);
  formatted = formatted.replace(/\b[A-ZÁÉÍÓÚÑÜ0-9]{2,}\b/g, (match) => `<strong>${match}</strong>`);
  formatted = formatted.replace(/\n/g, "<br>");

  return formatted;
}

// ======================================
// PHASES DATA
// ======================================

const phasesContent = {
  "1. Inicio de la ronda": `
(Remover Confusión)

- Detonar: habilidades de AL COMIENZO DE LA RONDA
   - Chequeo de POSTURA del Monstruo
   - Chequeo PELIGROS por efectos de la POSTURA del monstruo
- Chequeo habilidades del Cazador
- Chequeo de habilidades de Objetivos
- Remover ficha de CONFUSION
`.trim(),

  "2. Consumir": `
- Cada jugador puede usar una habilidad de CONSUMIR una POCION y removerla del juego (regresa al jugador si falla el escenario)
`.trim(),

  "3. Mantenimiento del monstruo": `
- Se refrescan las cartas de COMPORTAMIENTO del monstruo, descarta el número más bajo de comportamiento. Si hay empate, se cambian las iguales.
- +1 ESFUERZO por jugador.
- +1 ESFUERZO por aceleración
`.trim(),

  "4. Turno del jugador": `
Recordatorio: el jugador con la ficha de AGRESIVIDAD va primero y gana la ficha de Primer Jugador al comenzar la nueva ronda.

Noqueado: Si el jugador esta NOQUEADO, con la ficha en rojo, salta su turno y da vuelta la ficha. 
Si la ficha es de color blanco, LEVANTATE, remueve la ficha, roba tu mano (5 maximo), y coloca nuevamente la miniatura del jugador en pie. 

- Salir de la Meseta (Terreno)
- Chequeo del COMPORTAMIENTO del monstruo por sus efectos
- Termino de CAPTURA, si el jugador estaba capturado.
- Chequeo de los objetivos del monstruo por efectos
- Chequeo de las cartas del jugador por efectos  (equipamiento, cartas de acción, maestría que aparezca “AL COMIENZO DEL TURNO”)
- Chequeo del terreno o plantas del sector por efectos.

Si hay una BAETHANIS (planta) en tu sector, cura 1 de daño a tu personaje por NIVEL DE ARMA.
Si hay una SYNAEREA (planta) en tu sector, puedes sufrir 1 de daño por NIVEL DE ARMA para robar una carta de tu mazo.

- Remover CEGUERA
`.trim(),

  "5. Fase de movimiento": `
- El jugador puede gastar 1 de RESISTENCIA (generada por cartas o fichas de resistencia) para moverse 1 sector, si esto pasa, remueve AMENAZADO. 
El jugador debe gastar 2 de RESISTENCIA para moverse 1 sector si es Arena (Terreno). 
Si el jugador no se mueve, el jugador gana la ficha AMENAZADO.

- Chequeo del comportamiento del monstruo por efectos

- Escóndete en un arbusto; 
Si el arbusto es verde, puedes gastar una carta (verde) para esconderte dentro del arbusto, coloca la miniatura de tu personaje sobre la ficha del arbusto, luego pausa tu turno y selecciona a un jugador que no haya jugado su turno, al terminar el turno de este jugador, dejaras el arbusto y retomaras tu turno. Mientras estes oculto no puedes ASISTIR ni ATRAER al monstruo. 

Si el arbusto es rojo, puedes RECICLAR una carta de AGRESIVIDAD, para poder realizar lo mismo que el arbusto verde.

Si te mueves a un sector con NIEBLA, obtienes la ficha de AMENAZADO.
`.trim(),

  "6. Fase de acción": `
Recordatorio: La máxima cantidad de cartas de acción a jugar es 5 (salvo que alguna habilidad o carta diga lo contrario). La máxima cantidad de cartas de acción que puedas jugar en el AGUA es 3.

Los jugadores no pueden jugar cartas cuando están sobre FUEGO (Terreno)
Los jugadores deben gastar +1 RESISTENCIA al utilizar cartas de esquiva (verdes) cuando estan sobre PANTANO (terreno). Se repite segun la cantidad de cartas jueguen.
Los jugadores deben gastar +1 RESISTENCIA al utilizar cartas de ofensiva (simbolo ataque) cuando estan en ESPINOS (planta). Se repite segun la cantidad de cartas jueguen.

Puedes LEVANTAR a uno de tus aliados NOQUEADOS gastando 2 RESISTENCIAS, si realizas esta accion da vuelta la ficha de NOQUEADO.
Puedes recibir ASISTENCIA de otro jugador inactivo, una ves por jugador.
Puedes quemar cartas para obtener RESISTENCIA y bajar cartas a tu zona de secuencia con un maximo de 5, salvo que otra fuente diga lo contrario. Recuerda que al quemar la carta o las cartas la RESISTENCIA no se acumula para la siguiente carta, salvo las fichas de RESISTENCIA.

Cuando juegues una carta con AGRESIVIDAD, obtienes la ficha de AGRESIVIDAD.
No puedes empezar a utilizar una carta de ATAQUE (roja) si estas en una zona protegida del monstruo (zona negra).
Detona COLOR:HABILIDAD y otras habilidades de Cazadores/Objetivos/Terrenos.

Si hay una CYRICAE (planta) en tu sector, cuando juegues una carta de ATAQUE (roja) en tu secuencia, el efecto del ataque gana BONUS DE DAÑO igual a tu NIVEL DE ARMA. Es una ves por carta jugada.

Si ocurre un efecto de el AGUA SE ESPARCE, cuando debes colocar una ficha de agua en una zona que ya esta con agua, debes de colocar una ficha agua a cada sector adyacente.   

Chequeo del COMPORTAMIENTO del monstruo por efectos; segun cartas o efectos que se hayan jugado.
Obtienes +1 ficha de RESISTENCIA, si 2 o más cartas se mantienen en tu mano al final de la FASE DE ACCION.
`.trim(),

  "7. Fase de Desgaste": `
Detonar y resolver habilidades de COMIENZO FASE DE DESGASTE (cartas de PELIGRO y ficha de POLVO)

Si hay POLVO en tu sector (maximo 2), toma 1 ficha de INTERRUPCION (simbolo defensa tachado) y colocalas en distintas cartas DEFENSIVAS de tu sequencia. Esas cartas no cuentan para el chequeo de DESGASTE.

Roba 1 carta de Desgaste (2 si estás AMENAZADO). 
Si tienes la igual o mayor cantidad de cartas DEFENSIVAS (simbolo defensa), sumando o restando fichas de DEFENZA/INTERRUPCION, no sufres daño por Desgaste este turno. 
Si fuese lo contrario, sumando o restando fichas de DEFENZA/INTERRUPCION, sufririas el daño del monstruo + sus bonificaciones, en caso de tener.

Luego descarta las cartas de Desgaste.

Puedes remover una ROCA (Terreno) para prevenir el daño de Desgaste, si lo haces descarta la ficha de ROCA (terreno).

- Detonar: habilidades de TERMINO FASE DESGASTE, resuelve los comportamientos del monstruo.
- Remueve las fichas de DEFENZA/INTERRUPCION.
`.trim(),

  "8. Fin del turno del jugador": `
- Descarta la secuencia jugada, desde la carta más vieja a la ultima jugada, dejando arriba del cementerio la más nueva.
- Rellena tu mano: roba/descarta hasta tener tu tamaño, por defecto el tamaño de la mano es 5, a no ser que alguna carta o efecto diga lo contrario.

Las fichas de TENSION (rectangulo con un -1 al interior) pueden afectar el tamaño de tu mano de juego disminuyendola.

- El MONSTRUO se gira al jugador que tenga la ficha de AGRESIVIDAD
- Chequeo de efectos del COMPORTAMIENTO del monstruo.
- Detonar: habilidades de FINAL DEL TURNO DEL JUGADOR, segun ACTUALIZACION RAPIDA/Cazador/Terreno/LENTITUD (ficha de pierna monstruo).

- Chequeo para los efectos de PLANTA/TERRENO en el sector. 

Si hay una ficha de MESETA (terreno) en tu sector y no hay otro jugador arriba de esta, puedes colocar a tu personaje arriba de esta. Cuando una carta de COMPORTAMIENTO es revelada, puedes colocar la miniatura de tu cazador sobre esta y realizar lo siguiente: Cancelar el efecto de la carta de COMPORTAMIENTO y luego, realizar un chequeo de MONTAR.

El chequeo de montar se realiza descartando la primara carta de DESGASTE y se compara con la primera carta de tu mazo. 
Si la RESISTENCIA de la carta de tu mazo es MENOR a el valor de la carta de DESGASTE, sufre daño del monstruo y coloca a tu personaje en el sector FRONTAL del monstruo. 
Si es MAYOR o IGUAL, genera la cantidad de daño de tu arma y coloca al personaje en cualquier sector.

Si hay una ficha de PLANTA DE FAUCES SILVESTRE (planta) en tu sector y tienes el estado AMENAZADO, sufres 1 de daño por NIVEL DE ARMA.
Si hay HIELO (terreno) en tu sector y tienes el estado AMENAZADO, debes de EXILIAR la primera carta de tu mazo en tu zona de cartas exiliadas.

- Si todos los jugadores ya realizaron su turno, termina la ronda, sino debes de pasar al siguiente jugador.
`.trim(),

  "9. Fin de la ronda": `
- Detonar: habilidades de AL FINAL DE LA RONDA, resolviendo primero los PELIGROS, COMPORTAMIENTO, cartas de Cazador, girar la ficha de FUEGO (terreno), remover todas las fichas de POLVO, eliminar fichas de VULNERABILIDAD y ATONTADO. 
- Avanza el Marcador de Turno
`.trim()
};

// ======================================
// FLOW BASE
// ======================================

const baseFlow = [
  "1. Inicio de la ronda",
  "2. Consumir",
  "3. Mantenimiento del monstruo",
  "4. Turno del jugador",
  "5. Fase de movimiento",
  "6. Fase de acción",
  "7. Fase de Desgaste",
  "8. Fin del turno del jugador",
  "9. Fin de la ronda"
];

let runtimeFlow = [];

// ======================================
// BUILD FLOW BY PLAYERS
// ======================================

function buildRuntimeFlow(playersCount) {
  runtimeFlow = [];

  runtimeFlow.push(baseFlow[0]);
  runtimeFlow.push(baseFlow[1]);
  runtimeFlow.push(baseFlow[2]);

  for (let i = 1; i <= playersCount; i++) {
    runtimeFlow.push("4. Turno del jugador");
    runtimeFlow.push("5. Fase de movimiento");
    runtimeFlow.push("6. Fase de acción");
    runtimeFlow.push("7. Fase de Desgaste");
    runtimeFlow.push("8. Fin del turno del jugador");
  }

  runtimeFlow.push(baseFlow[8]);
}

// ======================================
// UPDATE UI
// ======================================

function updateRoundUI() {
  roundCounter.textContent = `${currentRound} / 10`;
}

function updatePlayerUI() {
  playerTurnCounter.textContent = `${currentPlayer} / ${totalPlayers}`;
}

function updateTurnListUI() {
  turnList.innerHTML = "";

  baseFlow.forEach((phase) => {
    const div = document.createElement("div");
    div.classList.add("turn-item");
    div.textContent = phase;

    if (phase === runtimeFlow[currentPhaseIndex]) {
      div.classList.add("active");
    }

    turnList.appendChild(div);
  });
}

function updatePhaseUI() {
  const phaseName = runtimeFlow[currentPhaseIndex];

  phaseTitle.textContent = phaseName.toUpperCase();
  phaseText.innerHTML = formatText(phasesContent[phaseName]);

  updateTurnListUI();
}

function updateCountersUI() {
  woundsCounter.textContent = wounds;
  damageCounter.textContent = damage;
  effortCounter.textContent = effort;
  accelCounter.textContent = accel;

  damageMaxSpan.textContent = damageMax;
}

// ======================================
// PLAYER CALCULATION
// ======================================

function updateCurrentPlayerFromPhase() {
  if (currentPhaseIndex <= 2) {
    currentPlayer = 1;
    return;
  }

  const relativeIndex = currentPhaseIndex - 3;
  const blockSize = 5;

  if (relativeIndex >= 0) {
    currentPlayer = Math.floor(relativeIndex / blockSize) + 1;
    if (currentPlayer > totalPlayers) currentPlayer = totalPlayers;
  }
}

// ======================================
// RESET TRACKER
// ======================================

function resetTracker() {
  currentRound = 1;
  currentPhaseIndex = 0;
  currentPlayer = 1;

  wounds = 0;
  damage = 0;
  effort = 0;
  accel = 0;

  updateRoundUI();
  updatePlayerUI();
  updatePhaseUI();
  updateCountersUI();
}

// ======================================
// DAMAGE MAX (por nivel monstruo)
// ======================================

function updateDamageMax() {
  if (selectedMonsterLevel === null) {
    damageMax = 10;
  } else {
    const lvl = parseInt(selectedMonsterLevel);

    // puedes ajustar estos valores a tu gusto
    if (lvl === 0) damageMax = 10;
    if (lvl === 1) damageMax = 12;
    if (lvl === 2) damageMax = 14;
    if (lvl === 3) damageMax = 16;
  }

  updateCountersUI();
}

// ======================================
// RADIO SELECTION HANDLING
// ======================================

function getSelectedRadioValue(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : null;
}

// ======================================
// BUTTON EVENTS - FLOW SCREENS
// ======================================

btnEnter.addEventListener("click", () => {
  startMusic();
  showScreen(screen2);
});

btnBackTo1.addEventListener("click", () => {
  showScreen(screen1);
});

btnPlayersNext.addEventListener("click", () => {
  selectedPlayers = getSelectedRadioValue("players");

  if (!selectedPlayers) {
    alert("Debes seleccionar número de jugadores.");
    return;
  }

  totalPlayers = parseInt(selectedPlayers);

  showScreen(screen3);
});

btnBackTo2.addEventListener("click", () => {
  showScreen(screen2);
});

btnMonsterNext.addEventListener("click", () => {
  selectedMonster = getSelectedRadioValue("monster");

  if (!selectedMonster) {
    alert("Debes seleccionar un monstruo.");
    return;
  }

  showScreen(screenLevel);
});

btnBackTo3.addEventListener("click", () => {
  showScreen(screen3);
});

btnLevelNext.addEventListener("click", () => {
  selectedMonsterLevel = getSelectedRadioValue("monsterLevel");

  if (selectedMonsterLevel === null) {
    alert("Debes seleccionar un nivel.");
    return;
  }

  buildRuntimeFlow(totalPlayers);
  updateDamageMax();

  showScreen(screen4);

  resetTracker();
});

// ======================================
// NAVIGATION PHASES
// ======================================

btnNextPhase.addEventListener("click", () => {
  currentPhaseIndex++;

  if (currentPhaseIndex >= runtimeFlow.length) {
    currentPhaseIndex = 0;
    currentRound++;

    if (currentRound > 10) currentRound = 10;
  }

  updateCurrentPlayerFromPhase();
  updateRoundUI();
  updatePlayerUI();
  updatePhaseUI();
});

btnPrevPhase.addEventListener("click", () => {
  currentPhaseIndex--;

  if (currentPhaseIndex < 0) {
    currentPhaseIndex = 0;
  }

  updateCurrentPlayerFromPhase();
  updatePlayerUI();
  updatePhaseUI();
});

// ======================================
// RESET BUTTON
// ======================================

btnReset.addEventListener("click", () => {
  if (confirm("¿Seguro que quieres reiniciar todo?")) {
    resetTracker();
  }
});

// ======================================
// COUNTER BUTTONS
// ======================================

btnDmgPlus.addEventListener("click", () => {
  damage++;

  if (damage >= damageMax) {
    damage = 0;
    wounds++;
    if (wounds > 10) wounds = 10;
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
// INIT
// ======================================
 
showScreen(screen1);
updateCountersUI();
