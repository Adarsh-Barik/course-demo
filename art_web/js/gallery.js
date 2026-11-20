/* =========================================================
   gallery.js — build the filterable tile grid from CSV
   ========================================================= */
(function () {
  "use strict";

  var grid = document.getElementById("galleryGrid");
  var statusEl = document.getElementById("galleryStatus");
  var filterBar = document.getElementById("filterBar");
  if (!grid) return;

  var items = [];
  var activeFilter = "all";

  var INSTAGRAM = "https://www.instagram.com/your.art.corner.6";
  var FALLBACK_IMG = "assets/images/madhubani-fish.svg";

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function isVideo(item) {
    return (item.type || "").toLowerCase() === "video";
  }

  function cardHTML(item, index) {
    var video = isVideo(item);
    var thumb = item.thumbnail || item.file || FALLBACK_IMG;
    var meta = [item.medium, item.year].filter(Boolean).join(" · ");

    return (
      '<a class="art-card" href="artwork.html?id=' + encodeURIComponent(item.id) + '"' +
      ' style="--i:' + index + '" data-type="' + (video ? "video" : "image") + '">' +
        '<figure class="art-card-media">' +
          '<img src="' + esc(thumb) + '" alt="' + esc(item.title) + '" loading="lazy" decoding="async" ' +
               'onerror="this.onerror=null;this.src=\'' + FALLBACK_IMG + '\';">' +
          (video
            ? '<span class="art-card-badge">Video</span>' +
              '<span class="art-card-play" aria-hidden="true"><span>&#9654;</span></span>'
            : "") +
        '</figure>' +
        '<div class="art-card-body">' +
          '<h3 class="art-card-title">' + esc(item.title) + '</h3>' +
          '<p class="art-card-meta">' + esc(meta) + '</p>' +
        '</div>' +
      '</a>'
    );
  }

  function render() {
    if (!items.length) {
      grid.innerHTML = "";
      statusEl.hidden = false;
      statusEl.innerHTML =
        'No artworks listed yet. Add rows to <code>data/artworks.csv</code> to see them here. ' +
        'Meanwhile, the full collection lives on ' +
        '<a href="' + INSTAGRAM + '" target="_blank" rel="noopener">Instagram</a>.';
      return;
    }

    statusEl.hidden = true;
    grid.innerHTML = items.map(cardHTML).join("");
    applyFilter(activeFilter);
  }

  function applyFilter(filter) {
    activeFilter = filter;
    var cards = grid.querySelectorAll(".art-card");
    var shown = 0;

    cards.forEach(function (card) {
      var match = filter === "all" || card.getAttribute("data-type") === filter;
      card.classList.toggle("is-hidden", !match);
      if (match) shown++;
    });

    if (filterBar) {
      filterBar.querySelectorAll(".filter").forEach(function (btn) {
        var on = btn.getAttribute("data-filter") === filter;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }

    if (!shown) {
      statusEl.hidden = false;
      statusEl.textContent = "Nothing in this category yet — try “All”.";
    } else {
      statusEl.hidden = true;
    }
  }

  /* ---- filter buttons ---- */
  if (filterBar) {
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      applyFilter(btn.getAttribute("data-filter") || "all");
    });
  }

  /* ---- load data ---- */
  window.ArtData.load()
    .then(function (list) {
      items = list;
      render();
    })
    .catch(function (err) {
      console.error(err);
      statusEl.hidden = false;
      statusEl.innerHTML =
        "Could not load the collection. If you are opening this file directly from disk, " +
        "run a local server instead (e.g. <code>python3 -m http.server</code>), then reload. " +
        'You can always browse the work on <a href="' + INSTAGRAM + '" target="_blank" rel="noopener">Instagram</a>.';
    });
})();
