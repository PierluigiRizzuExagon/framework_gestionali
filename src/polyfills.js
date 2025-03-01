// Polyfill minimo per l'ambiente browser
if (typeof window !== "undefined") {
  // Definisci global come window per compatibilità
  window.global = window;

  // Fornisci un oggetto process vuoto
  window.process = window.process || {
    env: {},
    browser: true,
    version: "",
    versions: {},
    platform: "browser",
    nextTick: function (cb) {
      setTimeout(cb, 0);
    },
  };
}
