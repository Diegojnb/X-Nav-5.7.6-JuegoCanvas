// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

// monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var princessesCaught = 0;

var stones = {};
var monsters = {};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	localStorage.setItem("princess",princessesCaught);
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	princess.x = 32 + (Math.random() * (canvas.width - 100));
	princess.y = 32 + (Math.random() * (canvas.height - 100));

	numberStones = Math.random() * 5;
	numberMonster = Math.random() * 2;
	stones =	generatestones(parseInt(numberStones));
	monsters =	generatemonster(parseInt(numberMonster));

};

var generatestones = function (n){
	var array = {};
	for (var i = 0; i < n; i++) {
		var stone = {};
		stone.x = 32 + (Math.random() * (canvas.width - 100));
		stone.y = 32 + (Math.random() * (canvas.height - 100));
		if ((Math.abs(stone.x-princess.x)<20) && (Math.abs(stone.y-princess.y)<20)) {
			reset();
		}
		for (j = 0; j < i; j++) {
			if ((Math.abs(stone.x-array[j].x)<20) && (Math.abs(stone.y-array[j].y)<20)) {
				reset();
			}
		}
		array[i] = stone;
	}
	return array;
};

var generatemonster = function (m,n){
	var array = {};
	for (var i = 0; i < m; i++) {
		var monster = {};
		monster.x = 32 + (Math.random() * (canvas.width - 100));
		monster.y = 32 + (Math.random() * (canvas.height - 100));
		if ((Math.abs(monster.x-princess.x)<20) && (Math.abs(monster.y-princess.y)<20)) {
			reset();
		}
		for (j = 0; j < i; j++) {
			if ((Math.abs(monster.x-array[j].x)<20) && (Math.abs(monster.y-array[j].y)<20)) {
				reset();
			}
		}
		for (k = 0; k < n; k++) {
			if ((Math.abs(monster.x-stones[k].x)<20) && (Math.abs(monster.y-stones[k].y)<20)) {
				reset();
			}
		}
		array[i] = monster;
	}
	return array;
};

var canpass = function (to){

	for (var i = 0; i < parseInt(numberStones); i++) {
		if(hero.x <= (stones[i].x + 28) && stones[i].x <= (hero.x + 28)	&& hero.y <= (stones[i].y + 28)	&& stones[i].y <= (hero.y + 28)){
			if(to=="l"){
				hero.x += 5;
			}else if(to=="r"){
				hero.x -= 5;
			}else if(to=="d"){
				hero.y -= 5;
			}else if(to=="u"){
				hero.y += 5;
			}
		}
	}
	return true;
};
// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if (canpass("u")){
			if(hero.y>32){
				hero.y -= hero.speed * modifier;
			}
		}
	}
	if (40 in keysDown) { // Player holding down
		if (canpass("d")){
			if(hero.y<416){
				hero.y += hero.speed * modifier;
			}
		}
	}
	if (37 in keysDown) { // Player holding left
		if (canpass("l")){
			if(hero.x>32){
				hero.x -= hero.speed * modifier;
			}
		}
	}
	if (39 in keysDown) { // Player holding right
		if (canpass("r")){
			if(hero.x<448){
				hero.x += hero.speed * modifier;
			}
		}
	}

	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		reset();
	}
};

var pintarStones = function () {
	for (var i = 0; i < stones.length; i++) {
		ctx.drawImage(stoneImage, stone.x, stone.y);
	}
};

var pintarMonsters = function () {
	for (var i = 0; i < stones.length; i++) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (stoneReady) {
		for (var i = 0; i < parseInt(numberStones); i++) {
			ctx.drawImage(stoneImage, stones[i].x, stones[i].y);
		}
	}

	if (monsterReady) {
		for (var i = 0; i < parseInt(numberMonster); i++) {
			ctx.drawImage(monsterImage, monsters[i].x, monsters[i].y);
		}
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

if (localStorage.getItem("princess")!=null) {
	princessesCaught=localStorage.getItem("princess");
}

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
