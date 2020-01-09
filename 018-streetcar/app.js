class Vector3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class Triangle {
	constructor(...points) {
		this.p = [];
		if (points.length >= 3) {
			this.p.push(new Vector3(points[0].x, points[0].y, points[0].z));
			this.p.push(new Vector3(points[1].x, points[1].y, points[1].z));
			this.p.push(new Vector3(points[2].x, points[2].y, points[2].z));
		}
		else {
			this.p = [
				new Vector3(0, 0, 0),
				new Vector3(0, 0, 0),
				new Vector3(0, 0, 0)
			];
		}
	}
}

class Mesh {
	constructor() {
		this.tris = [];
	}
}

class mat4x4 {
	constructor() {
		this.m = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
	}
}

const multiplyMatrix = (m1, m2) => {
	let o = new Vector3(0, 0, 0);
	o.x = m1.x * m2.m[0][0] + m1.y * m2.m[1][0] + m1.z * m2.m[2][0] + m2.m[3][0];
	o.y = m1.x * m2.m[0][1] + m1.y * m2.m[1][1] + m1.z * m2.m[2][1] + m2.m[3][1];
	o.z = m1.x * m2.m[0][2] + m1.y * m2.m[1][2] + m1.z * m2.m[2][2] + m2.m[3][2];
	const w = m1.x * m2.m[0][3] + m1.y * m2.m[1][3] + m1.z * m2.m[2][3] + m2.m[3][3];

	if (w != 0) {
		o.x /= w;
		o.y /= w;
		o.z /= w;
	}

	return o;
};

let NEAR = 0.1;
let FAR = 1000;
let FOV = 60;
const ASPECT_RATIO = () => Room.h / Room.w;
const FOV_RAD = () => 1 / Math.tan(Math.degtorad(FOV * 0.5));
const MAT_PROJ = () => {
	m = new mat4x4();
	m.m[0][0] = ASPECT_RATIO() * FOV_RAD();
	m.m[1][1] = FOV_RAD();
	m.m[2][2] = FAR / (FAR - NEAR);
	m.m[3][2] = (-FAR * NEAR) / (FAR - NEAR);
	m.m[2][3] = 1;
	m.m[3][3] = 0;
	return m;
};

