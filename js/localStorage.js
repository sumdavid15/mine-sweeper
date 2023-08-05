
let gameScores = [{
    player: 'Puki',
    level: 'Beginner',
    time: 1,
}, {
    player: 'Muki',
    level: 'Beginner',
    time: 2,
}, {
    player: 'Lolo',
    level: 'Medium',
    time: 42,
}, {
    player: 'Moshe',
    level: 'Expert',
    time: 59,
}]

setItemLocalStorage(getDataFromLocal('game-scores') || gameScores)

function getDataFromLocal(data) {
    return JSON.parse(localStorage.getItem(data))
}

function setItemLocalStorage(item) {
    localStorage.setItem('game-scores', JSON.stringify(item))
}

function getScores() {
    const beginner = []
    const medium = []
    const expert = []

    gameScores.forEach(score => {
        if (score.level === 'Beginner') beginner.push(score)
        if (score.level === 'Medium') medium.push(score)
        if (score.level === 'Expert') expert.push(score)
    });

    return [beginner, medium, expert]
}

function updateScoreBoard() {
    const [beginner, medium, expert] = getScores()

    const elBeginnerOl = document.querySelector('.beginner ol')
    const elMediumOl = document.querySelector('.medium ol')
    const elExpertOl = document.querySelector('.expert ol')

    elBeginnerOl.innerHTML = ''
    elMediumOl.innerHTML = ''
    elExpertOl.innerHTML = ''

    beginner.sort((a, b) => a.time - b.time)
    medium.sort((a, b) => a.time - b.time)
    expert.sort((a, b) => a.time - b.time)

    renderScoreBoard(beginner, elBeginnerOl)
    renderScoreBoard(medium, elMediumOl)
    renderScoreBoard(expert, elExpertOl)
}

function renderScoreBoard(scores, el) {
    scores.slice(0, 10).forEach(score => {
        el.appendChild(createEl(score.player, score.time))
    })
}

function createEl(player, time) {
    const elLi = document.createElement('li')
    elLi.innerText = `${player || 'player'} : ${time}`
    return elLi
}
