const FONT_FAMILY = 'Fresca, sans-serif';

const C = {
	sky: '#58cabe',
	tree1: '#99bb50',
	tree2: '#8db145',
	grass1: '#aeba3b',
	grass2: '#7d8b20',
	ground1: '#514d36',
	ground2: '#4c4832',
	hole: '#333022',
	flag: '#19816e',
	pole: '#949d9f',
	white: '#ffffff',
	black: '#000000'
};

const Align = {
	l: 'left',
	r: 'right',
	c: 'center',
	t: 'top',
	b: 'bottom',
	m: 'middle'
};

const Cap = {
	butt: 'butt', // default value
	round: 'round'
}

const Blend = {
	sourceOver: 'source-over', // default value
	destinationIn: 'destination-in'
}

Math.clamp = (a, b, c) => Math.min(c, Math.max(b, a));
Math.range = (min, max) => Math.random() * (max - min) + min;
Math.rangeInt = (min, max) => Math.floor(Math.range(min, max));
Math.degtorad = (d) => d * Math.PI / 180;
Math.radtodeg = (r) => r * 180 / Math.PI;
Math.lendirx = (l, d) => l * Math.cos(Math.degtorad(d));
Math.lendiry = (l, d) => l * Math.sin(Math.degtorad(d));
Math.lendir = (l, d) => ({
	x: Math.lendirx(l, d),
	y: Math.lendiry(l, d)
});
Math.lerp = (from, to, t) => from + t * (to - from);

Math.randomNegator = (n) => Math.range(0, 100) < (n || 50)? 1 : -1; // The higher n the more likely it gets to positive 1;

function BranthTime() {
	this.time = 0;
	this.lastTime = 0;
	this.deltaTime = 0;
	this.fixedDeltaTime = 1000 / 60;
	this.update = function(t) {
		this.lastTime = this.time || 0;
		this.time = t || 0;
		this.deltaTime = this.time - this.lastTime || this.fixedDeltaTime;
	}
}

