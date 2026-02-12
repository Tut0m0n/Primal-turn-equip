// -----------------------------
// VARIABLES GLOBALES
// -----------------------------
let totalJugadores = 2;
let jugadorActual = 1;
let rondaActual = 1;

let heridasMonstruo = 0;
let danoMonstruo = 0;
let esfuerzo = 0;
let aceleracion = 0;

let faseIndex = 0;

const fasesBase = [
  {
    titulo: "1. INICIO DE LA RONDA",
    contenido: `
(Remover Confusión)

- Detonar: habilidades de <b>AL COMIENZO DE LA RONDA</b>
   - Chequeo de <b>POSTURA</b> del Monstruo
   - Chequeo <b>PELIGROS</b> por efectos de la <b>POSTURA</b> del monstruo
- Chequeo habilidades del Cazador
- Chequeo de habilidades de Objetivos
- Remover ficha de <b>CONFUSION</b>
`
  },
  {
    titulo: "2. CONSUMIR",
    contenido: `
- Cada jugador puede usar una habilidad de <b>CONSUMIR</b> una <b>POCION</b> y removerla del juego
  (regresa al jugador si falla el escenario)
`
  },
  {
    titulo: "3. MANTENIMIENTO DEL MONSTRUO",
    contenido: `
- Se refrescan las cartas de <b>COMPORTAMIENTO</b> del monstruo, descarta el número más bajo.
  Si hay empate, se cambian las iguales.
- +1 <b>ESFUERZO</b> por jugador
- +1 <b>ESFUERZO</b> por aceleración
`
  },
  {
    titulo: "4. TURNO DEL JUGADOR",
    contenido: `
<p class="reminder">Recordatorio: el jugador con la ficha de <b>AGRESIVIDAD</b> va primero y gana la ficha de Primer Jugador al comenzar la nueva ronda.</p>

<p class="reminder">Noqueado: Si el jugador está <b>NOQUEADO</b>, salta su turno y da vuelta la ficha.
Si la ficha es blanca: <b>LEVANTATE</b>, roba tu mano (5 máximo) y vuelve a colocar tu miniatura.</p>

- Salir de la Meseta (Terreno)
- Chequeo del <b>COMPORTAMIENTO</b> del monstruo por sus efectos
- Termino de <b>CAPTURA</b>
- Chequeo de los objetivos del monstruo por efectos
- Chequeo de cartas del jugador por efectos (<b>AL COMIENZO DEL TURNO</b>)
- Chequeo de terreno o plantas por efectos:
  - Si hay <b>BAETHANIS</b>, cura 1 daño por <b>NIVEL DE ARMA</b>
  - Si hay <b>SYNAEREA</b>, puedes sufrir 1 daño por <b>NIVEL DE ARMA</b> para robar una carta
- Remover <b>CEGUERA</b>
`
  },
  {
    titulo: "5. FASE DE MOVIMIENTO",
    contenido: `
- Gastar 1 <b>RESISTENCIA</b> para moverse 1 sector (si ocurre, remueve <b>AMENAZADO</b>)
- Gastar 2 <b>RESISTENCIA</b> para moverse en Arena (Terreno)
- Si no se mueve: gana <b>AMENAZADO</b>
- Chequeo del comportamiento del monstruo por efectos
- Escóndete en un arbusto:
  - Arbusto verde: gastar carta verde para ocultarse
  - Arbusto rojo: reciclar carta de <b>AGRESIVIDAD</b>
- Si te mueves a NIEBLA: obtienes <b>AMENAZADO</b>
`
  },
  {
    titulo: "6. FASE DE ACCIÓN",
    contenido: `
<p class="reminder">Recordatorio: máximo 5 cartas de acción. En <b>AGUA</b> máximo 3.</p>

- No jugar cartas sobre <b>FUEGO</b> (Terreno)
- En <b>PANTANO</b>: +1 <b>RESISTENCIA</b> por carta de esquiva
- En <b>ESPINOS</b>: +1 <b>RESISTENCIA</b> por carta ofensiva

- Puedes LEVANTAR aliado <b>NOQUEADO</b> gastando 2 <b>RESISTENCIAS</b>
- Puedes recibir <b>ASISTENCIA</b> 1 vez por jugador
- Puedes quemar cartas para obtener <b>RESISTENCIA</b>
- Si juegas carta con <b>AGRESIVIDAD</b>, obtienes ficha de <b>AGRESIVIDAD</b>
- No atacar si estás en zona protegida (zona negra)
- Si hay <b>CYRICAE</b>: bonus de daño igual a <b>NIVEL DE ARMA</b>
- Efecto <b>AGUA SE ESPARCE</b>: se expande a sectores adyacentes

- Chequeo del <b>COMPORTAMIENTO</b> del monstruo por efectos
- +1 ficha de <b>RESISTENCIA</b> si 2+ cartas quedan en tu mano al final
`
  },
  {
    titulo: "7. FASE DE DESGASTE",
    contenido: `
- Detonar habilidades de comienzo fase de desgaste (<b>PELIGRO</b>, ficha <b>POLVO</b>)
- Si hay <b>POLVO</b>: toma ficha <b>INTERRUPCION</b> y colócala en cartas defensivas

- Roba 1 carta de Desgaste (2 si estás <b>AMENAZADO</b>)
- Si tienes suficientes defensas no sufres daño, si no, sufres daño del monstruo
- Descarta cartas de desgaste

- Puedes remover <b>ROCA</b> (Terreno) para prevenir daño de Desgaste
- Detonar habilidades de término fase desgaste
- Remueve fichas de <b>DEFENZA</b>/<b>INTERRUPCION</b>
`
  },
  {
    titulo: "8. FIN DEL TURNO DEL JUGADOR",
    contenido: `
- Descarta la secuencia jugada, dejando arriba la más nueva
- Rellena tu mano hasta tamaño (5 por defecto)
- Fichas de <b>TENSION</b> pueden disminuir tu tamaño de mano
- El <b>MONSTRUO</b> gira al jugador con <b>AGRESIVIDAD</b>
- Chequeo efectos del <b>COMPORTAMIENTO</b> del monstruo
- Detonar habilidades de final de turno del jugador
- Chequeo de efectos de <b>PLANTA</b>/<b>TERRENO</b>

- Si hay <b>MESETA</b> puedes subirte y cancelar carta de comportamiento
- Si hay <b>PLANTA DE FAUCES SILVESTRE</b> y estás <b>AMENAZADO</b>: sufres daño por <b>NIVEL DE ARMA</b>
- Si hay <b>HIELO</b> y estás <b>AMENAZADO</b>: EXILIAR primera carta del mazo

- Si todos jugaron: termina la ronda
`
  },
  {
    titulo: "9. FIN DE LA RONDA",
    contenido: `
- Detonar habilidades de <b>AL FINAL DE LA RONDA</b>
- Resolver primero <b>PELIGROS</b>, <b>COMPORTAMIENTO</b>, cartas de Cazador
- Girar ficha de <b>FUEGO</b>, remover fichas de <b>POLVO</b>
- Eliminar fichas de <b>VULNERABILIDAD</b> y <b>ATONTADO</b>
- Avanza el Marcador de Turno
`
  }
];

