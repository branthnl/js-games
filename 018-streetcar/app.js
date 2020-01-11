class Vector3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	normalize() {
		const l = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
		this.x /= l;
		this.y /= l;
		this.z /= l;
	}
	static add(v1, v2) {
		return v1.x + v2.x;
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
	loadFromFile(fileString) {
		this.tris = [];
		const vtx = [];
		const n = fileString.split(/\r\n|\n/);
		for (let i = 0; i < n.length; i++) {
			const m = n[i].split(' ');
			if (m.length > 3) {
				const id = m[0];
				const x = +m[1];
				const y = +m[2];
				const z = +m[3];
				switch (id) {
					case 'v': vtx.push(new Vector3(x, y, z)); break;
					case 'f': this.tris.push(new Triangle(vtx[x - 1], vtx[y - 1], vtx[z - 1])); break;
				}
			}
		}
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
let FOV = 90;
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
const CAMERA = new Vector3(0, 0, 0);

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
			const triRotatedX = new Triangle();
			const triRotatedY = new Triangle();
			const triRotatedZ = new Triangle();
			triRotatedX.p[0] = multiplyMatrix(tri.p[0], this.matRx);
			triRotatedX.p[1] = multiplyMatrix(tri.p[1], this.matRx);
			triRotatedX.p[2] = multiplyMatrix(tri.p[2], this.matRx);
			triRotatedY.p[0] = multiplyMatrix(triRotatedX.p[0], this.matRy);
			triRotatedY.p[1] = multiplyMatrix(triRotatedX.p[1], this.matRy);
			triRotatedY.p[2] = multiplyMatrix(triRotatedX.p[2], this.matRy);
			triRotatedZ.p[0] = multiplyMatrix(triRotatedY.p[0], this.matRz);
			triRotatedZ.p[1] = multiplyMatrix(triRotatedY.p[1], this.matRz);
			triRotatedZ.p[2] = multiplyMatrix(triRotatedY.p[2], this.matRz);
			const triTranslated = triRotatedZ;
			triTranslated.p[0].x += this.x;
			triTranslated.p[0].y += this.y;
			triTranslated.p[0].z += this.z;
			triTranslated.p[1].x += this.x;
			triTranslated.p[1].y += this.y;
			triTranslated.p[1].z += this.z;
			triTranslated.p[2].x += this.x;
			triTranslated.p[2].y += this.y;
			triTranslated.p[2].z += this.z;
			const line = [];
			line.push(new Vector3(
				triTranslated.p[1].x - triTranslated.p[0].x,
				triTranslated.p[1].y - triTranslated.p[0].y,
				triTranslated.p[1].z - triTranslated.p[0].z
			));
			line.push(new Vector3(
				triTranslated.p[2].x - triTranslated.p[0].x,
				triTranslated.p[2].y - triTranslated.p[0].y,
				triTranslated.p[2].z - triTranslated.p[0].z
			));
			const normal = new Vector3(
				line[0].y * line[1].z - line[0].z * line[1].y,
				line[0].z * line[1].x - line[0].x * line[1].z,
				line[0].x * line[1].y - line[0].y * line[1].x
			);
			normal.normalize();
			if (normal.x * (triTranslated.p[0].x - CAMERA.x) +
				normal.y * (triTranslated.p[0].y - CAMERA.y) +
				normal.z * (triTranslated.p[0].z - CAMERA.z) < 0) {
				const light = new Vector3(0, 0, -1); light.normalize();
				const dp = normal.x * light.x + normal.y * light.y + normal.z * light.z;
				const triProjected = new Triangle();
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
				const c = Math.abs(dp) * 200;
				Draw.setColor(`rgb(${c}, ${c}, ${c})`);
				Draw.polyBegin(Poly.fill);
				Draw.vertex(triProjected.p[0].x, triProjected.p[0].y);
				Draw.vertex(triProjected.p[1].x, triProjected.p[1].y);
				Draw.vertex(triProjected.p[2].x, triProjected.p[2].y);
				Draw.polyEnd();
			}
		}
	}
}

