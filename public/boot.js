// Runs before the app mounts. Kept as a file (not inline) so the
// Content-Security-Policy can forbid all inline scripts.

// Clickjacking guard. Vercel sends X-Frame-Options and frame-ancestors
// (vercel.json); this covers hosts that don't, since browsers ignore both in
// <meta>. The page hides itself when embedded in someone else's frame.
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
    // Only restore a plain same-site path: never "//host", "/\host" or a scheme.
    if (!/^\/(?![\/\\])[^\s\\]*$/.test(decoded)) {
      window.history.replaceState(null, null, "/" + l.hash);
      return;
    }
    window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
  }
})(window.location);
