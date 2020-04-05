const input = {
	army1: {
		flag: "S",
		nickname: "Basandee",
		s1: { type: 0, name: "Gru", strength: 45 },
		s2: { type: 0, name: "Leo", strength: 45 },
		s3: { type: 0, name: "Hut", strength: 121 },
		s4: { type: 0, name: "Ity", strength: 111 },
		s5: { type: 0, name: "Bea", strength: 132 }
	},
	army2: {
		flag: "P",
		nickname: "Galacthee",
		s1: { type: 0, name: "Hug", strength: 32 },
		s2: { type: 0, name: "Pot", strength: 44 },
		s3: { type: 0, name: "Fro", strength: 131 },
		s4: { type: 0, name: "Saw", strength: 124 },
		s5: { type: 0, name: "Sin", strength: 108 }
	},
	winner: "army1"
};

/*

- Draw arena
- For each unit
	- Draw self
	- Draw flag
	- Draw icon above head (referencing type)
	- Draw strength
	- Run attack alarm
	- As attack alarm hits zero
		- Release attack box
		- Reset attack alarm
- Draw UI
	- Team nickname
- Draw particles

*/

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	copy() {
		return new Point(this.x, this.y);
	}
}

class Rect {
	constructor(x, y, w, h) {
		this.position = new Point(x, y);
		this.size = new Point(w, h);
	}
	draw() {
		Draw.rect(this.position.x, this.position.y, this.size.x, this.size.y);
	}
}

const Room = {
	size: new Point(960, 540)
};

const Time = {
	time: 0,
	lastTime: 0,
	deltaTime: 0,
	update(t) {
		this.lastTime = this.time;
		this.time = t;
		this.deltaTime = this.lastTime - this.time;
	}
};

const Canvas = document.createElement("canvas");

const C = {
	blue: "#aaeeff",
	blacK: "#000000",
	green: "#8bde0e",
	white: "#ffffff"
};

const Draw = {
	list: {},
	ctx: Canvas.getContext("2d"),
	setCtx(ctx) {
		this.ctx = ctx;
	},
	resetCtx() {
		this.ctx = Canvas.getContext("2d");
	},
	setFill(c) {
		this.ctx.fillStyle = c;
	},
	setStroke(c) {
		this.ctx.strokeStyle = c;
	},
	draw(outline=false) {
		if (outline) this.ctx.stroke();
		else this.ctx.fill();
	},
	rect(x, y, w, h, outline=false) {
		this.ctx.beginPath();
		this.ctx.rect(x, y, w, h);
		this.draw(outline);
	},
	circle(x, y, r, outline=false) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, 2 * Math.PI);
		this.draw(outline);
	},
	image(img, x, y) {
		this.ctx.drawImage(img, x, y);
	},
	imageStrip(img, stripAmount, imageIndex, x, y) {
		const s = {
			w: img.width / stripAmount,
			h: img.height
		};
		this.ctx.drawImage(img, s.w * imageIndex, 0, s.w, s.h, x, y, s.w, s.h);
	},
	imageWithAnchor(img, x, y, anchorX, anchorY) {
		this.ctx.drawImage(img, x - img.width * anchorX, y - img.height * anchorY);
	},
	setFont(font) {
		this.ctx.font = font;
	},
	setHVAlign(h, v) {
		this.ctx.textAlign = h;
		this.ctx.textBaseline = v;
	},
	text(x, y, text) {
		this.ctx.fillText(text, x, y);
	},
	clear() {
		this.ctx.clearRect(0, 0, Room.size.x, Room.size.y);
	}
};

const Sound = {
	list: {},
	play(key) {
		const s = this.list[key];
		if (s) {
			s.currentTime = 0;
			s.play();
		}
	}
};

const Loader = {
	loaded: 0,
	loadAmount: 0,
	getLoadProgress() {
		return this.loaded / this.loadAmount;
	},
	addLoaded() {
		Loader.loaded++;
	},
	load(type, key, url, audioType="wav") {
		this.loadAmount++;
		switch (type) {
			case "image":
				const img = new Image();
				img.src = url;
				img.addEventListener("load", this.addLoaded);
				Draw.list[key] = img;
				break;
			case "Sound":
				const snd = new Audio();
				snd.innerHTML = `<source src="${url}" type="audio/${audioType}">`
				snd.addEventListener("");
				Sound.list[key] = snd;
				break;
		}
	},
	render() {
		Draw.text(Room.size.x * 0.5, Room.size.y * 0.5, `${Math.floor(this.getLoadProgress() * 100)}%`);
	}
};

const Arena = {
	arenaRect: new Rect(0, Room.size.y * 0.5, Room.size.x, Room.size.y * 0.5)
};

const Battle = {};

const Game = {
	start() {
		Canvas.id = "gameCanvas";
		Canvas.width = Room.size.x;
		Canvas.height = Room.size.y;
		const Css = document.createElement("style");
		Css.innerHTML = `
			* {
				margin: 0;
				padding: 0;
			}
			#${Canvas.id} {
				width: ${Canvas.width}px;
				height: ${Canvas.height}px;
				background-color: ${C.blue};
			}
		`;
		document.head.appendChild(Css);
		document.body.appendChild(Canvas);
		window.requestAnimationFrame(this.update);
	},
	update(t) {
		Time.update(t);
		Draw.clear();
		if (Loader.loaded === Loader.loadAmount) Game.render();
		else Loader.render();
		window.requestAnimationFrame(Game.update);
	},
	render() {
		Draw.setFill(C.green);
		Arena.arenaRect.draw();
	}
};

Game.start();