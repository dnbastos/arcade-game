// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.setRandomX();
    this.setRandomY();
    this.setRandomSpeed();
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x <= 500){
        this.x += (this.speed * 100) * dt;
    } else {
        this.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.setRandomX = function() {
    var randomX = Math.floor(Math.random() * 3);
    var allowedX = {
        0: -100,
        1: -300,
        2: -600
    };
    this.x = allowedX[randomX];
}

Enemy.prototype.setRandomY = function() {
    var randomY = Math.floor(Math.random() * 3);
    var allowedY = {
        0: 45,
        1: 130,
        2: 215
    };
    this.y = allowedY[randomY];
}

Enemy.prototype.setRandomSpeed = function() {
    this.speed = Math.floor(Math.random() * 3) + 2;
}

Enemy.prototype.reset = function() {
    this.setRandomX();
    this.setRandomY();
    this.setRandomSpeed();
}

Enemy.prototype.checkCollisions = function(player) {
    if (this.y === player.y && (player.x >= this.x - 80 && player.x <= this.x + 80)) {
        return true;
    }
    return false;
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = 200;
    this.y = 385;
    this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function() {
    if (this.y < 0) {
        this.reset();
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left':
            this.setXLocation(-1);
            break;
        case 'up':
            this.setYLocation(-1);
            break;
        case 'right':
            this.setXLocation(1);
            break;
        case 'down':
            this.setYLocation(1);
            break;
    }
}

Player.prototype.setXLocation = function(x) {
    var maxX = 500;
    var minX = -100;
    x *= 100;
    if (!(this.x + x >= maxX || this.x + x <= minX))
        this.x += x;
}

Player.prototype.setYLocation = function(y) {
    var maxY = 385;
    var minY = -100;
    y *= 85;
    if (!(this.y + y > maxY || this.y + y < minY))
        this.y += y;
}

Player.prototype.reset = function() {
    this.x = 200;
    this.y = 385;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
function generateEnemies(num) {
    var arrEnemies = [];
    for(var i = 0 ; i < num; i++) {
        arrEnemies.push(new Enemy());
    }
    return arrEnemies;
}
var player = new Player();
var allEnemies = generateEnemies(5);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
