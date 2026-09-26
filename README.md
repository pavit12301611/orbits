# Orbit — NEET & JEE study space

A fast, private, **zero-dependency** study website: plain HTML, CSS and JavaScript.
No React, build tools, CDNs, external fonts, accounts or servers. Open it and learn.

> `orbit-website.zip` is the original v1 archive. The live site is unzipped at the repo root.

## Run locally

From this folder:

```sh
python3 -m http.server 3000
```

Then open `http://localhost:3000`. Any static host (GitHub Pages, Netlify, VS Code Live Server)
serves the same files unchanged.

## What is inside

- **150 study combinations** — 50 chapters × 3 modes (Learn / Drill / Sprint), plus 6 grand
  modes: NEET full mock (45 Q), JEE full mock (30 Q), Mixed marathon, Daily 10, Speed run
  and a Mistake fixer that re-asks your wrong answers until they stick.
- **408 hand-written questions** with explanations, chapter tags and 3 difficulty levels,
  plus **infinite procedural drills** (derivatives, trig values, kinematics, circuits,
  mole/molarity, pH…) so Sprint mode never runs dry.
- **50 chapter guides** — concept notes, key formulas, worked examples, memory tips and
  an "exam trap" each. Readable, downloadable as `.txt`, bookmarkable.
- **Spaced-repetition flashcards** — 150+ cards auto-built from guides, plus your
  mistakes, scheduled across Leitner boxes 1–5.
- **48-formula sheets** (12 per subject) with one-tap copy and print support.
- **Real exam practice** — shuffled questions *and* options, +4/−1 marking, question
  palette, keyboard shortcuts (`1–4`, `←` `→`), auto-submit timers that survive page
  switches, and full answer reviews linked back to guides.
- **Learning analytics** — XP + levels, streaks, daily goals, per-chapter mastery bars,
  accuracy trend graph, and CSV/JSON export with JSON backup import.
- **Planner + focus timer** — dated tasks, one-click 7-day plans (NEET / JEE / revision
  week), and 15/25/50-minute focus sessions that keep running across pages.
- **Command palette** (`/` or `Ctrl+K`) to jump to any chapter, guide or action.
- **Dark mode**, mobile-first responsive layout, keyboard accessible, reduced-motion
  friendly.

## No sign-in, no data collection

Everything is stored in the browser's `localStorage` on the student's own device.
There is no account system, backend, tracking pixel or network call of any kind —
the site works fully offline once loaded. Students moving devices can use
**Progress → Backup** to export/import a JSON file. Clearing site data erases progress,
so back up before switching browsers.

This is a **starter revision and practice library**, not the complete NEET/JEE
syllabus or official previous-year papers. Pair it with textbooks/NCERT.

## Project layout

| File | Purpose |
|---|---|
| `index.html`, `combos.html`, `materials.html`, `tests.html`, `flashcards.html`, `formulas.html`, `planner.html`, `progress.html`, `bookmarks.html` | Page shells (same scripts, `data-page` picks the view) |
| `assets/data.js` | Subjects, 50 chapters, 48 formulas, planner templates, quotes |
| `assets/bank-physics.js` … `bank-maths.js` | Question banks (`[q, [correct, w1, w2, w3], explanation, chapter, difficulty]`) |
| `assets/guides1.js`, `assets/guides2.js` | 50 study guides |
| `assets/app.js` | State, shell, theme, palette, home, combos browser, library |
| `assets/app-quiz.js` | Generators, test engine, scoring, mistakes, review |
| `assets/app-study.js` | Flashcards, formulas, planner, focus, progress, import/export |
| `assets/style.css` | Light + dark themes, responsive, print styles |
| `manifest.webmanifest` | PWA metadata (installable, standalone) |

## Customise

- Add questions: append entries to the right `assets/bank-*.js` file. First option is
  always the correct one; runtime shuffling handles presentation. Chapter names must
  match `CHAPTERS` in `assets/data.js` exactly.
- Add a guide: push to `MATERIALS` (see `guides1.js` shape). Combos are generated
  automatically — one chapter automatically yields all 3 modes.
- Scoring/pace: `COMBO_MODES` in `app.js`, presets in `startCombo`/`startGrand`.

## Checks performed

`node --check` on every script; a Node harness verified all **150/150 combos build
complete question sets** with exactly one correct answer and no duplicate options,
NEET (45) and JEE (30) mock assembly, generator validity (9 chapters × repeated runs),
150+ flashcards, all 9 page renders, and an end-to-end drill (launch → answer →
score 12 on 4/4 with +4/−1 → mistakes banked → learn-mode lock → retry → mistake
pool). All 23 site URLs return HTTP 200.
