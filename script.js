/* ===========================
   VARIABLES DE ESTADO GLOBAL
=========================== */
let selectedPlayers = 2;
let selectedMonster = "Vyraxen";

let currentRound = 1;
let currentPhaseIndex = 0;
let currentPlayerTurn = 1;

let woundCount = 0;
let damageCount = 0;
let effortCount = 0;
let accelCount = 0;

/* ===========================
   FASES (ESTÁTICAS)
=========================== */
const phases = [
  {
    title: "1. INICIO DE LA RONDA",
    content: `
(Remover Confusión)

-Detonar: habilidades de AL COMIENZO DE LA RONDA
   - Chequeo de POSTURA del Monstruo
   - Chequeo PELIGROS por efectos de la POSTURA del monstruo
-Chequeo habilidades del Cazador
-Chequeo de habilidades de Objetivos
- Remover ficha de CONFUSION
`
  },
  {
    title: "2. CONSUMIR",
    content: `
- Cada jugador puede usar una habilidad de CONSUMIR una POCION y removerla del juego (regresa al jugador si falla el escenario)
`
  },
  {
    title: "3. MANTENIMIENTO DEL MONSTRUO",
    content: `
- Se refrescan las cartas de COMPORTAMIENTO del monstruo, descarta el número más bajo de comportamiento. Si hay empate, se cambian las iguales.
- +1 ESFUERZO por jugador.
- +1 ESFUERZO por aceleración
`
  },
  {
    title: "4. TURNO DEL JUGADOR",
    content: `
Recordatorio: el jugador con la ficha de AGRESIVIDAD va primero y gana la ficha de Primer Jugador al comenzar la nueva ronda.

Noqueado: Si el jugador esta NOQUEADO, con la ficha en rojo, salta su turno y da vuelta la ficha. Si la ficha es de color blanco, LEVANTATE, remueve la ficha, roba tu mano (5 maximo), y coloca nuevamente la miniatura del jugador en pie.

- Salir de la Meseta (Terreno)
- Chequeo del COMPORTAMIENTO del monstruo por sus efectos
- Termino de CAPTURA, si el jugador estaba capturado.
- Chequeo de los objetivos del monstruo por efectos
- Chequeo de las cartas del jugador por efectos (equipamiento, cartas de acción, maestría que aparezca “AL COMIENZO DEL TURNO”)
- Chequeo del terreno o plantas del sector por efectos.

Si hay una BAETHANIS (planta) en tu sector, cura 1 de daño a tu personaje por NIVEL DE ARMA.
Si hay una SYNAEREA (planta) en tu sector, puedes sufrir 1 de daño por NIVEL DE ARMA para robar una carta de tu mazo.

- Remover CEGUERA
`
  },
  {
    title: "5. FASE DE MOVIMIENTO",
    content: `
- El jugador puede gastar 1 de RESISTENCIA (generada por cartas o fichas de resistencia) para moverse 1 sector, si esto pasa, remueve AMENAZADO.

El jugador debe gastar 2 de RESISTENCIA para moverse 1 sector si es Arena (Terreno).

Si el jugador no se mueve, el jugador gana la ficha AMENAZADO.

- Chequeo del comportamiento del monstruo por efectos

- Escóndete en un arbusto:
Si el arbusto es verde, puedes gastar una carta (verde) para esconderte dentro del arbusto, coloca la miniatura de tu personaje sobre la ficha del arbusto, luego pausa tu turno y selecciona a un jugador que no haya jugado su turno, al terminar el turno de este jugador, dejaras el arbusto y retomaras tu turno. Mientras estes oculto no puedes ASISTIR ni ATRAER al monstruo.

Si el arbusto es rojo, puedes RECICLAR una carta de AGRESIVIDAD, para poder realizar lo mismo que el arbusto verde.

Si te mueves a un sector con NIEBLA, obtienes la ficha de AMENAZADO.
`
  },
  {
    title: "6. FASE DE ACCIÓN",
    content: `
Recordatorio: La máxima cantidad de cartas de acción a jugar es 5 (salvo que alguna habilidad o carta diga lo contrario). La máxima cantidad de cartas de acción que puedas jugar en el AGUA es 3.

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
`
  },
  {
    title: "7. FASE DE DESGASTE",
    content: `
Detonar y resolver habilidades de COMIENZO FASE DE DESGASTE (cartas de PELIGRO y ficha de POLVO)

Si hay POLVO en tu sector (maximo 2), toma 1 ficha de INTERRUPCION (simbolo defensa tachado) y colocalas en distintas cartas DEFENSIVAS de tu sequencia. Esas cartas no cuentan para el chequeo de DESGASTE.

Roba 1 carta de Desgaste (2 si estás AMENAZADO).

Si tienes la igual o mayor cantidad de cartas DEFENSIVAS (simbolo defensa), sumando o restando fichas de DEFENZA/INTERRUPCION, no sufres daño por Desgaste este turno.

Si fuese lo contrario, sumando o restando fichas de DEFENZA/INTERRUPCION, sufririas el daño del monstruo + sus bonificaciones, en caso de tener.

Luego descarta las cartas de Desgaste.

Puedes remover una ROCA (Terreno) para prevenir el daño de Desgaste, si lo haces descarta la ficha de ROCA (terreno).

- Detonar: habilidades de TERMINO FASE DESGASTE, resuelve los comportamientos del monstruo.
- Remueve las fichas de DEFENZA/INTERRUPCION.
`
  },
  {
    title: "8. FIN DEL TURNO DEL JUGADOR",
    content: `
- Descarta la secuencia jugada, desde la carta más vieja a la ultima jugada, dejando arriba del cementerio la más nueva.

- Rellena tu mano: roba/descarta hasta tener tu tamaño, por defecto el tamaño de la mano es 5, a no ser que alguna carta o efecto diga lo contrario.

Las fichas de TENSION (rectangulo con un -1 al interior) pueden afectar el tamaño de tu mano de juego disminuyendola.

- El MONSTRUO se gira al jugador que tenga la ficha de AGRESIVIDAD
- Chequeo de efectos del COMPORTAMIENTO del monstruo.
- Detonar: habilidades de FINAL DEL TURNO DEL JUGADOR, segun ACTUALIZACION RAPIDA/Cazador/Terreno/LENTITUD (ficha de pierna monstruo).

- Chequeo para los efectos de PLANTA/TERRENO en el sector.

Si hay una ficha de MESETA (terreno) en tu sector y no hay otro jugador arriba de esta, puedes colocar a tu personaje arriba de esta.

Cuando una carta de COMPORTAMIENTO es revelada, puedes colocar la miniatura de tu cazador sobre esta y realizar lo siguiente: Cancelar el efecto de la carta de COMPORTAMIENTO y luego, realizar un chequeo de MONTAR.

El chequeo de montar se realiza descartando la primara carta de DESGASTE y se compara con la primera carta de tu mazo.

Si la RESISTENCIA de la carta de tu mazo es MENOR a el valor de la carta de DESGASTE, sufre daño del monstruo y coloca a tu personaje en el sector FRONTAL del monstruo.

Si es MAYOR o IGUAL, genera la cantidad de daño de tu arma y coloca al personaje en cualquier sector.

Si hay una ficha de PLANTA DE FAUCES SILVESTRE (planta) en tu sector y tienes el estado AMENAZADO, sufres 1 de daño por NIVEL DE ARMA.

Si hay HIELO (terreno) en tu sector y tienes el estado AMENAZADO, debes de EXILIAR la primera carta de tu mazo en tu zona de cartas exiliadas.

-Si todos los jugadores ya realizaron su turno, termina la ronda, sino debes de pasar al siguiente jugador.
`
  },
  {
    title: "9. FIN DE LA RONDA",
    content: `
- Detonar: habilidades de AL FINAL DE LA RONDA, resolviendo primero los PELIGROS, COMPORTAMIENTO, cartas de Cazador, girar la ficha de FUEGO (terreno), remover todas las fichas de POLVO, eliminar fichas de VULNERABILIDAD y ATONTADO.

- Avanza el Marcador de Turno
`
  }
];


