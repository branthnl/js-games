class Mat4x4 {
	constructor() {
		this.m = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
	}
	static makeIdentity() {
		const m = new Mat4x4();
		m.m[0][0] = 1;
		m.m[1][1] = 1;
		m.m[2][2] = 1;
		m.m[3][3] = 1;
		return m;
	}
	static multiplyVector(m, v) {
		return new Vector3(
			v.x * m.m[0][0] + v.y * m.m[1][0] + v.z * m.m[2][0] + m.m[3][0],
			v.x * m.m[0][1] + v.y * m.m[1][1] + v.z * m.m[2][1] + m.m[3][1],
			v.x * m.m[0][2] + v.y * m.m[1][2] + v.z * m.m[2][2] + m.m[3][2],
			v.x * m.m[0][3] + v.y * m.m[1][3] + v.z * m.m[2][3] + m.m[3][3]
		);
	}
	static multiplyMatrix(m1, m2) {
		const m = new Mat4x4();
		for (let c = 0; c < 4; c++) {
			for (let r = 0; r < 4; r++) {
				m.m[r][c] = m1.m[r][0] * m2.m[0][c] + m1.m[r][r] * m2.m[1][c] + m1.m[r][0];
			}
		}
		return m;
	}
	static makeRotationX(angleRad) {
		const m = new Mat4x4();
		m.m[0][0] = 1;
		m.m[1][1] = Math.cos(angleRad);
		m.m[1][2] = Math.sin(angleRad);
		m.m[2][1] = -Math.sin(angleRad);
		m.m[2][2] = Math.cos(angleRad);
		m.m[3][3] = 1;
		return m;
	}
	static makeRotationY(angleRad) {
		const m = new Mat4x4();
		m.m[0][0] = Math.cos(angleRad);
		m.m[0][2] = -Math.sin(angleRad);
		m.m[1][1] = 1;
		m.m[2][0] = Math.sin(angleRad);
		m.m[2][2] = Math.cos(angleRad);
		m.m[3][3] = 1;
		return m;
	}
	static makeRotationZ(angleRad) {
		const m = new Mat4x4();
		m.m[0][0] = Math.cos(angleRad);
		m.m[0][1] = Math.sin(angleRad);
		m.m[1][0] = -Math.sin(angleRad);
		m.m[1][1] = Math.cos(angleRad);
		m.m[2][2] = 1;
		m.m[3][3] = 1;
		return m;
	}
	static makeTranslation(x, y, z) {
		const m = new Mat4x4();
		m.m[0][0] = 1;
		m.m[1][1] = 1;
		m.m[2][2] = 1;
		m.m[3][3] = 1;
		m.m[3][0] = x;
		m.m[3][1] = y;
		m.m[3][2] = z;
		return m;
	}
	static makeProjection(fovDeg, aspectRatio, near, far) {
		const fovRad = 1 / Math.tan(Math.degtorad(fovDeg * 0.5));
		const m = new Mat4x4();
		m.m[0][0] = aspectRatio * fovRad;
		m.m[1][1] = fovRad;
		m.m[2][2] = far / (far - near);
		m.m[3][2] = (-far * near) / (far - near);
		m.m[2][3] = 1;
		m.m[3][3] = 0;
		return m;
	}
}

class Vector3 {
	constructor(x, y, z, w) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = w || 1;
	}
	normalize() {
		const l = Vector3.len(this);
		this.x /= l;
		this.y /= l;
		this.z /= l;
	}
	static add(v1, v2) {
		return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
	}
	static sub(v1, v2) {
		return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
	}
	static mul(v1, k) {
		return new Vector3(v1.x * k, v1.y * k, v1.z * k);
	}
	static div(v1, k) {
		return new Vector3(v1.x / k, v1.y / k, v1.z / k);
	}
	static dot(v1, v2) {
		return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
	}
	static len(v) {
		return Math.sqrt(Vector3.dot(v, v));
	}
	static cross(v1, v2) {
		return new Vector3(
			v1.y * v2.z - v1.z * v2.y,
			v1.z * v2.x - v1.x * v2.z,
			v1.x * v2.y - v1.y * v2.x
		);
	}
}

class Triangle {
	constructor(...v) {
		this.p = [];
		if (v.length >= 3) {
			this.p.push(new Vector3(v[0].x, v[0].y, v[0].z));
			this.p.push(new Vector3(v[1].x, v[1].y, v[1].z));
			this.p.push(new Vector3(v[2].x, v[2].y, v[2].z));
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

const CAMERA = new Vector3(0, 0, 0);
const MAT_PROJ = Mat4x4.makeProjection(90, Room.h / Room.w, 0.1, 1000);

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
		return Mat4x4.makeRotationX(this.rx);
	}
	get matRy() {
		return Mat4x4.makeRotationY(this.ry);
	}
	get matRz() {
		return Mat4x4.makeRotationZ(this.rz);
	}
	get matTrans() {
		return Mat4x4.makeTranslation(this.x, this.y, this.z);
	}
	render() {
		let matWorld = Mat4x4.makeIdentity();
		matWorld = Mat4x4.multiplyMatrix(this.matRz, this.matRx);
		matWorld = Mat4x4.multiplyMatrix(matWorld, this.matTrans);
		for (const tri of this.mesh.tris) {
			const triTransformed = new Triangle(
				new Vector3(Mat4x4.multiplyVector(matWorld, tri.p[0])),
				new Vector3(Mat4x4.multiplyVector(matWorld, tri.p[1])),
				new Vector3(Mat4x4.multiplyVector(matWorld, tri.p[2]))
			);
			const line1 = Vector3.sub(triTransformed.p[1], triTransformed.p[0]);
			const line2 = Vector3.sub(triTransformed.p[2], triTransformed.p[0]);
			const normal = Vector3.cross(line1, line2);
			normal.normalize();
			const cameraRay = Vector3.sub(triTransformed.p[0], CAMERA);
			if (Vector3.dot(normal, cameraRay) < 0) {
				const light = new Vector3(0, 0, -1);
				light.normalize();
				const dp = Math.max(0.1, Vector3.dot(light, normal));
				const triProjected = new Triangle(
					Mat4x4.multiplyVector(MAT_PROJ, triTransformed.p[0]),
					Mat4x4.multiplyVector(MAT_PROJ, triTransformed.p[1]),
					Mat4x4.multiplyVector(MAT_PROJ, triTransformed.p[2])
				);
				triProjected.p.map(v => v = Vector3.div(v, v.w));
				const offsetView = new Vector3(1, 1, 0);
				triProjected.p.map(v => v = Vector3.add(v, offsetView));
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