function BranthDraw(ctx) {
	this.setAlpha = function(n) {
		ctx.globalAlpha = n;
	}
	this.setColor = function(s) {
		ctx.fillStyle = s;
		ctx.strokeStyle = s;
	}
	this.setHAlign = function(s) {
		ctx.textAlign = s;
	}
	this.setVAlign = function(s) {
		ctx.textBaseline = s;
	}
	this.setHVAlign = function(h, v) {
		this.setHAlign(h);
		this.setVAlign(v);
	}
	this.setShadow = function(x, y, b, c) {
		ctx.shadowBlur = b || 0;
		ctx.shadowColor = c || C.black;
		ctx.shadowOffsetX = x;
		ctx.shadowOffsetY = y;
	}
	this.resetShadow = function() {
		this.setShadow(0, 0, 0, C.black);
	}
	this.font = function(s) { // ex. '24px', 'bold 12px', 'italic 18px Comic Sans';
		ctx.font = `${s} ${FONT_FAMILY}`;
	}
	this.text = function(x, y, text) {
		ctx.fillText(text, x, y);
	}
	this.beginPath = function() {
		ctx.beginPath();
	}
	this.closePath = function() {
		ctx.closePath();
	}
	this.fill = function() {
		ctx.fill();
	}
	this.stroke = function(cap) {
		if (cap) {
			ctx.lineCap = cap;
		}
		ctx.stroke();
		ctx.lineCap = Cap.butt;
	}
	this.moveTo = function(x, y) {
		ctx.moveTo(x, y);
	}
	this.lineTo = function(x, y) {
		ctx.lineTo(x, y);
	}
	this.quadraticCurveTo = function(controlX, controlY, endX, endY) {
		ctx.quadraticCurveTo(controlX, controlY, endX, endY);
	}
	this.draw = function(outline) {
		if (outline) {
			ctx.stroke();
		}
		else {
			ctx.fill();
		}
	}
	this.rect = function(x, y, w, h, outline) {
		ctx.beginPath();
		ctx.rect(x, y, w, h);
		ctx.closePath();
		this.draw(outline);
	}
	this.circle = function(x, y, r, outline) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.closePath();
		this.draw(outline);
	}
	this.roundrect = function(x, y, w, h, r, outline) {
		r = Math.clamp(r, 0, Math.min(w / 2, h / 2)) || 0;
		ctx.beginPath();
		ctx.moveTo(x, y + r);
		ctx.quadraticCurveTo(x, y, x + r, y);
		ctx.lineTo(x + w - r, y);
		ctx.quadraticCurveTo(x + w, y, x + w, y + r);
		ctx.lineTo(x + w, y + h - r);
		ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		ctx.lineTo(x + r, y + h);
		ctx.quadraticCurveTo(x, y + h, x, y + h - r);
		ctx.closePath();
		this.draw(outline);
	}
	this.polyBegin = function(x, y) {
		ctx.beginPath();
		ctx.moveTo(x, y);
	}
	this.vertex = function(x, y) {
		ctx.lineTo(x, y);
	}
	this.polyEnd = function(outline) {
		ctx.closePath();
		this.draw(outline);
	}
	this.star = function(x, y, r, outline) {
		this.starTransformed(x, y, r, 0, outline);
	}
	this.starTransformed = function(x, y, r, d = 0, outline) {
		const lp = [ // Large part (polygon)
			Math.lendir(r, d + 270),
			Math.lendir(r, d + 342),
			Math.lendir(r, d + 54),
			Math.lendir(r, d + 126),
			Math.lendir(r, d + 198)
		];
		const sr = r * 0.5; // Small radius
		const sp = [ // Small part (polygon)
			Math.lendir(sr, d + 306),
			Math.lendir(sr, d + 18),
			Math.lendir(sr, d + 90),
			Math.lendir(sr, d + 162),
			Math.lendir(sr, d + 234)
		];
		this.polyBegin(x + lp[0].x, y + lp[0].y);
		this.vertex(x + sp[0].x, y + sp[0].y);
		this.vertex(x + lp[1].x, y + lp[1].y);
		this.vertex(x + sp[1].x, y + sp[1].y);
		this.vertex(x + lp[2].x, y + lp[2].y);
		this.vertex(x + sp[2].x, y + sp[2].y);
		this.vertex(x + lp[3].x, y + lp[3].y);
		this.vertex(x + sp[3].x, y + sp[3].y);
		this.vertex(x + lp[4].x, y + lp[4].y);
		this.vertex(x + sp[4].x, y + sp[4].y);
		this.polyEnd(outline);
	}
	this.rectTransformed = function(x, y, w, h, d, outline) {
		const r = Math.hypot(w / 2, h / 2);
		const p = [
			Math.lendir(r, d + 225),
			Math.lendir(r, d + 315),
			Math.lendir(r, d + 45),
			Math.lendir(r, d + 135)
		];
		this.polyBegin(x + p[0].x, y + p[0].y);
		this.vertex(x + p[1].x, y + p[1].y);
		this.vertex(x + p[2].x, y + p[2].y);
		this.vertex(x + p[3].x, y + p[3].y);
		this.polyEnd(outline);
	}
	this.scale = (x, y) => ctx.scale(x, y);
	this.translate = (x, y) => ctx.translate(x, y);
	this.lineCap = (s) => ctx.lineCap = s;
	this.resetLineCap = (s) => ctx.lineCap = Cap.butt;
	this.lineWidth = (n) => ctx.lineWidth = n; // in pixel
	this.setBlend = (s) => ctx.globalCompositeOperation = s;
	this.resetBlend = () => ctx.globalCompositeOperation = Blend.sourceOver;
	this.createLinearGradient = (x0, y0, x1, y1) => ctx.createLinearGradient(x0, y0, x1, y1);
	this.createRadialGradient = (x0, y0, r0, x1, y1, r1) => ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
	this.clearRect = (x, y, w, h) => ctx.clearRect(x, y, w, h);
}

function BranthCanvas() {
	const c = document.createElement('canvas');
	c.w = c.width;
	c.h = c.height;
	c.mid = {
		w: c.w / 2,
		h: c.h / 2
	}
	c.update = function() {
		c.width = c.clientWidth * 2;
		c.height = c.clientHeight * 2;
		c.w = c.width / 2;
		c.h = c.height / 2;
		c.mid.w = c.w / 2;
		c.mid.h = c.h / 2;
	}
	return c;
}

const Time = new BranthTime();
const Canv = new BranthCanvas();
const Draw = new BranthDraw(Canv.getContext('2d'));

const GRAVITY = 9.807 / 50;
const GRAVITY_DIRECTION = 90;