// -----------------------------
// ELEMENTOS DOM
// -----------------------------
const screens = {
  inicio: document.getElementById("pantallaInicio"),
  jugadores: document.getElementById("pantallaJugadores"),
  monstruo: document.getElementById("pantallaMonstruo"),
  tracker: document.getElementById("pantallaTracker")
};

const btnEntrar = document.getElementById("btnEntrar");
const btnCancelarJugadores = document.getElementById("btnCancelarJugadores");
const btnSiguienteJugadores = document.getElementById("btnSiguienteJugadores");
const btnCancelarMonstruo = document.getElementById("btnCancelarMonstruo");
const btnSiguienteMonstruo = document.getElementById("btnSiguienteMonstruo");

const listaOrden = document.getElementById("listaOrden");
const faseTitulo = document.getElementById("faseTitulo");
const faseContenido = document.getElementById("faseContenido");
const faseCard = document.getElementById("faseCard");

const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const btnReset = document.getElementById("btnReset");

const contadorRonda = document.getElementById("contadorRonda");
const contadorJugador = document.getElementById("contadorJugador");

const contadorHeridas = document.getElementById("contadorHeridas");
const contadorDano = document.getElementById("contadorDano");
const contadorEsfuerzo = document.getElementById("contadorEsfuerzo");
const contadorAceleracion = document.getElementById("contadorAceleracion");