class BranthObject3D extends BranthObject {
	constructor() {
		super(0, 0);
		this.z = 0;
		this.rx = 0;
		this.ry = 0;
		this.rz = 0;
		this.xto = this.x;
		this.yto = this.y;
		this.zto = this.z;
		this.rxto = this.rx;
		this.ryto = this.ry;
		this.rzto = this.rz;
		this.mesh = new Mesh();
	}
	get matRx() {
		const m = new mat4x4();
		m.m[0][0] = 1;
		m.m[1][1] = Math.cos(Math.degtorad(this.rx));
		m.m[1][2] = Math.sin(Math.degtorad(this.rx));
		m.m[2][1] = -Math.sin(Math.degtorad(this.rx));
		m.m[2][2] = Math.cos(Math.degtorad(this.rx));
		m.m[3][3] = 1;
		return m;
	}
	get matRy() {
		const m = new mat4x4();
		m.m[0][0] = Math.cos(Math.degtorad(this.ry));
		m.m[0][2] = -Math.sin(Math.degtorad(this.ry));
		m.m[1][1] = 1;
		m.m[2][0] = Math.sin(Math.degtorad(this.ry));
		m.m[2][2] = Math.cos(Math.degtorad(this.ry));
		m.m[3][3] = 1;
		return m;
	}
	get matRz() {
		const m = new mat4x4();
		m.m[0][0] = Math.cos(Math.degtorad(this.rz));
		m.m[0][1] = Math.sin(Math.degtorad(this.rz));
		m.m[1][0] = -Math.sin(Math.degtorad(this.rz));
		m.m[1][1] = Math.cos(Math.degtorad(this.rz));
		m.m[2][2] = 1;
		m.m[3][3] = 1;
		return m;
	}
	render() {
		for (const tri of this.mesh.tris) {
			let triRotatedX = new Triangle();
			let triRotatedY = new Triangle();
			let triRotatedZ = new Triangle();
			triRotatedX.p[0] = multiplyMatrix(tri.p[0], this.matRx);
			triRotatedX.p[1] = multiplyMatrix(tri.p[1], this.matRx);
			triRotatedX.p[2] = multiplyMatrix(tri.p[2], this.matRx);
			triRotatedY.p[0] = multiplyMatrix(triRotatedX.p[0], this.matRy);
			triRotatedY.p[1] = multiplyMatrix(triRotatedX.p[1], this.matRy);
			triRotatedY.p[2] = multiplyMatrix(triRotatedX.p[2], this.matRy);
			triRotatedZ.p[0] = multiplyMatrix(triRotatedY.p[0], this.matRz);
			triRotatedZ.p[1] = multiplyMatrix(triRotatedY.p[1], this.matRz);
			triRotatedZ.p[2] = multiplyMatrix(triRotatedY.p[2], this.matRz);
			let triTranslated = triRotatedZ;
			triTranslated.p[0].x += this.x;
			triTranslated.p[0].y += this.y;
			triTranslated.p[0].z += this.z;
			triTranslated.p[1].x += this.x;
			triTranslated.p[1].y += this.y;
			triTranslated.p[1].z += this.z;
			triTranslated.p[2].x += this.x;
			triTranslated.p[2].y += this.y;
			triTranslated.p[2].z += this.z;
			let triProjected = new Triangle();
			triProjected.p[0] = multiplyMatrix(triTranslated.p[0], MAT_PROJ());
			triProjected.p[1] = multiplyMatrix(triTranslated.p[1], MAT_PROJ());
			triProjected.p[2] = multiplyMatrix(triTranslated.p[2], MAT_PROJ());
			triProjected.p[0].x += 1; triProjected.p[0].y += 1;
			triProjected.p[1].x += 1; triProjected.p[1].y += 1;
			triProjected.p[2].x += 1; triProjected.p[2].y += 1;
			triProjected.p[0].x *= 0.5 * Room.w;
			triProjected.p[0].y *= 0.5 * Room.h;
			triProjected.p[1].x *= 0.5 * Room.w;
			triProjected.p[1].y *= 0.5 * Room.h;
			triProjected.p[2].x *= 0.5 * Room.w;
			triProjected.p[2].y *= 0.5 * Room.h;
			Draw.setColor(C.black);
			Draw.polyBegin(Poly.stroke);
			Draw.vertex(triProjected.p[0].x, triProjected.p[0].y);
			Draw.vertex(triProjected.p[1].x, triProjected.p[1].y);
			Draw.vertex(triProjected.p[2].x, triProjected.p[2].y);
			Draw.polyEnd();
		}
	}
}

