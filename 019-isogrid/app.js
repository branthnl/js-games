const Game = new BranthRoom('Game');
Room.add(Game);

class Point {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
}

class Line {
	constructor(p1, p2) {
		this.p = [p1, p2];
	}
	intersect(line) {
		const p1 = this.p[0], p2 = this.p[1], p3 = line.p[0], p4 = line.p[1];
		const s1 = new Point(p2.x - p1.x, p2.y - p1.y);
		const s2 = new Point(p4.x - p3.x, p4.y - p3.y);
		const s = (-s1.y * (p1.x - p3.x) + s1.x * (p1.y - p3.y)) / (-s2.x * s1.y + s1.x * s2.y);
		const t = (s2.x * (p1.y - p3.y) - s2.y * (p1.x - p3.x)) / (-s2.x * s1.y + s1.x * s2.y);
		if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
			return new Point(p1.x + (t * s1.x), p1.y + (t * s1.y));
		}
		return null;
	}
}

const World = {
	x: 0,
	y: 0,
	ws: 2400,
	get hs() {
		return this.ws;
	},
	scale: 1,
	get w() {
		return Math.floor(this.ws * this.scale);
	},
	get h() {
		return Math.floor(this.hs * this.scale);
	},
	xto: 0,
	yto: 0,
	scaleTo: 1,
	scaleMin: 0.8,
	scaleMax: 2,
	update() {
		this.x += 0.2 * (this.xto - this.x);
		this.y += 0.2 * (this.yto - this.y);
		this.scale += 0.2 * (Math.clamp(this.scaleTo, this.scaleMin, this.scaleMax) - this.scale);
	}
};

const Tile = {
	ws: 40,
	get hs() {
		return this.ws * 0.5;
	},
	get w() {
		return this.ws * World.scale;
	},
	get h() {
		return this.hs * World.scale;
	}
};

const MapUI = {
	x: 5,
	w: 200,
	get h() {
		return this.w;
	},
	get y() {
		return Room.h - 5 - this.h;
	},
	get smallRectW() {
		return Room.w / World.w * this.w;
	},
	get smallRectH() {
		return Room.h / World.h * this.h;
	},
	get smallRectX() {
		return this.x + (-World.x / (World.w - Room.w)) * (this.w - this.smallRectW);
	},
	get smallRectY() {
		return this.y + (-World.y / (World.h - Room.h)) * (this.h - this.smallRectH);
	}
};

Game.update = () => {
	const spd = Tile.ws;
	const keyUp = Input.keyHold(KeyCode.Up);
	const keyDown = Input.keyHold(KeyCode.Down);
	const keyLeft = Input.keyHold(KeyCode.Left);
	const keyRight = Input.keyHold(KeyCode.Right);
	if (keyUp) {
		World.yto += spd;
	}
	if (keyDown) {
		World.yto -= spd;
	}
	if (keyLeft) {
		World.xto += spd;
	}
	if (keyRight) {
		World.xto -= spd;
	}
	if (Input.keyHold(KeyCode.Z)) {
		World.scaleTo = Math.min(World.scaleMax, World.scaleTo + 0.1);
	}
	if (Input.keyHold(KeyCode.X)) {
		World.scaleTo = Math.max(World.scaleMin, World.scaleTo - 0.1);
	}
	const isHold = keyUp || keyDown || keyLeft || keyRight;
	const gap = isHold? 180 : 150;
	World.xto = Math.clamp(World.xto, -World.w + Room.w - gap, gap);
	World.yto = Math.clamp(World.yto, -World.h + Room.h - gap, gap);
	World.update();
};

