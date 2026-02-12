// ==============================
// PRIMAL - ORDEN DE TURNO TRACKER
// Compatible con index original
// ==============================

const fases = [
  {
    titulo: "1) Comienzo de la ronda",
    detalles: [
      "Remover Confusión",
      "Chequeo de Postura del Monstruo",
      "Chequeo de Postura del Monstruo y Peligros por efectos",
      "Efectos de inicio de ronda"
    ]
  },
  {
    titulo: "2) Consumir",
    detalles: [
      "Cada jugador puede usar una habilidad de consumo"
    ]
  },
  {
    titulo: "3) Mantenimiento del monstruo",
    detalles: [
      "Se refresca el comportamiento del monstruo (Descarta el número más bajo de comportamiento)",
      "+1 Esfuerzo por jugador",
      "+1 Esfuerzo por aceleración"
    ]
  },
  {
    titulo: "4) Turno del jugador",
    detalles: [
      "Recordatorio: el jugador con la ficha de Amenaza va primero y gana la ficha de Primer Jugador al comenzar la nueva ronda.",
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
    titulo: "5) Fase de movimiento",
    detalles: [
      "El jugador puede gastar 1 de Resistencia para moverse 1 sector (si esto pasa, remueve Atado)",
      "El jugador debe gastar 2 de Resistencia para moverse 1 sector si es Arena (Terreno)",
      "Si el jugador no se mueve, el jugador gana la ficha Atado",
      "Chequeo del comportamiento del monstruo por efectos",
      "Escóndete en un arbusto (rellenar después según el tipo de arbusto)"
    ]
  },
  {
    titulo: "6) Fase de acción",
    detalles: [
      "Máximo 5 cartas de acción (salvo que alguna carta/habilidad diga lo contrario)",
      "Máximo 3 cartas de acción en Agua",
      "Los jugadores no pueden jugar cartas cuando están sobre Fuego (Terreno)",
      "Chequeo del comportamiento del monstruo por efectos",
      "+1 Resistencia si 2 o más cartas se mantienen en tu mano al final de la fase de acción"
    ]
  },
  {
    titulo: "7) Fase de Desgaste",
    detalles: [
      "Roba 1 carta de Desgaste (2 si estás AMENAZADO)",
      "Puedes remover una ROCA (Terreno) para prevenir el daño de Desgaste",
      "Chequeo de efectos del comportamiento del monstruo",
      "Después de otros detonantes: Termina la fase de efectos de Desgaste"
    ]
  },
  {
    titulo: "8) Fin del turno del jugador",
    detalles: [
      "Descarta la secuencia jugada (desde la carta más vieja a la nueva jugada, dejando arriba la más nueva)",
      "Rellena tu mano: roba/descarta hasta tener tu tamaño (por defecto 5)",
      "El monstruo gira hacia el jugador con la AMENAZA",
      "Chequeo de efectos del comportamiento del monstruo",
      "Después de otros detonantes: Termina el turno de efectos del jugador",
      "Chequeo de efectos de PLANTA/TERRENO en el sector",
      "Subirse a una MESETA"
    ]
  },
  {
    titulo: "9) Fin de la ronda",
    detalles: [
      "Chequeo de Postura, Peligro y efectos de comportamiento del monstruo",
      "Avanza el Marcador de Turno",
      "Después de otras detonaciones: Terminan los efectos de fin de ronda"
    ]
  }
];

// ------------------ ESTADO ------------------
let pasoActual = 0;

// ------------------ STORAGE ------------------
const STORAGE_KEY = "primal_paso_actual";

// ------------------ ELEMENTOS HTML ------------------
let faseActualEl;
let progresoEl;
let listaOrdenEl;

let btnAnterior;
let btnSiguiente;
let btnReset;


// ------------------ FUNCIONES ------------------

function cargarPasoGuardado() {
  const guardado = localStorage.getItem(STORAGE_KEY);

  if (guardado !== null) {
    const num = parseInt(guardado);
    if (!isNaN(num) && num >= 0 && num < fases.length) {
      pasoActual = num;
    }
  }
}

function guardarPaso() {
  localStorage.setItem(STORAGE_KEY, pasoActual.toString());
}

function renderListaOrden() {
  listaOrdenEl.innerHTML = "";

  fases.forEach((fase, index) => {
    const div = document.createElement("div");
    div.classList.add("fase-item");

    if (index === pasoActual) {
      div.classList.add("fase-activa");
    }

    const titulo = document.createElement("h3");
    titulo.textContent = fase.titulo;

    const ul = document.createElement("ul");

    fase.detalles.forEach((detalle) => {
      const li = document.createElement("li");
      li.textContent = detalle;
      ul.appendChild(li);
    });

    div.appendChild(titulo);
    div.appendChild(ul);

    listaOrdenEl.appendChild(div);
  });
}

function actualizarVista() {
  faseActualEl.textContent = fases[pasoActual].titulo;
  progresoEl.textContent = `${pasoActual + 1} / ${fases.length}`;

  renderListaOrden();

  btnAnterior.disabled = pasoActual === 0;
  btnSiguiente.disabled = pasoActual === fases.length - 1;

  guardarPaso();
}

function siguientePaso() {
  if (pasoActual < fases.length - 1) {
    pasoActual++;
    actualizarVista();
  }
}

function pasoAnterior() {
  if (pasoActual > 0) {
    pasoActual--;
    actualizarVista();
  }
}

function resetear() {
  pasoActual = 0;
  actualizarVista();
}


// ------------------ INIT ------------------

document.addEventListener("DOMContentLoaded", () => {
  faseActualEl = document.getElementById("faseActual");
  progresoEl = document.getElementById("progreso");
  listaOrdenEl = document.getElementById("listaOrden");

  btnAnterior = document.getElementById("btnAnterior");
  btnSiguiente = document.getElementById("btnSiguiente");
  btnReset = document.getElementById("btnReset");

  if (!faseActualEl || !progresoEl || !listaOrdenEl) {
    console.error("ERROR: faltan elementos HTML (faseActual, progreso o listaOrden).");
    return;
  }

  if (!btnAnterior || !btnSiguiente || !btnReset) {
    console.error("ERROR: faltan botones HTML (btnAnterior, btnSiguiente o btnReset).");
    return;
  }

  btnAnterior.addEventListener("click", pasoAnterior);
  btnSiguiente.addEventListener("click", siguientePaso);
  btnReset.addEventListener("click", resetear);

  cargarPasoGuardado();
  actualizarVista();
});
