# Respirá

Aplicación web de respiración guiada y yoga en silla, pensada para adultos mayores. Letra grande, alto contraste, botones amplios y funciona sin internet.

> **Estado:** proyecto personal, versión 1.0. Hecho con HTML, CSS y JavaScript, sin librerías externas.

## El problema

La mayoría de las apps de bienestar están diseñadas para gente joven: letra chica, poco contraste, botones difíciles de tocar y pantallas llenas de estímulos. Para mis alumnos de yoga en silla, que son adultos mayores, eso es una barrera real. Respirá intenta resolverlo con una interfaz simple, legible y calma.

## Qué hace

- **Respiración guiada** con tres ritmos (Calma, Equilibrio y Despertar) y duraciones de 1, 3 o 5 minutos. Un círculo crece al inhalar y se achica al exhalar, y un número cuenta los segundos de cada fase.
- **Secuencia de yoga en silla** de 8 posturas con instrucciones cortas, temporizador y avance automático. Se puede pausar, retroceder o saltear.
- **Ajustes de lectura:** cuatro tamaños de letra y un modo de alto contraste.
- **Registro simple** de prácticas completadas y tiempo total, guardado solo en el dispositivo.
- **Funciona sin conexión** y se puede instalar en el celular como una app (PWA).

## Decisiones de diseño y accesibilidad

| Decisión | Motivo |
|---|---|
| Tipografía del sistema, Verdana primero | Es muy legible y no requiere descargas, así que funciona offline |
| Botones de al menos 3,25 rem de alto | Más fáciles de tocar con poca precisión o temblor |
| Colores con contraste AA o mayor, más modo de alto contraste propio | Mejor lectura con baja visión |
| El círculo tiene un anillo fijo | Se ve hasta dónde llega al inhalar, sin depender del color |
| Anuncios para lectores de pantalla (`aria-live`) | Cada fase y cada postura se anuncian |
| Respeta `prefers-reduced-motion` | Quita la animación para quien la necesita |
| Respeta el modo oscuro del sistema | Menos fatiga visual de noche |
| Mantiene la pantalla encendida durante la práctica | Evita que el teléfono se bloquee a mitad de la sesión |

## Tecnología

- HTML5 semántico, CSS con variables y JavaScript sin dependencias.
- **PWA:** `manifest.webmanifest` y un service worker que guarda los archivos para uso offline.
- `localStorage` para ajustes y estadísticas, con respaldo en memoria si el navegador lo bloquea.

## Estructura

```
respira/
├── index.html
├── manifest.webmanifest
├── sw.js                 # service worker (uso sin conexión)
├── icon.svg
├── css/
│   └── styles.css
└── js/
    ├── data.js           # contenido: ritmos de respiración y posturas
    ├── storage.js        # ajustes y estadísticas
    ├── breath.js         # lógica de la sesión de respiración
    ├── sequence.js       # lógica de la secuencia de yoga
    └── app.js            # conecta la interfaz con la lógica
```

El contenido (ritmos y posturas) está separado del código en `data.js`, así que se puede editar sin tocar la lógica.

## Cómo usarlo

**En tu computadora:** descargá el proyecto y abrí `index.html` con el navegador. La parte de uso sin conexión solo se activa cuando la app está publicada en internet.

**Publicado con GitHub Pages:**
1. Subí los archivos a un repositorio.
2. En el repositorio, entrá a **Settings → Pages**.
3. En **Source**, elegí la rama `main` y la carpeta `/ (root)`.
4. En unos minutos queda disponible en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

## Cómo se desarrolló

Este proyecto lo diseñé yo a partir de mi experiencia dando clases de yoga en silla a adultos mayores, y lo desarrollé con Claude como asistente de programación. Yo definí el problema, el público, las prácticas y las posturas, y revisé y probé el resultado.

## Limitaciones y próximos pasos

- Las instrucciones de las posturas son generales y no reemplazan una clase con profesor ni la indicación médica.
- Sumar sonido opcional (campana suave) al cambiar de fase.
- Sumar más secuencias (movilidad de manos, equilibrio sentado).
- Hacer pruebas con usuarios reales y ajustar según lo que digan.
- Agregar capturas de pantalla en una carpeta `docs/`.