/* ===========================
   FUNCIONES AUXILIARES
=========================== */
function boldUppercaseWords(text) {
  return text.replace(/\b[A-ZÁÉÍÓÚÑÜ0-9]{2,}\b/g, (match) => `<b>${match}</b>`);
}

function highlightRecordatorio(text) {
  return text.replace(/Recordatorio:/g, `<span style="color:red; font-weight:bold;">Recordatorio:</span>`);
}

function formatContent(text) {
  let formatted = text;
  formatted = highlightRecordatorio(formatted);
  formatted = boldUppercaseWords(formatted);
  return formatted;
}


/* ===========================
   REFERENCIAS DOM
=========================== */
const screenEntry = document.getElementById("screen-entry");
const screenPlayers = document.getElementById("screen-players");
const screenMonster = document.getElementById("screen-monster");
const screenMain = document.getElementById("screen-main");

const btnEnter = document.getElementById("btnEnter");

const btnCancelPlayers = document.getElementById("btnCancelPlayers");
const btnNextPlayers = document.getElementById("btnNextPlayers");

const btnCancelMonster = document.getElementById("btnCancelMonster");
const btnNextMonster = document.getElementById("btnNextMonster");

const phaseList = document.getElementById("phaseList");
const phaseTitle = document.getElementById("phaseTitle");
const phaseContent = document.getElementById("phaseContent");
const phaseCard = document.getElementById("phaseCard");

