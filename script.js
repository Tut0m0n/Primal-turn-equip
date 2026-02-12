// ======================================
// PRIMAL - Orden de Turno Companion
// ======================================

// SCREENS
const screenHome = document.getElementById("screen-home");
const screenPlayers = document.getElementById("screen-players");
const screenMonster = document.getElementById("screen-monster");
const screenTracker = document.getElementById("screen-tracker");

// BUTTONS
const enterBtn = document.getElementById("enterBtn");

const cancelPlayersBtn = document.getElementById("cancelPlayersBtn");
const nextPlayersBtn = document.getElementById("nextPlayersBtn");

const cancelMonsterBtn = document.getElementById("cancelMonsterBtn");
const nextMonsterBtn = document.getElementById("nextMonsterBtn");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");

// MUSIC
const bgMusic = document.getElementById("bgMusic");
const musicToggleBtn = document.getElementById("musicToggleBtn");
const volumeSlider = document.getElementById("volumeSlider");

// TRACKER ELEMENTS
const phaseList = document.getElementById("phaseList");
const currentPhaseTitle = document.getElementById("currentPhaseTitle");
const currentPhaseContent = document.getElementById("currentPhaseContent");
const roundNumber = document.getElementById("roundNumber");
const phaseBox = document.getElementById("phaseBox");

// COUNTERS
const woundsValue = document.getElementById("woundsValue");
const damageValue = document.getElementById("damageValue");
const effortValue = document.getElementById("effortValue");
const accelValue = document.getElementById("accelValue");

const damageMinus = document.getElementById("damageMinus");
const damagePlus = document.getElementById("damagePlus");

const effortMinus = document.getElementById("effortMinus");
const effortPlus = document.getElementById("effortPlus");

const accelMinus = document.getElementById("accelMinus");
const accelPlus = document.getElementById("accelPlus");

const effortWarning = document.getElementById("effortWarning");

// PLAYER / MONSTER OPTIONS
const playersOptions = document.getElementById("playersOptions");
const monsterOptions = document.getElementById("monsterOptions");

// APP STATE
let selectedPlayers = null;
let selectedMonster = null;

let currentPhaseIndex = 0;
let currentRound = 1;

let wounds = 0;
let damage = 0;
let effort = 0;
let accel = 0;

// ======================================
// DATA - ORDEN DE TURNO
// ======================================

