
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function copyArrayOfArrays(arr) {
    return arr.map(innerArray => innerArray.map(obj => Object.assign({}, obj)))
}

function copyObject(obj) {
    return JSON.parse(JSON.stringify(obj))
}

function getEmptyCells() {
    const emptyCells = []
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (!currCell.isFirstClick && !currCell.aroundFirstClick) emptyCells.push({ i, j })
        }
    }
    return emptyCells
}

function savePrevMove(gBoard, gGame, gLevel) {
    gPrevMove.push([gBoard, gGame, gLevel])
}

function setEmptyCellsAroundFirstClickF(rowIdx, colIdx) {
    for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (let j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gBoard[0].length) continue
            const currCell = gBoard[i][j]
            currCell.aroundFirstClick = true
        }
    }
}