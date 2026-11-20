# Your Art Corner

A static, fully responsive art gallery site built for GitHub Pages.
Paintings and videos are listed in a CSV file; each one opens its own detail page
with a link to Instagram for all sales and enquiries.

---

## 1. Folder structure
your-art-corner/
├── index.html → gallery (hero + filterable tiles)
├── about.html → the artist
├── artwork.html → detail template (reads ?id= from the URL)
├── .nojekyll → empty file, required for GitHub Pages
├── README.md
├── css/style.css → all styling
├── js/
│ ├── csv.js → CSV parser + data loader
│ ├── site.js → shared behaviour (year, nav state)
│ ├── gallery.js → builds the tile grid & filters
│ └── artwork.js → builds the detail page
├── data/
│ └── artworks.csv → THE list of artworks
└── assets/
├── favicon.svg
├── artist.svg → about-page portrait (replace with a photo)
├── images/ → paintings, thumbnails, posters
└── videos/ → .mp4 films


---

## 2. Add or edit an artwork

Open `data/artworks.csv`. Each line is one artwork. The columns are:

| Column | What it is | Example |
|---|---|---|
| `id` | Unique, URL-safe slug. Used in `artwork.html?id=…` | `madhubani-fish` |
| `title` | Display name | `Fish of the Mithila River` |
| `type` | `image` or `video` | `image` |
| `file` | Path to the main image, or the `.mp4` for videos | `assets/images/madhubani-fish.jpg` |
| `thumbnail` | Path to the tile image / video poster | `assets/images/madhubani-fish.jpg` |
| `medium` | Materials, or a short label for films | `Ink and natural pigment on paper` |
| `size` | Dimensions, or the running time | `18 × 24 in` |
| `year` | Year made | `2024` |
| `description` | One paragraph (or several, separated by line breaks inside quotes) | `Two fish circle each other…` |

**Rules of thumb**

- Quote any field that contains a comma, quote, or line break:
  `"Ink, gouache and gold on paper"`
- Escape a literal double quote inside a quoted field by doubling it: `""`.
- Keep `id` unique and lowercase with hyphens — no spaces.

---

## 3. Add your real media

1. Drop your image files into `assets/images/`.
   Use the same aspect ratio (ideally **4:5 portrait**) for a tidy grid.
   Keep files under ~400 KB each (compress with [Squoosh](https://squoosh.app)).
2. Drop your `.mp4` films into `assets/videos/`.
   For smooth playback on phones, encode H.264/AAC at 720p or 1080p.
3. Point the CSV `file` and `thumbnail` columns at the new paths.
4. Replace `assets/artist.svg` with your photo (e.g. `assets/artist.jpg`)
   and update the `<img src="…">` in `about.html`.

The sample SVGs currently in `assets/images/` are placeholders — delete them
once your own files are in place, or keep them as a "coming soon" set.

---

## 4. Preview locally

Browsers block `fetch()` on `file://` URLs, so use a tiny local server:

```bash
# Python 3
python3 -m http.server 8000

# or Node
npx serve .
