

var size = 5;


class Block {
	constructor(value) {
		this.value = value;
		this.canCombine = true;


	}
}

var matrix = []
for (var y = 0; y < size; y ++) {
	matrix.push([]);
	for (var x = 0; x < size; x ++) {
		matrix[y].push(new Block(0));
	}
}


function rd (lowerBound, upperBound) {
	return Math.round(Math.random() * (upperBound - lowerBound) + lowerBound);
}

function pMatrix() {
	var table = []
	for (var y = 0; y < size; y ++) {
		table.push([]);
		for (var x = 0; x < size; x ++) {
			if (matrix[y][x].value === 0) {
				table[y].push('')
			}else {
				table[y].push(matrix[y][x].value)
			}
		}
	}
	console.table(table);
}

function avaliableSquares() {
	var result = [];
	for (var y = 0; y < size; y ++) {
		for (var x = 0; x < size; x ++) {
			if (matrix[y][x].value === 0) {
				result.push([x, y]);
			}
		}
	}
	//no more squares avaliable
	if (result.length === 0) {
		console.log('you lose!')
		console.log(result);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = "100px Arial";
		ctx.fillText('You lost!', canvas.width / 2, canvas.height / 2);
		clearInterval(timer);
		return;
	}
	return result;
}

function spawnBlock() {
	var avaliable = avaliableSquares();
	var rand = rd(0, avaliable.length-1);

	var chosenOne = avaliable[rand];


	var chosenX = chosenOne[0];
	var chosenY = chosenOne[1];
	matrix[chosenY][chosenX].value = rd(0, 3) === 0 ? 4 : 2;
}

function swap(x1, y1, x2, y2) {
	var temp = matrix[y1][x1];
	matrix[y1][x1] = matrix[y2][x2];
	matrix[y2][x2] = temp;
}

function collision(x1, y1, x2, y2) {
	if (matrix[y2][x2].value === 0) {
		//the second block is empty
		swap(x1, y1, x2, y2);
	}else if (matrix[y1][x1].value === matrix[y2][x2].value) {
		//makes sure the block can't combine a second time every round
		if (matrix[y1][x1].canCombine && matrix[y2][x1].canCombine) {
			matrix[y2][x2].value *= 2; //second block becomes empty
			matrix[y1][x1].value = 0; //first block becomes empty

			matrix[y1][x1].canCombine = false;
			matrix[y2][x2].canCombine = false;
		}
	}
}

function moveLeft() {
	function moveOnce() {
		for (var y = 0; y < size; y ++) {
			for (var x = 1; x < size; x ++) {
				if (matrix[y][x].value !== 0) { //a block
					collision(x, y, x-1, y);
				}//otherwise it's an empty block
			}
		}

	}
	//illterates until all the blocks have been moved the farthest they can go
	for (var lolo = 0; lolo < size * 2; lolo ++) {
		moveOnce();
	}
}

function moveRight() {
	function moveOnce() {
		for (var y = 0; y < size; y ++) {
			for (var x = 0; x < size - 1; x ++) {
				if (matrix[y][x].value !== 0) { //a block
					collision(x, y, x + 1, y);
				}
			}
		}
	}
	for (var lolo = 0; lolo < size * 2; lolo ++) {
		moveOnce();
	}
}

function moveUp() {
	function moveOnce() {
		for (var y = 1; y < size; y ++) {
			for (var x = 0; x < size; x ++) {
				if (matrix[y][x].value !== 0) {//a block lel
					collision(x, y, x, y - 1);
				}//otherwise it's an empty block
			}
		}
	}
	for (var lolo = 0; lolo < size * 2; lolo ++) {
		moveOnce();
	}
}

function moveDown() {
	function moveOnce() {
		for (var y = 0; y < size - 1; y ++) {
			for (var x = 0; x < size; x ++) {
				if (matrix[y][x].value !== 0) {//a block lol
					collision(x, y, x, y + 1);
				}//otherwise it's an empty block
			}
		}
	}
	for (var lolo = 0; lolo < size * 2; lolo ++) {
		moveOnce();
	}
}

function setCombine(value) {
	for (var y = 0; y < size; y ++) {
		for (var x = 0; x < size; x ++) {
			matrix[y][x].canCombine = value;
		}
	}
}


matrix[rd(0, 3)][rd(0, 3)].value = 2;


pMatrix();

moveDown();
pMatrix();

//playing in the console
function play() {
	pMatrix();

	while (true) {
		var properInput = false;
		var direction;
		while (! properInput) {
			direction = prompt('plz move: ');
			if (direction === '') {
				continue
			}
			if (direction === 'a' || direction === 'd' || direction === 'w'
				|| direction === 's') {
				properInput = true;
			}
		}
		if (direction === 'a') {
			moveLeft();
		}else if (direction === 'd') {
			moveRight();
		}else if (direction === 'w') {
			moveUp();
		}else if (direction === 's') {
			moveDown();
		}

		spawnBlock();
		
		pMatrix();
		setCombine(true);
	}
}

function nextFrame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	function drawBorder(xPos, yPos, width, height, thickness = 1) {
	  ctx.fillStyle='#888888';
	  ctx.fillRect(xPos - (thickness), yPos - (thickness), 
	  	width + (thickness * 2), height + (thickness * 2));
	}
	for (var y = 0; y < size; y ++) {
		for (var x = 0; x < size; x ++) {
			var gridSize = 100;
			ctx.fillStyle = '#333333';
			drawBorder(x * gridSize, y * gridSize, gridSize, gridSize, 
				thickness = 10);
			ctx.fillStyle = '#CCCCCC';
			ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);

			ctx.fillStyle = '#000000';
			var num = String(matrix[y][x].value);
			if (num === '0') {
				num = ' ';
			}else {
				ctx.fillText(num, 
					x * gridSize + (gridSize / 2), 
					y * gridSize + (gridSize / 2));
			}
			
		}

	}


}

function keyCode(event) {
	var x = event.keyCode;
	if (x === 37) {
		moveLeft();
	}else if (x === 39) {
		moveRight();
	}else if (x === 38) {
		moveUp();
	}else if (x === 40) {
		moveDown();
	}
	spawnBlock();

	pMatrix();
	setCombine(true);
}

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#FF0000";
ctx.font = "50px Arial";
ctx.textAlign = 'center';
var timer = setInterval(nextFrame, 17);