Game.render = () => {
	const w = {
		x: World.x,
		y: World.y,
		w: World.w,
		h: World.h
	};
	const t = {
		w: Tile.w,
		h: Tile.h
	};
	for (let x = 0; x < w.w; x += t.w) {
		for (let y = 0; y < w.h; y += t.h) {
			const b = {
				x: w.x + x,
				y: w.y + y
			};
			CTX.beginPath();
			CTX.moveTo(b.x + t.w * 0.5, b.y);
			CTX.lineTo(b.x + t.w, b.y + t.h * 0.5);
			CTX.lineTo(b.x + t.w * 0.5, b.y + t.h);
			CTX.lineTo(b.x, b.y + t.h * 0.5);
			CTX.closePath();
			Draw.setColor(C.black);
			CTX.stroke();
		}
	}
	const m = Input.screenToWorldPoint(Input.mousePosition);
	m.x -= World.x;
	m.y -= World.y;
	m.x = Math.clamp(m.x, Tile.w * 0.5, World.w - Tile.w * 0.5);
	m.y = Math.clamp(m.y, Tile.h * 0.5, World.h - Tile.h * 0.5);
	const c = {
		wr: Math.floor(m.x / Tile.w),
		wc: Math.floor(m.y / Tile.h),
		or: 0,
		oc: 0,
		get r() {
			return this.wr + this.wc + this.or;
		},
		get c() {
			return this.wc - this.wr + this.oc;
		},
		get x() {
			return this.r * t.w * 0.5 - this.c * t.w * 0.5;
		},
		get y() {
			return this.c * t.h * 0.5 + this.r * t.h * 0.5;
		}
	};
	const b = {
		get x() {
			return w.x + c.x;
		},
		get y() {
			return w.y + c.y;
		}
	};
	// Cell point
	const cp = [
		new Point(b.x + t.w * 0.5, b.y),
		new Point(b.x + t.w, b.y + t.h * 0.5),
		new Point(b.x + t.w * 0.5, b.y + t.h),
		new Point(b.x, b.y + t.h * 0.5)
	];
	// Mouse line
	const ml = new Line(
		new Point(b.x + t.w * 0.5, b.y + t.h * 0.5),
		new Point(w.x + m.x, w.y + m.y)
	);
	// Intersect top right?
	if (ml.intersect(new Line(cp[0], cp[1]))) {
		c.oc--;
	}
	// Intersect bottom right?
	else if (ml.intersect(new Line(cp[1], cp[2]))) {
		c.or++;
	}
	// Intersect bottom left?
	else if (ml.intersect(new Line(cp[2], cp[3]))) {
		c.oc++;
	}
	// Intersect top left?
	else if (ml.intersect(new Line(cp[3], cp[0]))) {
		c.or--;
	}
	CTX.beginPath();
	CTX.moveTo(b.x + t.w * 0.5, b.y);
	CTX.lineTo(b.x + t.w, b.y + t.h * 0.5);
	CTX.lineTo(b.x + t.w * 0.5, b.y + t.h);
	CTX.lineTo(b.x, b.y + t.h * 0.5);
	CTX.closePath();
	Draw.setColor(C.yellow);
	CTX.fill();
	Draw.setFont(Font.sb);
	Draw.setColor(C.black);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.text(16, 16, `Cell: ${c.r}, ${c.c}`);
	// Draw line intersection
	Draw.setColor(C.blue);
	Draw.line(cp[0].x, cp[0].y, cp[1].x, cp[1].y);
	Draw.setColor(C.green);
	Draw.line(cp[1].x, cp[1].y, cp[2].x, cp[2].y);
	Draw.setColor(C.blue);
	Draw.line(cp[2].x, cp[2].y, cp[3].x, cp[3].y);
	Draw.setColor(C.green);
	Draw.line(cp[3].x, cp[3].y, cp[0].x, cp[0].y);
	Draw.setColor(C.red);
	Draw.circle(ml.p[0].x, ml.p[0].y, 2);
	Draw.line(ml.p[0].x, ml.p[0].y, ml.p[1].x, ml.p[1].y);
};

Game.renderUI = () => {
	Draw.setColor(C.gray);
	Draw.rect(MapUI.x, MapUI.y, MapUI.w, MapUI.h);
	const smRectPoints = [{
		x: Math.clamp(MapUI.smallRectX, MapUI.x, MapUI.x + MapUI.w),
		y: Math.clamp(MapUI.smallRectY, MapUI.y, MapUI.y + MapUI.h)
	}];
	smRectPoints.push({
		x: Math.clamp(MapUI.smallRectX + MapUI.smallRectW, MapUI.x, MapUI.x + MapUI.w),
		y: Math.clamp(MapUI.smallRectY, MapUI.y, MapUI.y + MapUI.h)
	});
	smRectPoints.push({
		x: Math.clamp(MapUI.smallRectX + MapUI.smallRectW, MapUI.x, MapUI.x + MapUI.w),
		y: Math.clamp(MapUI.smallRectY + MapUI.smallRectH, MapUI.y, MapUI.y + MapUI.h)
	});
	smRectPoints.push({
		x: Math.clamp(MapUI.smallRectX, MapUI.x, MapUI.x + MapUI.w),
		y: Math.clamp(MapUI.smallRectY + MapUI.smallRectH, MapUI.y, MapUI.y + MapUI.h)
	});
	Draw.setColor(C.black);
	CTX.beginPath();
	CTX.moveTo(smRectPoints[0].x, smRectPoints[0].y);
	CTX.lineTo(smRectPoints[1].x, smRectPoints[1].y);
	CTX.lineTo(smRectPoints[2].x, smRectPoints[2].y);
	CTX.lineTo(smRectPoints[3].x, smRectPoints[3].y);
	CTX.closePath();
	CTX.stroke();
	Draw.setFont(Font.sb);
	Draw.setColor(C.black);
	Draw.setHVAlign(Align.r, Align.b);
	Draw.text(Room.w - 16, Room.h - 16, `(${Math.floor(Room.w)}, ${Math.floor(Room.h)})`);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(World.x, World.y, `(${Math.floor(World.x)}, ${Math.floor(World.y)})`);
	Draw.text(World.x + World.w * 0.5, World.y, `(${Math.floor(World.w)})`);
};

BRANTH.start();
Room.start('Game');