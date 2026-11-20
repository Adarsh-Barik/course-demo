/* =========================================================
   csv.js — tiny CSV parser + data loader
   Exposes: window.parseCSV(text), window.csvToObjects(rows), window.ArtData.load()
   ========================================================= */
(function () {
  "use strict";

  /**
   * Parse RFC-4180-ish CSV text into an array of arrays.
   * Supports quoted fields, escaped quotes ("") and newlines inside quotes.
   */
  function parseCSV(text) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;
    var i = 0;

    // strip BOM
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

    while (i < text.length) {
      var c = text[i];

      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQuotes = false; i += 1; continue;
        }
        field += c; i += 1; continue;
      }

      if (c === '"') { inQuotes = true; i += 1; continue; }
      if (c === ",") { row.push(field); field = ""; i += 1; continue; }
      if (c === "\r") { i += 1; continue; }
      if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i += 1; continue; }

      field += c; i += 1;
    }

    // last field / row
    row.push(field);
    rows.push(row);

    // drop fully-empty trailing rows
    return rows.filter(function (r) {
      return r.some(function (cell) { return String(cell).trim() !== ""; });
    });
  }

  /** Convert parsed rows into objects using the first row as headers. */
  function csvToObjects(rows) {
    if (!rows || rows.length < 2) return [];
    var headers = rows[0].map(function (h) { return h.trim().toLowerCase(); });

    return rows.slice(1).map(function (r) {
      var obj = {};
      headers.forEach(function (h, idx) {
        obj[h] = (r[idx] !== undefined ? String(r[idx]) : "").trim();
      });
      return obj;
    }).filter(function (o) {
      return o.id && o.title;
    });
  }

  var DATA_URL = "data/artworks.csv";

  var ArtData = {
    _cache: null,

    /** Fetch + parse the artworks CSV. Returns a Promise<Array<Object>>. */
    load: function () {
      if (this._cache) return Promise.resolve(this._cache);

      return fetch(DATA_URL, { cache: "no-cache" })
        .then(function (res) {
          if (!res.ok) throw new Error("Could not load " + DATA_URL + " (HTTP " + res.status + ")");
          return res.text();
        })
        .then(function (text) {
          var list = csvToObjects(parseCSV(text));
          ArtData._cache = list;
          return list;
        });
    },

    /** Find a single artwork by its id. */
    findById: function (id) {
      return this.load().then(function (list) {
        return list.filter(function (item) { return item.id === id; })[0] || null;
      });
    }
  };

  window.parseCSV = parseCSV;
  window.csvToObjects = csvToObjects;
  window.ArtData = ArtData;
})();
