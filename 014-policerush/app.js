Draw.add('BG1', 'assets/images/BG1.png');
Draw.add('BG2', 'assets/images/BG2.png');
Draw.add('BG3', 'assets/images/BG3.png');
Draw.add('Road', 'assets/images/Road.png');
Draw.add('Dot', 'assets/images/Dot.png', 2, 2, 23, 23);
Draw.add('PageDialog', 'assets/images/PageDialog.png');
Draw.add('Player', 'assets/images/Player.png', 2, 2, 291, 230);
Draw.add('ButtonBack', 'assets/images/ButtonBack.png', 2, 2, 76, 68);
Draw.add('ButtonNext', 'assets/images/ButtonNext.png', 2, 2, 236, 117);
Draw.add('ButtonPlay', 'assets/images/ButtonPlay.png', 2, 2, 493, 117);
Draw.add('ButtonTuts', 'assets/images/ButtonTuts.png', 2, 2, 493, 117);
Draw.add('ButtonLeft', 'assets/images/ButtonLeft.png', 2, 2, 117, 117);
Draw.add('ButtonExit', 'assets/images/ButtonExit.png', 2, 2, 236, 117);
Draw.add('ButtonRetry', 'assets/images/ButtonRetry.png', 2, 2, 236, 117);
Draw.add('ButtonRight', 'assets/images/ButtonRight.png', 2, 2, 117, 117);
Draw.add('PageTutorials', 'assets/images/PageTutorials.png', 3, 3, 796, 840);

class Button extends BranthGameObject {
	constructor(x, y) {
		super(x, y);
		this.w = 0;
		this.h = 0;
		this.xto = x;
		this.yto = y;
		this.pressed = false;
	}
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		}
	}
	get bound() {
		return {
			l: this.x - this.mid.w,
			r: this.x + this.mid.w,
			t: this.y - this.mid.h,
			b: this.y + this.mid.h
		}
	}
	hover(m) {
		return (m.x >= this.bound.l && m.x <= this.bound.r && m.y >= this.bound.t && m.y <= this.bound.b);
	}
	lateUpdate() {
		if (Input.touchCount > 0) {
			const m = Input.screenToWorldPoint(Input.getTouch(0).position);
		}
		else {
			const m = Input.screenToWorldPoint(Input.mousePosition);
			if (this.pressed) {
				if (this.hover(m)) {
					if (Input.mouseUp(Mouse.Left)) {
						this.click();
					}
				}
			}
			else {
				if (this.hover(m)) {
					if (Input.mouseDown(Mouse.Left)) {
						this.spriteIndex = 1;
						this.pressed = true;
					}
				}
			}
			if (Input.mouseUp(Mouse.Left)) {
				this.pressed = false;
				this.spriteIndex = 0;
			}
		}
		this.x = Math.lerp(this.x, this.xto, 0.2);
		this.y = Math.lerp(this.y, this.yto, 0.2);
	}
}

class ButtonPlay extends Button {
	awake() {
		this.depth = -1;
		this.spriteName = 'ButtonPlay';
		this.w = 493;
		this.h = 117;
		this.y = Room.h;
	}
	click() {
		if (SHOW_TUTORIAL) {
			Room.start('Tuts');
		}
		else {
			Room.start('Prep');
		}
	}
}

class ButtonTuts extends Button {
	awake() {
		this.spriteName = 'ButtonTuts';
		this.w = 493;
		this.h = 117;
		this.y = Room.h;
	}
	click() {
		Room.start('Tuts');
	}
}

class ButtonLeft extends Button {
	awake() {
		this.spriteName = 'ButtonLeft';
		this.w = 117;
		this.h = 117;
	}
	click() {
		Tuts.changeIndex(-1);
	}
}

class ButtonRight extends Button {
	awake() {
		this.spriteName = 'ButtonRight';
		this.w = 117;
		this.h = 117;
		this.x = Room.w;
	}
	click() {
		Tuts.changeIndex(1);
	}
}

class ButtonBack extends Button {
	awake() {
		this.spriteName = 'ButtonBack';
		this.w = 76;
		this.h = 68;
		this.xto = 70;
		this.yto = 70;
	}
	click() {
		switch (Room.current.name) {
			case 'Prep': Room.start(Room.previous.name); break;
			case 'Tuts': Room.start('Menu'); break;
			case 'Game': Game.paused = !Game.paused; break;
		}
	}
}

