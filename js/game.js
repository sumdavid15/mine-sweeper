'use strict'

let gBoard;
let gTimerInterval;

const gLevel = {
    SIZE: 4,
    MINES: 4,
    LIFE: 3,
};
const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    gGame.isOn = true
    document.querySelector('.mines').innerHTML = gLevel.MINES
}

function buildBoard() {
    const board = []
    for (let i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (let j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isFirstClick: false,
            }
        }
    }
    return board
}

function renderBoard(board) {

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            let className = ''
            let innerHTML = ''

            if (currCell.isFirstClick) className = 'revealed'
            if (currCell.isShown) className = 'revealed'

            if (currCell.isShown && !currCell.isMine) innerHTML = currCell.minesAroundCount ? currCell.minesAroundCount : ''
            if (currCell.isShown && currCell.isMine) innerHTML = '<img src="img/mine.png">'
            if (currCell.isMarked && !currCell.isShown) innerHTML = '<img src="img/flag.png">'
            // if (currCell.isMine && currCell.isMarked) innerHTML = '🤬'


            strHTML += `<td class="cell ${className}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(event, this, ${i}, ${j})">`
            strHTML += innerHTML
            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return

    if (!gGame.shownCount) {
        firstClick(i, j)
        startTimer()
    }

    const currCell = gBoard[i][j]
    if (currCell.isShown) return
    if (currCell.isMarked) return

    if (currCell.isMine) {
        onMineClick(elCell)
        revealCell(currCell, elCell, '<img src="img/mine.png">')
    }

    if (!currCell.isMine && !currCell.isFirstClick) {
        const value = currCell.minesAroundCount ? currCell.minesAroundCount : ''
        revealCell(currCell, elCell, value)
    }

    if (currCell.isFirstClick) {
        revealCell(currCell, elCell, '')
    }

    checkGameOver()
}

function setMinesNegsCount() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isMine || currCell.isFirstClick) continue
            currCell.minesAroundCount = countMinesAround(gBoard, i, j)
        }
    }
}

function cellMarked(event, el, i, j) {
    event.preventDefault()
    if (!gGame.isOn) return
    const currCell = gBoard[i][j]
    if (currCell.isShown) return
    currCell.isMarked = !currCell.isMarked
    currCell.isMarked && !currCell.isShown ? el.innerHTML = '<img src="img/flag.png">' : el.innerHTML = ''
    // currCell.isMarked && !currCell.isShown ? el.classList.add('marked') : el.classList.remove('marked')

}

function expandShown(board, elCell, i, j) {

}

function checkGameOver() {
    if (gLevel.LIFE) return
    document.querySelector('.smiley').innerHTML = '😖'
    gGame.isOn = false
    clearInterval(gTimerInterval)
    console.log('You lost');
}

function firstClick(i, j) {
    gGame.isOn = true
    gBoard[i][j].isFirstClick = true
    addMines()
    setMinesNegsCount()
    renderBoard(gBoard)
    console.log(gBoard);
}

function onMineClick() {
    gLevel.LIFE--
    document.querySelector('.life').innerHTML = gLevel.LIFE
    gLevel.MINES--
    document.querySelector('.mines').innerHTML = gLevel.MINES
}

function revealCell(currCell, elCell, value) {
    elCell.innerHTML = value
    elCell.classList.add('revealed')
    currCell.isShown = true
    gGame.shownCount++
}

function addMines() {
    const emptyCells = getEmptyCells()
    if (!emptyCells.length) return

    for (let i = 0; i < gLevel.MINES; i++) {
        const randNum = getRandomInt(0, emptyCells.length)
        const randomCell = emptyCells[randNum]
        emptyCells.splice(randNum, 1)
        gBoard[randomCell.i][randomCell.j].isMine = true
    }
}

function countMinesAround(board, rowIdx, colIdx) {
    let count = 0
    for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (let j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            const currCell = board[i][j]
            if (currCell.isMine) count++
        }
    }
    return count
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

function changeSmileyDown() {
    if (!gGame.isOn) return
    document.querySelector('.smiley').innerHTML = '😃'
}
function changeSmileyUp() {
    if (!gGame.isOn) return
    document.querySelector('.smiley').innerHTML = '🙂'
}

function startTimer() {
    gTimerInterval = setInterval(() => {
        gGame.secsPassed++;
        document.querySelector('.timer').innerHTML = gGame.secsPassed;
    }, 1000);
}
