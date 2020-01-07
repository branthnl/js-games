class vec3d {
	constructor(args) {
		this.x = args[0];
		this.y = args[1];
		this.z = args[2];
	}
}

class triangle {
	constructor(p) {
		this.p = [];
		this.p.push(new vec3d(p[0]));
		this.p.push(new vec3d(p[1]));
		this.p.push(new vec3d(p[2]));
	}
}

class mesh {
	constructor(tris) {
		this.tris = tris;
	}
}

class mat4x4 {
	constructor() {
		this.m = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
	}
}

const Game = new BranthRoom('Game', 640, 640);
Room.add(Game);

let meshCube, matProj, CAMERA;

const multiplyMatrix = (i, m) => {
	let o = new vec3d([0, 0, 0]);
	o.x = i.x * m.m[0][0] + i.y * m.m[1][0] + i.z * m.m[2][0] + m.m[3][0];
	o.y = i.x * m.m[0][1] + i.y * m.m[1][1] + i.z * m.m[2][1] + m.m[3][1];
	o.z = i.x * m.m[0][2] + i.y * m.m[1][2] + i.z * m.m[2][2] + m.m[3][2];
	const w = i.x * m.m[0][3] + i.y * m.m[1][3] + i.z * m.m[2][3] + m.m[3][3];

	if (w != 0) {
		o.x /= w;
		o.y /= w;
		o.z /= w;
	}

	return o;
}

Game.start = () => {
	meshCube = new mesh([
		// SOUTH
		new triangle([[0, 0, 0], [0, 1, 0], [1, 1, 0]]),
		new triangle([[0, 0, 0], [1, 1, 0], [1, 0, 0]]),

		// EAST
		new triangle([[1, 0, 0], [1, 1, 0], [1, 1, 1]]),
		new triangle([[1, 0, 0], [1, 1, 1], [1, 0, 1]]),

		// NORTH
		new triangle([[1, 0, 1], [1, 1, 1], [0, 1, 1]]),
		new triangle([[1, 0, 1], [0, 1, 1], [0, 0, 1]]),

		// WEST
		new triangle([[0, 0, 1], [0, 1, 1], [0, 1, 0]]),
		new triangle([[0, 0, 1], [0, 1, 0], [0, 0, 0]]),

		// TOP
		new triangle([[0, 1, 0], [0, 1, 1], [1, 1, 1]]),
		new triangle([[0, 1, 0], [1, 1, 1], [1, 1, 0]]),

		// BOTTOM
		new triangle([[1, 0, 1], [0, 0, 1], [0, 0, 0]]),
		new triangle([[1, 0, 1], [0, 0, 0], [1, 0, 0]])
	]);

	// Projection Matrix
	const NEAR = 0.1;
	const FAR = 1000;
	const FOV = 90;
	const ASPECT_RATIO = Room.h / Room.w;
	const FOV_RAD = 1 / Math.tan(Math.degtorad(FOV * 0.5));

	CAMERA = new vec3d([0, 0, 0]);

	matProj = new mat4x4();
	matProj.m[0][0] = ASPECT_RATIO * FOV_RAD;
	matProj.m[1][1] = FOV_RAD;
	matProj.m[2][2] = FAR / (FAR - NEAR);
	matProj.m[3][2] = (-FAR * NEAR) / (FAR - NEAR);
	matProj.m[2][3] = 1;
	matProj.m[3][3] = 0;
}

