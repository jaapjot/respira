/*
 * Datos de la app: las prácticas de respiración y las posturas de yoga en silla.
 * Se separan del código para poder editar el contenido sin tocar la lógica.
 */
(function (R) {
  "use strict";

  // Cada práctica es un patrón que se repite. "phase" controla la animación del círculo.
  R.PRACTICES = {
    calma: {
      name: "Calma",
      blurb: "Inhalás 4 segundos y exhalás 6. La exhalación larga suele ayudar a aflojar el cuerpo.",
      pattern: [
        { phase: "inhale", label: "Inhalá", seconds: 4 },
        { phase: "exhale", label: "Exhalá", seconds: 6 }
      ]
    },
    equilibrio: {
      name: "Equilibrio",
      blurb: "Cuatro tiempos iguales: inhalás, sostenés, exhalás y sostenés. Ordena el ritmo.",
      pattern: [
        { phase: "inhale", label: "Inhalá", seconds: 4 },
        { phase: "hold-full", label: "Sostené", seconds: 4 },
        { phase: "exhale", label: "Exhalá", seconds: 4 },
        { phase: "hold-empty", label: "Sostené", seconds: 4 }
      ]
    },
    despertar: {
      name: "Despertar",
      blurb: "Inhalás 3 segundos y exhalás 3, sin pausas. Un ritmo parejo para empezar el día.",
      pattern: [
        { phase: "inhale", label: "Inhalá", seconds: 3 },
        { phase: "exhale", label: "Exhalá", seconds: 3 }
      ]
    }
  };

  // Duraciones disponibles, en minutos.
  R.MINUTES = [1, 3, 5];

  // Secuencia de yoga en silla. Contenido a revisar por la profesora antes de publicar.
  R.POSES = [
    {
      name: "Llegar a la silla",
      seconds: 60,
      steps: [
        "Sentate en el borde de la silla, con los pies apoyados en el piso.",
        "Apoyá las manos sobre los muslos.",
        "Alargá la columna como si un hilo te tirara suavemente de la cabeza.",
        "Respirá por la nariz, con calma."
      ]
    },
    {
      name: "Brazos al cielo",
      seconds: 45,
      steps: [
        "Inhalá y subí los brazos por los costados hasta donde te resulte cómodo.",
        "Exhalá y bajalos despacio.",
        "Repetí al ritmo de tu respiración."
      ]
    },
    {
      name: "Hombros que sueltan",
      seconds: 45,
      steps: [
        "Subí los hombros hacia las orejas al inhalar.",
        "Soltalos hacia atrás y hacia abajo al exhalar.",
        "Hacé círculos lentos: primero hacia atrás y después hacia adelante."
      ]
    },
    {
      name: "Cuello suave",
      seconds: 45,
      steps: [
        "Girá la cabeza hacia la derecha, sin forzar, y mirá hacia ese lado.",
        "Volvé al centro y girá hacia la izquierda.",
        "No lleves la cabeza hacia atrás."
      ]
    },
    {
      name: "Torsión sentada",
      seconds: 45,
      steps: [
        "Apoyá la mano derecha en la rodilla izquierda y la otra mano en el respaldo o en el asiento.",
        "Inhalá para alargarte y exhalá para girar un poco.",
        "A mitad del tiempo, cambiá de lado."
      ]
    },
    {
      name: "Gato y vaca en la silla",
      seconds: 45,
      steps: [
        "Apoyá las manos en las rodillas.",
        "Al inhalar, abrí el pecho y mirá al frente.",
        "Al exhalar, redondeá la espalda y llevá el mentón hacia el pecho.",
        "Hacelo muy suave, sin buscar un movimiento grande."
      ]
    },
    {
      name: "Tobillos y pies",
      seconds: 45,
      steps: [
        "Estirá una pierna hacia adelante y apoyá el talón en el piso.",
        "Hacé círculos con el pie hacia un lado y después hacia el otro.",
        "A mitad del tiempo, cambiá de pierna."
      ]
    },
    {
      name: "Quietud final",
      seconds: 60,
      steps: [
        "Apoyá las manos en el regazo y cerrá los ojos si te resulta cómodo.",
        "Respirá de forma natural.",
        "Notá cómo está tu cuerpo ahora."
      ]
    }
  ];
})(window.Respira = window.Respira || {});
