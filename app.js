/*
 * Conecta la interfaz con la lógica: ajustes de lectura, navegación entre
 * vistas, y las dos prácticas (respiración y yoga en silla).
 */
(function (R) {
  "use strict";

  var FONT_STEPS = [1, 1.15, 1.3, 1.5];
  var root = document.documentElement;
  var settings = R.store.get();
  var breath = null;
  var yoga = null;
  var wakeLock = null;

  function $(id) { return document.getElementById(id); }
  function setHidden(id, hidden) { $(id).hidden = hidden; }

  function minutesText(seconds) {
    var m = Math.max(1, Math.round(seconds / 60));
    return m + (m === 1 ? " minuto" : " minutos");
  }

  /* ---------- Anuncios para lectores de pantalla ---------- */
  function announce(text) {
    var region = $("announce");
    region.textContent = "";
    setTimeout(function () { region.textContent = text; }, 50);
  }

  /* ---------- Pantalla encendida durante la práctica ---------- */
  function keepAwake() {
    try {
      if (navigator.wakeLock) {
        navigator.wakeLock.request("screen").then(function (lock) { wakeLock = lock; }, function () {});
      }
    } catch (e) { /* no disponible */ }
  }
  function releaseAwake() {
    try {
      if (wakeLock) { wakeLock.release(); wakeLock = null; }
    } catch (e) { /* ya liberado */ }
  }

  /* ---------- Ajustes de lectura ---------- */
  function applySettings() {
    var step = Math.min(Math.max(Number(settings.fontStep) || 0, 0), FONT_STEPS.length - 1);
    settings.fontStep = step;
    root.style.fontSize = Math.round(FONT_STEPS[step] * 100) + "%";

    if (settings.highContrast) root.setAttribute("data-contrast", "high");
    else root.removeAttribute("data-contrast");

    $("contrast").setAttribute("aria-pressed", String(!!settings.highContrast));
    $("font-down").disabled = step === 0;
    $("font-up").disabled = step === FONT_STEPS.length - 1;
  }

  function bindSettings() {
    $("font-up").addEventListener("click", function () {
      settings = R.store.update({ fontStep: settings.fontStep + 1 });
      applySettings();
    });
    $("font-down").addEventListener("click", function () {
      settings = R.store.update({ fontStep: settings.fontStep - 1 });
      applySettings();
    });
    $("contrast").addEventListener("click", function () {
      settings = R.store.update({ highContrast: !settings.highContrast });
      applySettings();
    });
  }

  /* ---------- Estadísticas ---------- */
  function renderStats() {
    var s = R.store.get();
    $("stats").textContent = s.sessions === 0
      ? "Todavía no completaste ninguna práctica."
      : "Prácticas completadas: " + s.sessions + " · Tiempo total: " + minutesText(s.seconds);
  }

  /* ---------- Opciones de respiración (se arman desde los datos) ---------- */
  function buildRadio(name, value, checked, title, description) {
    var label = document.createElement("label");
    label.className = "choice";

    var input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = value;
    input.checked = checked;

    var body = document.createElement("span");
    body.className = "choice-body";
    var strong = document.createElement("b");
    strong.textContent = title;
    body.appendChild(strong);
    if (description) {
      var small = document.createElement("small");
      small.textContent = description;
      body.appendChild(small);
    }

    label.appendChild(input);
    label.appendChild(body);
    return label;
  }

  function buildChoices() {
    var practices = $("practice-choices");
    Object.keys(R.PRACTICES).forEach(function (key, i) {
      var p = R.PRACTICES[key];
      practices.appendChild(buildRadio("practice", key, i === 0, p.name, p.blurb));
    });

    var minutes = $("minute-choices");
    R.MINUTES.forEach(function (m, i) {
      minutes.appendChild(buildRadio("minutes", String(m), i === 1, m + (m === 1 ? " minuto" : " minutos")));
    });
  }

  function selected(name) {
    return document.querySelector('input[name="' + name + '"]:checked').value;
  }

  /* ---------- Navegación entre vistas ---------- */
  function stopAll() {
    if (breath) { breath.stop(); breath = null; }
    if (yoga) { yoga.stop(); yoga = null; }
    releaseAwake();
    resetBreath();
    resetYoga();
  }

  function showView(name) {
    stopAll();
    setHidden("view-breath", name !== "breath");
    setHidden("view-yoga", name !== "yoga");
    document.querySelectorAll(".view-btn").forEach(function (btn) {
      if (btn.getAttribute("data-view") === name) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }

  /* ---------- Respiración ---------- */
  function resetBreath() {
    setHidden("breath-setup", false);
    setHidden("breath-session", true);
    setHidden("breath-done", true);
    $("breath-pause").textContent = "Pausar";
  }

  function startBreath() {
    var practiceKey = selected("practice");
    var practice = R.PRACTICES[practiceKey];
    var minutes = Number(selected("minutes"));

    setHidden("breath-setup", true);
    setHidden("breath-session", false);
    $("breath-pause").textContent = "Pausar";

    breath = new R.BreathSession(practice, minutes, {
      orb: $("orb"),
      label: $("phase-label"),
      count: $("phase-count"),
      remaining: $("breath-remaining"),
      announce: announce
    }, function (seconds) {
      releaseAwake();
      R.store.addSession(seconds);
      renderStats();
      setHidden("breath-session", true);
      setHidden("breath-done", false);
      $("breath-done-text").textContent =
        "Respiraste durante " + minutesText(seconds) + " con el ritmo «" + practice.name + "». " +
        "Tomate un momento para notar cómo te sentís.";
      $("breath-done-title").focus();
      breath = null;
    });

    keepAwake();
    breath.start();
    $("breath-pause").focus();
  }

  function toggleBreathPause() {
    if (!breath) return;
    if (breath.running) {
      breath.pause();
      $("breath-pause").textContent = "Seguir";
      announce("Pausa");
    } else {
      breath.resume();
      $("breath-pause").textContent = "Pausar";
    }
  }

  function stopBreath() {
    if (breath) breath.stop();
    breath = null;
    releaseAwake();
    resetBreath();
    $("breath-start").focus();
  }

  /* ---------- Yoga en silla ---------- */
  function resetYoga() {
    setHidden("yoga-setup", false);
    setHidden("yoga-session", true);
    setHidden("yoga-done", true);
    $("yoga-pause").textContent = "Pausar";
  }

  function buildYogaIntro() {
    var total = R.POSES.reduce(function (sum, p) { return sum + p.seconds; }, 0);
    $("yoga-intro").textContent =
      "Una secuencia de " + R.POSES.length + " posturas, de unos " + minutesText(total) +
      " en total. Todo se hace sentada o sentado. Avanza sola, y podés pausarla o saltear una postura cuando quieras.";

    var list = $("yoga-list");
    R.POSES.forEach(function (pose) {
      var li = document.createElement("li");
      li.textContent = pose.name;
      list.appendChild(li);
    });
  }

  function startYoga() {
    setHidden("yoga-setup", true);
    setHidden("yoga-session", false);
    $("yoga-pause").textContent = "Pausar";

    yoga = new R.PoseSession(R.POSES, {
      title: $("yoga-title"),
      steps: $("yoga-steps"),
      timer: $("yoga-timer"),
      progressText: $("yoga-progress-text"),
      bar: $("yoga-bar"),
      prev: $("yoga-prev"),
      next: $("yoga-next"),
      announce: announce
    }, function (seconds) {
      releaseAwake();
      R.store.addSession(seconds);
      renderStats();
      setHidden("yoga-session", true);
      setHidden("yoga-done", false);
      $("yoga-done-text").textContent =
        "Practicaste durante " + minutesText(seconds) + ". Bajá el ritmo y tomate un momento antes de levantarte.";
      $("yoga-done-title").focus();
      yoga = null;
    });

    keepAwake();
    yoga.start();
    $("yoga-pause").focus();
  }

  function toggleYogaPause() {
    if (!yoga) return;
    if (yoga.running) {
      yoga.pause();
      $("yoga-pause").textContent = "Seguir";
      announce("Pausa");
    } else {
      yoga.resume();
      $("yoga-pause").textContent = "Pausar";
    }
  }

  function stopYoga() {
    if (yoga) yoga.stop();
    yoga = null;
    releaseAwake();
    resetYoga();
    $("yoga-start").focus();
  }

  /* ---------- Arranque ---------- */
  function init() {
    applySettings();
    bindSettings();
    buildChoices();
    buildYogaIntro();
    renderStats();

    document.querySelectorAll(".view-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { showView(btn.getAttribute("data-view")); });
    });

    $("breath-start").addEventListener("click", startBreath);
    $("breath-pause").addEventListener("click", toggleBreathPause);
    $("breath-stop").addEventListener("click", stopBreath);
    $("breath-again").addEventListener("click", function () { resetBreath(); $("breath-start").focus(); });

    $("yoga-start").addEventListener("click", startYoga);
    $("yoga-pause").addEventListener("click", toggleYogaPause);
    $("yoga-prev").addEventListener("click", function () { if (yoga) yoga.go(-1); });
    $("yoga-next").addEventListener("click", function () { if (yoga) yoga.go(1); });
    $("yoga-stop").addEventListener("click", stopYoga);
    $("yoga-again").addEventListener("click", function () { resetYoga(); $("yoga-start").focus(); });

    // Funciona sin internet: registra el service worker cuando la página se sirve por http(s).
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").catch(function () {});
      });
    }
  }

  init();
})(window.Respira = window.Respira || {});
