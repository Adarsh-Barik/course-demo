/* =========================================================
   site.js — shared behaviour for every page
   ========================================================= */
(function () {
  "use strict";

  /* ---- current year in the footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- highlight the active nav link (safety net) ---- */
  var current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (current === "") current = "index.html";

  document.querySelectorAll(".site-nav a[href]").forEach(function (link) {
    var href = (link.getAttribute("href") || "").toLowerCase();
    if (href === current) link.setAttribute("aria-current", "page");
  });
})();