function GolfBall(x, y) {
	this.x = x;
	this.y = y;
	this.xp = x; // x previous
	this.yp = y; // y previous
	this.d = 0; // direction
	this.spd = 0;
	this.gravSpd = 0;
	this.impulse = function(direction, amount) {
		this.d = direction;
		this.spd = amount;
		this.gravSpd = GRAVITY;
	}
	this.update = function() {
		this.xp = this.x;
		this.yp = this.y;
		this.x += Math.lendirx(this.spd, this.d) + Math.lendirx(this.gravSpd, GRAVITY_DIRECTION);
		this.y += Math.lendiry(this.spd, this.d) + Math.lendiry(this.gravSpd, GRAVITY_DIRECTION);
		this.gravSpd += GRAVITY;
		this.spd *= 0.9999;
		if (this.y > Canv.mid.h) {
			this.impulse(270, 9);
		}
		this.render();
	}
	this.render = function() {
		Draw.setColor(C.white);
		Draw.circle(this.x, this.y, 4);
	}
}

/*
Ground Shape Coordinates

if (length === 6) {
			top
	_____________________
	|					|
	|					|
	|					|
	|					|
	|					|
	|					|
	|					|
	|					| j3
	|					| j2
	|		middle		| j1
	|___________________| j0
	|					|
	|					|
	|					|
	|					|
	|					|
	|___________________|
	i0	i1	i2	i3	i4	i5
			bottom
}

*/

let groundShape;

const generateGroundShape = () => {
	groundShape = [{
		i: 0,
		j: Math.rangeInt(0, 5)
	}];
	groundShape.push({
		i: 1,
		j: groundShape[0].j
	});
	for (i of [2, 3, 4, 5]) {
		groundShape.push({
			i: i,
			j: i === 5? groundShape[4].j : Math.rangeInt(0, 5)
		});
	}
}

generateGroundShape();