const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnReset = document.getElementById("btnReset");

const roundDisplay = document.getElementById("roundDisplay");
const playerTurnDisplay = document.getElementById("playerTurnDisplay");

const woundDisplay = document.getElementById("woundDisplay");
const damageDisplay = document.getElementById("damageDisplay");
const effortDisplay = document.getElementById("effortDisplay");
const accelDisplay = document.getElementById("accelDisplay");

const damageMinus = document.getElementById("damageMinus");
const damagePlus = document.getElementById("damagePlus");

const effortMinus = document.getElementById("effortMinus");
const effortPlus = document.getElementById("effortPlus");

const accelMinus = document.getElementById("accelMinus");
const accelPlus = document.getElementById("accelPlus");

const unleashedWarning = document.getElementById("unleashedWarning");

/* MODAL RESET */
const resetModal = document.getElementById("resetModal");
const confirmResetYes = document.getElementById("confirmResetYes");
const confirmResetNo = document.getElementById("confirmResetNo");

/* AUDIO */
const bgMusic = document.getElementById("bgMusic");
const btnMute = document.getElementById("btnMute");
const volumeSlider = document.getElementById("volumeSlider");

let isMuted = false;


/* ===========================
   CAMBIO DE PANTALLAS
=========================== */
function showScreen(screenToShow) {
  [screenEntry, screenPlayers, screenMonster, screenMain].forEach(s => s.classList.remove("active"));
  screenToShow.classList.add("active");
}


/* ===========================
   LISTA IZQUIERDA DE FASES
=========================== */
function renderPhaseList() {
  phaseList.innerHTML = "";

  phases.forEach((phase, index) => {
    const div = document.createElement("div");
    div.classList.add("phase-item");

    if (index === currentPhaseIndex) {
      div.classList.add("active");
    }

    div.textContent = phase.title.charAt(0) + phase.title.slice(1).toLowerCase();

    div.addEventListener("click", () => {
      currentPhaseIndex = index;
      updateUI(true);
    });

    phaseList.appendChild(div);
  });
}


/* ===========================
   LOGICA TURNO JUGADOR
=========================== */
function updatePlayerTurnLogic() {
  // Fases 4,5,6,7,8 pertenecen al turno jugador.
  const playerTurnPhases = [3, 4, 5, 6, 7];

  if (currentPhaseIndex === 3) {
    // al entrar a fase turno jugador, mantiene el contador actual
  }

  // cuando se pasa de fase 8 a fase 9, significa que terminó el turno del jugador
  if (currentPhaseIndex === 8) {
    // nada aún
  }
}


/* ===========================
   ACTUALIZAR UI
=========================== */
function updateUI(animated = false) {
  roundDisplay.textContent = `${currentRound} / 10`;
  playerTurnDisplay.textContent = `${currentPlayerTurn} / ${selectedPlayers}`;

  if (animated) {
    phaseCard.classList.add("fade-out");

    setTimeout(() => {
      phaseTitle.textContent = phases[currentPhaseIndex].title;
      phaseContent.innerHTML = formatContent(phases[currentPhaseIndex].content);

      renderPhaseList();

      phaseCard.classList.remove("fade-out");
      phaseCard.classList.add("fade-in");

      setTimeout(() => {
        phaseCard.classList.remove("fade-in");
      }, 250);

    }, 180);

  } else {
    phaseTitle.textContent = phases[currentPhaseIndex].title;
    phaseContent.innerHTML = formatContent(phases[currentPhaseIndex].content);
    renderPhaseList();
  }

  woundDisplay.textContent = `${woundCount} / 10`;
  damageDisplay.textContent = `${damageCount} / 10`;
  effortDisplay.textContent = `${effortCount} / 10`;
  accelDisplay.textContent = `${accelCount} / 10`;

  if (effortCount >= 10) {
    unleashedWarning.classList.remove("hidden");
  } else {
    unleashedWarning.classList.add("hidden");
  }
}