class Cube extends BranthObject3D {
	awake() {
		this.x = 0;
		this.y = 1;
		this.z = 4;
		this.rx = 0;
		this.ry = 0;
		this.rz = 0;
		this.xto = this.x;
		this.yto = this.y;
		this.zto = this.z;
		this.rxto = this.rx;
		this.ryto = this.ry;
		this.rzto = this.rz;
		this.mpd = 0.8;
		this.spd = 0;
		this.acc = 0.1;
		this.mesh.tris = [
			// NORTH
			new Triangle(new Vector3(1, 0, 3), new Vector3(1, 1, 3), new Vector3(-1, 1, 3)),
			new Triangle(new Vector3(1, 0, 3), new Vector3(-1, 1, 3), new Vector3(-1, 0, 3)),
			// EAST
			new Triangle(new Vector3(1, 0, -2), new Vector3(1, 1, -2), new Vector3(1, 1, 3)),
			new Triangle(new Vector3(1, 0, -2), new Vector3(1, 1, 3), new Vector3(1, 0, 3)),
			// SOUTH
			new Triangle(new Vector3(-1, 0, -2), new Vector3(-1, 1, -2), new Vector3(1, 1, -2)),
			new Triangle(new Vector3(-1, 0, -2), new Vector3(1, 1, -2), new Vector3(1, 0, -2)),
			// WEST
			new Triangle(new Vector3(-1, 0, 3), new Vector3(-1, 1, 3), new Vector3(-1, 1, -2)),
			new Triangle(new Vector3(-1, 0, 3), new Vector3(-1, 1, -2), new Vector3(-1, 0, -2)),
			// TOP
			new Triangle(new Vector3(1, 0, 0), new Vector3(-1, 0, 0), new Vector3(-1, 0, -2)),
			new Triangle(new Vector3(1, 0, 0), new Vector3(-1, 0, -2), new Vector3(1, 0, -2)),
			// TOPNORTH
				new Triangle(new Vector3(1, -1, 2.5), new Vector3(1, 0, 3), new Vector3(-1, 0, 3)),
				new Triangle(new Vector3(1, -1, 2.5), new Vector3(-1, 0, 3), new Vector3(-1, -1, 2.5)),
			// BOTTOM
			new Triangle(new Vector3(-1, 1, -2), new Vector3(-1, 1, 3), new Vector3(1, 1, 3)),
			new Triangle(new Vector3(-1, 1, -2), new Vector3(1, 1, 3), new Vector3(1, 1, -2))
		];
	}
	update() {
		const keyW = Input.keyHold(KeyCode.Up);
		const keyA = Input.keyHold(KeyCode.Left);
		const keyS = Input.keyHold(KeyCode.Down);
		const keyD = Input.keyHold(KeyCode.Right);
		const keyWd = Input.keyDown(KeyCode.Up);
		const keySd = Input.keyDown(KeyCode.Down);
		if (keyWd || keySd) {
			this.spd = 0;
		}
		if (keyW) {
			this.spd = Math.min(this.spd + this.acc, this.mpd);
			this.xto += Math.lendiry(this.spd, this.ry);
			this.zto += Math.lendirx(this.spd, this.ry);
		}
		if (keyA) {
			if (keyS) {
				this.ryto += 5;
			}
			else {
				this.ryto -= 5;
			}
		}
		if (keyS) {
			this.spd = Math.min(this.spd + this.acc, this.mpd * 0.5);
			this.xto -= Math.lendiry(this.spd, this.ry);
			this.zto -= Math.lendirx(this.spd, this.ry);
		}
		if (keyD) {
			if (keyS) {
				this.ryto -= 5;
			}
			else {
				this.ryto += 5;
			}
		}
		this.x = Math.lerp(this.x, this.xto, 0.2);
		this.y = Math.lerp(this.y, this.yto, 0.2);
		this.z = Math.lerp(this.z, this.zto, 0.2);
		this.rx = Math.lerp(this.rx, this.rxto, 0.2);
		this.ry = Math.lerp(this.ry, this.ryto, 0.2);
		this.rz = Math.lerp(this.rz, this.rzto, 0.2);
	}
}

OBJ.add(Cube);

const Menu = new BranthRoom('Menu', 640, 360);
const Game = new BranthRoom('Game', 640, 360);
const Race = new BranthRoom('Race', 640, 360);
const Garage = new BranthRoom('Garage', 640, 360);
Room.add(Menu);
Room.add(Game);
Room.add(Race);
Room.add(Garage);

Menu.start = () => {
	OBJ.create(Cube);
};
Menu.update = () => {};
Menu.render = () => {};
Menu.renderUI = () => {};

Game.start = () => {};
Game.update = () => {};
Game.render = () => {};
Game.renderUI = () => {};

Race.start = () => {};
Race.update = () => {};
Race.render = () => {};
Race.renderUI = () => {};

Garage.start = () => {};
Garage.update = () => {};
Garage.render = () => {};
Garage.renderUI = () => {};

BRANTH.start();
Room.start('Menu');