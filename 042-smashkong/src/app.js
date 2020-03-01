Sound.add('Menu', 'src/snd/Menu.mp3');
Sound.add('Text', 'src/snd/Text.wav');
Sound.add('Pound', 'src/snd/Pound.wav');
Sound.add('Cursor', 'src/snd/Cursor.wav');
Sound.add('Decision', 'src/snd/Decision.wav');

class Title extends BranthBehaviour {
	constructor() {
		super(0, 0);
		this.scale = 20;
		this.counter = 0;
		this.alarm[0] = 400;
		this.visible = false;
		Sound.play('Pound');
	}
	render() {
		if (this.scale > 18) this.scale -= 0.16;
		else if (this.scale > 1) this.scale = Math.range(this.scale, 0, 0.5);
		else this.scale = Math.range(this.scale, 1, 0.2);
		const t = Math.sin(Time.time * 0.005);
		const txt = 'Smash for your life.'.slice(0, this.counter);
		for (let i = 1; i >= 0; i--) {
			Draw.setColor(i > 0? C.black : C.white);
			Draw.setFont(Font.sm, Font.italic);
			Draw.setHVAlign(Align.r, Align.b);
			Draw.textRotated(Room.mid.w + Draw.textWidth(txt) * 0.5 + i, 124 + i, txt, -4 * t);
			Draw.setFont(Font.xxl, Font.bold);
			Draw.setHVAlign(Align.c, Align.t);
			Draw.textTransformed(Room.mid.w + i, 48 + (6 - 4 * i) * t, 'SMASH KONG', this.scale, this.scale);
		}
	}
	alarm0() {
		this.counter++;
		Sound.play('Text');
		if (this.counter < 20) this.alarm[0] = 20;
	}
}

class Transition extends BranthBehaviour {
	constructor(color = C.white, interval = 200, delay = 100) {
		super(0, 0);
		this.color = color;
		this.interval = interval;
		this.alarm[0] = this.interval + delay;
	}
	render() {
		Draw.setAlpha(Math.clamp(this.alarm[0] / this.interval, 0, 1));
		Draw.setColor(this.color);
		Draw.rect(0, 0, Room.w, Room.h);
		Draw.setAlpha(1);
	}
	alarm0() {
		OBJ.destroy(this.id);
	}
}

OBJ.add(Title);
OBJ.add(Transition);

const Manager = {
	menu: {
		cursor: 0,
		rotation: 0,
		items: [{
				text: 'Start Mission',
				color: C.cornflowerBlue,
				description: 'Smash down buildings!',
				onClick() {
				}
			},
			{
				text: 'Gold Rush',
				color: C.gold,
				description: 'Compete against each other for gold!',
				onClick() {
				}
			},
			{
				text: 'Leaderboard',
				color: C.lemonChiffon,
				description: 'See the best player at smashing!',
				onClick() {
					Room.start('Leaderboard');
				}
			},
			{
				text: 'Resizeable',
				color: C.lightGreen,
				description: 'Set screen mode to fullscreen.',
				onClick() {
				}
			},
			{
				text: 'Credits',
				color: C.tomato,
				description: 'See credits.',
				onClick() {
					Room.start('Credits');
				}
			}
		],
		get keyA() {
			return Input.keyDown(KeyCode.A) || Input.keyDown(KeyCode.Left);
		},
		get keyD() {
			return Input.keyDown(KeyCode.D) || Input.keyDown(KeyCode.Right);
		},
		get keyEnter() {
			return Input.keyDown(KeyCode.Enter) || Input.keyDown(KeyCode.Space);
		},
		get keyEscape() {
			return Input.keyDown(KeyCode.Escape) || Input.keyDown(KeyCode.Backspace);
		},
		drawText(x, y, text) {
			for (let i = 1; i >= 0; i--) {
				Draw.setColor(i > 0? C.black : C.white);
				Draw.text(x + i, y + i, text);
			}
		}
	},
	game: {
		drawWallAround() {
			Draw.setColor(C.darkGray);
			Draw.rect(0, 0, Room.w, 32);
			Draw.rect(0, 0, 32, Room.h);
			Draw.rect(0, Room.h - 32, Room.w, 32);
			Draw.rect(Room.w - 32, 0, 32, Room.h);
			Draw.setColor(C.gray);
			Draw.circle(16, 16, 4, true);
			Draw.circle(Room.w - 16, 16, 4, true);
			Draw.circle(16, Room.h - 16, 4, true);
			Draw.circle(Room.w - 16, Room.h - 16, 4, true);
			Draw.setColor(C.black);
			Draw.rect(1, 1, Room.w - 2, Room.h - 2, true);
			Draw.rect(32, 32, Room.w - 64, Room.h - 64, true);
		}
	},
	credits: {
		y: 0
	},
	leaderboard: {
		y: 0
	}
};