const phases = [
  {
    title: "1. Inicio de la ronda",
    content: `
(Remover Confusión)

- Detonar: habilidades de AL COMIENZO DE LA RONDA
   - Chequeo de POSTURA del Monstruo
   - Chequeo PELIGROS por efectos de la POSTURA del monstruo
- Chequeo habilidades del Cazador
- Chequeo de habilidades de Objetivos
- Remover ficha de CONFUSION
`.trim()
  },
  {
    title: "2. Consumir",
    content: `
- Cada jugador puede usar una habilidad de CONSUMIR una POCION y removerla del juego (regresa al jugador si falla el escenario)
`.trim()
  },
  {
    title: "3. Mantenimiento del monstruo",
    content: `
- Se refrescan las cartas de COMPORTAMIENTO del monstruo, descarta el número más bajo de comportamiento. Si hay empate, se cambian las iguales.
- +1 ESFUERZO por jugador.
- +1 ESFUERZO por aceleración
`.trim()
  },
  {
    title: "4. Turno del jugador",
    content: `
Recordatorio: el jugador con la ficha de AGRESIVIDAD va primero y gana la ficha de Primer Jugador al comenzar la nueva ronda.

Noqueado: Si el jugador esta NOQUEADO, con la ficha en rojo, salta su turno y da vuelta la ficha. 
Si la ficha es de color blanco, LEVANTATE, remueve la ficha, roba tu mano (5 maximo), y coloca nuevamente la miniatura del jugador en pie.

- Salir de la Meseta (Terreno)
- Chequeo del COMPORTAMIENTO del monstruo por sus efectos
- Termino de CAPTURA, si el jugador estaba capturado.
- Chequeo de los objetivos del monstruo por efectos
- Chequeo de las cartas del jugador por efectos (equipamiento, cartas de acción, maestría que aparezca “AL COMIENZO DEL TURNO”)
- Chequeo del terreno o plantas del sector por efectos.

Si hay una BAETHANIS (planta) en tu sector, cura 1 de daño a tu personaje por NIVEL DE ARMA.
Si hay una SYNAEREA (planta) en tu sector, puedes sufrir 1 de daño por NIVEL DE ARMA para robar una carta de tu mazo.

- Remover CEGUERA
`.trim()
  },
  {
    title: "5. Fase de movimiento",
    content: `
- El jugador puede gastar 1 de RESISTENCIA (generada por cartas o fichas de resistencia) para moverse 1 sector, si esto pasa, remueve AMENAZADO.
- El jugador debe gastar 2 de RESISTENCIA para moverse 1 sector si es Arena (Terreno).
- Si el jugador no se mueve, el jugador gana la ficha AMENAZADO.
- Chequeo del comportamiento del monstruo por efectos

- Escóndete en un arbusto:
  Si el arbusto es verde, puedes gastar una carta (verde) para esconderte dentro del arbusto, coloca la miniatura de tu personaje sobre la ficha del arbusto, luego pausa tu turno y selecciona a un jugador que no haya jugado su turno.
  Al terminar el turno de este jugador, dejaras el arbusto y retomaras tu turno.
  Mientras estes oculto no puedes ASISTIR ni ATRAER al monstruo.

  Si el arbusto es rojo, puedes RECICLAR una carta de AGRESIVIDAD, para poder realizar lo mismo que el arbusto verde.

  Si te mueves a un sector con NIEBLA, obtienes la ficha de AMENAZADO.
`.trim()
  },
  {
    title: "6. Fase de acción",
    content: `
Recordatorio: La máxima cantidad de cartas de acción a jugar es 5 (salvo que alguna habilidad o carta diga lo contrario).
La máxima cantidad de cartas de acción que puedas jugar en el AGUA es 3.

Los jugadores no pueden jugar cartas cuando están sobre FUEGO (Terreno)
Los jugadores deben gastar +1 RESISTENCIA al utilizar cartas de esquiva (verdes) cuando estan sobre PANTANO (terreno). Se repite segun la cantidad de cartas jueguen.
Los jugadores deben gastar +1 RESISTENCIA al utilizar cartas de ofensiva (simbolo ataque) cuando estan en ESPINOS (planta). Se repite segun la cantidad de cartas jueguen.

Puedes LEVANTAR a uno de tus aliados NOQUEADOS gastando 2 RESISTENCIAS, si realizas esta accion da vuelta la ficha de NOQUEADO.
Puedes recibir ASISTENCIA de otro jugador inactivo, una ves por jugador.

Puedes quemar cartas para obtener RESISTENCIA y bajar cartas a tu zona de secuencia con un maximo de 5, salvo que otra fuente diga lo contrario.
Recuerda que al quemar la carta o las cartas la RESISTENCIA no se acumula para la siguiente carta, salvo las fichas de RESISTENCIA.

Cuando juegues una carta con AGRESIVIDAD, obtienes la ficha de AGRESIVIDAD.
No puedes empezar a utilizar una carta de ATAQUE (roja) si estas en una zona protegida del monstruo (zona negra).

Detona COLOR:HABILIDAD y otras habilidades de Cazadores/Objetivos/Terrenos.

Si hay una CYRICAE (planta) en tu sector, cuando juegues una carta de ATAQUE (roja) en tu secuencia, el efecto del ataque gana BONUS DE DAÑO igual a tu NIVEL DE ARMA. Es una ves por carta jugada.

Si ocurre un efecto de el AGUA SE ESPARCE, cuando debes colocar una ficha de agua en una zona que ya esta con agua, debes de colocar una ficha agua a cada sector adyacente.

Chequeo del COMPORTAMIENTO del monstruo por efectos; segun cartas o efectos que se hayan jugado.

Obtienes +1 ficha de RESISTENCIA, si 2 o más cartas se mantienen en tu mano al final de la FASE DE ACCION.
`.trim()
  },
  {
    title: "7. Fase de Desgaste",
    content: `
Detonar y resolver habilidades de COMIENZO FASE DE DESGASTE (cartas de PELIGRO y ficha de POLVO)

Si hay POLVO en tu sector (maximo 2), toma 1 ficha de INTERRUPCION (simbolo defensa tachado) y colocalas en distintas cartas DEFENSIVAS de tu sequencia.
Esas cartas no cuentan para el chequeo de DESGASTE.

Roba 1 carta de Desgaste (2 si estás AMENAZADO).
Si tienes la igual o mayor cantidad de cartas DEFENSIVAS (simbolo defensa), sumando o restando fichas de DEFENZA/INTERRUPCION, no sufres daño por Desgaste este turno.
Si fuese lo contrario, sumando o restando fichas de DEFENZA/INTERRUPCION, sufririas el daño del monstruo + sus bonificaciones, en caso de tener.

Luego descarta las cartas de Desgaste.

Puedes remover una ROCA (Terreno) para prevenir el daño de Desgaste, si lo haces descarta la ficha de ROCA (terreno).

- Detonar: habilidades de TERMINO FASE DESGASTE, resuelve los comportamientos del monstruo.
- Remueve las fichas de DEFENZA/INTERRUPCION.
`.trim()
  },
  {
    title: "8. Fin del turno del jugador",
    content: `
- Descarta la secuencia jugada, desde la carta más vieja a la ultima jugada, dejando arriba del cementerio la más nueva.
- Rellena tu mano: roba/descarta hasta tener tu tamaño, por defecto el tamaño de la mano es 5, a no ser que alguna carta o efecto diga lo contrario.

Las fichas de TENSION (rectangulo con un -1 al interior) pueden afectar el tamaño de tu mano de juego disminuyendola.

- El MONSTRUO se gira al jugador que tenga la ficha de AGRESIVIDAD
- Chequeo de efectos del COMPORTAMIENTO del monstruo.
- Detonar: habilidades de FINAL DEL TURNO DEL JUGADOR, segun ACTUALIZACION RAPIDA/Cazador/Terreno/LENTITUD (ficha de pierna monstruo).

- Chequeo para los efectos de PLANTA/TERRENO en el sector.

Si hay una ficha de MESETA (terreno) en tu sector y no hay otro jugador arriba de esta, puedes colocar a tu personaje arriba de esta.
Cuando una carta de COMPORTAMIENTO es revelada, puedes colocar la miniatura de tu cazador sobre esta y realizar lo siguiente:
Cancelar el efecto de la carta de COMPORTAMIENTO y luego, realizar un chequeo de MONTAR.

El chequeo de montar se realiza descartando la primara carta de DESGASTE y se compara con la primera carta de tu mazo.
Si la RESISTENCIA de la carta de tu mazo es MENOR a el valor de la carta de DESGASTE, sufre daño del monstruo y coloca a tu personaje en el sector FRONTAL del monstruo.
Si es MAYOR o IGUAL, genera la cantidad de daño de tu arma y coloca al personaje en cualquier sector.

Si hay una ficha de PLANTA DE FAUCES SILVESTRE (planta) en tu sector y tienes el estado AMENAZADO, sufres 1 de daño por NIVEL DE ARMA.
Si hay HIELO (terreno) en tu sector y tienes el estado AMENAZADO, debes de EXILIAR la primera carta de tu mazo en tu zona de cartas exiliadas.

- Si todos los jugadores ya realizaron su turno, termina la ronda, sino debes de pasar al siguiente jugador.
`.trim()
  },
  {
    title: "9. Fin de la ronda",
    content: `
- Detonar: habilidades de AL FINAL DE LA RONDA, resolviendo primero los PELIGROS, COMPORTAMIENTO, cartas de Cazador, girar la ficha de FUEGO (terreno), remover todas las fichas de POLVO, eliminar fichas de VULNERABILIDAD y ATONTADO.
- Avanza el Marcador de Turno
`.trim()
  }
];

