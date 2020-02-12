const Level = new BranthRoom('Level');
Room.add(Level);

let snap, select, Tile;

let isSnap = false;

const pre = document.createElement('textarea');

const start = () => {
	const room = {
		w: document.querySelector('#rw').value,
		h: document.querySelector('#rh').value
	};
	Tile = {
		w: +document.querySelector('#tw').value,
		h: +document.querySelector('#th').value
	};
	const obj = [];
	for (const o of document.querySelector('#obj').value.split(',')) {
		obj.push(`<option>${o}</option>`);
	}
	document.body.innerHTML = '';
	BRANTH.start(room.w, room.h);
	Room.start('Level');
	select = document.createElement('select');
	select.innerHTML = obj.join('');
	const span = document.createElement('span');
	span.innerHTML = `Tile (${Tile.w}, ${Tile.h})<label for="snap">Snap: </label>`;
	snap = document.createElement('input');
	snap.id = 'snap';
	snap.type = 'checkbox';
	snap.onclick = () => snapClick();
	span.appendChild(snap);
	document.body.appendChild(select);
	document.body.appendChild(span);
	document.body.appendChild(document.createElement('br'));
};

const snapClick = () => {
	isSnap = snap.checked;
};

const updatePRE = () => {
	if (OBJ.take(Showcase).length) {
		pre.value = '// Copy code below to your game\n';
	}
	else {
		pre.value = '';
	}
	for (const o of OBJ.take(Showcase)) {
		pre.value += `OBJ.create(${o.name}, ${o.x}, ${o.y});\n`;
	}
};

class Showcase extends BranthObject {
	constructor(name, x, y) {
		super(x, y);
		this.r = Math.max(Tile.w, Tile.h) * 0.25;
		this.name = name;
		this.hold = false;
		this.dragX = 0;
		this.dragY = 0;
	}
	get hover() {
		const m = Input.mousePosition;
		return Math.pointdis(m, new Vector2(this.x, this.y)) < this.r;
	}
	update() {
		if (this.hover) {
			mouseHover = true;
			if (Input.mouseDown(0)) {
				const m = Input.mousePosition;
				this.dragX = this.x - m.x;
				this.dragY = this.y - m.y;
				this.hold = true;
			}
			if (Input.mouseDown(Mouse.Right)) {
				OBJ.destroy(this.id);
				updatePRE();
			}
		}
		if (this.hold) {
			let m = Input.mousePosition;
			if (isSnap || Input.keyHold(KeyCode.Ctrl)) {
				m.x = (~~(m.x / Tile.w) + 0.5) * Tile.w;
				m.y = (~~(m.y / Tile.h) + 0.5) * Tile.h;
			}
			else {
				m = Vector2.add(m, new Vector2(this.dragX, this.dragY));
			}
			[this.x, this.y] = [Math.clamp(~~m.x, 0, Room.w), Math.clamp(~~m.y, 0, Room.h)];
		}
		if (Input.mouseUp(0)) {
			if (this.hold) {
				if (this.hover) {
					updatePRE();
				}
				this.hold = false;
			}
		}
	}
	renderUI() {
		Draw.setColor(C.black);
		Draw.circle(this.x, this.y, this.r);
		Draw.setFont(Font.s);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.setColor(this.hover || this.hold? C.yellow : C.white);
		Draw.text(this.x, this.y, this.name);
	}
}

OBJ.add(Showcase);

let mouseHover = false;

Level.update = () => {
	mouseHover = false;
};

Level.render = () => {
	if (!mouseHover && Input.mouseDown(0)) {
		const m = Input.mousePosition;
		if (m.x > 0 && m.x < Room.w && m.y > 0 && m.y < Room.h) {
			if (isSnap) {
				m.x = (~~(m.x / Tile.w) + 0.5) * Tile.w;
				m.y = (~~(m.y / Tile.h) + 0.5) * Tile.h;
			}
			OBJ.push(Showcase, new Showcase(select.value, ~~m.x, ~~m.y));
			if (OBJ.take(Showcase).length === 1) {
				if (!document.body.contains(pre)) {
					const copy = document.createElement('button');
					copy.innerHTML = 'Copy Code';
					copy.onclick = () => {
						pre.select();
						document.execCommand('copy');
					};
					document.body.appendChild(copy);
					document.body.appendChild(document.createElement('br'));
					pre.style.width = '100%';
					pre.style.height = '100%';
					document.body.appendChild(pre);
				}
				pre.value += '// Copy code below to your game\n';
			}
			pre.value += `OBJ.create(${select.value}, ${m.x}, ${m.y});\n`;
		}
	}
	if (isSnap) {
		Draw.setColor(C.black);
		for (let i = 0; i < Room.w / Tile.w; i++) {
			for (let j = 0; j < Room.h / Tile.h; j++) {
				Draw.rect(i * Tile.w, j * Tile.h, Tile.w, Tile.h, true);
			}
		}
		const m = Input.mousePosition;
		m.x = ~~(m.x / Tile.w) * Tile.w;
		m.y = ~~(m.y / Tile.h) * Tile.h;
		Draw.rect(m.x, m.y, Tile.w, Tile.h);
	}
};