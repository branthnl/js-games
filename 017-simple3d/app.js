const videoShip = '\
v 1.000000 -1.000000 -1.000000,\
v 1.000000 1.000000 -1.000000,\
v 1.000000 -1.000000 1.000000,\
v 1.000000 1.000000 1.000000,\
v -1.000000 -1.000000 -1.000000,\
v -1.000000 1.000000 -1.000000,\
v -1.000000 -1.000000 1.000000,\
v -1.000000 1.000000 1.000000,\
v -0.720000 0.120000 -1.400000,\
v 0.300000 0.000000 5.000000,\
v -0.600000 -0.600000 -1.400000,\
v -0.300000 0.000000 5.000000,\
v -1.200000 0.200000 1.000000,\
v -0.600000 0.600000 -1.400000,\
v -1.200000 -0.200000 -1.000000,\
v -1.200000 0.200000 -1.000000,\
v 1.200000 -0.200000 1.000000,\
v 1.200000 -0.200000 -1.000000,\
v 1.200000 0.200000 -1.000000,\
v 1.200000 0.200000 1.000000,\
v -1.200000 -0.200000 1.000000,\
v 0.600000 0.600000 -1.400000,\
v 0.600000 -0.600000 -1.400000,\
v -4.200000 0.060000 1.000000,\
v -4.200000 -0.060000 1.000000,\
v -4.200000 -0.060000 -1.000000,\
v -4.200000 0.060000 -1.000000,\
v 4.200000 -0.060000 1.000000,\
v 4.200000 -0.060000 -1.000000,\
v 4.200000 0.060000 -1.000000,\
v 4.200000 0.060000 1.000000,\
v 4.200000 -0.180000 1.000000,\
v 4.200000 -0.180000 -1.000000,\
v 4.200000 0.180000 -1.000000,\
v 4.200000 0.180000 1.000000,\
v 4.500000 -0.180000 1.000000,\
v 4.500000 -0.180000 -1.000000,\
v 4.500000 0.180000 -1.000000,\
v 4.500000 0.180000 1.000000,\
v -4.200000 0.180000 1.000000,\
v -4.200000 -0.180000 1.000000,\
v -4.200000 -0.180000 -1.000000,\
v -4.200000 0.180000 -1.000000,\
v -4.500000 0.180000 1.000000,\
v -4.500000 -0.180000 1.000000,\
v -4.500000 -0.180000 -1.000000,\
v -4.500000 0.180000 -1.000000,\
v 4.350000 -0.180000 3.000000,\
v 4.350000 0.180000 3.000000,\
v -4.350000 0.180000 3.000000,\
v -4.350000 -0.180000 3.000000,\
v 0.000000 -0.700000 3.000000,\
v -0.720000 -0.120000 -1.400000,\
v 0.720000 -0.120000 -1.400000,\
v 0.720000 0.120000 -1.400000,\
s off,\
f 21 52 12,\
f 6 13 8,\
f 5 23 1,\
f 7 1 3,\
f 4 6 8,\
f 4 12 10,\
f 17 20 10,\
f 20 4 10,\
f 17 52 3,\
f 7 3 52,\
f 16 14 9,\
f 7 15 5,\
f 20 30 19,\
f 18 23 54,\
f 4 19 2,\
f 1 17 3,\
f 13 25 21,\
f 13 21 12,\
f 12 52 10,\
f 8 13 12,\
f 27 42 43,\
f 15 27 16,\
f 21 26 15,\
f 16 24 13,\
f 31 34 30,\
f 18 28 17,\
f 17 31 20,\
f 19 29 18,\
f 32 49 35,\
f 29 32 28,\
f 31 32 35,\
f 29 34 33,\
f 38 36 37,\
f 34 37 33,\
f 35 38 34,\
f 33 36 32,\
f 43 44 40,\
f 25 42 26,\
f 27 40 24,\
f 25 40 41,\
f 44 46 45,\
f 40 44 50,\
f 42 47 43,\
f 41 46 42,\
f 44 47 46,\
f 32 36 48,\
f 39 35 49,\
f 39 48 36,\
f 45 51 50,\
f 40 51 41,\
f 45 41 51,\
f 45 50 44,\
f 18 29 28,\
f 17 28 31,\
f 4 2 6,\
f 18 55 19,\
f 15 11 5,\
f 19 22 2,\
f 2 14 6,\
f 16 53 15,\
f 53 9 54,\
f 19 30 29,\
f 15 26 27,\
f 16 27 24,\
f 13 24 25,\
f 21 25 26,\
f 7 21 15,\
f 7 5 1,\
f 21 7 52,\
f 1 18 17,\
f 17 10 52,\
f 4 20 19,\
f 20 31 30,\
f 4 8 12,\
f 43 47 44,\
f 6 16 13,\
f 40 50 51,\
f 41 45 46,\
f 42 46 47,\
f 2 22 14,\
f 19 55 22,\
f 18 54 55,\
f 18 1 23,\
f 5 11 23,\
f 15 53 11,\
f 16 9 53,\
f 16 6 14,\
f 9 14 22,\
f 22 55 9,\
f 55 54 9,\
f 54 23 11,\
f 11 53 54,\
f 34 38 37,\
f 38 39 36,\
f 39 49 48,\
f 35 39 38,\
f 33 37 36,\
f 25 41 42,\
f 27 43 40,\
f 31 35 34,\
f 29 33 32,\
f 32 48 49,\
f 27 26 42,\
f 31 28 32,\
f 29 30 34,\
f 25 24 40';