const btnDanoMenos = document.getElementById("btnDanoMenos");
const btnDanoMas = document.getElementById("btnDanoMas");
const btnEsfuerzoMenos = document.getElementById("btnEsfuerzoMenos");
const btnEsfuerzoMas = document.getElementById("btnEsfuerzoMas");
const btnAceleracionMenos = document.getElementById("btnAceleracionMenos");
const btnAceleracionMas = document.getElementById("btnAceleracionMas");

const mensajeDesatado = document.getElementById("mensajeDesatado");

// AUDIO
const bgMusic = document.getElementById("bgMusic");
const btnAudio = document.getElementById("btnAudio");
const audioVolume = document.getElementById("audioVolume");

// -----------------------------
// FUNCIONES PANTALLAS
// -----------------------------
function mostrarPantalla(nombre) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[nombre].classList.add("active");
}

function asegurarMusica() {
  controversialAutoplayFix();
}

function controversialAutoplayFix() {
  bgMusic.volume = audioVolume.value;
}

// -----------------------------
// CHECKBOX SINGLE SELECTION
// -----------------------------
function hacerSeleccionUnica(selectorName) {
  const inputs = document.querySelectorAll(`input[name="${selectorName}"]`);
  inputs.forEach(input => {
    input.addEventListener("change", () => {
      if (input.checked) {
        inputs.forEach(i => {
          if (i !== input) i.checked = false;
        });
      }
    });
  });
}

// -----------------------------
// ORDEN DE TURNO UI
// -----------------------------
function renderListaOrden() {
  listaOrden.innerHTML = "";

  fasesBase.forEach((fase, index) => {
    const div = document.createElement("div");
    div.classList.add("order-item");
    div.textContent = fase.titulo.charAt(0) + fase.titulo.slice(1).toLowerCase();

    if (index === faseIndex) {
      div.classList.add("active");
    }

    listaOrden.appendChild(div);
  });
}

function actualizarFase() {
  faseCard.classList.add("fade");

  setTimeout(() => {
    faseTitulo.textContent = fasesBase[faseIndex].titulo;
    faseContenido.innerHTML = fasesBase[faseIndex].contenido;

    renderListaOrden();
    actualizarContadoresUI();

    faseCard.classList.remove("fade");
  }, 200);
}

function actualizarContadoresUI() {
  contadorRonda.textContent = `${rondaActual} / 10`;
  contadorJugador.textContent = `TURNO JUGADOR ${jugadorActual} / ${totalJugadores}`;

  contadorHeridas.textContent = `${heridasMonstruo} / 10`;
  contadorDano.textContent = `${danoMonstruo} / 10`;
  contadorEsfuerzo.textContent = `${esfuerzo} / 10`;
  contadorAceleracion.textContent = `${aceleracion} / 10`;

  if (esfuerzo >= 10) {
    mensajeDesatado.textContent = "DESATADO!! Genera el daño del monstruo a todos los jugadores!!";
  } else {
    mensajeDesatado.textContent = "";
  }
}

// -----------------------------
// CAMBIO DE FASE
// -----------------------------
function avanzarFase() {
  const faseActual = fasesBase[faseIndex].titulo;

  if (faseActual.includes("FIN DEL TURNO DEL JUGADOR")) {
    if (jugadorActual < totalJugadores) {
      jugadorActual++;
      faseIndex = 3;
    } else {
      jugadorActual = 1;
      faseIndex++;
    }
  } else if (faseActual.includes("FIN DE LA RONDA")) {
    if (rondaActual < 10) rondaActual++;
    faseIndex = 0;
  } else {
    faseIndex++;
  }

  if (faseIndex >= fasesBase.length) {
    faseIndex = fasesBase.length - 1;
  }

  actualizarFase();
}