/* ===========================
   BOTONES SIGUIENTE / ATRÁS
=========================== */
function goNextPhase() {
  // si estamos en fase 9 (fin ronda) y avanzamos, sube ronda
  if (currentPhaseIndex === phases.length - 1) {
    if (currentRound < 10) {
      currentRound++;
    }
    currentPhaseIndex = 0;
    currentPlayerTurn = 1;
    updateUI(true);
    return;
  }

  // lógica: si estamos en fase 8 (fin turno jugador) avanzamos -> fase 9
  if (currentPhaseIndex === 7) {
    currentPhaseIndex++;
    updateUI(true);
    return;
  }

  // si estamos en fase 4-8 y avanzamos, sigue normal
  currentPhaseIndex++;

  // si se terminó la fase 8, significa terminó turno de un jugador
  if (currentPhaseIndex === 8) {
    // al entrar a fase 9 aún no cambia jugador
  }

  updateUI(true);

  // cuando pasamos desde fase 8 a fase 9, al siguiente avance debe cambiar jugador
  if (currentPhaseIndex === 8) {
    // nada aquí
  }
}

function goPrevPhase() {
  if (currentPhaseIndex === 0) {
    return;
  }
  currentPhaseIndex--;
  updateUI(true);
}


/* ===========================
   RESET
=========================== */
function resetAll() {
  currentRound = 1;
  currentPhaseIndex = 0;
  currentPlayerTurn = 1;

  woundCount = 0;
  damageCount = 0;
  effortCount = 0;
  accelCount = 0;

  updateUI(true);
}


/* ===========================
   CONTADORES DERECHA
=========================== */
damagePlus.addEventListener("click", () => {
  damageCount++;
  if (damageCount >= 10) {
    damageCount = 0;
    woundCount++;
    if (woundCount > 10) woundCount = 10;
  }
  updateUI();
});

damageMinus.addEventListener("click", () => {
  if (damageCount > 0) damageCount--;
  updateUI();
});

effortPlus.addEventListener("click", () => {
  if (effortCount < 10) effortCount++;
  updateUI();
});

effortMinus.addEventListener("click", () => {
  if (effortCount > 0) effortCount--;
  updateUI();
});

accelPlus.addEventListener("click", () => {
  if (accelCount < 10) accelCount++;
  updateUI();
});

accelMinus.addEventListener("click", () => {
  if (accelCount > 0) accelCount--;
  updateUI();
});


/* ===========================
   AUDIO
=========================== */
btnMute.addEventListener("click", () => {
  isMuted = !isMuted;
  bgMusic.muted = isMuted;
  btnMute.textContent = isMuted ? "🔇" : "🔊";
});

volumeSlider.addEventListener("input", () => {
  bgMusic.volume = volumeSlider.value;
});


/* ===========================
   EVENTOS DE PANTALLAS
=========================== */
btnEnter.addEventListener("click", () => {
  bgMusic.volume = 0.5;
  bgMusic.play().catch(() => {});
  showScreen(screenPlayers);
});

btnCancelPlayers.addEventListener("click", () => {
  showScreen(screenEntry);
});

btnNextPlayers.addEventListener("click", () => {
  const selected = document.querySelector("input[name='players']:checked");
  if (!selected) {
    alert("Por favor selecciona el número de jugadores.");
    return;
  }

  selectedPlayers = parseInt(selected.value);
  showScreen(screenMonster);
});

btnCancelMonster.addEventListener("click", () => {
  showScreen(screenPlayers);
});

btnNextMonster.addEventListener("click", () => {
  const selected = document.querySelector("input[name='monster']:checked");
  if (!selected) {
    alert("Por favor selecciona un monstruo.");
    return;
  }

  selectedMonster = selected.value;
  showScreen(screenMain);
  updateUI();
});


/* ===========================
   BOTONES PRINCIPALES
=========================== */
btnPrev.addEventListener("click", () => {
  goPrevPhase();
});

btnNext.addEventListener("click", () => {
  // lógica de turnos jugadores: al terminar fase 8 (fin turno jugador)
  // el siguiente click en "Siguiente" debe avanzar al siguiente jugador si aún quedan jugadores
  if (currentPhaseIndex === 7) {
    // pasamos a fase 9 (fin ronda) si ya es último jugador
    if (currentPlayerTurn >= selectedPlayers) {
      currentPhaseIndex = 8;
      updateUI(true);
      return;
    } else {
      currentPlayerTurn++;
      currentPhaseIndex = 3; // vuelve al Turno del jugador
      updateUI(true);
      return;
    }
  }

  goNextPhase();
});

btnReset.addEventListener("click", () => {
  resetModal.classList.remove("hidden");
});

confirmResetYes.addEventListener("click", () => {
  resetModal.classList.add("hidden");
  resetAll();
});

confirmResetNo.addEventListener("click", () => {
  resetModal.classList.add("hidden");
});


/* ===========================
   INICIALIZAR
=========================== */
document.addEventListener("DOMContentLoaded", () => {
  updateUI();
});
