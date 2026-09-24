// Runs before the app mounts. Kept as a file (not inline) so the
// Content-Security-Policy can forbid all inline scripts.

// Clickjacking guard. GitHub Pages cannot send X-Frame-Options or a
// frame-ancestors CSP header, and browsers ignore both in <meta>, so the page
// hides itself when embedded in someone else's frame.
(function () {
  if (window.top === window.self) return;
  document.documentElement.style.display = "none";
  try {
    window.top.location.replace(window.location.href);
  } catch (e) {
    /* top navigation blocked (e.g. sandboxed frame): stay hidden */
  }
})();

// SPA fallback restore: decodes the redirect from 404.html back into the
// real route. Pairs with public/404.html.
(function (l) {
  if (l.search[1] === "/") {
    var decoded = l.search
      .slice(1)
      .split("&")
      .map(function (s) {
        return s.replace(/~and~/g, "&");
      })
      .join("?");
    window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
  }
})(window.location);
