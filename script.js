const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const gameOverBox = document.getElementById('gameOver');
const retryButton = document.getElementById('retryButton');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 15,
    dx: 4,
    dy: -4,
    color: 'red'
};

// Paddle properties
const paddle = {
    width: 100,
    height: 15,
    x: (canvas.width - 100) / 2,
    y: canvas.height - 30,
    speed: 7,
    dx: 0
};

let gameStarted = false;

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

    // Prevent paddle from going out of bounds
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (left/right)
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    // Wall collision (top)
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
        ball.y = paddle.y - ball.radius; // Prevent ball from sticking
    }

    // Game over (bottom wall)
    if (ball.y - ball.radius > canvas.height) {
        gameStarted = false;
        gameOverBox.classList.remove('hidden');
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
}

// Update game frame
function update() {
    if (!gameStarted) return;

    movePaddle();
    moveBall();

    draw();

    requestAnimationFrame(update);
}

// Keyboard event handlers
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

// Start game
startButton.addEventListener('click', () => {
    gameStarted = true;
    startButton.style.display = 'none';
    update();
});

// Retry game
retryButton.addEventListener('click', () => {
    gameOverBox.classList.add('hidden');
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    ball.dx = 4;
    ball.dy = -4;
    paddle.x = (canvas.width - paddle.width) / 2;
    gameStarted = true;
    update();
});
