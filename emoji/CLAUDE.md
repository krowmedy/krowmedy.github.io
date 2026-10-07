# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`emoji/` is a self-contained "colour by sums" worksheet generator: a 10x10 grid of
addition/subtraction calculations (answers 0–10) that colours in to reveal a hidden
emoji picture. It lives inside `krowmedy.github.io`, a Jekyll site published to GitHub
Pages, but has no Jekyll front matter and is served as a plain static page at
`/emoji/`.

## Running it

No build step, no dependencies, no tests or linter. `index.html` loads `emojis.js`
then `app.js` as classic scripts, so opening `emoji/index.html` directly in a browser
is the normal dev loop. The one caveat: on `file://` `history.replaceState` may throw,
so the `?emoji=&seed=` URL sync silently no-ops (`syncUrl` swallows it).

To exercise it under the real site, from the repo root:

```bash
bundle install              # first time
bundle exec jekyll serve    # http://localhost:4000/emoji/
```

## Architecture

`emojis.js` is data, `app.js` is everything else, `styles.css` owns both screen and
print layout. The split matters: adding pictures should never require touching
`app.js`.

**The art format** (`window.EMOJIS` in `emojis.js`) is the main contract:

- `art` is exactly 10 strings of exactly 10 characters.
- `'.'` means background — no colour, no calculation, rendered as an empty but
  fully-bordered square. Everything else must be a `key` from that emoji's `palette`.
- **Palette order determines which numbers each colour gets.** `buildKey` assigns
  answer `v` to colour `v % palette.length`, so with two colours this is the
  even/odd split of the original paper worksheet. Put the dominant colour first so
  it picks up `0`.
- `validateData()` runs on load and `console.warn`s on wrong row counts, wrong row
  lengths, and characters missing from the palette — check the browser console after
  authoring new art rather than eyeballing the grid.

**Determinism.** Sheets are generated from a `mulberry32` seed, and `?emoji=<id>&seed=<n>`
is kept in step with state so a printed worksheet can be re-printed or shared exactly.
Any change to the *order or number* of `rand()` calls in `makeExpression`/`buildSheet`
silently changes what every existing seed produces. Treat that as a breaking change to
already-shared URLs.

**Single source of truth for cell appearance.** `applyFills()` is the only code that
sets a square's background: it paints `cell.colour` when `state.revealed`, otherwise
`cell.painted`. Nothing else should write `td.style.background` — add state to the
cell and let `applyFills` interpret it.

**Painting** is pointer-event based with `setPointerCapture` so drags keep working
outside the grid, and `cellFromPoint` re-resolves the element under the pointer each
move. `touch-action: none` on `.grid` in CSS is load-bearing for touch dragging.
Clicking a square that already holds the selected colour erases instead of painting.

**New sums** regenerates the calculations with a fresh seed but deliberately carries
`cell.painted` across, so a part-coloured sheet is not lost.

## Print layout

`styles.css` targets a single A4 portrait page: `@page { size: A4 portrait; margin: 0 }`,
and the grid is square so its size is capped by the short edge — `--cell: 18mm` x 10
= 180mm inside 210mm. Controls are hidden via `.no-print`, and the grid sets
`print-color-adjust: exact` so coloured squares actually print. Changing the grid size
or page padding means re-checking that 180mm fit.

## Repo notes

- The surrounding site is `mmistakes/minimal-mistakes` via `remote_theme`; posts live
  in `_posts/`, standalone pages in `_pages/`. `seagull/` is a separate pre-built
  static game — treat its `assets/*.js` as build output, not source.
- `*.Identifier` files that appear next to edited files are Windows/WSL
  mark-of-the-web artifacts; they are gitignored and can be ignored.
