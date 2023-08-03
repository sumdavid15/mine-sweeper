'use strict'

let gBoard;
let gTimerInterval;
let gSafeTimeOut;
let gHintTimeOut;
let gMinesCount = 2
let gPrevMove = []

let gFirstCell = null
let gSecondCell = null

const gLevel = {
    SIZE: 4,
    MINES: gMinesCount,
    LIFE: 0,
    HINTS: 0,
    SAFE_CLICKS: 0,
    MEGA_HINT: false,
};

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    hint: false,
    gameIsOver: false,
    safeClick: false,
    isMegaHint: false,
}

function initGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)

    clearInterval(gTimerInterval)
    clearTimeout(gHintTimeOut)
    clearTimeout(gSafeTimeOut)

    gGame.isOn = true
    gGame.gameIsOver = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.isMegaHint = false
    gGame.safeClick = false

    gLevel.MINES = gMinesCount
    gLevel.LIFE = 3
    gLevel.HINTS = 3
    gLevel.SAFE_CLICKS = 3
    gLevel.MEGA_HINT = false

    gFirstCell = null
    gSecondCell = null

    document.querySelector('.hints-btn span').innerHTML = gLevel.HINTS
    document.querySelector('.safe-btn span').innerHTML = gLevel.SAFE_CLICKS

    document.querySelector('.mines span').innerHTML = gLevel.MINES
    document.querySelector('.life').innerHTML = "💖".repeat(gLevel.LIFE)
    document.querySelector('.timer span').innerHTML = gGame.secsPassed
    document.querySelector('.smiley').innerHTML = '🙂'


    document.querySelector('.undo-btn').classList.add('hide-btn')
    document.querySelector('.mega-btn').classList.add('hide-btn')
    document.querySelector('.hints-btn').classList.add('hide-btn')
    document.querySelector('.safe-btn').classList.add('hide-btn')
    gPrevMove = []
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
                isSafe: false,
                aroundFirstClick: false
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

            if (currCell.isShown) className = 'revealed'
            if (currCell.isSafe && !currCell.isShown) className = 'safe-mark'

            if (currCell.isShown && !currCell.isMine) {
                innerHTML = currCell.minesAroundCount ? currCell.minesAroundCount : ''
                if (currCell.minesAroundCount) className += ' ' + `x${currCell.minesAroundCount}`
            }
            if (currCell.isShown && currCell.isMine) innerHTML = '<img src="img/mine.png">'
            if (currCell.isMarked && !currCell.isShown) innerHTML = '<img src="img/flag.png">'

            strHTML += `<td class="cell ${className}" data-i="${i}" data-j="${j}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(event, this, ${i}, ${j})">`
            strHTML += innerHTML
            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {

    if (gGame.isMegaHint) {
        if (!gFirstCell) {
            gFirstCell = { i, j }
            elCell.classList.add('mega-hit-mark')
        } else {
            gSecondCell = { i, j }
            elCell.classList.add('mega-hit-mark')
        }
        if (gFirstCell && gSecondCell) {
            revealArea(gFirstCell.i, gSecondCell.i, gFirstCell.j, gSecondCell.j)
            gGame.isMegaHint = false
            gLevel.MEGA_HINT = true
            setTimeout(() => {
                undoGame()
                gGame.isOn = true
            }, 2000);
        }
        return
    }

    if (!gGame.isOn) return

    if (!gGame.shownCount) {
        firstClick(i, j)
        startTimer()
        expandShown(gBoard, i, j)
        renderBoard(gBoard)
        savePrevMove(copyArrayOfArrays(gBoard), copyObject(gGame), copyObject(gLevel))
        checkVictory()
        return
    }

    if (gGame.hint) {
        hintForNextMove(i, j)
        return
    }

    const currCell = gBoard[i][j]

    if (currCell.isShown) return

    if (currCell.isSafe) {
        clearTimeout(gSafeTimeOut)
        currCell.isSafe = false
        gGame.safeClick = false
    }

    if (currCell.minesAroundCount === 0 && !currCell.isMine && !currCell.isMarked) {
        currCell.isShown
        expandShown(gBoard, i, j)
        gGame.shownCount++
    }
    if (currCell.isMarked) return

    if (currCell.isMine) {
        onMineClick(elCell)
        currCell.isShown = true
        gGame.shownCount++
    }

    if (!currCell.isMine && !currCell.isFirstClick) {
        currCell.isShown = true
        gGame.shownCount++
    }

    savePrevMove(copyArrayOfArrays(gBoard), copyObject(gGame), copyObject(gLevel))
    renderBoard(gBoard)
    checkVictory()
    checkGameOver()
}


function cellMarked(event, el, i, j) {
    event.preventDefault()
    if (!gGame.isOn) return

    const currCell = gBoard[i][j]
    if (currCell.isShown) return

    if (!currCell.isMarked) {
        currCell.isMarked = true
        gGame.markedCount++
        gLevel.MINES--
        document.querySelector('.mines span').innerHTML = gLevel.MINES
    } else {
        currCell.isMarked = false
        gGame.markedCount--
        gLevel.MINES++
        document.querySelector('.mines span').innerHTML = gLevel.MINES
    }
    savePrevMove(copyArrayOfArrays(gBoard), copyObject(gGame), copyObject(gLevel))
    renderBoard(gBoard)
}

function expandShown(board, rowIdx, colIdx) {
    for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (let j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            const currCell = board[i][j]
            if (!currCell.isMine && !currCell.isShown && !currCell.isMarked) {
                currCell.isShown = true
                gGame.shownCount++
                if (currCell.minesAroundCount === 0) {
                    expandShown(board, i, j)
                }
            }
        }
    }
}

function changeLevel(size, mine) {
    gLevel.SIZE = size
    gMinesCount = mine
    initGame()
}

function checkVictory() {
    let nonMineCellCount = 0
    let shownCellCount = 0

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (!currCell.isMine) nonMineCellCount++
            if (currCell.isShown && !currCell.isMine) shownCellCount++
        }
    }
    if (nonMineCellCount === shownCellCount) {
        document.querySelector('.smiley').innerHTML = '😎'
        stopGame()
        alert('GG')
    }
}

function checkGameOver() {
    if (gLevel.LIFE) return
    document.querySelector('.smiley').innerHTML = '😖'
    stopGame()
    renderRemainingMines()
    gGame.gameIsOver = true
}

function stopGame() {
    clearInterval(gTimerInterval)
    gGame.isOn = false
}

function firstClick(i, j) {
    document.querySelector('.mega-btn').classList.remove('hide-btn')
    document.querySelector('.hints-btn').classList.remove('hide-btn')
    document.querySelector('.undo-btn').classList.remove('hide-btn')
    document.querySelector('.safe-btn').classList.remove('hide-btn')

    gGame.isOn = true
    gBoard[i][j].isFirstClick = true
    gBoard[i][j].isShown = true
    gGame.shownCount++

    setEmptyCellsAroundFirstClickF(i, j)
    addMines()
    setMinesNegsCount()
    savePrevMove(copyArrayOfArrays(gBoard), copyObject(gGame), copyObject(gLevel))
    renderBoard(gBoard)
}

function revealCell(currCell, elCell, value) {
    elCell.innerHTML = value
    elCell.classList.add('revealed')
    currCell.isShown = true
    gGame.shownCount++
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
    clearInterval(gTimerInterval)

    gTimerInterval = setInterval(() => {
        gGame.secsPassed++;
        document.querySelector('.timer span').innerHTML = gGame.secsPassed;
        if (gGame.secsPassed === 999) clearInterval(gTimerInterval)
    }, 1000);
}
