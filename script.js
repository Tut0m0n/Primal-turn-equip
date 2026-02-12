const steps = [
  {
    number: 1,
    title: "Inicio de la ronda - (Remover Confusión)",
    items: [
      "Detonar: habilidades de AL COMIENZO DE LA RONDA",
      "Chequeo de POSTURA del Monstruo",
      "Chequeo PELIGROS por efectos de la POSTURA del monstruo",
      "Chequeo habilidades del Cazador",
      "Chequeo de habilidades de Objetivos",
      "Remover ficha de CONFUSION"
    ]
  },
  {
    number: 2,
    title: "Consumir",
    items: [
      "Cada jugador puede usar una habilidad de CONSUMIR una POCION y removerla del juego (regresa al jugador si falla el escenario)"
    ]
  },
  {
    number: 3,
    title: "Mantenimiento del monstruo",
    items: [
      "Se refrescan las cartas de COMPORTAMIENTO del monstruo, descarta el número más bajo de comportamiento. Si hay empate, se cambian las iguales.",
      "+1 ESFUERZO por jugador.",
      "+1 ESFUERZO por aceleración"
    ]
  },
  {
    number: 4,
    title: "Turno del jugador",
    items: [
      "Recordatorio: el jugador con la ficha de AGRESIVIDAD va primero y gana la ficha de Primer Jugador al comenzar la nueva ronda.",
      "Noqueado: Si el jugador esta NOQUEADO, con la ficha en rojo, salta su turno y da vuelta la ficha. Si la ficha es de color blanco, LEVANTATE, remueve la ficha, roba tu mano (5 maximo), y coloca nuevamente la miniatura del jugador en pie.",
      "Salir de la Meseta (Terreno)",
      "Chequeo del COMPORTAMIENTO del monstruo por sus efectos",
      "Termino de CAPTURA, si el jugador estaba capturado.",
      "Chequeo de los objetivos del monstruo por efectos",
      "Chequeo de las cartas del jugador por efectos (equipamiento, cartas de acción, maestría que aparezca “AL COMIENZO DEL TURNO”)",
      "Chequeo del terreno o plantas del sector por efectos.",
      "Si hay una BAETHANIS (planta) en tu sector, cura 1 de daño a tu personaje por NIVEL DE ARMA.",
      "Si hay una SYNAEREA (planta) en tu sector, puedes sufrir 1 de daño por NIVEL DE ARMA para robar una carta de tu mazo.",
      "Remover CEGUERA"
    ]
  },
  {
    number: 5,
    title: "Fase de movimiento",
    items: [
      "El jugador puede gastar 1 de RESISTENCIA (generada por cartas o fichas de resistencia) para moverse 1 sector, si esto pasa, remueve AMENAZADO.",
      "El jugador debe gastar 2 de RESISTENCIA para moverse 1 sector si es Arena (Terreno).",
      "Si el jugador no se mueve, el jugador gana la ficha AMENAZADO.",
      "Chequeo del comportamiento del monstruo por efectos",
      "Escóndete en un arbusto; Si el arbusto es verde, puedes gastar una carta (verde) para esconderte dentro del arbusto, coloca la miniatura de tu personaje sobre la ficha del arbusto, luego pausa tu turno y selecciona a un jugador que no haya jugado su turno, al terminar el turno de este jugador, dejaras el arbusto y retomaras tu turno. Mientras estes oculto no puedes ASISTIR ni ATRAER al monstruo.",
      "Si el arbusto es rojo, puedes RECICLAR una carta de AGRESIVIDAD, para poder realizar lo mismo que el arbusto verde.",
      "Si te mueves a un sector con NIEBLA, obtienes la ficha de AMENAZADO."
    ]
  },
  {
    number: 6,
    title: "Fase de acción",
    items: [
      "Recordatorio: La máxima cantidad de cartas de acción a jugar es 5 (salvo que alguna habilidad o carta diga lo contrario). La máxima cantidad de cartas de acción que puedas jugar en el AGUA es 3.",
      "Los jugadores no pueden jugar cartas cuando están sobre FUEGO (Terreno)",
      "Los jugadores deben gastar +1 RESISTENCIA al utilizar cartas de esquiva (verdes) cuando estan sobre PANTANO (terreno). Se repite segun la cantidad de cartas jueguen.",
      "Los jugadores deben gastar +1 RESISTENCIA al utilizar cartas de ofensiva (simbolo ataque) cuando estan en ESPINOS (planta). Se repite segun la cantidad de cartas jueguen.",
      "Puedes LEVANTAR a uno de tus aliados NOQUEADOS gastando 2 RESISTENCIAS, si realizas esta accion da vuelta la ficha de NOQUEADO.",
      "Puedes recibir ASISTENCIA de otro jugador inactivo, una ves por jugador.",
      "Puedes quemar cartas para obtener RESISTENCIA y bajar cartas a tu zona de secuencia con un maximo de 5, salvo que otra fuente diga lo contrario. Recuerda que al quemar la carta o las cartas la RESISTENCIA no se acumula para la siguiente carta, salvo las fichas de RESISTENCIA.",
      "Cuando juegues una carta con AGRESIVIDAD, obtienes la ficha de AGRESIVIDAD.",
      "No puedes empezar a utilizar una carta de ATAQUE (roja) si estas en una zona protegida del monstruo (zona negra).",
      "Detona COLOR:HABILIDAD y otras habilidades de Cazadores/Objetivos/Terrenos.",
      "Si hay una CYRICAE (planta) en tu sector, cuando juegues una carta de ATAQUE (roja) en tu secuencia, el efecto del ataque gana BONUS DE DAÑO igual a tu NIVEL DE ARMA. Es una ves por carta jugada.",
      "Si ocurre un efecto de el AGUA SE ESPARCE, cuando debes colocar una ficha de agua en una zona que ya esta con agua, debes de colocar una ficha agua a cada sector adyacente.",
      "Chequeo del COMPORTAMIENTO del monstruo por efectos; segun cartas o efectos que se hayan jugado.",
      "Obtienes +1 ficha de RESISTENCIA, si 2 o más cartas se mantienen en tu mano al final de la FASE DE ACCION."
    ]
  },
  {
    number: 7,
    title: "Fase de Desgaste",
    items: [
      "Detonar y resolver habilidades de COMIENZO FASE DE DESGASTE (cartas de PELIGRO y ficha de POLVO)",
      "Si hay POLVO en tu sector (maximo 2), toma 1 ficha de INTERRUPCION (simbolo defensa tachado) y colocalas en distintas cartas DEFENSIVAS de tu sequencia. Esas cartas no cuentan para el chequeo de DESGASTE.",
      "Roba 1 carta de Desgaste (2 si estás AMENAZADO). Si tienes la igual o mayor cantidad de cartas DEFENSIVAS (simbolo defensa), sumando o restando fichas de DEFENZA/INTERRUPCION, no sufres daño por Desgaste este turno. Si fuese lo contrario, sumando o restando fichas de DEFENZA/INTERRUPCION, sufririas el daño del monstruo + sus bonificaciones, en caso de tener.",
      "Luego descarta las cartas de Desgaste.",
      "Puedes remover una ROCA (Terreno) para prevenir el daño de Desgaste, si lo haces descarta la ficha de ROCA (terreno).",
      "Detonar: habilidades de TERMINO FASE DESGASTE, resuelve los comportamientos del monstruo.",
      "Remueve las fichas de DEFENZA/INTERRUPCION."
    ]
  },
  {
    number: 8,
    title: "Fin del turno del jugador",
    items: [
      "Descarta la secuencia jugada, desde la carta más vieja a la ultima jugada, dejando arriba del cementerio la más nueva.",
      "Rellena tu mano: roba/descarta hasta tener tu tamaño, por defecto el tamaño de la mano es 5, a no ser que alguna carta o efecto diga lo contrario.",
      "Las fichas de TENSION (rectangulo con un -1 al interior) pueden afectar el tamaño de tu mano de juego disminuyendola.",
      "El MONSTRUO se gira al jugador que tenga la ficha de AGRESIVIDAD",
      "Chequeo de efectos del COMPORTAMIENTO del monstruo.",
      "Detonar: habilidades de FINAL DEL TURNO DEL JUGADOR, segun ACTUALIZACION RAPIDA/Cazador/Terreno/LENTITUD (ficha de pierna monstruo).",
      "Chequeo para los efectos de PLANTA/TERRENO en el sector.",
      "Si hay una ficha de MESETA (terreno) en tu sector y no hay otro jugador arriba de esta, puedes colocar a tu personaje arriba de esta.",
      "Cuando una carta de COMPORTAMIENTO es revelada, puedes colocar la miniatura de tu cazador sobre esta y realizar lo siguiente: Cancelar el efecto de la carta de COMPORTAMIENTO y luego, realizar un chequeo de MONTAR.",
      "El chequeo de montar se realiza descartando la primara carta de DESGASTE y se compara con la primera carta de tu mazo.",
      "Si la RESISTENCIA de la carta de tu mazo es MENOR a el valor de la carta de DESGASTE, sufre daño del monstruo y coloca a tu personaje en el sector FRONTAL del monstruo.",
      "Si es MAYOR o IGUAL, genera la cantidad de daño de tu arma y coloca al personaje en cualquier sector.",
      "Si hay una ficha de PLANTA DE FAUCES SILVESTRE (planta) en tu sector y tienes el estado AMENAZADO, sufres 1 de daño por NIVEL DE ARMA.",
      "Si hay HIELO (terreno) en tu sector y tienes el estado AMENAZADO, debes de EXILIAR la primera carta de tu mazo en tu zona de cartas exiliadas.",
      "Si todos los jugadores ya realizaron su turno, termina la ronda, sino debes de pasar al siguiente jugador."
    ]
  },
  {
    number: 9,
    title: "Fin de la ronda",
    items: [
      "Detonar: habilidades de AL FINAL DE LA RONDA, resolviendo primero los PELIGROS, COMPORTAMIENTO, cartas de Cazador, girar la ficha de FUEGO (terreno), remover todas las fichas de POLVO, eliminar fichas de VULNERABILIDAD y ATONTADO.",
      "Avanza el Marcador de Turno",
      "Después de otras detonaciones: Terminan los efectos de fin de ronda (Fin de los efectos de la ronda)"
    ]
  }
];

