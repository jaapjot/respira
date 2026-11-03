/*
 * Secuencia de yoga en silla.
 * Recorre una lista de posturas con un temporizador por postura. Avanza sola
 * al terminar el tiempo, y también se puede ir hacia adelante o atrás a mano.
 */
(function (R) {
  "use strict";

  /**
   * @param {Array} poses     lista de posturas ({name, seconds, steps})
   * @param {object} ui       elementos: title, steps, timer, progressText, bar, prev, next, announce(fn)
   * @param {function} onDone se llama con los segundos practicados al terminar
   */
  function PoseSession(poses, ui, onDone) {
    this.poses = poses;
    this.ui = ui;
    this.onDone = onDone;
    this.index = 0;
    this.left = poses[0].seconds;
    this.elapsed = 0;
    this.timer = null;
    this.running = false;
  }

  PoseSession.prototype.start = function () {
    this.renderPose();
    this.resume();
  };

  PoseSession.prototype.renderPose = function () {
    var pose = this.poses[this.index];
    var ui = this.ui;
    var position = "Postura " + (this.index + 1) + " de " + this.poses.length;

    ui.title.textContent = pose.name;
    ui.steps.textContent = "";
    pose.steps.forEach(function (text) {
      var li = document.createElement("li");
      li.textContent = text;
      ui.steps.appendChild(li);
    });

    ui.progressText.textContent = position;
    ui.bar.max = this.poses.length;
    ui.prev.disabled = this.index === 0;
    ui.next.textContent = this.index === this.poses.length - 1 ? "Finalizar" : "Siguiente";
    ui.announce(position + ": " + pose.name);
    this.renderTimer();
  };

  PoseSession.prototype.renderTimer = function () {
    var pose = this.poses[this.index];
    this.ui.timer.textContent = R.formatTime(this.left);
    this.ui.bar.value = this.index + (pose.seconds - this.left) / pose.seconds;
  };

  PoseSession.prototype.tick = function () {
    this.left -= 1;
    this.elapsed += 1;
    if (this.left <= 0) {
      this.go(1);
      return;
    }
    this.renderTimer();
  };

  /** Mueve la secuencia: +1 avanza, -1 retrocede. Pasar la última postura la termina. */
  PoseSession.prototype.go = function (delta) {
    var next = this.index + delta;
    if (next < 0) return;
    if (next >= this.poses.length) {
      this.stop();
      this.onDone(this.elapsed);
      return;
    }
    this.index = next;
    this.left = this.poses[next].seconds;
    this.renderPose();
  };

  PoseSession.prototype.pause = function () {
    this.running = false;
    clearInterval(this.timer);
  };

  PoseSession.prototype.resume = function () {
    if (this.running) return;
    this.running = true;
    var self = this;
    this.timer = setInterval(function () { self.tick(); }, 1000);
  };

  PoseSession.prototype.stop = function () {
    this.running = false;
    clearInterval(this.timer);
  };

  R.PoseSession = PoseSession;
})(window.Respira = window.Respira || {});
