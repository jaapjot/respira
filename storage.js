/*
 * Guarda los ajustes y las estadísticas en el navegador (localStorage).
 * Si el navegador bloquea el almacenamiento (por ejemplo, en modo privado),
 * los datos se guardan en memoria y la app sigue funcionando mientras esté abierta.
 */
(function (R) {
  "use strict";

  var KEY = "respira:v1";
  var DEFAULTS = { fontStep: 0, highContrast: false, sessions: 0, seconds: 0 };
  var memory = Object.assign({}, DEFAULTS); // respaldo si localStorage no está disponible

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) memory = Object.assign({}, DEFAULTS, JSON.parse(raw));
    } catch (e) {
      /* se usa la copia en memoria */
    }
    return Object.assign({}, memory);
  }

  function write(state) {
    memory = Object.assign({}, state);
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* sin almacenamiento: queda en memoria */
    }
  }

  R.store = {
    get: read,
    update: function (patch) {
      var next = Object.assign(read(), patch);
      write(next);
      return next;
    },
    addSession: function (seconds) {
      var current = read();
      return R.store.update({
        sessions: current.sessions + 1,
        seconds: current.seconds + seconds
      });
    }
  };
})(window.Respira = window.Respira || {});