class ButtonNext extends Button {
	awake() {
		this.spriteName = 'ButtonNext';
		this.w = 236;
		this.h = 117;
		this.y = Room.h;
	}
	click() {
		Prep.changeIndex(1);
	}
}

class ButtonUI extends Button {
	render() {}
	renderUI() {
		this.drawSelf();
	}
}

class ButtonExit extends ButtonUI {
	awake() {
		this.spriteName = 'ButtonExit';
		this.w = 236;
		this.h = 117;
		this.active = false;
		this.visible = false;
	}
	click() {
		Room.start('Menu');
	}
}

class ButtonRetry extends ButtonUI {
	awake() {
		this.spriteName = 'ButtonRetry';
		this.w = 236;
		this.h = 117;
		this.active = false;
		this.visible = false;
	}
	click() {
		Room.start('Game');
	}
}

class Player extends BranthGameObject {
	awake() {
		this.spriteName = 'Player';
		this.laneWidth = Room.w / 3;
		this.lane = 0;
		this.xto = this.x;
		this.yto = this.y;
	}
	changeLane(i) {
		this.lane += i;
		this.lane = Math.clamp(this.lane, -1, 1);
	}
	update() {
		if (Input.keyDown(KeyCode.Left)) {
			this.changeLane(-1);
		}
		if (Input.keyDown(KeyCode.Right)) {
			this.changeLane(1);
		}
		this.xto = Room.mid.w + this.laneWidth * this.lane;
		this.yto = Room.h - 200;
		this.x = Math.lerp(this.x, this.xto, 0.2);
		this.y = Math.lerp(this.y, this.yto, 0.2);
		this.spriteIndex = Time.time / 200;
	}
}

class Transition extends BranthObject {
	awake() {
		this.a = 1;
		this.c = C.black;
	}
	renderUI() {
		this.a -= Time.deltaTime / 200;
		if (this.a <= 0) {
			OBJ.destroy(this.id);
		}
		Draw.setAlpha(Math.clamp(this.a, 0, 1));
		Draw.setColor(this.c);
		Draw.rect(0, 0, Room.w, Room.h);
		Draw.setAlpha(1);
	}
}

OBJ.add(ButtonBack);
OBJ.add(ButtonNext);
OBJ.add(ButtonPlay);
OBJ.add(ButtonTuts);
OBJ.add(ButtonLeft);
OBJ.add(ButtonExit);
OBJ.add(ButtonRetry);
OBJ.add(ButtonRight);
OBJ.add(Player);
OBJ.add(Transition);

let SHOW_TUTORIAL = true;
const GOLD = '#ffb020';
const BLUE = '#3a3653';
const DKBLUE = '#2e2a3e';
const GRAY = '#727272';
const DKGRAY = '#545454';
const LTGRAY = '#afafaf';
const TUTS_TEXT = [
	`Move using your finger to swipe left\nor right to dodge the obstacles.\n\nThe more obstacle you dodge,\nthe faster you will get to the\ninauguration.`,
	`Sign means that the lane there will\nbe an obstacle.\n\nAvoid the obstacle as best as you\ncan to get the best score.`,
	`If you hit an obstacle, then your\nspeed will decrease.\n\nWhich causes decrease in your score.`
];
const PREP_TEXT = [
	`Hey, Rookie! It's your inauguration, right?\nYou gotta go fast to the police station, the\npress will be crowding the road if you're late!`,
	`Here's some direction, Rookie!\nGet a close look or you'll lost!`
];
const FONT_SMALL = '46px';
const FONT_NORMAL = '54px';
const FONT_MEDIUM = '72px';
const FONT_LARGE = '96px';

const Menu = new BranthRoom('Menu', 1080, 1920);
const Tuts = new BranthRoom('Tuts', 1080, 1920);
const Prep = new BranthRoom('Prep', 1080, 1920);
const Game = new BranthRoom('Game', 1080, 1920);
Room.add(Menu);
Room.add(Tuts);
Room.add(Prep);
Room.add(Game);

Menu.start = () => {
	OBJ.create(ButtonPlay, Room.mid.w, Room.h - 500);
	OBJ.create(ButtonTuts, Room.mid.w, Room.h - 300);
	OBJ.create(Transition);
}

