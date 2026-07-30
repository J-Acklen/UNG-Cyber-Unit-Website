/* Applies the saved theme before first paint (must load before style.css).
   Dark is the default; only 'light' is ever written to <html data-theme>. */
(function () {
  if (localStorage.getItem('cyberunit-theme') === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