let DP = 0;
Game.render = () => {

	const Theta = Time.time * 0.001;

	const matRotZ = new mat4x4();
	const matRotX = new mat4x4();

	matRotZ.m[0][0] = Math.cos(Theta);
	matRotZ.m[0][1] = Math.sin(Theta);
	matRotZ.m[1][0] = -Math.sin(Theta);
	matRotZ.m[1][1] = Math.cos(Theta);
	matRotZ.m[2][2] = 1;
	matRotZ.m[3][3] = 1;

	matRotX.m[0][0] = 1;
	matRotX.m[1][1] = Math.cos(Theta * 0.5);
	matRotX.m[1][2] = Math.sin(Theta * 0.5);
	matRotX.m[2][1] = -Math.sin(Theta * 0.5);
	matRotX.m[2][2] = Math.cos(Theta * 0.5);
	matRotX.m[3][3] = 1;

	for (const tri of meshCube.tris) {

		// Rotate in Z axis
		let o0 = multiplyMatrix(tri.p[0], matRotZ);
		let o1 = multiplyMatrix(tri.p[1], matRotZ);
		let o2 = multiplyMatrix(tri.p[2], matRotZ);

		let triRotatedZ = new triangle([
			[o0.x, o0.y, o0.z],
			[o1.x, o1.y, o1.z],
			[o2.x, o2.y, o2.z]
		]);

		// Rotate in X axis
		o0 = multiplyMatrix(triRotatedZ.p[0], matRotX);
		o1 = multiplyMatrix(triRotatedZ.p[1], matRotX);
		o2 = multiplyMatrix(triRotatedZ.p[2], matRotX);

		let triRotatedZX = new triangle([
			[o0.x, o0.y, o0.z],
			[o1.x, o1.y, o1.z],
			[o2.x, o2.y, o2.z]
		]);


		// Offset into the scene
		let triTranslated = triRotatedZX;
		triTranslated.p[0].z = triRotatedZX.p[0].z + 3;
		triTranslated.p[1].z = triRotatedZX.p[1].z + 3;
		triTranslated.p[2].z = triRotatedZX.p[2].z + 3;

		const line1 = new vec3d([
			triTranslated.p[1].x - triTranslated.p[0].x,
			triTranslated.p[1].y - triTranslated.p[0].y,
			triTranslated.p[1].z - triTranslated.p[0].z
		]);

		const line2 = new vec3d([
			triTranslated.p[2].x - triTranslated.p[0].x,
			triTranslated.p[2].y - triTranslated.p[0].y,
			triTranslated.p[2].z - triTranslated.p[0].z
		]);

		const normal = new vec3d([
			line1.y * line2.z - line1.z * line2.y,
			line1.z * line2.x - line1.x * line2.z,
			line1.x * line2.y - line1.y * line2.x
		]);

		let l = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
		normal.x /= l;
		normal.y /= l;
		normal.z /= l;

		// if (normal.z < 0) {
		if (normal.x * (triTranslated.p[0].x - CAMERA.x) +
			normal.y * (triTranslated.p[0].y - CAMERA.y) +
			normal.z * (triTranslated.p[0].z - CAMERA.z) < 0) {





			// Illumination

			const light_direction = new vec3d([0, 0, -1]);
			l = Math.sqrt(light_direction.x ** 2 + light_direction.y ** 2 + light_direction.z ** 2);
			light_direction.x /= l;
			light_direction.y /= l;
			light_direction.z /= l;

			const dp = normal.x * light_direction.x + normal.y * light_direction.y + normal.z + light_direction.z;

			DP = dp;

			// Project triangles from 3D to 2D

			o0 = multiplyMatrix(triTranslated.p[0], matProj);
			o1 = multiplyMatrix(triTranslated.p[1], matProj);
			o2 = multiplyMatrix(triTranslated.p[2], matProj);

			let triProjected = new triangle([
				[o0.x, o0.y, o0.z],
				[o1.x, o1.y, o1.z],
				[o2.x, o2.y, o2.z]
			]);

			triProjected.p[0].x += 1; triProjected.p[0].y += 1;
			triProjected.p[1].x += 1; triProjected.p[1].y += 1;
			triProjected.p[2].x += 1; triProjected.p[2].y += 1;


			triProjected.p[0].x *= 0.5 * Room.w;
			triProjected.p[0].y *= 0.5 * Room.h;
			triProjected.p[1].x *= 0.5 * Room.w;
			triProjected.p[1].y *= 0.5 * Room.h;
			triProjected.p[2].x *= 0.5 * Room.w;
			triProjected.p[2].y *= 0.5 * Room.h;

			const c = Math.abs(dp * 100);
			Draw.setColor(`rgb(${c}, ${c}, ${c})`);
			Draw.polyBegin(Poly.fill);
			Draw.vertex(triProjected.p[0].x, triProjected.p[0].y);
			Draw.vertex(triProjected.p[1].x, triProjected.p[1].y);
			Draw.vertex(triProjected.p[2].x, triProjected.p[2].y);
			Draw.polyEnd();
			// Draw.setColor(C.black);
			// Draw.polyEnd(Poly.stroke);
			// Draw.setLineWidth(7);
			Draw.polyEnd(Poly.pointList);
			Draw.setLineWidth(5);
			Draw.setColor(C.yellow);
			Draw.polyEnd(Poly.pointList);
			Draw.resetLineWidth();
		}

	}
}

BRANTH.start();
Room.start('Game');