let currentStepIndex = 0;

const stepsContainer = document.getElementById("stepsContainer");
const currentStepName = document.getElementById("currentStepName");
const progressText = document.getElementById("progressText");

const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnReset = document.getElementById("btnReset");

function renderSteps() {
  stepsContainer.innerHTML = "";

  steps.forEach((step, index) => {
    const card = document.createElement("div");
    card.classList.add("step-card");

    if (index === currentStepIndex) {
      card.classList.add("active");
    }

    const title = document.createElement("div");
    title.classList.add("step-title");
    title.innerHTML = `<span>${step.number}.</span> ${step.title}`;

    const list = document.createElement("ul");
    list.classList.add("step-list");

    step.items.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    card.appendChild(title);
    card.appendChild(list);
    stepsContainer.appendChild(card);
  });

  updateStatus();
}

function updateStatus() {
  currentStepName.textContent = `${steps[currentStepIndex].number}. ${steps[currentStepIndex].title}`;
  progressText.textContent = `${currentStepIndex + 1} / ${steps.length}`;
}

btnNext.addEventListener("click", () => {
  if (currentStepIndex < steps.length - 1) {
    currentStepIndex++;
    renderSteps();
    scrollToActive();
  }
});

btnPrev.addEventListener("click", () => {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    renderSteps();
    scrollToActive();
  }
});

btnReset.addEventListener("click", () => {
  currentStepIndex = 0;
  renderSteps();
  scrollToActive();
});

function scrollToActive() {
  const activeCard = document.querySelector(".step-card.active");
  if (activeCard) {
    activeCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

renderSteps();
