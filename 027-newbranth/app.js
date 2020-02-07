class Car extends BranthObject {
	awake() {
		this.w = 32;
		this.h = 72;
		this.spd = 0;
		this.acc = 0.2;
		this.angle = 0;
	}
	update() {
		const keyUp = Input.keyHold(KeyCode.Up);
		const keyLeft = Input.keyHold(KeyCode.Left);
		const keyDown = Input.keyHold(KeyCode.Down);
		const keyRight = Input.keyHold(KeyCode.Right);
		if (keyUp) {
			this.spd = Math.min(this.acc * 40, this.spd + this.acc);
		}
		if (keyDown) {
			this.spd = Math.max(-this.acc * 20, this.spd - this.acc);
		}
		if (!keyUp && !keyDown) {
			this.spd *= 0.98;
		}
		const l = Math.lendir(this.spd, this.angle);
		this.x += l.x;
		this.y += l.y;
		this.angle += this.spd * 0.5 * ((keyRight - keyLeft));
		Emitter.preset('sparkle');
		Emitter.setArea(this.x, this.x, this.y, this.y);
		Emitter.emit(1);
	}
	render() {
		Draw.setColor(C.lemonChiffon);
		Draw.roundRectTransformed(
			this.x, this.y,
			this.h, this.w, this.w * 0.25,
			false, 1, 1, this.angle);
		Draw.setColor(C.red);
		Draw.circle(this.x, this.y, 3);
	}
}

OBJ.add(Car);

const Menu = new BranthRoom('Menu');
const Game = new BranthRoom('Game');
Room.add(Menu);
Room.add(Game);

Menu.update = () => {
	if (Input.keyDown(KeyCode.Enter)) {
		Room.start('Game');
	}
};

Menu.renderUI = () => {
	if (Input.mouseDown(0)) {
		const m = Input.mousePosition;
		Emitter.preset(Math.randbool()? 'puff' : 'bubble');
		Emitter.setArea(m.x, m.x, m.y, m.y);
		Emitter.emit(Math.range(25, 30));
	}
	Draw.setFont(Font.l);
	Draw.setColor(C.gold);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(Room.mid.w, Room.h * 0.75 - 2, ':');
	Draw.setHAlign(Align.r);
	Draw.text(Room.mid.w - 8, Room.h * 0.75, Time.mm);
	Draw.setHAlign(Align.l);
	Draw.text(Room.mid.w + 8, Room.h * 0.75, Time.ss);
	Draw.setHAlign(Align.c);
	Draw.text(Room.mid.w, Room.mid.h, Room.name);
	Draw.textTransformed(Room.mid.w, Room.h * 0.25, 'Press enter to switch between room', 1 + Math.sin(Time.time * 0.005) * 0.2, 2, Time.time * 0.1);
	Draw.setHVAlign(Align.r, Align.b);
	Draw.text(Room.w - 8, Room.h - 8, `(${~~Room.w}, ${~~Room.h})`);
	let x = Room.w - 8, y = Room.h - 8 - Font.size;
	Draw.setFont(Font.xxl);
	Draw.text(x, y, 'XXL');
	y -= Font.size;
	Draw.setFont(Font.xl);
	Draw.text(x, y, 'XL');
	y -= Font.size;
	Draw.setFont(Font.l);
	Draw.text(x, y, 'L');
	y -= Font.size;
	Draw.setFont(Font.m);
	Draw.text(x, y, `FPS: ${Time.FPS}`);
	y -= Font.size;
	Draw.setFont(Font.s);
	const kp = DEBUG_MODE;
	Draw.text(x, y, `Debug mode is: ${kp? 'ON' : 'OFF'}`);
	Draw.pointLine(
		new Vector2(7, 7),
		new Vector2(71, 37)
	);
	Draw.starRotated(Room.mid.w + 72, Room.mid.h, 8, Time.time * 0.05);
	Draw.rect(32, 32, 7, 18, true);
	Draw.rectTransformed(128, 128, 28, 14, kp, 1, Math.sin(Time.time * 0.01) * 2, Math.sin(Time.time * 0.005) * 24);
	Draw.circle(37, 68, 6);
	Draw.roundRect(64, 48, 24, 18, 5);
	Draw.roundRectTransformed(Room.mid.w, Room.mid.h, 78, 28, 14, kp, 1, Math.sin(Time.time * 0.01) * 2, Math.sin(Time.time * 0.005) * 24);
};

Game.start = () => {
	OBJ.create(Car, Room.w * Math.range(0.25, 0.75), Room.h * Math.range(0.25, 0.75));
};

Game.update = () => {
	if (Input.keyDown(KeyCode.Enter)) {
		Room.start('Menu');
	}
};

Game.renderUI = () => Menu.renderUI();

BRANTH.start();
Room.start('Game');