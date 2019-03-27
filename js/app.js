// Grid to position all entities
var Grid = function() {
    this.numRows =  7;
    this.numCols =  5;
    this.rowSize =  83;
    this.colSize =  101;
    this.rowImages = [
        'images/water-block.png',   // Top row is water
        'images/stone-block.png',   // Row 1 of 3 of stone
        'images/stone-block.png',   // Row 2 of 3 of stone
        'images/grass-block.png',   // Row 3 of 3 of stone
        'images/stone-block.png',   // Row 1 of 2 of grass
        'images/grass-block.png',   // Row 2 of 2 of grass
        'images/grass-block.png'    // Row 2 of 2 of grass
    ];
};

Grid.prototype.render = function() {
    var row, col;
    /* Loop through the number of rows and columns we've defined above
        * and, using the rowImages array, draw the correct image for that
        * portion of the "grid"
        */
    for (row = 0; row < this.numRows; row++) {
        for (col = 0; col < this.numCols; col++) {
            /* The drawImage function of the canvas' context element
                * requires 3 parameters: the image to draw, the x coordinate
                * to start drawing and the y coordinate to start drawing.
                * We're using our Resources helpers to refer to our images
                * so that we get the benefits of caching these images, since
                * we're using them over and over.
                */
            ctx.drawImage(Resources.get(this.rowImages[row]), col * this.colSize, row * this.rowSize);
        }
    }
}

// Enemies our player must avoid
var Enemy = function(grid) {
    this.grid = grid; // Grid to move around
    this.margin = {x: 30, y: -23}; // Justify enemy image on grid
    this.allowedRows = [1, 2, 4]; // Rows that enemies may appear;
    this.allowedInitial = [-100, -200, -300]; //initial x point that enemies may appear;
    this.minSpeed = 1;
    this.maxSpeed = 3;
    this.setRandomPosition();
    this.setRandomSpeed();
    this.sprite = 'images/enemy-bug.png';
};

// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, scoreValue) {
    var gridWidth = this.grid.colSize * this.grid.numCols;
    if (this.x <= gridWidth){
        // By the dt parameter which will ensure the game runs at the same speed fors all computers.
        this.x += this.getDistancePerTime(scoreValue) * dt;
    } else {
        // When gridWidth is reached, the enemy is reset
        this.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Set a new random position and speed
Enemy.prototype.reset = function() {
    this.setRandomPosition();
    this.setRandomSpeed();
}

// Parameter: scoreValue, the current score to set the enemy speed and increase the difficulty dynamically
Enemy.prototype.getDistancePerTime = function(scoreValue) {
    return this.speed * (100 + (scoreValue * 5));
};

// Define a random position by properties allowedRows and allowedInitial;
Enemy.prototype.setRandomPosition = function() {
    var randElement = function randElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    var randomRow = randElement(this.allowedRows);
    var randomInitial = randElement(this.allowedInitial);
    this.setPosition(randomRow, randomInitial);
}

// Set position by grid coordinates
// Parameter: row, y grid point. initialPoint, x grid point
Enemy.prototype.setPosition = function(row, initialPoint) {
    this.x = initialPoint + this.margin.x;
    this.y = this.grid.rowSize * row + this.margin.y;
}

// Set a random speed level between minSpeed and maxSpeed;
Enemy.prototype.setRandomSpeed = function() {
    this.speed = Math.floor(Math.random() * this.maxSpeed) + this.minSpeed;
}

// Get grid coordinate for row.
Enemy.prototype.getRow = function() {
     return (this.y - this.margin.y) / this.grid.rowSize;
}

// Get column range based on grid coordinate.
Enemy.prototype.getColRange = function() {
    var xPos = (this.x - this.margin.x) / this.grid.colSize;
    var minPos = Math.round(xPos);
    var maxPos = Math.ceil(xPos);
    return { min: minPos, max: maxPos }
}

// Returns true if check a Collision with a player
// Parameter: the Player object;
Enemy.prototype.checkCollisions = function(player) {
    var playerPosition = player.getPosition();
    var colRange = this.getColRange();
    if (playerPosition.y === this.getRow()) {
        return playerPosition.x === colRange.min || playerPosition.x === colRange.max;
    }
    return false;
}

// Static method that returns a array of new enemies
Enemy.generateEnemies = function(numEnemies, grid) {
    var arrEnemies = [];
    for(var i = 0; i < numEnemies; i++) {
        arrEnemies.push(new Enemy(grid))
    }
    return arrEnemies;
}

// Character you control
var Player = function(grid) {
    this.grid = grid; // Grid to move around
    this.dead = false; // Define if you lost
    this.margin = {x: 0, y: -30}; //justify player image on grid
    this.sprite = 'images/char-boy.png';
    this.setPosition(2, 6);
}

Player.prototype.update = function() {
    if (this.isWinner() || this.dead) {
        this.reset();
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.reset = function() {
    this.dead = false;
    this.setPosition(2, 6);
}

Player.prototype.handleInput = function(key) {
    var inputActions = {
        left: function left() {
            this.moveX(-1);
        },
        up: function up() {
            this.moveY(-1);
        },
        right: function right() {
            this.moveX(1);
        },
        down: function down() {
            this.moveY(1);
        }
    };
    if (inputActions[key] !== undefined) {
        inputActions[key].call(this);
    }
}

// Returns true when goal is achieved
Player.prototype.isWinner = function() {
    return this.getPosition().y === 0;
}

// Move the player on the row
Player.prototype.moveX = function(distance) {
    var pos = this.getPosition();
    this.setPosition(pos.x + distance, pos.y);
}

// Move the player on the column
Player.prototype.moveY = function(distance) {
    var pos = this.getPosition();
    this.setPosition(pos.x, pos.y + distance);
}

// Define the player position by Grid cordinates
Player.prototype.setPosition = function(x, y) {
    if (this.isValidPosition(x, y)) {
        this.x = this.grid.colSize * x + this.margin.x;
        this.y = this.grid.rowSize * y + this.margin.y;
    }
}

// Get the grid cordinates by current player position
Player.prototype.getPosition = function() {
    var x = (this.x - this.margin.x) / this.grid.colSize;
    var y = (this.y - this.margin.y) / this.grid.rowSize;
    return { x: x, y: y };
}

// Returns true if a grid cordinate position is valid
Player.prototype.isValidPosition = function(x, y) {
    var validX = x >= 0 && x <= this.grid.numCols - 1;
    var validY = y >= 0 && y <= this.grid.numRows - 1;
    return validX && validY;
}

// Score display
var Score = function() {
    this.curentScore = 0;
    this.highScore = 0;
}

// Check player situation for reset or add a point to score
// Parameter: the player object
Score.prototype.update = function(player) {
    if (player.dead) {
        this.reset();
    }
    if (player.isWinner()) {
        this.addPoint();
    }
}

Score.prototype.render = function() {
    ctx.font = '15pt consolas';
    ctx.textAlign = "right";
    ctx.fillStyle = 'black';
    ctx.fillText(('0000' + (this.curentScore)).slice(-4), 500, 40);
    if (this.highScore !== 0) {
        ctx.fillStyle = 'grey';
        ctx.fillText('HI ' + ('0000' + this.highScore).slice(-4), 400, 40);
    }
}

// check of a new record and reset the score value
Score.prototype.reset = function() {
    if(this.curentScore > this.highScore) {
        this.highScore = this.curentScore;
    }
    this.curentScore = 0;
    this.update;
}

Score.prototype.addPoint = function() {
    this.curentScore++;
}

var grid = new Grid();
var score = new Score();
var player = new Player(grid);
var numOfEnemies = 4;
var allEnemies = Enemy.generateEnemies(numOfEnemies, grid);

// This listens for key presses and sends the keys to your Player.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
