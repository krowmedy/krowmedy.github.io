/* Emoji Colour by Sums -- builds a 10x10 "solve the sum, colour the square"
   worksheet from the hand-authored art in emojis.js. */
(function () {
  'use strict';

  var SIZE = 10;
  var MAX_ANSWER = 10;

  var els = {
    picker: document.getElementById('picker'),
    key: document.getElementById('key'),
    grid: document.getElementById('grid'),
    newSums: document.getElementById('btn-new'),
    check: document.getElementById('btn-check'),
    reveal: document.getElementById('btn-reveal'),
    print: document.getElementById('btn-print')
  };

  var state = {
    emoji: null,     // the active emoji record from window.EMOJIS
    seed: 0,
    key: [],         // [{ key, name, hex, numbers: [..] }]
    cells: [],       // row-major, SIZE * SIZE; see buildSheet
    crayon: null,    // palette key of the selected colour, or null
    revealed: false
  };

  /* ------------------------------------------------------------ utilities */

  // mulberry32: tiny seeded PRNG, so a given seed always rebuilds the same
  // sheet and a printed worksheet can be reproduced from its URL.
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), 1 | t);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randInt(rand, lo, hi) {        // inclusive
    return lo + Math.floor(rand() * (hi - lo + 1));
  }

  function isDark(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) < 145;
  }

  function paletteEntry(emoji, key) {
    for (var i = 0; i < emoji.palette.length; i++) {
      if (emoji.palette[i].key === key) return emoji.palette[i];
    }
    return null;
  }

  /* --------------------------------------------------------- data checking */

  function validateData() {
    (window.EMOJIS || []).forEach(function (emoji) {
      if (emoji.art.length !== SIZE) {
        console.warn('[' + emoji.id + '] art has ' + emoji.art.length + ' rows, expected ' + SIZE);
      }
      emoji.art.forEach(function (row, r) {
        if (row.length !== SIZE) {
          console.warn('[' + emoji.id + '] row ' + r + ' is ' + row.length + ' chars, expected ' + SIZE);
        }
        for (var c = 0; c < row.length; c++) {
          var ch = row[c];
          if (ch !== '.' && !paletteEntry(emoji, ch)) {
            console.warn('[' + emoji.id + '] row ' + r + ' col ' + c + ': "' + ch + '" is not in the palette');
          }
        }
      });
    });
  }

  /* ------------------------------------------------------- the colour key */

  // Answers run 0..MAX_ANSWER. With N colours, value v belongs to colour v % N.
  // For N = 2 that is exactly the even/odd split of the original worksheet.
  function buildKey(palette) {
    var n = palette.length;
    return palette.map(function (colour, i) {
      var numbers = [];
      for (var v = 0; v <= MAX_ANSWER; v++) {
        if (v % n === i) numbers.push(v);
      }
      return { key: colour.key, name: colour.name, hex: colour.hex, numbers: numbers };
    });
  }

  /* ------------------------------------------------------ sum generation */

  // Build a calculation whose answer is `target`, using only operands 0..10
  // and never going negative.
  function makeExpression(rand, target) {
    if (rand() < 0.5) {
      var a = randInt(rand, 0, target);
      return a + ' + ' + (target - a);
    }
    var b = randInt(rand, target, MAX_ANSWER);
    return b + ' − ' + (b - target);
  }

  function buildSheet(emoji, seed) {
    var rand = mulberry32(seed);
    var key = buildKey(emoji.palette);
    var cells = [];

    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var ch = emoji.art[r][c];
        if (ch === '.') {
          cells.push({ row: r, col: c, colour: null, answer: null, text: '', painted: null });
          continue;
        }

        var entry = null;
        for (var i = 0; i < key.length; i++) {
          if (key[i].key === ch) { entry = key[i]; break; }
        }
        var answer = entry.numbers[randInt(rand, 0, entry.numbers.length - 1)];

        // Avoid printing the same calculation as the cell above or to the left,
        // so the sheet does not look copy-pasted.
        var left = c > 0 ? cells[r * SIZE + c - 1] : null;
        var up = r > 0 ? cells[(r - 1) * SIZE + c] : null;
        var text = '';
        for (var attempt = 0; attempt < 4; attempt++) {
          text = makeExpression(rand, answer);
          if ((!left || left.text !== text) && (!up || up.text !== text)) break;
        }

        cells.push({ row: r, col: c, colour: ch, answer: answer, text: text, painted: null });
      }
    }

    state.emoji = emoji;
    state.seed = seed;
    state.key = key;
    state.cells = cells;
    state.crayon = key[0].key;
    state.revealed = false;
  }

  /* ------------------------------------------------------------ rendering */

  function renderPicker() {
    els.picker.innerHTML = '';
    window.EMOJIS.forEach(function (emoji) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-pressed', String(emoji.id === state.emoji.id));
      btn.innerHTML = '<span class="glyph"></span><span class="label"></span>';
      btn.querySelector('.glyph').textContent = emoji.glyph;
      btn.querySelector('.label').textContent = emoji.name;
      btn.addEventListener('click', function () {
        buildSheet(emoji, state.seed);
        renderAll();
        syncUrl();
      });
      els.picker.appendChild(btn);
    });
  }

  function renderKey() {
    els.key.innerHTML = '';
    state.key.forEach(function (colour) {
      var box = document.createElement('button');
      box.type = 'button';
      box.className = 'key-box';
      box.setAttribute('aria-pressed', String(colour.key === state.crayon));
      box.innerHTML =
        '<span class="key-name"><span class="swatch"></span><span class="cname"></span></span>' +
        '<span class="key-numbers"></span>';
      box.querySelector('.swatch').style.background = colour.hex;
      box.querySelector('.cname').textContent = colour.name + ':';
      box.querySelector('.key-numbers').textContent = colour.numbers.join(', ');
      box.addEventListener('click', function () {
        state.crayon = colour.key;
        renderKey();
      });
      els.key.appendChild(box);
    });
  }

  function renderGrid() {
    els.grid.innerHTML = '';
    for (var r = 0; r < SIZE; r++) {
      var tr = document.createElement('tr');
      for (var c = 0; c < SIZE; c++) {
        var cell = state.cells[r * SIZE + c];
        var td = document.createElement('td');
        td.dataset.index = String(r * SIZE + c);
        if (cell.colour) {
          td.className = 'sum';
          td.textContent = cell.text;
        } else {
          td.className = 'blank';
          // A non-breaking space keeps the empty square at full height, so its
          // borders always draw as part of the grid.
          td.innerHTML = '&nbsp;';
        }
        tr.appendChild(td);
      }
      els.grid.appendChild(tr);
    }
    applyFills();
  }

  // One place decides what every square looks like: the revealed answer when
  // Reveal is on, otherwise whatever has been coloured in.
  function applyFills() {
    var tds = els.grid.querySelectorAll('td');
    for (var i = 0; i < tds.length; i++) {
      var td = tds[i];
      var cell = state.cells[Number(td.dataset.index)];
      var key = state.revealed ? cell.colour : cell.painted;
      var entry = key ? paletteEntry(state.emoji, key) : null;
      td.style.background = entry ? entry.hex : '';
      td.style.color = entry && isDark(entry.hex) ? '#fff' : '';
    }
  }

  function clearMarks() {
    var marked = els.grid.querySelectorAll('td.wrong');
    for (var i = 0; i < marked.length; i++) marked[i].classList.remove('wrong');
  }

  function renderAll() {
    renderPicker();
    renderKey();
    renderGrid();
    els.reveal.setAttribute('aria-pressed', String(state.revealed));
  }

  /* ------------------------------------------------------------ colouring */

  var drag = { active: false, mode: 'paint' };

  function cellFromPoint(x, y) {
    var el = document.elementFromPoint(x, y);
    if (!el || el.tagName !== 'TD' || !el.classList.contains('sum')) return null;
    if (!els.grid.contains(el)) return null;
    return el;
  }

  function applyCrayon(td) {
    var cell = state.cells[Number(td.dataset.index)];
    cell.painted = drag.mode === 'erase' ? null : state.crayon;
    td.classList.remove('wrong');
    applyFills();
  }

  els.grid.addEventListener('pointerdown', function (e) {
    if (state.revealed || !state.crayon) return;
    var td = cellFromPoint(e.clientX, e.clientY);
    if (!td) return;
    e.preventDefault();
    var cell = state.cells[Number(td.dataset.index)];
    // Clicking a square that already holds the selected colour rubs it out.
    drag.mode = cell.painted === state.crayon ? 'erase' : 'paint';
    drag.active = true;
    applyCrayon(td);
    els.grid.setPointerCapture(e.pointerId);
  });

  els.grid.addEventListener('pointermove', function (e) {
    if (!drag.active) return;
    var td = cellFromPoint(e.clientX, e.clientY);
    if (td) applyCrayon(td);
  });

  function endDrag(e) {
    if (!drag.active) return;
    drag.active = false;
    if (els.grid.hasPointerCapture && els.grid.hasPointerCapture(e.pointerId)) {
      els.grid.releasePointerCapture(e.pointerId);
    }
  }
  els.grid.addEventListener('pointerup', endDrag);
  els.grid.addEventListener('pointercancel', endDrag);

  /* -------------------------------------------------------------- toolbar */

  els.newSums.addEventListener('click', function () {
    var painted = state.cells.map(function (cell) { return cell.painted; });
    buildSheet(state.emoji, (Math.random() * 0xFFFFFFFF) >>> 0);
    state.cells.forEach(function (cell, i) { cell.painted = painted[i]; });
    renderAll();
    syncUrl();
  });

  els.check.addEventListener('click', function () {
    clearMarks();
    var tds = els.grid.querySelectorAll('td');
    var wrong = 0;
    for (var i = 0; i < tds.length; i++) {
      var cell = state.cells[Number(tds[i].dataset.index)];
      if (cell.painted && cell.painted !== cell.colour) {
        tds[i].classList.add('wrong');
        wrong++;
      }
    }
    els.check.textContent = wrong === 0 ? 'All correct!' : wrong + ' to fix';
    setTimeout(function () { els.check.textContent = 'Check'; }, 2000);
  });

  els.reveal.addEventListener('click', function () {
    state.revealed = !state.revealed;
    els.reveal.setAttribute('aria-pressed', String(state.revealed));
    clearMarks();
    applyFills();
  });

  els.print.addEventListener('click', function () { window.print(); });

  /* ------------------------------------------------------------------ url */

  // Keeps ?emoji=&seed= in step with the sheet so a worksheet can be
  // reprinted or shared exactly. Fails silently on file:// in some browsers.
  function syncUrl() {
    try {
      history.replaceState(null, '', '?emoji=' + state.emoji.id + '&seed=' + state.seed);
    } catch (err) { /* not available from a local file; harmless */ }
  }

  function startingSheet() {
    var params = new URLSearchParams(location.search);
    var wanted = params.get('emoji');
    var emoji = window.EMOJIS.filter(function (e) { return e.id === wanted; })[0] || window.EMOJIS[0];
    var seed = parseInt(params.get('seed'), 10);
    if (!isFinite(seed)) seed = (Math.random() * 0xFFFFFFFF) >>> 0;
    return { emoji: emoji, seed: seed >>> 0 };
  }

  validateData();
  var start = startingSheet();
  buildSheet(start.emoji, start.seed);
  renderAll();
  syncUrl();
})();