function retrocederFase() {
  const faseActual = fasesBase[faseIndex].titulo;

  if (faseActual.includes("TURNO DEL JUGADOR")) {
    if (jugadorActual > 1) {
      jugadorActual--;
      faseIndex = 7;
    }
  } else if (faseActual.includes("INICIO DE LA RONDA")) {
    if (rondaActual > 1) rondaActual--;
  } else {
    faseIndex--;
    if (faseIndex < 0) faseIndex = 0;
  }

  actualizarFase();
}

// -----------------------------
// RESET CON CONFIRMACION
// -----------------------------
function resetearTodo() {
  const confirmar = confirm("Si presionas reset se reseteará todo, ¿deseas hacerlo?");
  if (!confirmar) return;

  faseIndex = 0;
  rondaActual = 1;
  jugadorActual = 1;

  heridasMonstruo = 0;
  danoMonstruo = 0;
  esfuerzo = 0;
  aceleracion = 0;

  actualizarFase();
}

// -----------------------------
// CONTADORES + / -
// -----------------------------
function ajustarContador(valor, cambio) {
  valor += cambio;
  if (valor < 0) valor = 0;
  if (valor > 10) valor = 10;
  return valor;
}

btnDanoMas.addEventListener("click", () => {
  danoMonstruo++;
  if (danoMonstruo >= 10) {
    danoMonstruo = 0;
    heridasMonstruo++;
    if (heridasMonstruo > 10) heridasMonstruo = 10;
  }
  actualizarContadoresUI();
});

btnDanoMenos.addEventListener("click", () => {
  danoMonstruo--;
  if (danoMonstruo < 0) danoMonstruo = 0;
  actualizarContadoresUI();
});

btnEsfuerzoMas.addEventListener("click", () => {
  esfuerzo = ajustarContador(esfuerzo, 1);
  actualizarContadoresUI();
});

btnEsfuerzoMenos.addEventListener("click", () => {
  esfuerzo = ajustarContador(esfuerzo, -1);
  actualizarContadoresUI();
});

btnAceleracionMas.addEventListener("click", () => {
  aceleracion = ajustarContador(aceleracion, 1);
  actualizarContadoresUI();
});

btnAceleracionMenos.addEventListener("click", () => {
  aceleracion = ajustarContador(aceleracion, -1);
  actualizarContadoresUI();
});

// -----------------------------
// AUDIO CONTROLES
// -----------------------------
btnAudio.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    btnAudio.textContent = "🔊";
  } else {
    bgMusic.pause();
    btnAudio.textContent = "🔇";
  }
});

audioVolume.addEventListener("input", () => {
  bgMusic.volume = audioVolume.value;
});

// -----------------------------
// EVENTOS PRINCIPALES
// -----------------------------
btnEntrar.addEventListener("click", () => {
  asegurarMusica();
  bgMusic.play();
  mostrarPantalla("jugadores");
});

btnCancelarJugadores.addEventListener("click", () => {
  mostrarPantalla("inicio");
});

btnSiguienteJugadores.addEventListener("click", () => {
  const seleccion = document.querySelector(`input[name="jugadores"]:checked`);
  if (!seleccion) {
    alert("Debes seleccionar una opción.");
    return;
  }

  totalJugadores = parseInt(seleccion.value);
  jugadorActual = 1;

  mostrarPantalla("monstruo");
});

btnCancelarMonstruo.addEventListener("click", () => {
  mostrarPantalla("jugadores");
});

btnSiguienteMonstruo.addEventListener("click", () => {
  const seleccion = document.querySelector(`input[name="monstruo"]:checked`);
  if (!seleccion) {
    alert("Debes seleccionar un monstruo.");
    return;
  }

  mostrarPantalla("tracker");
  actualizarFase();
});

btnSiguiente.addEventListener("click", avanzarFase);
btnAnterior.addEventListener("click", retrocederFase);
btnReset.addEventListener("click", resetearTodo);

// -----------------------------
// INIT
// -----------------------------
hacerSeleccionUnica("jugadores");
hacerSeleccionUnica("monstruo");

renderListaOrden();
actualizarContadoresUI();
