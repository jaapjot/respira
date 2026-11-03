/*
 * Sesión de respiración guiada.
 * Cuenta de a un segundo y le dice a la animación (CSS) hacia dónde moverse:
 * el círculo crece al inhalar y se achica al exhalar. La duración de cada
 * movimiento es la duración de la fase, así que la animación sigue al ritmo.
 */
(function (R) {
  "use strict";

  function formatTime(totalSeconds) {
    var m = Math.floor(totalSeconds / 60);
    var s = totalSeconds % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  /**
   * @param {{pattern: Array}} practice  práctica elegida
   * @param {number} minutes             duración pedida (se redondea a ciclos completos)
   * @param {object} ui                  elementos: orb, label, count, remaining, announce(fn)
   * @param {function} onDone            se llama con los segundos practicados al terminar
   */
  function BreathSession(practice, minutes, ui, onDone) {
    this.pattern = practice.pattern;
    var cycleLength = this.pattern.reduce(function (sum, p) { return sum + p.seconds; }, 0);
    var cycles = Math.max(1, Math.round((minutes * 60) / cycleLength));

    this.total = cycles * cycleLength; // termina siempre al final de un ciclo
    this.left = this.total;
    this.index = 0;
    this.phaseLeft = this.pattern[0].seconds;
    this.ui = ui;
    this.onDone = onDone;
    this.timer = null;
    this.running = false;
  }

  BreathSession.prototype.start = function () {
    void this.ui.orb.offsetWidth; // fuerza el estado inicial para que la transición arranque
    this.showPhase();
    this.resume();
  };

  BreathSession.prototype.showPhase = function () {
    var phase = this.pattern[this.index];
    this.ui.label.textContent = phase.label;
    this.ui.announce(phase.label);
    this.ui.orb.style.transitionDuration = this.phaseLeft + "s";
    this.ui.orb.setAttribute("data-phase", phase.phase);
    this.renderNumbers();
  };

  BreathSession.prototype.renderNumbers = function () {
    this.ui.count.textContent = this.phaseLeft;
    this.ui.remaining.textContent = formatTime(this.left);
  };

  BreathSession.prototype.tick = function () {
    this.left -= 1;
    this.phaseLeft -= 1;

    if (this.left <= 0) {
      this.stop();
      this.onDone(this.total);
      return;
    }
    if (this.phaseLeft <= 0) {
      this.index = (this.index + 1) % this.pattern.length;
      this.phaseLeft = this.pattern[this.index].seconds;
      this.showPhase();
      return;
    }
    this.renderNumbers();
  };

  BreathSession.prototype.pause = function () {
    if (!this.running) return;
    this.running = false;
    clearInterval(this.timer);
    // Congela el círculo en el tamaño actual.
    var orb = this.ui.orb;
    var frozen = getComputedStyle(orb).transform;
    orb.style.transitionDuration = "0s";
    if (frozen && frozen !== "none") orb.style.transform = frozen;
  };

  BreathSession.prototype.resume = function () {
    if (this.running) return;
    this.running = true;
    var orb = this.ui.orb;
    if (orb.style.transform) {
      // Retoma el movimiento hacia el tamaño de la fase, durante el tiempo que falta.
      orb.style.transitionDuration = this.phaseLeft + "s";
      orb.style.transform = "";
    }
    var self = this;
    this.timer = setInterval(function () { self.tick(); }, 1000);
  };

  BreathSession.prototype.stop = function () {
    this.running = false;
    clearInterval(this.timer);
    var orb = this.ui.orb;
    orb.style.transform = "";
    orb.style.transitionDuration = "";
    orb.setAttribute("data-phase", "ready");
  };

  R.formatTime = formatTime;
  R.BreathSession = BreathSession;
})(window.Respira = window.Respira || {});
