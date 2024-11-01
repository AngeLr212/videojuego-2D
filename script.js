const canvas = document.getElementById("juegoCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");
const scoreDisplay = document.getElementById("score");
const finalScoreDisplay = document.getElementById("final-score");
const timerDisplay = document.getElementById("time");
const contador = document.getElementById("contador");
const music = document.getElementById("background-music"); // Elemento de audio

let score = 0;
let changos = [];
let explosiones = [];
let timer;
const timeLimit = 30; // 30 segundos

const changoImg = new Image();
changoImg.src = "img/chango.png"; // Imagen del chango
const explosionImg = new Image();
explosionImg.src = "img/explosion.png"; // Imagen de la explosión
const fondoImg = new Image();
fondoImg.src = "img/fondo.png"; // Imagen de fondo

// Iniciar el juego
document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("restart-button").addEventListener("click", restartGame);

function startGame() {
    startScreen.style.display = "none"; // Oculta la pantalla de inicio
    canvas.style.display = "block"; // Muestra el canvas
    contador.style.display = "block"; // Muestra el contador
    timerDisplay.parentElement.style.display = "block"; // Muestra el temporizador
    score = 0;
    changos = [];
    explosiones = [];
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLimit;

    // Inicia la música
    music.currentTime = 0; // Reinicia la música al inicio
    music.play(); // Reproduce la música

    // Inicia el temporizador
    timer = setInterval(updateTimer, 1000);

    loop(); // Inicia el bucle del juego
}

function updateTimer() {
    const timeLeft = parseInt(timerDisplay.textContent) - 1;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timer);
        music.pause(); // Detiene la música
        endGame(); // Termina el juego cuando se acabe el tiempo
    }
}

function endGame() {
    canvas.style.display = "none"; // Oculta el canvas
    contador.style.display = "none"; // Oculta el contador
    timerDisplay.parentElement.style.display = "none"; // Oculta el temporizador
    finalScoreDisplay.textContent = score; // Muestra el puntaje final
    endScreen.style.display = "block"; // Muestra la pantalla de fin de juego
}

function restartGame() {
    endScreen.style.display = "none"; // Oculta la pantalla de fin de juego
    startGame(); // Reinicia el juego
}

// Función para crear un nuevo chango en una posición aleatoria
function crearChango() {
    const x = Math.random() * (canvas.width - 50);
    const y = Math.random() * (canvas.height - 50);
    const chango = { x, y, dx: Math.random() * 4 - 2, dy: Math.random() * 4 - 2, opacity: 1 };
    changos.push(chango);
}

// Función para dibujar el fondo
function dibujarFondo() {
    ctx.drawImage(fondoImg, 0, 0, canvas.width, canvas.height);
}

// Función para dibujar los changos en el canvas
function dibujarChangos() {
    changos.forEach((chango) => {
        // Movimiento aleatorio de los changos
        chango.x += chango.dx;
        chango.y += chango.dy;

        // Rebotar en los bordes
        if (chango.x <= 0 || chango.x >= canvas.width - 50) chango.dx *= -1;
        if (chango.y <= 0 || chango.y >= canvas.height - 50) chango.dy *= -1;

        ctx.globalAlpha = chango.opacity;
        ctx.drawImage(changoImg, chango.x, chango.y, 50, 50);
    });
    ctx.globalAlpha = 1.0; // Resetear la opacidad
}

// Evento para detectar clics y eliminar changos con animación de explosión
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    changos.forEach((chango, index) => {
        if (x > chango.x && x < chango.x + 50 && y > chango.y && y < chango.y + 50) {
            // Agregar explosión en la posición del chango
            explosiones.push({ x: chango.x, y: chango.y, frame: 0 });
            changos.splice(index, 1); // Eliminar el chango
            score++;
            scoreDisplay.textContent = score; // Actualiza el puntaje en pantalla
        }
    });
});

// Función para dibujar y actualizar las explosiones
function dibujarExplosiones() {
    explosiones.forEach((explosion, index) => {
        if (explosion.frame < 10) {
            ctx.globalAlpha = 1 - explosion.frame * 0.1; // Desvanecimiento gradual
            ctx.drawImage(explosionImg, explosion.x, explosion.y, 50, 50);
            explosion.frame++;
        } else {
            explosiones.splice(index, 1); // Eliminar la explosión cuando termine la animación
        }
    });
    ctx.globalAlpha = 1.0; // Restablecer la opacidad
}

// Bucle principal del juego
function loop() {
    dibujarFondo(); // Dibuja el fondo
    if (Math.random() < 0.02) { // Probabilidad de aparición de un chango
        crearChango();
    }
    dibujarChangos();
    dibujarExplosiones();
    requestAnimationFrame(loop);
}