const Menu = new BranthRoom('Menu');
const Game = new BranthRoom('Game');
const Credits = new BranthRoom('Credits');
const Leaderboard = new BranthRoom('Leaderboard');
Room.add(Menu);
Room.add(Game);
Room.add(Credits);
Room.add(Leaderboard);

Menu.start = () => {
	if (!Sound.isPlaying('Menu')) Sound.loop('Menu');
	Manager.menu.cursor = 0;
	Manager.menu.rotation = -72;
	OBJ.push(Transition, new Transition(C.white));
	OBJ.create(Title);
};

Menu.update = () => {
	if (Manager.menu.keyA) {
		if (--Manager.menu.cursor < 0) Manager.menu.cursor = Manager.menu.items.length - 1;
		Sound.play('Cursor');
	}
	if (Manager.menu.keyD) {
		if (++Manager.menu.cursor > Manager.menu.items.length - 1) Manager.menu.cursor = 0;
		Sound.play('Cursor');
	}
	if (Manager.menu.keyEnter) {
		Manager.menu.items[Manager.menu.cursor].onClick();
		Sound.play('Decision');
	}
	Manager.menu.rotation += Math.sin(Math.degtorad(-Manager.menu.cursor * (360 / Manager.menu.items.length) - Manager.menu.rotation)) * 10;
	if (Room.name === 'Menu') {
		Emitter.preset('fire');
		Emitter.setColor(Math.choose(C.indigo, C.darkSlateBlue));
		Emitter.setArea(0, Room.w, Room.h, Room.h);
		Emitter.emit(1);
	}
};

Menu.renderUI = () => {
	const menu = {
		x: Room.mid.w,
		y: Room.mid.h,
		w: Room.w * 0.6,
		h: Room.h * 0.1
	};
	const h = [];
	for (let i = Manager.menu.items.length - 1; i >= 0; i--) {
		const j = Manager.menu.rotation + i * 360 / Manager.menu.items.length;
		h.push({ i, x: menu.x + Math.lendiry(menu.w * 0.5, j), y: menu.y + Math.lendirx(menu.h * 0.5, j) });
	}
	h.sort((a, b) => a.y > b.y? -1 : 1);
	for (let i = h.length - 1; i >= 0; i--) {
		const j = h[i];
		const k = j.i === Manager.menu.cursor;
		const l = 0.25 + 0.75 * ((j.y - menu.y + Math.lendirx(menu.h * 0.5, 0)) / menu.h);
		Draw.setColor(Manager.menu.items[j.i].color);
		Draw.rectTransformed(j.x, j.y, 80, 80, false, l, l);
		Draw.setAlpha(0.5);
		Draw.rectTransformed(j.x, menu.y + 90 * l, 200, 20, false, l, l);
		Draw.setAlpha(1);
	}
	const t = 1 + Math.max(0, Math.sin(Time.time * 0.01) * 0.1);
	Draw.setFont(Font.l, Font.bold);
	Draw.setHVAlign(Align.c, Align.m);
	for (let i = 1; i >= 0; i--) {
		Draw.setColor(i > 0? C.black : C.white);
		Draw.textTransformed(menu.x + i, menu.y + 90 + i, Manager.menu.items[Manager.menu.cursor].text, t, t, Math.range(-1, 1));
	}
	Draw.setFont(Font.m);
	Draw.setVAlign(Align.b);
	Manager.menu.drawText(menu.x, Room.h - 48 + Math.sin(Time.time * 0.01) * 2, Manager.menu.items[Manager.menu.cursor].description);
	Draw.setFont(Font.s);
	Draw.setHAlign(Align.l);
	Draw.setAlpha(0.5);
	Manager.menu.drawText(16, Room.h - 16, 'Press <Left> or <Right> to select.\nPress <Enter> to confirm.');
	Draw.setAlpha(1);
	OBJ.take(Title)[0].render();
};

