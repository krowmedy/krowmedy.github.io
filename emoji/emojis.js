/* Curated 10x10 emoji art.
 *
 * Each `art` entry is 10 strings of exactly 10 characters.
 *   '.'  = background: no colour, no calculation, left blank on the sheet.
 *   else = a key from `palette`, in palette order.
 *
 * `palette` order matters: it decides which numbers a colour gets
 * (see buildKey in app.js -- value v belongs to colour v % N).
 * Put the dominant colour first so it picks up 0.
 */
window.EMOJIS = [
  {
    id: 'smiley',
    name: 'Smiley Face',
    glyph: '\u{1F642}',
    palette: [
      { key: 'Y', name: 'Yellow', hex: '#FFC83D' },
      { key: 'K', name: 'Black',  hex: '#2B2B2B' }
    ],
    art: [
      '..YYYYYY..',
      '.YYYYYYYY.',
      'YYYYYYYYYY',
      'YYKYYYYKYY',
      'YYKYYYYKYY',
      'YYYYYYYYYY',
      'YKYYYYYYKY',
      'YYKKKKKKYY',
      '.YYYYYYYY.',
      '..YYYYYY..'
    ]
  },
  {
    id: 'heart',
    name: 'Heart',
    glyph: '❤️',
    palette: [
      { key: 'R', name: 'Red',  hex: '#E8384F' },
      { key: 'P', name: 'Pink', hex: '#FF9FB0' }
    ],
    art: [
      '.RR....RR.',
      'RRRRRRRRRR',
      'RPPRRRRRRR',
      'RPPPRRRRRR',
      'RRPPRRRRRR',
      '.RRRRRRRR.',
      '.RRRRRRRR.',
      '..RRRRRR..',
      '...RRRR...',
      '....RR....'
    ]
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    glyph: '\u{1F33B}',
    palette: [
      { key: 'Y', name: 'Yellow', hex: '#FFC83D' },
      { key: 'B', name: 'Brown',  hex: '#8B5A2B' },
      { key: 'G', name: 'Green',  hex: '#3FA34D' }
    ],
    art: [
      '..YY..YY..',
      '.YYYYYYYY.',
      'YYYBBBBYYY',
      'YYBBBBBBYY',
      'YYBBBBBBYY',
      'YYYBBBBYYY',
      '.YYYYYYYY.',
      '..YY..YY..',
      '....GG....',
      '..GGGGGG..'
    ]
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    glyph: '\u{1F383}',
    palette: [
      { key: 'O', name: 'Orange', hex: '#F07818' },
      { key: 'K', name: 'Black',  hex: '#2B2B2B' },
      { key: 'G', name: 'Green',  hex: '#4C9A2A' }
    ],
    art: [
      '....GG....',
      '...OGGO...',
      '..OOOOOO..',
      '.OOOOOOOO.',
      'OOKOOOOKOO',
      'OOKOOOOKOO',
      'OOOOKKOOOO',
      'OKKOOOOKKO',
      '.OOKKKKOO.',
      '..OOOOOO..'
    ]
  },
  {
    id: 'tree',
    name: 'Christmas Tree',
    glyph: '\u{1F384}',
    palette: [
      { key: 'G', name: 'Green', hex: '#2E8B3D' },
      { key: 'R', name: 'Red',   hex: '#E8384F' },
      { key: 'B', name: 'Brown', hex: '#8B5A2B' }
    ],
    art: [
      '....GG....',
      '...GGGG...',
      '...GRGG...',
      '..GGGGGG..',
      '..GRGGRG..',
      '.GGGGGGGG.',
      '.GGRGGGRG.',
      'GGGGGGGGGG',
      'GGRGGGGRGG',
      '...BBBB...'
    ]
  },
  {
    id: 'cat',
    name: 'Cat Face',
    glyph: '\u{1F431}',
    palette: [
      { key: 'O', name: 'Orange', hex: '#F4A23C' },
      { key: 'K', name: 'Black',  hex: '#2B2B2B' },
      { key: 'P', name: 'Pink',   hex: '#FF9FB0' }
    ],
    art: [
      'OP......PO',
      'OPP....PPO',
      'OOOOOOOOOO',
      'OOOOOOOOOO',
      'OOKKOOKKOO',
      'OOKKOOKKOO',
      'OOOOPPOOOO',
      'OOOKOOKOOO',
      '.OOOKKOOO.',
      '..OOOOOO..'
    ]
  },
  {
    id: 'poo',
    name: 'Poo',
    glyph: '\u{1F4A9}',
    palette: [
      { key: 'B', name: 'Brown',      hex: '#8B5A2B' },
      { key: 'K', name: 'Black',      hex: '#2B2B2B' },
      { key: 'D', name: 'Dark Brown', hex: '#5C3A17' }
    ],
    art: [
      '....BB....',
      '...BBBB...',
      '..BDDDDB..',
      '.BBBBBBBB.',
      '.BBBBBBBB.',
      'BDDDDDDDDB',
      'BBKBBBBKBB',
      'BBKBBBBKBB',
      'BBBKKKKBBB',
      '.BBBBBBBB.'
    ]
  },
  {
    id: 'bee',
    name: 'Bee',
    glyph: '\u{1F41D}',
    palette: [
      { key: 'Y', name: 'Yellow', hex: '#FFC83D' },
      { key: 'K', name: 'Black',  hex: '#2B2B2B' }
    ],
    art: [
      '..K....K..',
      '...KKKK...',
      '..KKKKKK..',
      '.YYYYYYYY.',
      '.KKKKKKKK.',
      '.YYYYYYYY.',
      '.KKKKKKKK.',
      '.YYYYYYYY.',
      '..YYYYYY..',
      '....KK....'
    ]
  },
  {
    id: 'frog',
    name: 'Frog',
    glyph: '\u{1F438}',
    palette: [
      { key: 'G', name: 'Green',  hex: '#57B847' },
      { key: 'K', name: 'Black',  hex: '#2B2B2B' },
      { key: 'Y', name: 'Yellow', hex: '#FFD93B' }
    ],
    art: [
      '.GGG..GGG.',
      '.YYY..YYY.',
      '.YKY..YKY.',
      'GGGGGGGGGG',
      'GGGKGGKGGG',
      'GGGGGGGGGG',
      'GGGGGGGGGG',
      'GKGGGGGGKG',
      'GGKKKKKKGG',
      '.GGGGGGGG.'
    ]
  },
  {
    id: 'penguin',
    name: 'Penguin',
    glyph: '\u{1F427}',
    palette: [
      { key: 'K', name: 'Black',  hex: '#2B2B2B' },
      { key: 'A', name: 'Grey',   hex: '#C2C8D0' },
      { key: 'O', name: 'Orange', hex: '#FF8A1F' }
    ],
    art: [
      '...KKKK...',
      '..KKKKKK..',
      '.KKAAAAKK.',
      '.KKKAAKKK.',
      '.KKAOOAKK.',
      'KKKAAAAKKK',
      'KKAAAAAAKK',
      'KKAAAAAAKK',
      'KKAAAAAAKK',
      '.OOO..OOO.'
    ]
  },
  {
    id: 'rocket',
    name: 'Rocket',
    glyph: '\u{1F680}',
    palette: [
      { key: 'A', name: 'Grey',   hex: '#AAB4BF' },
      { key: 'R', name: 'Red',    hex: '#E8384F' },
      { key: 'O', name: 'Orange', hex: '#FF8A1F' },
      { key: 'B', name: 'Blue',   hex: '#3B82F6' }
    ],
    art: [
      '....RR....',
      '...RRRR...',
      '...AAAA...',
      '...ABBA...',
      '...ABBA...',
      '...AAAA...',
      '.RRAAAARR.',
      '.RRAAAARR.',
      '...OOOO...',
      '....OO....'
    ]
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    glyph: '\u{1F308}',
    palette: [
      { key: 'R', name: 'Red',    hex: '#E8384F' },
      { key: 'O', name: 'Orange', hex: '#FF8A1F' },
      { key: 'G', name: 'Green',  hex: '#3FA34D' },
      { key: 'B', name: 'Blue',   hex: '#3B82F6' }
    ],
    art: [
      '..RRRRRR..',
      '.ROOOOOOR.',
      'ROOGGGGOOR',
      'ROGGBBGGOR',
      'ROGB..BGOR',
      'ROGB..BGOR',
      'ROGB..BGOR',
      'ROGB..BGOR',
      'ROGB..BGOR',
      'ROGB..BGOR'
    ]
  }
];
