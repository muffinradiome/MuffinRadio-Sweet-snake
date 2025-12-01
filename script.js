// Простая змейка с maffin emoji как "еда". Работает в современных браузерах.
const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const scoreEl = document.getElementById('score')
const bestEl = document.getElementById('best')
const startBtn = document.getElementById('startBtn')
const shareBtn = document.getElementById('shareBtn')

const CELL = 20
const COLS = canvas.width / CELL
const ROWS = canvas.height / CELL

let snake,
	dir,
	food,
	running,
	score,
	best = 0,
	loopId

function reset() {
	snake = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }]
	dir = { x: 1, y: 0 }
	placeFood()
	score = 0
	running = false
	scoreEl.textContent = score
	bestEl.textContent = best
	draw()
}

function placeFood() {
	while (true) {
		const x = Math.floor(Math.random() * COLS)
		const y = Math.floor(Math.random() * ROWS)
		if (!snake.some(s => s.x === x && s.y === y)) {
			food = { x, y }
			break
		}
	}
}

function drawCell(x, y, color) {
	ctx.fillStyle = color
	ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2)
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	// сетка (необязательно)
	for (let i = 0; i < COLS; i++) {
		for (let j = 0; j < ROWS; j++) {
			// можно рисовать фон
		}
	}
	// еда: рисуем emoji в центре клетки
	ctx.font = CELL - 2 + 'px serif'
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.fillText('🧁', food.x * CELL + CELL / 2, food.y * CELL + CELL / 2)

	// змейка
	snake.forEach((s, idx) => {
		if (idx === 0) drawCell(s.x, s.y, '#ff9fc0') // голова
		else drawCell(s.x, s.y, '#ffd7e6') // тело
	})
}

function step() {
	const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }
	// столкновение со стеной
	if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS)
		return gameOver()
	// столкновение с телом
	if (snake.some(s => s.x === head.x && s.y === head.y)) return gameOver()

	snake.unshift(head)

	// съели еду?
	if (head.x === food.x && head.y === food.y) {
		score += 1
		scoreEl.textContent = score
		if (score > best) {
			best = score
			bestEl.textContent = best
		}
		placeFood()
	} else {
		snake.pop()
	}
	draw()
}

function gameOver() {
	running = false
	clearInterval(loopId)
	alert('Игра окончена! Счёт: ' + score)
}

function start() {
	if (running) return
	running = true
	loopId = setInterval(step, 120)
}

document.addEventListener('keydown', e => {
	if (!running && e.key === 'Enter') start()
	const key = e.key
	if (key === 'ArrowUp' || key === 'w') {
		if (dir.y === 1) return
		dir = { x: 0, y: -1 }
	}
	if (key === 'ArrowDown' || key === 's') {
		if (dir.y === -1) return
		dir = { x: 0, y: 1 }
	}
	if (key === 'ArrowLeft' || key === 'a') {
		if (dir.x === 1) return
		dir = { x: -1, y: 0 }
	}
	if (key === 'ArrowRight' || key === 'd') {
		if (dir.x === -1) return
		dir = { x: 1, y: 0 }
	}
})

startBtn.addEventListener('click', () => {
	if (!running) {
		start()
		startBtn.textContent = 'Игра идёт'
	} else {
		clearInterval(loopId)
		running = false
		startBtn.textContent = 'Старт'
	}
})

shareBtn.addEventListener('click', () => {
	const repo = location.href
	navigator.clipboard
		?.writeText(repo)
		.then(() => alert('Ссылка скопирована в буфер обмена'))
})

reset()
