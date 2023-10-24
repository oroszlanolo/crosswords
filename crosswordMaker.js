

// placeWordsToWords(placedWords, wordsToPlace) : solution[]
// recursive
// if wordsToPlace is empty, return [placedWords] 
// goes through all the possible wordsToPlace, and calls placeWordToWords if placing a word is possible
// merges the results of the placeWordToWords, and returns it (solutions)
// placeWordToWords(placedWords, selectedWord, wordsToPlace) : solution[]
// Gets all the possible positions where the word can be inserted into the crosswords
// goes through all the possible places, and checks if placing the word there is possible or not
// if possible, places the word there, calls the placeWordsToWords with the remaining words
// if not possible, goes to the next position
// merges the results of the placeWordsToWords and returns it


export const Directions = {
    HORIZONTAL: 0,
    VERTICAL: 1
}

export function createCrossword(words) {
    if(words.length === 0) {
        return [];
    }
    const placedWords = [];
    const firstWord = words.shift();
    const wordToInsert = getWordObj(firstWord, {x: 7, y: 10}, Directions.HORIZONTAL);
    placedWords.push(wordToInsert);
    const crosswords = placeWordsToWords(placedWords, words);
    // console.log(words);
    return crosswords;
}

function placeWordsToWords(placedWords, wordsToPlace) {
    // console.log("1:", placedWords);
    if(wordsToPlace.length == 0) {
        return [placedWords];
    }
    // placedWords = [...placedWords];
    wordsToPlace = [...wordsToPlace];
    const solutions = [];
    const iterNum = wordsToPlace.length;
    for(let i = 0; i < iterNum; i++) {
        const currentWord = wordsToPlace.shift();
        const solutionsToAdd = placeWordToWords(placedWords, currentWord, wordsToPlace);
        wordsToPlace.push(currentWord);
        for(let solution of solutionsToAdd) {
            if(!haveSolution(solutions, solution)) {
                solutions.push(solution);
            }
        }
        if(solutions.length > 10) {
            return solutions;
        }
    }
    return solutions;
}

function placeWordToWords(placedWords, currentWord, wordsToPlace) {
    // console.log("2:", placedWords, currentWord, wordsToPlace);
    placedWords = [...placedWords];
    // wordsToPlace = [...wordsToPlace];
    const solutions = [];
    const possibleWordObjects = getPossibleWordObjects(placedWords, currentWord);
    for(let wordObj of possibleWordObjects) {
        // console.log("asd");
        const solutionsToAdd = placeWordsToWords([...placedWords, wordObj], wordsToPlace);
        for(let solution of solutionsToAdd) {
            if(!haveSolution(solutions, solution)) {
                solutions.push(solution);
            }
        }
    }
    return solutions;
}

// get the posible positions a word can be placed next to other words
// returns word objects array
function getPossibleWordObjects(placedWords, currentWord) {
    // console.log("3:", placedWords, currentWord);
    const possibleWordObjects = [];
    for(let i = 0; i < currentWord.length; i++) {
        const positionsForThisChar = [];
        const c = currentWord[i];
        for(let word of placedWords) {
            // console.log("dsa");
            let possiblePlaces = getWordToWordPositionsWithChar(word, currentWord, i);
            possiblePlaces = possiblePlaces.filter(place => canWordBePlaced(placedWords, place, word));
            possibleWordObjects.push(...possiblePlaces);
        }
    }
    return possibleWordObjects;
}

// get the possible positions a word can be placed to another word using the nth character of the first word
function getWordToWordPositionsWithChar(wordToPlaceTo, word, idx) {
    // console.log("4:", wordToPlaceTo, word, idx);
    const possiblePositions = [];
    const c = word[idx];
    const [dx, dy] = getDxDy(wordToPlaceTo.direction);
    const possibleIndexes = getIndexes(wordToPlaceTo.word, c);
    for(let currIdx of possibleIndexes) {
        const commonCharPos = {
            x: wordToPlaceTo.start.x + dx * currIdx,
            y: wordToPlaceTo.start.y + dy * currIdx
        }
        const start = {
            x: commonCharPos.x - (1 - dx) * idx,
            y: commonCharPos.y - (1 - dy) * idx,
        }
        possiblePositions.push(getWordObj(word, start, rotate(wordToPlaceTo.direction)));
    }
    return possiblePositions;
}

function getWordObj(word, start, dir) {
    const [dx, dy] = getDxDy(dir);
    return {
        word: word,
        start: start,
        end: {
            x: start.x + dx * (word.length - 1),
            y: start.y + dy * (word.length - 1)
        },
        direction: dir
    };
}

function canWordBePlaced(placedWords, wordObj, skipWord) {
    const wordsToCheck = placedWords.filter(w => w != skipWord);
    const [dx, dy] = getDxDy(wordObj.direction);
    for(let placedWord of wordsToCheck) {
        if(wordsCollide(placedWord, wordObj)) {
            return false;
        }
    }
    return true; 
}


function wordsCollide(word1, word2) {
    const [dx, dy] = getDxDy(word2.direction);
    for(let i = 0; i < word2.word.length; i++) {
        if(posCollideWithWord(word1, word2.start.x + i * dx, word2.start.y + i * dy)) {
            return true;
        }
    }
    return false;
}

function posCollideWithWord(word, x, y) {
    const start = word.start;
    const end = word.end;
    const asd = (x >= start.x && x <= end.x && y >= start.y - 1 && y <= end.y + 1) ||
    (y >= start.y && y <= end.y && x >= start.x - 1 && x <= end.x + 1);
    // console.log(word, x, y, asd);
    return asd;
}

function haveSolution(solutions, solution) {
    for(let s of solutions) {
        if(sameSolution(s, solution)) {
            return true;
        }
    }
    return false;
}

function sameSolution(s1, s2) {
    for(let w1 of s1) {
        for(let w2 of s2) {
            if(w1.word == w2.word) {
                if(w1.start.x != w2.start.x ||
                    w1.start.y != w2.start.y ||
                    w1.direction != w2.direction) {
                    return false;
                } else {
                    break;
                }
            }
        }
    }
    return true;
}

/**
 * Get all the indexes of a character inside a string
 * @param {string} word 
 * @param {char} c 
 * @returns All the indexes "c" appeares inside "word"
 */
function getIndexes(word, c) {
    const idxs = [];
    for( let i = 0; i < word.length; i++) {
        if(word[i] === c) {
            idxs.push(i);
        }
    }
    return idxs;
}

function rotate(direction) {
    return !direction;
}

function getDxDy(direction) {
    return [direction == Directions.HORIZONTAL, direction == Directions.VERTICAL];
}