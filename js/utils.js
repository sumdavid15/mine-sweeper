
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
            if (!currCell.isFirstClick) emptyCells.push({ i, j })
        }
    }
    return emptyCells
}

function savePrevMove(gBoard, gGame, gLevel) {
    gPrevMove.push([gBoard, gGame, gLevel])
}
