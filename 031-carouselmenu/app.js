const chars = [
	'bear',
	'buffalo',
	'chick',
	'chicken',
	'cow',
	'crocodile',
	'dog',
	'duck',
	'elephant',
	'frog',
	'giraffe',
	'goat',
	'gorilla',
	'hippo',
	'horse',
	'monkey',
	'moose',
	'narwhal',
	'owl',
	'panda',
	'parrot',
	'penguin',
	'pig',
	'rabbit',
	'rhino',
	'sloth',
	'snake',
	'walrus',
	'whale',
	'zebra'
];

for (const ch of chars) {
	Draw.add(ch, `img/${ch}.png`);
}

Audio.add('BGM', 'snd/bgm.mp3', 'snd/bgm.ogg');
Audio.add('Hit', 'snd/hit.mp3', 'snd/hit.ogg');

Audio.setVolume('BGM', 0.2);

class MenuItem {
	constructor(text, desc) {
		this.w = 136;
		this.h = 136;
		this.text = text;
		this.desc = desc;
	}
	get mid() {
		return {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
	}
	draw(i, x, y, scale, r) {
		Draw.imageTransformed(chars[i], x, y, scale * 0.5, r, true);
		Draw.setAlpha(1 - Math.clamp(scale, 0, 1));
		Draw.setColor(C.black);
		Draw.rectTransformed(x, y, this.mid.w * scale, this.mid.h * scale, r);
		Draw.setAlpha(1);
	}
}

class CarouselMenu extends BranthObject {
	start() {
		this.w = 480;
		this.h = 80;
		this.items = [];
		for (const ch of chars) {
			this.items.push(new MenuItem(ch.toUpperCase(), `Select ${ch} as your character.`));
		}
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
		if (Input.keyDown(KeyCode.Left)) {
			this.cursor -= 1;
			if (this.cursor < 0) {
				this.cursor += this.items.length;
			}
			Audio.play('Hit');
		}
		if (Input.keyDown(KeyCode.Right)) {
			this.cursor += 1;
			if (this.cursor >= this.items.length) {
				this.cursor -= this.items.length;
			}
			Audio.play('Hit');
		}
		if (Input.keyDown(KeyCode.Enter)) {
			alert(`${this.items[this.cursor].text} selected.`);
			if (!Audio.isPlaying('BGM')) {
				Audio.loop('BGM');
			}
		}
		this.rotation += Math.sin(Math.degtorad(-this.cursor * (360 / this.items.length) - this.rotation)) * 10;
	}
	render() {
		const sortedItems = [];
		for (let i = 0; i < this.items.length; i++) {
			const d = this.rotation + i * 360 / this.items.length;
			const [x, y] = [this.x + Math.lendiry(this.mid.w, d), this.y + Math.lendirx(this.mid.h, d)];
			sortedItems.push({i, x, y});
		}
		sortedItems.sort((a, b) => a.y < b.y? -1 : 1);
		for (let i = 0; i < sortedItems.length; i++) {
			const s = sortedItems[i];
			const selected = s.i === this.cursor;
			const ydif = s.y - this.y + Math.lendirx(this.mid.h, 0);
			const scale = (selected? 1.18 + Math.sin(Time.time * 0.0074) * 0.02 : 0.5) * ydif / this.h;
			const r = selected? Math.sin(Time.time * 0.074) : 0;
			if (selected) {
				Emitter.preset('sparkle');
				Emitter.setArea(s.x, s.x, s.y, s.y);
				Emitter.setDepth(1);
				Emitter.setColor(Math.choose(C.lemonChiffon, C.navajoWhite));
				Emitter.emit(1);
			}
			this.items[s.i].draw(s.i, s.x, s.y, scale, r);
		}
	}
	renderUI() {
		Draw.setFont(Font.s);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.c, Align.b);
		let x = Room.mid.w, y = Room.h - 8;
		Draw.text(x, y, this.items[this.cursor].desc);
		y -= Font.size + 8;
		Draw.setFont(Font.m);
		Draw.text(x, y, this.items[this.cursor].text);
	}
}

OBJ.add(CarouselMenu);

const Menu = new BranthRoom('Menu', 640, 360);
Room.add(Menu);

Menu.start = () => {
	OBJ.create(CarouselMenu, Room.mid.w, Room.mid.h);
};

Menu.update = () => {
	Emitter.preset('snow');
	Emitter.setArea(0, Room.w * 2, 0, 0);
	Emitter.setDepth(-1);
	Emitter.emit(1);
};

Menu.renderUI = () => {
	Draw.setFont(Font.xlb);
	Draw.setHVAlign(Align.c, Align.t);
	Draw.setColor(C.white);
	Draw.text(Room.mid.w, 17, 'Choose character');
	Draw.setColor(C.black);
	Draw.text(Room.mid.w, 16, 'Choose character');
};

BRANTH.start();
Room.start('Menu');