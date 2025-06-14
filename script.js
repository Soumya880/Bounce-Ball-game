const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const gameOverBox = document.getElementById('gameOver');
const retryButton = document.getElementById('retryButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const scoreDisplay = document.getElementById('scoreDisplay');

// Canvas size
canvas.width = 800;
canvas.height = 600;

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 15,
    dx: 5,     // Super fast speed
    dy: -5,
    color: 'red'
};

// Paddle properties
const paddle = {
    width: 100,
    height: 15,
    x: (canvas.width - 100) / 2,
    y: canvas.height - 30,
    speed: 10,
    dx: 0
};

let score = 0;
let gameStarted = false;

// Draw functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.fillStyle = 'white';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Move paddle
function movePaddle() {
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width)
        paddle.x = canvas.width - paddle.width;
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall bounce
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0)
        ball.dx *= -1;

    if (ball.y - ball.radius < 0)
        ball.dy *= -1;

    // Paddle bounce
    if (
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height
    ) {
        ball.dy *= -1;
        ball.y = paddle.y - ball.radius;
        score++; // Increase score
    }

    // Missed ball
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
    drawScore();
}

// Update game frame
function update() {
    if (!gameStarted) return;

    movePaddle();
    moveBall();
    draw();
    requestAnimationFrame(update);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') paddle.dx = paddle.speed;
    else if (e.key === 'ArrowLeft') paddle.dx = -paddle.speed;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') paddle.dx = 0;
});

// Touch & mouse controls for buttons
function setPaddleControl(button, direction) {
    button.addEventListener('mousedown', () => paddle.dx = direction * paddle.speed);
    button.addEventListener('mouseup', () => paddle.dx = 0);
    button.addEventListener('touchstart', () => paddle.dx = direction * paddle.speed);
    button.addEventListener('touchend', () => paddle.dx = 0);
}

setPaddleControl(leftButton, -1);
setPaddleControl(rightButton, 1);

// Start game
startButton.addEventListener('click', () => {
    gameStarted = true;
    score = 0;
    startButton.style.display = 'none';
    gameOverBox.classList.add('hidden');
    update();
});

// Retry game
retryButton.addEventListener('click', () => {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    ball.dx = 5;
    ball.dy = -5;
    paddle.x = (canvas.width - paddle.width) / 2;
    score = 0;
    gameStarted = true;
    gameOverBox.classList.add('hidden');
    update();
});
