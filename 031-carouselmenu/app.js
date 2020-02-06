class MenuItem {
	constructor(id, color, text, desc) {
		this.x = 0;
		this.y = 0;
		this.id = id;
		this.color = color;
		this.text = text;
		this.desc = desc;
		this.scale = 1;
	}
	get w() {
		return 40 * this.scale;
	}
	get h() {
		return 40 * this.scale;
	}
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	}
	draw(x, y, scale) {
		this.x = x;
		this.y = y;
		this.scale = scale;
		this.render();
	}
	render() {
		Draw.setColor(this.color);
		Draw.rect(this.x - this.mid.w, this.y - this.mid.h, this.w, this.h);
	}
}

class CarouselMenu extends BranthObject {
	start() {
		this.w = Room.mid.w;
		this.h = Room.h * 0.1;
		this.item = null;
		this.items = [
			new MenuItem(0, C.red, 'New Game', 'Start a new game.'),
			new MenuItem(1, C.orange, 'Continue', 'Continue game.'),
			new MenuItem(2, C.yellow, 'Leaderboard', 'See ranking.'),
			new MenuItem(3, C.blue, 'Credits', 'See credits.'),
			new MenuItem(4, C.purple, 'Exit', 'Exit game.')
		];
		this.cursor = 0;
		this.rotation = 0;
	}
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	}
	update() {
		this.x = Room.mid.w;
		this.y = Room.mid.h;
		if (Input.keyDown(KeyCode.Left)) {
			this.cursor -= 1;
			if (this.cursor < 0) {
				this.cursor += this.items.length;
			}
		}
		if (Input.keyDown(KeyCode.Right)) {
			this.cursor += 1;
			if (this.cursor >= this.items.length) {
				this.cursor -= this.items.length;
			}
		}
		this.rotation += Math.sin(Math.degtorad(-this.cursor * (360 / this.items.length) - this.rotation)) * 10;
		this.item = this.items[this.cursor];
		if (Input.keyDown(KeyCode.Enter)) {
			alert(this.item.text);
		}
	}
	renderUI() {
		if (this.item) {
			const sortedItems = [];
			for (let i = 0; i < this.items.length; i++) {
				const d = this.rotation + i * 360 / this.items.length;
				const [x, y] = [this.x + Math.lendiry(this.mid.w, d), this.y + Math.lendirx(this.mid.h, d)];
				sortedItems.push({i, x, y});
			}
			sortedItems.sort((a, b) => a.y < b.y? -1 : 1);
			for (let i = 0; i < sortedItems.length; i++) {
				const s = sortedItems[i];
				const ydif = s.y - this.y + Math.lendirx(this.mid.h, 0);
				this.items[s.i].draw(s.x, s.y, ydif / this.h);
			}
			Draw.setFont(Font.s);
			Draw.setColor(C.black);
			Draw.setHVAlign(Align.c, Align.b);
			let x = Room.mid.w, y = Room.h - 8;
			Draw.text(x, y, this.item.desc);
			y -= Font.size + 8;
			Draw.setFont(Font.m);
			Draw.text(x, y, this.item.text);
		}
	}
}

OBJ.add(CarouselMenu);

const Menu = new BranthRoom('Menu', 640, 360);
Room.add(Menu);

Menu.start = () => {
	OBJ.create(CarouselMenu);
};

BRANTH.start();
Room.start('Menu');