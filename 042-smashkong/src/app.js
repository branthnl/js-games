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
				}
			}
		]
	}
};

class Title extends BranthBehaviour {
	awake() {
		this.scale = 20;
		this.counter = 0;
		this.alarm[0] = 400;
	}
	render() {
		if (this.scale > 18) this.scale -= 0.16;
		else if (this.scale > 1) this.scale = Math.range(this.scale, 0.9, 0.5);
		else this.scale = Math.range(this.scale, 1, 0.5);
		const txt = 'Smash for your life.'.slice(0, this.counter);
		for (let i = 1; i >= 0; i--) {
			Draw.setColor(i > 0? C.black : C.white);
			Draw.setFont(Font.m, Font.italic);
			Draw.setHVAlign(Align.r, Align.t);
			Draw.textRotated(Room.mid.w + Draw.textWidth(txt) * 0.5 + i, 90 + i, txt, Math.sin(Time.time * 0.01) * -4);
			Draw.setFont(Font.xxl, Font.bold);
			Draw.setHVAlign(Align.c, Align.t);
			Draw.textTransformed(Room.mid.w + i, 32 + (6 - 4 * i) * Math.sin(Time.time * 0.01), 'SMASH KONG', this.scale, this.scale);
		}
	}
	alarm0() {
		this.counter++;
		if (this.counter < 20) this.alarm[0] = 20;
	}
}

OBJ.add(Title);

const Menu = new BranthRoom('Menu');
const Game = new BranthRoom('Game');
Room.add(Menu);
Room.add(Game);

Menu.start = () => {
	OBJ.create(Title);
};

Menu.update = () => {
	const keyA = Input.keyDown(KeyCode.A) || Input.keyDown(KeyCode.Left);
	const keyD = Input.keyDown(KeyCode.D) || Input.keyDown(KeyCode.Right);
	if (keyA) {
		if (--Manager.menu.cursor < 0) {
			Manager.menu.cursor = Manager.menu.items.length - 1;
		}
	}
	if (keyD) {
		if (++Manager.menu.cursor > Manager.menu.items.length - 1) {
			Manager.menu.cursor = 0;
		}
	}
	Manager.menu.rotation += Math.sin(Math.degtorad(-Manager.menu.cursor * (360 / Manager.menu.items.length) - Manager.menu.rotation)) * 10;
};

Menu.render = () => {
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
	for (let i = 1; i >= 0; i--) {
		Draw.setColor(i > 0? C.black : C.white);
		Draw.text(menu.x + i, Room.h - 32 + i + Math.sin(Time.time * 0.01) * 2, Manager.menu.items[Manager.menu.cursor].description);
	}
};

BRANTH.start(960, 540);
Room.start('Menu');