Menu.render = () => {
	if (Input.keyDown(KeyCode.Enter)) {
		OBJ.take(ButtonPlay)[0].click();
	}
	Draw.image('BG1', 0, 0);
}

Prep.start = () => {
	this.index = 0;
	OBJ.create(ButtonBack);
	OBJ.create(ButtonNext, Room.mid.w, Room.h - 300);
	OBJ.create(Transition);
}

Prep.changeIndex = (i) => {
	this.index = Math.clamp(this.index + i, 0, 2);
	if (this.index === 2) {
		Room.start('Game');
		this.index = 1;
	}
}

Prep.render = () => {
	if (Input.keyDown(KeyCode.Enter)) {
		OBJ.take(ButtonNext)[0].click();
	}
	if (Input.keyDown(KeyCode.Escape)) {
		OBJ.take(ButtonBack)[0].click();
	}
	Draw.setColor(DKBLUE);
	Draw.rect(0, 0, Room.w, Room.h);
	Draw.image('PageDialog', Room.mid.w, Room.mid.h - 200, true);
	Draw.setColor(C.white);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.setFont(FONT_MEDIUM);
	Draw.text(110, Room.mid.h + 10, 'Mr. Jenkins:');
	Draw.setFont(FONT_SMALL);
	let count = 0;
	for (const t of PREP_TEXT[this.index].split('\n')) {
		Draw.text(110, Room.mid.h + 100 + Font.size * count, t);
		count++;
	}
	Draw.setHVAlign(Align.c, Align.t);
	Draw.text(Room.mid.w, Room.mid.h + 400, `${this.index + 1} / 2`);
}

Tuts.start = () => {
	SHOW_TUTORIAL = false;
	this.index = 0;
	this.buttonLeft = OBJ.create(ButtonLeft, 60, Room.mid.h - 200);
	this.buttonRight = OBJ.create(ButtonRight, Room.w - 60, Room.mid.h - 200);
	OBJ.create(ButtonPlay, Room.mid.w, Room.h - 170);
	OBJ.create(ButtonBack);
	Tuts.changeIndex(0);
	OBJ.create(Transition);
}

Tuts.changeIndex = (i) => {
	this.index = Math.clamp(this.index + i, 0, 2);
	this.buttonLeft.active = true;
	this.buttonLeft.visible = true;
	this.buttonRight.active = true;
	this.buttonRight.visible = true;
	if (this.index === 0) {
		this.buttonLeft.active = false;
		this.buttonLeft.visible = false;
	}
	if (this.index === 2) {
		this.buttonRight.active = false;
		this.buttonRight.visible = false;
	}
}

Tuts.render = () => {
	if (Input.keyDown(KeyCode.Left)) {
		Tuts.changeIndex(-1);
	}
	if (Input.keyDown(KeyCode.Right)) {
		Tuts.changeIndex(1);
	}
	if (Input.keyDown(KeyCode.Enter)) {
		OBJ.take(ButtonPlay)[0].click();
	}
	if (Input.keyDown(KeyCode.Escape)) {
		OBJ.take(ButtonBack)[0].click();
	}
	Draw.setColor(DKBLUE);
	Draw.rect(0, 0, Room.w, Room.h);
	Draw.setColor(C.white);
	Draw.setHVAlign(Align.c, Align.t);
	Draw.setFont(FONT_LARGE);
	Draw.text(Room.mid.w, 80, 'TUTORIAL');
	Draw.sprite('PageTutorials', this.index, Room.mid.w, Room.mid.h - 300, true);
	Draw.setColor(BLUE);
	Draw.roundRect(100, Room.mid.h + 230, Room.w - 200, 400, 20);
	Draw.setColor(GOLD);
	Draw.setLineWidth(10);
	Draw.draw(true);
	Draw.resetLineWidth();
	Draw.setColor(C.white);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.setFont(FONT_NORMAL);
	let count = 0;
	for (const t of TUTS_TEXT[this.index].split('\n')) {
		Draw.text(125, Room.mid.h + 255 + Font.size * count, t);
		count++;
	}
	for (const i of [0, 1, 2]) {
		Draw.sprite('Dot', i === this.index? 1 : 0, Room.mid.w - 70 + 70 * i, Room.mid.h + 160);
	}
}