const onUpdate = (t) => {
	Time.update(t);

	// Draw Section
	Draw.clearRect(0, 0, Canv.w, Canv.h);

	// Draw Sky
	const skyGrad = Draw.createLinearGradient(Canv.mid.w, 0, Canv.mid.w, Canv.h * 1.5);
	skyGrad.addColorStop(0, C.sky);
	skyGrad.addColorStop(1, C.white);
	Draw.setColor(skyGrad);
	Draw.rect(0, 0, Canv.w, Canv.h);

	// Convert Ground Shape Coordinates
	const convert = (c) => ({
		x: Canv.w / (groundShape.length - 1 || 1) * c.i,
		y: Canv.h * 0.65 - (Canv.h / 40) * c.j
	});
	const conv = groundShape.map(convert);

	// Draw Backround

	// Draw Ground
	const drawGround1 = () => {
		Draw.beginPath();
		Draw.moveTo(0, Canv.h);
		for (c of conv) {
			Draw.lineTo(c.x, c.y);
		}
		Draw.lineTo(Canv.w, Canv.h);
		Draw.closePath();
		Draw.setColor(C.ground1);
		Draw.fill();
	};
	const drawGround2 = () => {
		for (c of conv) {
			const s = Canv.w / 434;
			Draw.setColor(C.ground2);
			Draw.circle(c.x - s * 12, c.y + s *  50, 6 * s);
			Draw.circle(c.x - s *  8, c.y + s *  50, 4 * s);
			Draw.circle(c.x - s * 24, c.y + s *  80, 3 * s);
			Draw.circle(c.x - s * 20, c.y + s *  80, 4 * s);
			Draw.circle(c.x - s *  8, c.y + s * 110, 7 * s);
			Draw.circle(c.x - s *  4, c.y + s * 140, 5 * s);
			Draw.circle(c.x + s * 24, c.y + s *  50, 4 * s);
			Draw.circle(c.x + s * 38, c.y + s *  80, 4 * s);
			Draw.circle(c.x + s * 19, c.y + s *  80, 4 * s);
			Draw.circle(c.x + s * 70, c.y + s * 100, 4 * s);
			Draw.circle(c.x - s *  8, c.y + s * 140, 5 * s);
			Draw.circle(c.x - s * 14, c.y + s * 180, 3 * s);
			Draw.circle(c.x - s * 10, c.y + s * 230, 7 * s);
			Draw.circle(c.x - s * 60, c.y + s * 240, 6 * s);
			Draw.circle(c.x - s * 40, c.y + s * 189, 6 * s);
			Draw.circle(c.x - s * 12, c.y + s * 260, 6 * s);
			Draw.circle(c.x - s *  8, c.y + s * 300, 5 * s);
			Draw.circle(c.x - s *  8, c.y + s * 320, 6 * s);
		}
	};
	drawGround1();
	drawGround2();

	// Canvas Scaler
	const s = Canv.w / 434;

	// Draw Grass
	const drawGrass = () => {
		let yOffset = Canv.h / 250;
		for (i of [1, 0, 2.5]) {
			let count = 0;
			Draw.beginPath();
			for (c of conv) {
				if (count === 0) {
					Draw.moveTo(c.x, c.y + yOffset * i);
				}
				else {
					Draw.lineTo(c.x, c.y + yOffset * i);
				}
				count++;
			}
			if (i >= 2) {
				Draw.lineWidth(s);
				Draw.setColor(C.white);
				Draw.setAlpha(0.2);
				Draw.stroke();
				Draw.setAlpha(1);
			}
			else {
				Draw.lineWidth(Canv.h / 50);
				Draw.setColor(i > 0? C.grass2 : C.grass1);
				if (i === 1) {
					Draw.setShadow(0, 4 * s, 20 * s, 'rgba(0, 0, 0, 0.2)');
				}
				Draw.stroke(Cap.round);
				Draw.resetShadow();
			}
		}
	};
	drawGrass();

	// Draw Hole
	const lastLine = conv.slice(conv.length - 2);
	const hole = {
		x: Math.lerp(lastLine[0].x, lastLine[1].x, 0.5),
		y: Math.lerp(lastLine[0].y, lastLine[1].y, 0.5)
	}
	const drawHole = () => {
		Draw.setColor(C.grass2);
		Draw.roundrect(hole.x - 12 * s, hole.y - Canv.h / 130, 24 * s, Canv.h / 50, 5 * s);
		Draw.lineWidth(0.5 * s);
		Draw.setColor('rgba(255, 255, 255, 0.2)');
		Draw.roundrect(hole.x - 12 * s, hole.y - Canv.h / 130, 24 * s, Canv.h / 50, 5 * s, true);
		Draw.setColor(C.hole);
		Draw.roundrect(hole.x - 10 * s, hole.y - Canv.h / 200, 20 * s, Canv.h / 15, 5 * s);
	};
	const drawFlag = () => {
		const flag = {
			x: hole.x,
			y: hole.y - Canv.h / 15,
			w: 25 * s,
			h: Canv.h / 100
		}
		const wave = Math.sin(Time.time / 100) * s;
		Draw.setColor(C.flag);
		Draw.beginPath();
		Draw.moveTo(flag.x, flag.y - flag.h);
		Draw.quadraticCurveTo(flag.x + flag.w * 0.3, flag.y - flag.h * (0.3 + 0.1 * wave), flag.x + flag.w + flag.w * 0.03 * wave, flag.y + flag.h * 0.2 * wave);
		Draw.lineTo(flag.x, flag.y + flag.h);
		Draw.setColor(C.flag);
		Draw.fill();
	};
	const drawPole = () => {
		Draw.beginPath();
		Draw.moveTo(hole.x, hole.y + Canv.h / 100);
		Draw.quadraticCurveTo(hole.x + Math.min(0.2, Math.sin(Time.time / 500) * 2) * s, hole.y + Canv.h / 100 - Canv.h / 22, hole.x, hole.y + Canv.h / 100 - Canv.h / 11);
		Draw.lineWidth(2 * s);
		Draw.setColor(C.pole);
		Draw.stroke(C.round);
	};
	drawHole();
	drawFlag();
	drawPole();

	// Draw Ball
	golfBall.update();

	// Draw Hole Cover
	// const drawHoleCover = () => {
	// 	const hc = {
	// 		h: Canv.h / 250, // from draw grass yOffset
	// 	}

	// 	Draw.beginPath();
	// 	Draw.moveTo(hole.x - 10 * s, hole.y + Canv.h / 50 - hc.h * 2);
	// 	Draw.lineTo(hole.x + 10 * s, hole.y + Canv.h / 50 - hc.h * 2);
	// 	Draw.lineWidth(hc.h);
	// 	Draw.setColor(C.grass2);
	// 	Draw.stroke(Cap.round);

	// 	Draw.beginPath();
	// 	Draw.moveTo(hole.x - 11 * s, hole.y + Canv.h / 50 - hc.h * 3);
	// 	Draw.lineTo(hole.x + 11 * s, hole.y + Canv.h / 50 - hc.h * 3);
	// 	Draw.lineWidth(hc.h);
	// 	Draw.setColor(C.grass1);
	// 	Draw.stroke(Cap.round);
	// };
	// drawHoleCover();

	// Loop
	window.requestAnimationFrame(onUpdate);
}

const onResize = () => {
	Canv.update();
	Draw.scale(2, 2);
};

let golfBall;

const onLoad = () => {
	document.body.appendChild(Canv);
	window.addEventListener('resize', onResize);
	onResize();
	golfBall = new GolfBall(Canv.mid.w, Canv.mid.h);
	onUpdate();
};

window.onload = onLoad;