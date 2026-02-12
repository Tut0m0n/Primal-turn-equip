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
      "La máxima cantidad de cartas de acción que puedas juga