Credits.start = () => {
	Manager.credits.y = 320;
};

Credits.update = () => {
	if (Manager.menu.keyEscape) {
		Room.start('Menu');
		Manager.menu.cursor = 4;
		Manager.menu.rotation = 0;
	}
	if (Room.name === 'Credits') {
		Emitter.preset('fire');
		Emitter.setArea(0, Room.w, Room.h, Room.h);
		Emitter.emit(1);
	}
	Manager.credits.y = Math.range(Manager.credits.y, 0, 0.2);
};

Credits.renderUI = () => {
	const t = Math.sin(Time.time * 0.005);
	Draw.setFont(Font.xxl);
	Draw.setHVAlign(Align.c, Align.t);
	Manager.menu.drawText(Room.mid.w, 48 + t * 5, 'CREDITS');
	Draw.setFont(Font.s);
	Draw.setHVAlign(Align.l, Align.b);
	Draw.setAlpha(0.5);
	Manager.menu.drawText(16, Room.h - 16, 'Press <Backspace> to back.');
	Draw.setAlpha(1);
};

Leaderboard.start = () => {
	Manager.leaderboard.y = 320;
};

Leaderboard.update = () => {
	Manager.leaderboard.t += Time.deltaTime;
	if (Manager.menu.keyEscape) {
		Room.start('Menu');
		Manager.menu.cursor = 2;
		Manager.menu.rotation = -216;
	}
	if (Room.name === 'Leaderboard') {
		Emitter.preset('fire');
		Emitter.setColor(Math.choose(C.lemonChiffon, C.yellow));
		Emitter.setArea(0, Room.w, Room.h, Room.h);
		Emitter.emit(1);
	}
	Manager.leaderboard.y = Math.range(Manager.leaderboard.y, 0, 0.2);
};

Leaderboard.renderUI = () => {
	const t = Math.sin(Time.time * 0.005);
	Draw.setFont(Font.xxl);
	Draw.setHVAlign(Align.c, Align.t);
	Manager.menu.drawText(Room.mid.w, 48 + t * 5, 'LEADERBOARD');
	Draw.setFont(Font.m);
	for (let i = 0; i < 10; i++) {
		const x = Room.mid.w + Math.ceil(i * 0.5) * (i % 2 === 0? -1 : 1) * 75;
		const h = (10 - i) * 34;
		const y = Manager.leaderboard.y + Room.h - h;
		Draw.setColor(C.goldenRod);
		Draw.roundRect(x, y, 40, h + 32, 4);
		Draw.setVAlign(Align.t);
		Manager.menu.drawText(x + 20, y + 6, i + 1);
		Draw.setVAlign(Align.b);
		Draw.setColor(C.blue);
		Draw.rect(x + 8, y, 24, -24);
		Manager.menu.drawText(x + 20, y - 30, `${'Greyhunter'}\n${(11 - i) * 10000}`);
	}
	Draw.setFont(Font.s);
	Draw.setHVAlign(Align.l, Align.b);
	Draw.setAlpha(0.5);
	Manager.menu.drawText(16, Room.h - 16, 'Press <Backspace> to back.');
	Draw.setAlpha(1);
};

BRANTH.start(960, 540, { HAlign: true, VAlign: true });
Room.start('Leaderboard');