import { createCrossword, Directions } from "./crosswordMaker.js";


const gridElement = document.getElementById("grid");
const wordsElement = document.getElementById("words");
const generateButton = document.getElementById("generate");
generateButton.onclick = generate;

const GRID_SIZE = 20
const GRID_CELLS = GRID_SIZE * GRID_SIZE;

const prevButton = document.getElementById("prev");
prevButton.onclick = prev;
const nextButton = document.getElementById("next");
nextButton.onclick = next;

for(let i = 0; i < GRID_CELLS; i++) {
    const cellElement = document.createElement("div");
    cellElement.className = "cell";
    gridElement.appendChild(cellElement);
}

// const words = ["sbbba", "acccd", "eeed", "sxxx"];
// const words = ["alma", "karalábé", "banán", "kalap", "állam"];
// const words = ["bbbbab", "ccccccac", "dadddd"];
const words = ["dog", "cat", "bat", "elephant", "kangaroo"];
// const words = ["dog", "cat", "bat", "elephant", "kangaroo", "alpacca", "dragon", "mouse", "eszti", "csokis keksz"];
// const words = ["elephant", "kangoroo", "cat", "dog"];

wordsElement.value = words.join(",");

let crosswords = createCrossword(words);

console.log(crosswords);

let currentIdx = 0;
writeCrossword(crosswords[currentIdx]);

function generate() {
    if(crosswords.length > 0) {
        removeCrossword(crosswords[currentIdx]);
    }
    crosswords = createCrossword(wordsElement.value.split(","));
    currentIdx = 0;
    console.log(crosswords);
    if(crosswords.length > 0) {
        writeCrossword(crosswords[currentIdx]);
    }
}


function writeWord(word, x, y, direction) {
    const dx = direction == Directions.HORIZONTAL ? 1 : 0;
    const dy = direction == Directions.VERTICAL ? 1 : 0;
    word.split("").forEach(letter => {
        writeLetter(letter, y, x);
        y += dy;
        x += dx;
    });
}

function removeWord(word, x, y, direction) {
    const dx = direction == Directions.HORIZONTAL ? 1 : 0;
    const dy = direction == Directions.VERTICAL ? 1 : 0;
    word.split("").forEach(letter => {
        writeLetter("", y, x);
        y += dy;
        x += dx;
    });
}

function writeLetter(letter, i, j) {
    if(i < 0 || i > GRID_SIZE) {
        return false;
    }
    if(j < 0 || j > GRID_SIZE) {
        return false;
    }
    const idx = i * GRID_SIZE + j;
    if(idx > gridElement.children.length) {
        return false;
    }
    const cellElement = gridElement.children[idx];
    cellElement.innerHTML = letter;
}



function writeCrossword(crossword) {
    for(let word of crossword) {
        writeWord(word.word, word.start.x, word.start.y, word.direction);
    }
}

function removeCrossword(crossword) {
    for(let word of crossword) {
        removeWord(word.word, word.start.x, word.start.y, word.direction);
    }
}

function next() {
    if(currentIdx < crosswords.length - 1) {
        removeCrossword(crosswords[currentIdx]);
        currentIdx++;
        writeCrossword(crosswords[currentIdx]);
    }
}
function prev() {
    if(currentIdx > 0) {
        removeCrossword(crosswords[currentIdx]);
        currentIdx--;
        writeCrossword(crosswords[currentIdx]);
    }
}


// TODO
// No words next to each other
// ................
// .....a..........
// ...kalap........
// ...láma.........
// .....a..........
// Generate all solutions?
// SVG
// print