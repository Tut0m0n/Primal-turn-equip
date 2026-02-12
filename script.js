// ==============================
// PRIMAL - ORDEN DE TURNO TRACKER
// script.js
// ==============================

// ---- DATA PRINCIPAL ----
const fases = [
  {
    titulo: "1. Inicio de la ronda",
    detalles: [
      "Remover Confusión",
      "Chequeo de Postura del Monstruo",
      "Chequeo de Postura del Monstruo y Peligros por efectos",
      "Efectos de inicio de ronda"
    ]
  },
  {
    titulo: "2. Consumir",
    detalles: [
      "Cada jugador puede usar una habilidad de consumo"
    ]
  },
  {
    titulo: "3. Mantenimiento del monstruo",
    detalles: [
      "Se refresca el comportamiento del monstruo (Descarta el número más bajo de comportamiento)",
      "+1 Esfuerzo por jugador",
      "+1 Esfuerzo por aceleración"
    ]
  },
  {
    titulo: "4. Turno del jugador",
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
    titulo: "5. Fase de movimiento",
    detalles: [
      "El jugador puede gastar 1 de Resistencia para moverse 1 sector (si esto pasa, remueve Atado)",
      "El jugador debe gastar 2 de Resistencia para moverse 1 sector si es Arena (Terreno)",
      "Si el jugador no se mueve, el jugador gana la ficha Atado",
      "Chequeo del comportamiento del monstruo por efectos",
      "Escóndete en un arbusto (rellenar después según el tipo de arbusto)"
    ]
  },
  {
    titulo: "6. Fase de acción",
    detalles: [
      "La máxima cantidad de cartas de acción a jugar es 5 (salvo que alguna habilidad o carta diga lo contrario)",
      "La máxima cantidad de cartas de acción que puedas jugar en el Agua es 3",
      "Los jugadores no pueden jugar cartas cuando están sobre Fuego (Terreno)",
      "Chequeo del comportamiento del monstruo por efectos",
      "+1 ficha de Resistencia si 2 o más cartas se mantienen en tu mano al final de la fase de acción"
    ]
  },
  {
    titulo: "7. Fase de Desgaste",
    detalles: [
      "Roba 1 carta de Desgaste (2 si estás AMENAZADO)",
      "Puedes remover una ROCA (Terreno) para prevenir el daño de Desgaste",
      "Chequeo de efectos del comportamiento del monstruo",
      "Después de otros detonantes: Termina la fase de efectos de Desgaste (Fin de los efectos de la fase de Desgaste)"
    ]
  },
  {
    titulo: "8. Fin del turno del jugador",
    detalles: [
      "Descarta la secuencia jugada (desde la carta más vieja a la nueva jugada, dejando arriba la más nueva)",
      "Rellena tu mano: roba/descarta hasta tener tu tamaño (por defecto el tamaño de la mano es 5, a no ser que alguna carta o efecto diga lo contrario)",
      "El MONSTRUO gira al jugador que tenga la AMENAZA",
      "Chequeo de efectos del comportamiento del monstruo",
      "Después de otros detonantes: Termina el turno de efectos del jugador (Fin de los efectos del turno del jugador)",
      "Chequeo para los efectos de PLANTA/TERRENO en el sector",
      "Subirse a una MESETA"
    ]
  },
  {
    titulo: "9. Fin de la ronda",
    detalles: [
      "Chequeo de Postura, Peligro y efectos de comportamiento del monstruo",
      "Avanza el Marcador de Turno",
      "Después de otras detonaciones: Terminan los efectos de fin de ronda (Fin de los efectos de la ronda)"
    ]
  }
];

// ---- ESTADO ----
let pasoActual = 0;

// ---- LOCAL STORAGE ----
const STORAGE_KEY = "primal_paso_actual";

// ---- ELEMENTOS HTML ----
let faseActualEl;
let progresoEl;
let listaOrdenEl;

let btnAnterior;
let btnSiguiente;
let btnReset;


// ==============================
// FUNCIONES
// ==============================

function cargarProgreso() {
  const guardado = localStorage.getItem(STORAGE_KEY);
  if (guardado !== null) {
    const valor = parseInt(guardado);
    if (!isNaN(valor) && valor >= 0 && valor < fases.length) {
      pasoActual = valor;
    }
  }
}

function guardarProgreso() {
  localStorage.setItem(STORAGE_KEY, pasoActual.toString());
}

function actualizarVista() {
  // Actualiza fase actual
  faseActualEl.textContent = fases[pasoActual].titulo;

  // Actualiza progreso
  progresoEl.textContent = `${pasoActual + 1} / ${fases.length}`;

  // Renderiza la lista completa
  listaOrdenEl.innerHTML = "";

  fases.forEach((fase, index) => {
    const faseDiv = document.createElement("div");
    faseDiv.classList.add("fase-item");

    // Marca fase activa
    if (index === pasoActual) {
      faseDiv.classList.add("fase-activa");
    }

    const titulo = document.createElement("h3");
    titulo.textContent = fase.titulo;

    const ul = document.createElement("ul");

    fase.detalles.forEach((detalle) => {
      const li = document.createElement("li");
      li.textContent = detalle;
      ul.appendChild(li);
    });

    faseDiv.appendChild(titulo);
    faseDiv.appendChild(ul);
    listaOrdenEl.appendChild(faseDiv);
  });

  // Habilitar/deshabilitar botones
  btnAnterior.disabled = pasoActual === 0;
  btnSiguiente.disabled = pasoActual === fases.length - 1;
}

function siguientePaso() {
  if (pasoActual < fases.length - 1) {
    pasoActual++;
    guardarProgreso();
    actualizarVista();
  }
}

function pasoAnterior() {
  if (pasoActual > 0) {
    pasoActual--;
    guardarProgreso();
    actualizarVista();
  }
}

function resetear() {
  pasoActual = 0;
  guardarProgreso();
  actualizarVista();
}


// ==============================
// INICIALIZACIÓN
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  // Obtener elementos
  faseActualEl = document.getElementById("faseActual");
  progresoEl = document.getElementById("progreso");
  listaOrdenEl = document.getElementById("listaOrden");

  btnAnterior = document.getElementById("btnAnterior");
  btnSiguiente = document.getElementById("btnSiguiente");
  btnReset = document.getElementById("btnReset");

  // Seguridad: si no encuentra elementos, avisar en consola
  if (!faseActualEl || !progresoEl || !listaOrdenEl) {
    console.error("ERROR: faltan elementos HTML (faseActual, progreso o listaOrden). Revisa index.html");
    return;
  }

  if (!btnAnterior || !btnSiguiente || !btnReset) {
    console.error("ERROR: faltan botones HTML (btnAnterior, btnSiguiente o btnReset). Revisa index.html");
    return;
  }

  // Eventos botones
  btnAnterior.addEventListener("click", pasoAnterior);
  btnSiguiente.addEventListener("click", siguientePaso);
  btnReset.addEventListener("click", resetear);

  // Cargar progreso guardado
  cargarProgreso();

  // Pintar la vista inicial
  actualizarVista();
});
