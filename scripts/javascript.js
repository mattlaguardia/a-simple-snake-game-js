// CONTENTS OF THE BOARD

var rows= 26;
var columns = 26;

// DIRECTION VARIABLES LEFT UP RIGHT AND DOWN

var LEFT=0;
var UP=1;
var RIGHT=2;
var DOWN=3;

// IDS

var EMPTY = 0;
var snake = 1;
var fruit = 2;

// GAME VARIABLES

var canvas;
var ctx;
var keyState;
var frames;

// KEY CONTROLS FOR THE snake
KEY_LEFT = 37;
KEY_UP = 38;
KEY_RIGHT = 39;
KEY_DOWN = 40;

var grid = {
	width: null,
	height: null,
	_grid: null,

// CONSTRUCTOR FUNCTIONS FOR GRID//

	init: function(d, c, r){
		this.width = c;
		this.height = r;

		this._grid = [];

		for (var x = 0; x < c; x++){  // C is for Column, creating x axis
			this._grid.push([]);		// creates the x axis

			for (var y = 0; y < r; y++){ // R is for row, creating the y axis
				this._grid[x].push(d);   // creates the y axis
			}
		}
	},

// CREATING THE GRIDS DATA STRUCTURE //

	set: function(val, x , y){
		this._grid[x][y] = val;
	},
	get: function(x,y){
		return this._grid[x][y];
	}
};

// snake OBJECT //

var snake = {
	direction: null,
	last: null,
	_queue: null,

	init: function(d,x,y){  // direction on the x and y axis //
		this.direction = d;
		this._queue = [];
		this.insert(x,y);
	},
	insert: function(x,y){
		this._queue.unshift({x:x, y:y});
		this.last = this._queue[0];
	},
	remove: function (){
		return this._queue.pop();
	}
}

// FOOD PLACEMENT ON THE BOARD
// TRACKING ALL THE empty PLACES ON THE GRID

function setFood (){
	var empty = [];
	for (var x=0; x < grid.width; x++){
		for (var y=0; y < grid.height; y++) {
			if (grid.get(x,y) === EMPTY){
				empty.push({x:x, y:y});
			}
		}
	}
	var randPos = empty[Math.floor(Math.random()*empty.length-1)];
	grid.set(fruit, randPos.x, randPos.y);
}

// MAIN INIT LOOP UPDATE AND DRAW

function main (){
	canvas = document.createElement("canvas");
	canvas.width = columns*20;
	canvas.height = rows*20;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);

	frames = 0;
	keyState = {};

// ARROW KEYS EVENT LISTENERS

	document.addEventListener("keydown", function(e){
		keyState[e.keyCode] = true;
	});
	document.addEventListener("keyup", function(e){
		delete keyState[e.keyCode];
	});

	init();
	loop();
}

function init (){
	grid.init(EMPTY, columns, rows); // creating the grid at load
	// creating the start pos of the snake startPos
	var startPos = {x:Math.floor(columns/2), y:rows-1};
	snake.init(UP, startPos.x, startPos.y);
	grid.set(snake, startPos.x, startPos.y);

	setFood();
}

function loop (){
	update();
	draw();

	window.requestAnimationFrame(loop, canvas);
}

function update (){
	frames++;

// Changing direction of the snake

	if (keyState[KEY_LEFT] && snake.direction !== RIGHT){
		snake.direction = LEFT;
	}
	if (keyState[KEY_UP] && snake.direction !== DOWN){
		snake.direction = UP;
	}
	if (keyState[KEY_RIGHT] && snake.direction !== LEFT){
		snake.direction = RIGHT;
	}
	if (keyState[KEY_DOWN] && snake.direction !== UP){
		snake.direction = DOWN;
	}
// EACH FIVE FRAMES UPDATE THE GAME STATE

	if (frames%5 === 0) {
		var nx = snake.last.x;
		var ny = snake.last.y;

// Updates the position depending on the snake direction

		switch (snake.direction) {
			case LEFT:
				nx--;
				break;
			case UP:
				ny--;
				break;
			case RIGHT:
				nx++;
				break;
			case DOWN:
				ny++;
				break;
		}
		if (0 > nx || nx > grid.width-1 || 0 > ny || ny > grid.height-1){
			return init();
		}

		if (grid.get(nx, ny) === fruit){
				var tail = {x:nx, y:ny};
				setFood();
		} else {
				var tail = snake.remove();
				grid.set(EMPTY, tail.x, tail.y);
				tail.x = nx;
				tail.y = ny;
		}

		grid.set(snake, tail.x, tail.y);
		snake.insert(tail.x, tail.y);
	}
}

function draw (){
	var tw = canvas.width/grid.width;
	var th = canvas.height/grid.height;

	for (x=0; x < grid.width ; x++){
		for (y=0; y < grid.height ; y++) {
			switch (grid.get(x,y)){
				case EMPTY:
					ctx.fillStyle = "#fff";
					break;
				case snake:
					ctx.fillStyle = "#0ff";
					break;
				case fruit:
					ctx.fillStyle = "#f00";
					break;
			}
			ctx.fillRect(x*tw, y*th, tw,th);
		}
	}
}

// CALLING OUR MAIN FUNCTION

main();
