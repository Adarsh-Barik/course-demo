// ---------- Configuration ----------
// const WORD_LIST_URL =
//    'https://gist.githubusercontent.com/shmookey/b28e342e1b1756c4700f42f17102c2ff/raw/ed4c33a168027aa1e448c579c8383fe20a3a6225/WORDS';
const WORD_LIST_URL = 'wordlist'

const MAX_ATTEMPTS = 5;
const WORD_LENGTH = 5;

// ---------- State ----------
let secretWord = '';
let currentGuess = '';
let currentRow = 0;
let gameOver = false;
let wordList = [];

// ---------- DOM references ----------
const boardEl = document.getElementById('game-board');
const keyboardEl = document.getElementById('keyboard');
const messageEl = document.getElementById('message');
const newGameBtn = document.getElementById('new-game');
const toggleBtn = document.getElementById('toggle-instructions');
const instructionsEl = document.getElementById('instructions');

// ---------- Initialise ----------
async function init() {
    await loadWordList();
    buildBoard();
    buildKeyboard();
    startNewGame();
}

// ---------- Load word list ----------
async function loadWordList() {
    try {
        const res = await fetch(WORD_LIST_URL);
        const text = await res.text();
        // The gist is a space‑separated string of 5‑letter words
        wordList = text
            .split(/\s+/)
            .map(w => w.trim().toUpperCase())
            .filter(w => w.length === WORD_LENGTH && /^[A-Z]+$/.test(w));

        if (wordList.length === 0) throw new Error('Empty word list');
    } catch (err) {
        console.error('Failed to load word list, using fallback.', err);
        wordList = [
            'APPLE', 'BRAIN', 'CRANE', 'DRIVE', 'EAGLE',
            'FLAME', 'GRACE', 'HEART', 'IMAGE', 'JOKER',
            'KNIFE', 'LIGHT', 'MAGIC', 'NIGHT', 'OCEAN',
            'PEACE', 'QUEEN', 'RIVER', 'STONE', 'TIGER'
        ];
    }
}

// ---------- Build empty board ----------
function buildBoard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < MAX_ATTEMPTS; r++) {
        const row = document.createElement('div');
        row.className = 'guess-row';
        for (let c = 0; c < WORD_LENGTH; c++) {
            const tile = document.createElement('div');
            tile.className = 'tile empty';
            tile.dataset.row = r;
            tile.dataset.col = c;
            row.appendChild(tile);
        }
        boardEl.appendChild(row);
    }
}

// ---------- Build on‑screen keyboard ----------
function buildKeyboard() {
    const rows = [
        ['Q','W','E','R','T','Y','U','I','O','P'],
        ['A','S','D','F','G','H','J','K','L'],
        ['ENTER','Z','X','C','V','B','N','M','⌫']
    ];

    keyboardEl.innerHTML = '';
    rows.forEach(rowKeys => {
        const rowEl = document.createElement('div');
        rowEl.className = 'keyboard-row';
        rowKeys.forEach(key => {
            const btn = document.createElement('button');
            btn.className = 'key';
            btn.textContent = key;
            btn.dataset.key = key;
            btn.addEventListener('click', () => handleKey(key));
            rowEl.appendChild(btn);
        });
        keyboardEl.appendChild(rowEl);
    });
}

// ---------- Start a new game ----------
function startNewGame() {
    secretWord = wordList[Math.floor(Math.random() * wordList.length)];
    currentGuess = '';
    currentRow = 0;
    gameOver = false;
    messageEl.textContent = '';

    // Reset board
    document.querySelectorAll('.tile').forEach(tile => {
        tile.className = 'tile empty';
        tile.textContent = '';
    });

    // Reset keyboard colours
    document.querySelectorAll('.key').forEach(key => {
        key.classList.remove('lightblue', 'green', 'red');
    });

    console.log('Secret (for debugging):', secretWord); // Remove in production
}

// ---------- Handle key press (on‑screen or physical) ----------
function handleKey(key) {
    if (gameOver) return;

    // Auto‑collapse instructions on first key press
    if (!instructionsEl.classList.contains('hidden')) {
        instructionsEl.classList.add('hidden');
        toggleBtn.textContent = '📖 Show Instructions';
        toggleBtn.setAttribute('aria-expanded', 'false');
    }

    if (key === 'ENTER') {
        submitGuess();
    } else if (key === '⌫' || key === 'BACKSPACE') {
        if (currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
            updateCurrentRow();
        }
    } else if (/^[A-Z]$/.test(key)) {
        if (currentGuess.length < WORD_LENGTH) {
            currentGuess += key;
            updateCurrentRow();
        }
    }
}

// ---------- Update the current row with typed letters ----------
function updateCurrentRow() {
    const tiles = document.querySelectorAll(
        `.tile[data-row="${currentRow}"]`
    );
    tiles.forEach((tile, idx) => {
        tile.textContent = currentGuess[idx] || '';
    });
}

// ---------- Submit the current guess ----------
function submitGuess() {
    if (currentGuess.length !== WORD_LENGTH) {
        messageEl.textContent = 'Guess must be exactly 5 letters.';
        return;
    }

    messageEl.textContent = '';

    // Evaluate guess and colour tiles
    const tiles = document.querySelectorAll(
        `.tile[data-row="${currentRow}"]`
    );

    for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = currentGuess[i];
        const secretLetter = secretWord[i];

        let cls;
        if (letter < secretLetter) {
            cls = 'lightblue';
        } else if (letter === secretLetter) {
            cls = 'green';
        } else {
            cls = 'red';
        }

        // Apply colour with flip animation
        tiles[i].classList.remove('empty');
        tiles[i].classList.add(cls, 'flip');
        tiles[i].textContent = letter;

        // Update keyboard key colour (priority: green > red > lightblue)
        const keyBtn = [...document.querySelectorAll('.key')].find(
            k => k.dataset.key === letter
        );
        if (keyBtn) {
            const existing = keyBtn.classList;
            if (!existing.contains('green') && !existing.contains('red')) {
                if (cls === 'green') {
                    keyBtn.classList.remove('lightblue');
                    keyBtn.classList.add('green');
                } else if (cls === 'red') {
                    keyBtn.classList.remove('lightblue', 'green');
                    keyBtn.classList.add('red');
                } else if (cls === 'lightblue' && !existing.contains('lightblue')) {
                    keyBtn.classList.add('lightblue');
                }
            }
        }
    }

    // Check win
    if (currentGuess === secretWord) {
        gameOver = true;
        messageEl.textContent = '🎉 Congratulations! You guessed the word!';
        return;
    }

    currentRow++;
    currentGuess = '';

    if (currentRow >= MAX_ATTEMPTS) {
        gameOver = true;
        messageEl.textContent = `😞 Out of attempts! The word was ${secretWord}.`;
    }
}

// ---------- Physical keyboard support ----------
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        handleKey('ENTER');
    } else if (e.key === 'Backspace') {
        handleKey('⌫');
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKey(e.key.toUpperCase());
    }
});

// ---------- New game button (with confirmation) ----------
newGameBtn.addEventListener('click', () => {
    const ok = confirm('Start a new game? Your current progress will be lost.');
    if (ok) startNewGame();
});

// ---------- Toggle instructions ----------
toggleBtn.addEventListener('click', () => {
    const isHidden = instructionsEl.classList.toggle('hidden');
    toggleBtn.textContent = isHidden
        ? '📖 Show Instructions'
        : '📕 Hide Instructions';
    toggleBtn.setAttribute('aria-expanded', String(!isHidden));
});

// ---------- Start ----------
init();
