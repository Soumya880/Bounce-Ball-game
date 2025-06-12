const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const retryButton = document.getElementById('retryButton');
const gameOverBox = document.getElementById('gameOver');
const scoreDisplay = document.getElementById('score');
const controlButtons = document.getElementById('controls');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

canvas.width = 800;
canvas.height = 600;

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 15,
    dx: 4,
    dy: -4,
    color: 'red'
};

// Paddle
const paddle = {
    width: 100,
    height: 15,
    x: (canvas.width - 100) / 2,
    y: canvas.height - 30,
    speed: 7,
    dx: 0
};

let gameStarted = false;
let score = 0;

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

// Draw paddle
function drawPaddle() {
    ctx.fillStyle = 'white';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Move paddle
function movePaddle() {
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collisions
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Paddle collision
    if (
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.y + ball.radius > paddle.y
    ) {
        ball.dy *= -1;
        ball.y = paddle.y - ball.radius;
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
    }

    // Game over
    if (ball.y - ball.radius > canvas.height) {
        gameStarted = false;
        gameOverBox.classList.remove('hidden');
        controlButtons.classList.add('hidden');
    }
}

// Draw game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
}

// Update frame
function update() {
    if (!gameStarted) return;

    movePaddle();
    moveBall();
    draw();

    requestAnimationFrame(update);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        paddle.dx = 0;
    }
});

// Button controls
leftButton.addEventListener('mousedown', () => {
    paddle.dx = -paddle.speed;
});
rightButton.addEventListener('mousedown', () => {
    paddle.dx = paddle.speed;
});
leftButton.addEventListener('mouseup', () => {
    paddle.dx = 0;
});
rightButton.addEventListener('mouseup', () => {
    paddle.dx = 0;
});

// Touch support for mobile
leftButton.addEventListener('touchstart', () => {
    paddle.dx = -paddle.speed;
});
rightButton.addEventListener('touchstart', () => {
    paddle.dx = paddle.speed;
});
leftButton.addEventListener('touchend', () => {
    paddle.dx = 0;
});
rightButton.addEventListener('touchend', () => {
    paddle.dx = 0;
});

// Start Game
startButton.addEventListener('click', () => {
    gameStarted = true;
    startButton.style.display = 'none';
    controlButtons.classList.remove('hidden');
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    update();
});

// Retry Game
retryButton.addEventListener('click', () => {
    gameOverBox.classList.add('hidden');
    controlButtons.classList.remove('hidden');
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    ball.dx = 4;
    ball.dy = -4;
    paddle.x = (canvas.width - paddle.width) / 2;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameStarted = true;
    update();
});