class vec3d {
	constructor(args) {
		this.x = args[0];
		this.y = args[1];
		this.z = args[2];
	}
}

class triangle {
	constructor(p, o) {
		this.p = [];
		if (o) {
			this.p.push(new vec3d([p[0].x, p[0].y, p[0].z]));
			this.p.push(new vec3d([p[1].x, p[1].y, p[1].z]));
			this.p.push(new vec3d([p[2].x, p[2].y, p[2].z]));
		}
		else {
			this.p.push(new vec3d(p[0]));
			this.p.push(new vec3d(p[1]));
			this.p.push(new vec3d(p[2]));
		}
	}
}

class mesh {
	constructor(tris) {
		this.tris = tris;
	}
	loadFromFile(filetext) {
		this.tris = [];
		let verts = [];

		const filearray = filetext.split(',');

		for (const line of filearray) {
			if (line[0] == 'v') {
				const splitLine = line.split(' ');
				verts.push(new vec3d([+splitLine[1], +splitLine[2], +splitLine[3]]));
			}
			if (line[0] == 'f') {
				const f = line.split(' ');
				const tri = new triangle([verts[+f[1] - 1], verts[+f[2] - 1], verts[+f[3] - 1]], true);
				this.tris.push(tri);
			}
		}
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

	meshCube.loadFromFile(videoShip);

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

let vecTrianglesToRaster = [];
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

	vecTrianglesToRaster = [];
	DP = [];
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
		triTranslated.p[0].z = triRotatedZX.p[0].z + 8;
		triTranslated.p[1].z = triRotatedZX.p[1].z + 8;
		triTranslated.p[2].z = triRotatedZX.p[2].z + 8;

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

			DP.push(dp);

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

			if (vecTrianglesToRaster.length >= meshCube.tris.length) {
				vecTrianglesToRaster.shift();
			}
			vecTrianglesToRaster.push(triProjected);
			vecTrianglesToRaster[vecTrianglesToRaster.length - 1].dp = dp;
		}


	}
	if (vecTrianglesToRaster.length > 1) {
		vecTrianglesToRaster.sort((t1, t2) => {
			const z1 = (t1.p[0].z + t1.p[1].z + t1.p[2].z) / 3;
			const z2 = (t2.p[0].z + t2.p[1].z + t2.p[2].z) / 3;
			return z1 > z2? -1 : 1;
		});
	}
	for (const i in vecTrianglesToRaster) {
		const c = Math.abs(vecTrianglesToRaster[i].dp * 100);
		Draw.setColor(`rgb(${c}, ${c}, ${c})`);
		Draw.polyBegin(Poly.fill);
		Draw.vertex(vecTrianglesToRaster[i].p[0].x, vecTrianglesToRaster[i].p[0].y);
		Draw.vertex(vecTrianglesToRaster[i].p[1].x, vecTrianglesToRaster[i].p[1].y);
		Draw.vertex(vecTrianglesToRaster[i].p[2].x, vecTrianglesToRaster[i].p[2].y);
		Draw.polyEnd();
		// Draw.setColor(C.black);
		// Draw.polyEnd(Poly.stroke);
		// Draw.setLineWidth(7);
		// Draw.polyEnd(Poly.pointList);
		// Draw.setLineWidth(5);
		// Draw.setColor(C.yellow);
		// Draw.polyEnd(Poly.pointList);
		// Draw.resetLineWidth();
	}
}

BRANTH.start();
Room.start('Game');