// ======================================
// SCREEN HANDLING
// ======================================

function showScreen(screen) {
  [screenHome, screenPlayers, screenMonster, screenTracker].forEach(s => {
    s.classList.remove("active");
  });

  screen.classList.add("active");
}

// ======================================
// MUSIC HANDLING
// ======================================

let musicPlaying = false;

function startMusic() {
  bgMusic.volume = 0.5;
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

volumeSlider.addEventListener("input", () => {
  bgMusic.volume = volumeSlider.value;
});

// ======================================
// OPTION SELECTORS
// ======================================

function setupOptionSelection(container, callback) {
  const items = container.querySelectorAll(".option-box");

  items.forEach(item => {
    item.addEventListener("click", () => {
      items.forEach(i => i.classList.remove("selected"));
      item.classList.add("selected");
      callback(item.dataset.value);
    });
  });
}

setupOptionSelection(playersOptions, (val) => {
  selectedPlayers = val;
});

setupOptionSelection(monsterOptions, (val) => {
  selectedMonster = val;
});

// ======================================
// TRACKER UI
// ======================================

function renderPhaseList() {
  phaseList.innerHTML = "";

  phases.forEach((phase, index) => {
    const div = document.createElement("div");
    div.classList.add("phase-item");
    div.textContent = phase.title;

    if (index === currentPhaseIndex) {
      div.classList.add("active");
    }

    phaseList.appendChild(div);
  });
}

function updatePhaseDisplay() {
  const phase = phases[currentPhaseIndex];

  currentPhaseTitle.textContent = phase.title;
  currentPhaseContent.textContent = phase.content;

  renderPhaseList();

  // animación suave cada cambio
  phaseBox.classList.remove("fade-slide");
  void phaseBox.offsetWidth;
  phaseBox.classList.add("fade-slide");
}

// ======================================
// ROUND LOGIC
// ======================================

function updateRoundDisplay() {
  roundNumber.textContent = currentRound;
}

function resetTracker() {
  currentPhaseIndex = 0;
  currentRound = 1;
  updateRoundDisplay();
  updatePhaseDisplay();
}

// ======================================
// COUNTERS LOGIC
// ======================================

function updateCounters() {
  woundsValue.textContent = wounds;
  damageValue.textContent = damage;
  effortValue.textContent = effort;
  accelValue.textContent = accel;

  if (effort >= 10) {
    effortWarning.textContent = "DESATADO!! Genera el daño del monstruo a todos los jugadores!!";
  } else {
    effortWarning.textContent = "";
  }
}

damagePlus.addEventListener("click", () => {
  damage++;
  if (damage >= 10) {
    damage = 0;
    wounds++;
    if (wounds > 10) wounds = 10;
  }
  updateCounters();
});

damageMinus.addEventListener("click", () => {
  damage--;
  if (damage < 0) damage = 0;
  updateCounters();
});

effortPlus.addEventListener("click", () => {
  effort++;
  if (effort > 10) effort = 10;
  updateCounters();
});

effortMinus.addEventListener("click", () => {
  effort--;
  if (effort < 0) effort = 0;
  updateCounters();
});

accelPlus.addEventListener("click", () => {
  accel++;
  if (accel > 10) accel = 10;
  updateCounters();
});

accelMinus.addEventListener("click", () => {
  accel--;
  if (accel < 0) accel = 0;
  updateCounters();
});

// ======================================
// BUTTON EVENTS
// ======================================

enterBtn.addEventListener("click", () => {
  startMusic();
  showScreen(screenPlayers);
});

cancelPlayersBtn.addEventListener("click", () => {
  selectedPlayers = null;
  showScreen(screenHome);
});

nextPlayersBtn.addEventListener("click", () => {
  if (!selectedPlayers) {
    alert("Debes seleccionar una opción de jugadores.");
    return;
  }

  // SOLO o 2 significan 2 jugadores mínimo
  if (selectedPlayers === "SOLO") {
    selectedPlayers = "2";
  }

  showScreen(screenMonster);
});

cancelMonsterBtn.addEventListener("click", () => {
  selectedMonster = null;
  showScreen(screenPlayers);
});

nextMonsterBtn.addEventListener("click", () => {
  if (!selectedMonster) {
    alert("Debes seleccionar un monstruo.");
    return;
  }

  showScreen(screenTracker);

  resetTracker();
  updateCounters();
});

// TRACKER NAV
nextBtn.addEventListener("click", () => {
  currentPhaseIndex++;

  if (currentPhaseIndex >= phases.length) {
    currentPhaseIndex = 0;
    currentRound++;

    if (currentRound > 10) {
      currentRound = 10;
    }
  }

  updateRoundDisplay();
  updatePhaseDisplay();
});

prevBtn.addEventListener("click", () => {
  currentPhaseIndex--;

  if (currentPhaseIndex < 0) {
    currentPhaseIndex = 0;
  }

  updatePhaseDisplay();
});

resetBtn.addEventListener("click", () => {
  resetTracker();
});

// ======================================
// INIT
// ======================================

showScreen(screenHome);
updateCounters();
