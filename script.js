
const gridElement = document.getElementById("grid");

const GRID_SIZE = 20
const GRID_CELLS = GRID_SIZE * GRID_SIZE;

const Directions = {
    HORIZONTAL: 0,
    VERTICAL: 1
}

for(let i = 0; i < GRID_CELLS; i++) {
    const cellElement = document.createElement("div");
    cellElement.className = "cell";
    gridElement.appendChild(cellElement);
}

function writeWord(word, i, j, direction) {
    const di = direction == Directions.VERTICAL ? 1 : 0;
    const dj = direction == Directions.HORIZONTAL ? 1 : 0;
    word.split("").forEach(letter => {
        writeLetter(letter, i, j);
        i += di;
        j += dj;
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
    if(cellElement.innerHTML != "") {
        return false;
    }
    cellElement.innerHTML = letter;
}

writeWord("alma", 5, 2, Directions.HORIZONTAL);
writeWord("árvíztűrő", 8, 10, Directions.VERTICAL);