Game.start = () => {
	Game.paused = false;
	OBJ.create(ButtonBack);
	OBJ.create(Player, Room.mid.w, Room.h + Draw.getSprite('Player').h);
	this.buttonExit = OBJ.create(ButtonExit, Room.mid.w - 236, Room.mid.h);
	this.buttonRetry = OBJ.create(ButtonRetry, Room.mid.w + 236, Room.mid.h);
	const n = OBJ.create(Transition);
	n.a = 1.2;
	n.c = C.white;
	this.roadX = Room.mid.w;
}

Game.update = () => {
	if (Input.keyDown(KeyCode.Escape)) {
		OBJ.take(ButtonBack)[0].click();
	}
	if (Game.paused || Game.over) {
		this.buttonExit.active = true;
		this.buttonRetry.active = true;
		this.buttonExit.visible = true;
		this.buttonRetry.visible = true;
		if (Input.keyDown(KeyCode.Enter)) {
			Room.start('Menu');
		}
	}
	else {
		this.buttonExit.active = false;
		this.buttonRetry.active = false;
		this.buttonExit.visible = false;
		this.buttonRetry.visible = false;
	}
}

Game.render = () => {
	this.roadX = Math.lerp(this.roadX, Input.screenToWorldPoint(Input.mousePosition).x, 0.1);
	Draw.image('BG2', 0, 0);
	Draw.image('BG3', 0, 0);
	// Draw.image('Road', 0, Room.h - Draw.getImage('Road').height);
	const rh = Draw.getImage('Road').height;
	const rw = 315;
	const rx = this.roadX;
	const ry = Room.h - rh;
	const rbw = Room.w + 400;
	Draw.polyBegin();
	let x1 = Room.mid.w - rbw * 0.5;
	let y1 = Room.h;
	Draw.vertex(x1, y1);
	let pd = Math.pointdis(x1, y1, Room.mid.w - rw * 0.5, ry);
	let ld = Math.lendir(pd, Math.pointdir(x1, y1, Room.mid.w - rw * 0.5, ry));
	Draw.vertex(x1 + ld.x * 0.5, y1 + ld.y * 0.5);
	Draw.vertex(x1 + ld.x * 0.77, y1 + ld.y * 0.77);
	Draw.vertex(rx - rw * 0.5, ry);
	Draw.vertex(rx + rw * 0.5, ry);
	let x4 = Room.mid.w + rw * 0.5;
	pd = Math.pointdis(x4, Draw.vertices[4].y, Room.mid.w + rbw * 0.5, Room.h);
	ld = Math.lendir(pd, Math.pointdir(x4, Draw.vertices[4].y, Room.mid.w + rbw * 0.5, Room.h));
	Draw.vertex(x4 + ld.x * 0.23, Draw.vertices[4].y + ld.y * 0.23);
	Draw.vertex(x4 + ld.x * 0.5, Draw.vertices[4].y + ld.y * 0.5);
	Draw.vertex(Room.mid.w + rbw * 0.5, Room.h);

	Draw.beginPath();
	Draw.moveTo(Draw.vertices[0].x, Draw.vertices[0].y);
	Draw.bezierCurveTo(Draw.vertices[1].x, Draw.vertices[1].y, Draw.vertices[2].x, Draw.vertices[2].y, Draw.vertices[3].x, Draw.vertices[3].y);
	Draw.lineTo(Draw.vertices[4].x, Draw.vertices[4].y);
	Draw.bezierCurveTo(Draw.vertices[5].x, Draw.vertices[5].y, Draw.vertices[6].x, Draw.vertices[6].y, Draw.vertices[7].x, Draw.vertices[7].y);
	Draw.setColor(DKGRAY);
	Draw.fill();

	if (false) {
		Draw.setLineWidth(5);
		Draw.setColor(C.yellow);
		Draw.polyEnd(Poly.stroke);
		Draw.setLineWidth(15);
		Draw.setColor(C.red);
		Draw.polyEnd(Poly.pointList);
		Draw.resetLineWidth();
	}
}

Game.renderUI = () => {
	if (Game.paused) {
		Draw.setColor(BLUE);
		Draw.roundRect(100, Room.mid.h - 300, Room.w - 200, 400, 20);
		Draw.setColor(GOLD);
		Draw.setLineWidth(10);
		Draw.draw(true);
		Draw.resetLineWidth();
		Draw.setColor(C.white);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.setFont(FONT_LARGE);
		Draw.text(Room.mid.w, Room.mid.h - 200, 'Paused');
	}
}

BRANTH.start();
Room.start('Menu');