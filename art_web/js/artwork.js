/* =========================================================
   artwork.js — render a single artwork detail page
   Reads ?id=... and looks the row up in data/artworks.csv
   ========================================================= */
(function () {
  "use strict";

  var root = document.getElementById("artwork");
  if (!root) return;

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

  function getId() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("id") || "").trim();
  }

  function errorHTML(title, message) {
    return (
      '<h1 class="artwork-title">' + esc(title) + '</h1>' +
      '<div class="error-box">' + message + '</div>' +
      '<p style="margin-top:1.75rem">' +
        '<a class="btn btn-primary" href="index.html">Back to the gallery</a>' +
      '</p>'
    );
  }

  function mediaHTML(item) {
    var isVideo = (item.type || "").toLowerCase() === "video";
    var poster = item.thumbnail || "";

    if (!isVideo) {
      return (
        '<figure class="artwork-media">' +
          '<img src="' + esc(item.file || FALLBACK_IMG) + '" alt="' + esc(item.title) + '" ' +
               'onerror="this.onerror=null;this.src=\'' + FALLBACK_IMG + '\';">' +
        '</figure>'
      );
    }

    return (
      '<figure class="artwork-media" id="mediaFigure">' +
        '<video controls playsinline preload="metadata"' +
          (poster ? ' poster="' + esc(poster) + '"' : "") + '>' +
          '<source src="' + esc(item.file) + '" type="video/mp4">' +
          'Your browser does not support embedded video. ' +
          '<a href="' + esc(item.file) + '">Download the film</a> instead.' +
        '</video>' +
        '<figcaption class="media-note" id="mediaNote"></figcaption>' +
      '</figure>'
    );
  }

  function metaHTML(item) {
    var rows = [];
    if (item.medium) rows.push(["Medium", item.medium]);
    if (item.size) rows.push(["Size / Length", item.size]);
    if (item.year) rows.push(["Year", item.year]);

    if (!rows.length) return "";

    return (
      '<dl class="meta-list">' +
        rows.map(function (r) {
          return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>';
        }).join("") +
      '</dl>'
    );
  }

  function paragraphs(text) {
    return String(text || "")
      .split(/\n+/)
      .filter(function (p) { return p.trim() !== ""; })
      .map(function (p) { return "<p>" + esc(p.trim()) + "</p>"; })
      .join("");
  }

  function render(item) {
    var isVideo = (item.type || "").toLowerCase() === "video";
    document.title = item.title + " — Your Art Corner";

    var desc = document.querySelector('meta[name="description"]');
    if (desc && item.description) desc.setAttribute("content", item.description.slice(0, 160));

    root.innerHTML =
      '<div class="artwork-layout">' +
        '<div>' + mediaHTML(item) + '</div>' +
        '<div>' +
          '<span class="artwork-type">' + (isVideo ? "Video" : "Painting") + '</span>' +
          '<h1 class="artwork-title">' + esc(item.title) + '</h1>' +
          metaHTML(item) +
          '<div class="artwork-desc">' + paragraphs(item.description) + '</div>' +
          '<div class="cta-box">' +
            '<p class="cta-title">Enquire or buy on Instagram</p>' +
            '<p class="cta-text">All sales, commissions and shipping are arranged through ' +
              'direct messages on Instagram. Reference the title “' + esc(item.title) + '”.</p>' +
            '<a class="btn btn-primary" href="' + INSTAGRAM + '" target="_blank" rel="noopener">' +
              'Message @your.art.corner.6</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    if (isVideo) {
      var video = root.querySelector("video");
      var note = root.querySelector("#mediaNote");
      if (video) {
        video.addEventListener("error", function () {
          if (note) {
            note.textContent = "This film file is not available yet. It will play once " +
              "the .mp4 is placed in assets/videos/. Watch it on Instagram meanwhile.";
          }
        }, true);
        var src = video.querySelector("source");
        if (src) {
          src.addEventListener("error", function () {
            if (note) {
              note.textContent = "This film file is not available yet. It will play once " +
                "the .mp4 is placed in assets/videos/. Watch it on Instagram meanwhile.";
            }
          });
        }
      }
    }
  }

  var id = getId();
  if (!id) {
    root.innerHTML = errorHTML("Artwork not found",
      "No artwork id was given in the address. Pick a piece from the gallery instead.");
    return;
  }

  window.ArtData.findById(id)
    .then(function (item) {
      if (!item) {
        root.innerHTML = errorHTML("Artwork not found",
          "We could not find a piece with the id <code>" + esc(id) + "</code> in " +
          "<code>data/artworks.csv</code>.");
        return;
      }
      render(item);
    })
    .catch(function (err) {
      console.error(err);
      root.innerHTML = errorHTML("Could not load this artwork",
        "The data file could not be read. If you are opening this page straight from disk, " +
        "serve it with <code>python3 -m http.server</code> and reload.");
    });
})();
