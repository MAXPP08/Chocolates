const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 700;

let score = 0;
let projectiles = [];
let fallingObjects = [];
let moveLeft = false;
let moveRight = false;

// Cargar las imágenes
const cannonImg = new Image();
cannonImg.src = 'cannon.png';

const projectileImg = new Image();
projectileImg.src = 'projectile.png';

const fallingObjectImg = new Image();
fallingObjectImg.src = 'fallingObject.png';

class Cannon {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 10;
        this.speed = 7;
    }

    draw() {
        ctx.drawImage(cannonImg, this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'left' && this.x > 0) {
            this.x -= this.speed;
        } else if (direction === 'right' && this.x + this.width < canvas.width) {
            this.x += this.speed;
        }
    }
}

class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 30;
        this.speed = 5;
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.drawImage(projectileImg, this.x - this.width / 2, this.y, this.width, this.height);
    }
}

class FallingObject {
    constructor() {
        this.width = 40;
        this.height = 40;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
        this.speed = Math.random() * 1.5 + 0.5;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        ctx.drawImage(fallingObjectImg, this.x, this.y, this.width, this.height);
    }
}

const cannon = new Cannon();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cannon.draw();

    projectiles.forEach((projectile, index) => {
        projectile.update();
        projectile.draw();
        if (projectile.y + projectile.height < 0) {
            projectiles.splice(index, 1);
        }
    });

    fallingObjects.forEach((object, objectIndex) => {
        object.update();
        object.draw();

        projectiles.forEach((projectile, projectileIndex) => {
            if (projectile.x > object.x && projectile.x < object.x + object.width &&
                projectile.y > object.y && projectile.y < object.y + object.height) {
                projectiles.splice(projectileIndex, 1);
                fallingObjects.splice(objectIndex, 1);
                score += 10;
            }
        });

        if (object.y + object.height > canvas.height) {
            setTimeout(() => {
                if (confirm('Te ganaste ' + score + ' Chocolates 🍫\n¿Quieres jugar de nuevo?')) {
                    window.location.reload();
                }
            }, 100);
        }
    });

    if (Math.random() < 0.02) {
        fallingObjects.push(new FallingObject());
    }

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Puntuación: ' + score, 10, 20);

    if (moveLeft) cannon.move('left');
    if (moveRight) cannon.move('right');

    requestAnimationFrame(gameLoop);
}

// Eventos de teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveLeft = true;
    if (e.key === 'ArrowRight') moveRight = true;
    if (e.key === ' ') {
        projectiles.push(new Projectile(cannon.x + cannon.width / 2, cannon.y));
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') moveLeft = false;
    if (e.key === 'ArrowRight') moveRight = false;
});

// Eventos táctiles para botones móviles
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const shootBtn = document.getElementById('shootBtn');

leftBtn.addEventListener('touchstart', () => moveLeft = true);
leftBtn.addEventListener('touchend', () => moveLeft = false);

rightBtn.addEventListener('touchstart', () => moveRight = true);
rightBtn.addEventListener('touchend', () => moveRight = false);

shootBtn.addEventListener('touchstart', () => {
    projectiles.push(new Projectile(cannon.x + cannon.width / 2, cannon.y));
});

gameLoop();