class Cube extends BranthObject3D {
	awake() {
		this.x = 0;
		this.y = 0;
		this.z = 3;
		this.rx = 0;
		this.ry = 0;
		this.rz = 0;
		this.xto = this.x;
		this.yto = this.y;
		this.zto = this.z;
		this.rxto = this.rx;
		this.ryto = this.ry;
		this.rzto = this.rz;
		this.mpd = 0.2;
		this.spd = 0;
		this.acc = 0.05;
		this.mesh.tris = [
			// SOUTH
			new Triangle(new Vector3(0, 0, 0), new Vector3(0, 1, 0), new Vector3(1, 1, 0)),
			new Triangle(new Vector3(0, 0, 0), new Vector3(1, 1, 0), new Vector3(1, 0, 0)),
			// EAST
			new Triangle(new Vector3(1, 0, 0), new Vector3(1, 1, 0), new Vector3(1, 1, 1)),
			new Triangle(new Vector3(1, 0, 0), new Vector3(1, 1, 1), new Vector3(1, 0, 1)),
			// NORTH
			new Triangle(new Vector3(1, 0, 1), new Vector3(1, 1, 1), new Vector3(0, 1, 1)),
			new Triangle(new Vector3(1, 0, 1), new Vector3(0, 1, 1), new Vector3(0, 0, 1)),
			// WEST
			new Triangle(new Vector3(0, 0, 1), new Vector3(0, 1, 1), new Vector3(0, 1, 0)),
			new Triangle(new Vector3(0, 0, 1), new Vector3(0, 1, 0), new Vector3(0, 0, 0)),
			// TOP
			new Triangle(new Vector3(0, 1, 0), new Vector3(0, 1, 1), new Vector3(1, 1, 1)),
			new Triangle(new Vector3(0, 1, 0), new Vector3(1, 1, 1), new Vector3(1, 1, 0)),
			// BOTTOM
			new Triangle(new Vector3(1, 0, 1), new Vector3(0, 0, 1), new Vector3(0, 0, 0)),
			new Triangle(new Vector3(1, 0, 1), new Vector3(0, 0, 0), new Vector3(1, 0, 0))
		];
	}
	update() {
		const keyW = Input.keyHold(KeyCode.Up);
		const keyA = Input.keyHold(KeyCode.Left);
		const keyS = Input.keyHold(KeyCode.Down);
		const keyD = Input.keyHold(KeyCode.Right);
		const keyWd = Input.keyDown(KeyCode.Up);
		const keySd = Input.keyDown(KeyCode.Down);
		const keyZd = Input.keyDown(KeyCode.Space);
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
		if (keyZd) {
			if (this.y <= 0.05) {
				this.yto = -2;
			}
		}
		// this.rxto += Time.deltaTime * 0.05;
		// this.rzto += Time.deltaTime * 0.1;
		this.x = Math.lerp(this.x, this.xto, 0.2);
		this.y = Math.lerp(this.y, this.yto, 0.2);
		this.z = Math.lerp(this.z, this.zto, 0.2);
		this.rx = Math.lerp(this.rx, this.rxto, 0.2);
		this.ry = Math.lerp(this.ry, this.ryto, 0.2);
		this.rz = Math.lerp(this.rz, this.rzto, 0.2);
		this.yto += Math.min(0.4, Math.abs(-this.yto)) * Math.sign(-this.yto);
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

const file = document.createElement('input');
file.type = 'file';
file.onchange = (e) => {
	const f = e.target.files[0];
	const reader = new FileReader();
	reader.onload = (e) => {
		OBJ.take(Cube)[0].mesh.loadFromFile(e.target.result);
	}
	reader.readAsText(f);
}
document.body.appendChild(file);

BRANTH.start();
Room.start('Menu');
const scaler = 8;
CANVAS.width *= scaler;
CANVAS.height *= scaler;
CTX.scale(scaler, scaler);