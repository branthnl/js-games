const back = [
	{
		t: 0,
		x: 0
	},
	{
		t: 0.3,
		x: 1
	},
	{
		t: 0.4,
		x: 1.1
	},
	{
		t: 0.5,
		x: 1.15
	},
	{
		t: 0.6,
		x: 1.175
	},
	{
		t: 0.7,
		x: 1.1875
	},
	{
		t: 0.8,
		x: 0.975
	},
	{
		t: 1,
		x: 1
	}
];

const squish = [
	{
		t: 0,
		x: 1,
		y: 1
	},
	{
		t: 0.1,
		x: 0.5,
		y: 1.5
	},
	{
		t: 0.3,
		x: 1.3,
		y: 0.7
	},
	{
		t: 0.5,
		x: 0.8,
		y: 1.2
	},
	{
		t: 0.7,
		x: 1.1,
		y: 0.9
	},
	{
		t: 0.9,
		x: 0.95,
		y: 1.05
	},
	{
		t: 1,
		x: 1,
		y: 1
	}
];

const stretch = [
	{
		t: 0,
		x: 1,
		y: 1
	},
	{
		t: 0.1,
		x: 0.5,
		y: 1.5
	},
	{
		t: 0.3,
		x: 1.2,
		y: 0.8
	},
	{
		t: 0.7,
		x: 1.23,
		y: 0.77
	},
	{
		t: 0.8,
		x: 0.96,
		y: 1.04
	},
	{
		t: 1,
		x: 1,
		y: 1
	}
];

const color = [
	{
		t: 0,
		r: 255,
		g: 0,
		b: 0,
		a: 0
	},
	{
		t: 0.1,
		r: 255,
		g: 0,
		b: 0,
		a: 1
	},
	{
		t: 0.2,
		r: 255,
		g: 0,
		b: 0,
		a: 1
	},
	{
		t: 0.3,
		r: 255,
		g: 255,
		b: 0,
		a: 1
	},
	{
		t: 0.4,
		r: 255,
		g: 255,
		b: 0,
		a: 1
	},
	{
		t: 0.5,
		r: 0,
		g: 255,
		b: 0,
		a: 1
	},
	{
		t: 0.6,
		r: 0,
		g: 255,
		b: 0,
		a: 1
	},
	{
		t: 0.7,
		r: 0,
		g: 0,
		b: 255,
		a: 1
	},
	{
		t: 0.8,
		r: 0,
		g: 0,
		b: 255,
		a: 1
	},
	{
		t: 0.9,
		r: 0,
		g: 0,
		b: 255,
		a: 0
	},
	{
		t: 1,
		r: 0,
		g: 0,
		b: 255,
		a: 0
	}
];

const shadow = [
	{
		t: 0,
		h: 0,
		v: 0,
		b: 0,
		cr: 0,
		cg: 0,
		cb: 0,
		ca: 1
	},
	{
		t: 0.2,
		h: -5,
		v: -5,
		b: 0,
		cr: 20,
		cg: 20,
		cb: 200,
		ca: 0.5
	},
	{
		t: 0.3,
		h: -5,
		v: 8,
		b: 3,
		cr: 20,
		cg: 180,
		cb: 20,
		ca: 0.4
	},
	{
		t: 0.4,
		h: -5,
		v: 7,
		b: 2.5,
		cr: 20,
		cg: 180,
		cb: 20,
		ca: 0.5
	},
	{
		t: 0.5,
		h: -3,
		v: 9,
		b: 2,
		cr: 190,
		cg: 190,
		cb: 10,
		ca: 0.8
	},
	{
		t: 0.7,
		h: 5,
		v: 6,
		b: 0,
		cr: 190,
		cg: 190,
		cb: 0,
		ca: 1
	},
	{
		t: 0.9,
		h: 2,
		v: 2,
		b: 1,
		cr: 255,
		cg: 50,
		cb: 50,
		ca: 1
	},
	{
		t: 1,
		h: 0,
		v: 0,
		b: 0,
		cr: 0,
		cg: 0,
		cb: 0,
		ca: 1
	},
];

Math.clamp = (a, b, c) => Math.min(c, Math.max(b, a));
const animate = (keyframes, interpolant) => {
	let k = Object.assign({}, keyframes[0]);
	const t = Math.clamp(interpolant, 0, 1);
	for (let i = 0; i < keyframes.length; i++) {
		const kfrom = keyframes[i];
		const kto = keyframes[i + 1] || kfrom;
		if (t > kfrom.t) {
			for (const property of Object.keys(k)) {
				// Base + Scalar * Difference
				const b = kfrom[property];
				const s = (t - kfrom.t) / (kto.t - kfrom.t);
				const d = kto[property] - kfrom[property];
				k[property] = b + s * d;
			}
		}
	}
	return k;
};

let backH1, squishH1, stretchH1, colorH1, shadowH1, canvas, ctx;
const query = (q) => document.querySelector(q);
const start = () => {
	backH1 = query('#back');
	squishH1 = query('#squish');
	stretchH1 = query('#stretch');
	colorH1 = query('#color');
	shadowH1 = query('#shadow');
	canvas = query('canvas');
	canvas.w = canvas.width;
	canvas.h = canvas.height;
	canvas.width *= 2;
	canvas.height *= 2;
	ctx = canvas.getContext('2d');
	ctx.scale(2, 2);
	loop();
};

const Time = {
	time: 0,
	lastTime: 0,
	deltaTime: 0,
	update: function(t) {
		this.lastTime = this.time || 0;
		this.time = t || 0;
		this.deltaTime = this.time - this.lastTime || 1000 / 60;
	}
};

let wave = 0;
const loop = (t) => {
	Time.update(t);

	wave += Time.deltaTime / 2000;
	if (wave >= 1.4) {
		wave = -0.2;
	}

	let k;

	k = animate(back, wave * 2);
	backH1.style.left = `calc(${1 - k.x}rem + ${50 * k.x}%)`;
	backH1.style.transform = `translateX(${-50 * k.x}%)`;

	k = animate(squish, wave * 2);
	squishH1.style.transform = `scale(${k.x}, ${k.y})`;

	k = animate(stretch, wave * 2);
	stretchH1.style.transform = `scale(${k.x}, ${k.y})`;

	k = animate(color, wave);
	colorH1.style.color = `rgba(${k.r}, ${k.g}, ${k.b}, ${k.a})`;

	k = animate(shadow, wave); // h-offset, v-offset, blur-radius, color;
	shadowH1.style.textShadow = `${k.h}px ${k.v}px ${k.b}px rgba(${k.cr}, ${k.cg}, ${k.cb}, ${k.ca})`;

	k = animate(back, wave * 2);
	ctx.clearRect(0, 0, canvas.w, canvas.h);
	ctx.beginPath();
	ctx.arc(canvas.w / 2, canvas.h / 2, 5 + 20 * k.x, -Math.PI + Math.PI * 0.6 * k.x, 1.4 * Math.PI * k.x);
	ctx.lineCap = 'round';
	ctx.lineWidth = 9 * k.x;
	k = animate(color, wave);
	ctx.shadowColor = `rgba(${k.r}, ${k.g}, ${k.b}, ${0.3 * k.a})`;
	ctx.shadowBlur = 10;
	ctx.strokeStyle = `rgba(${k.r}, ${k.g}, ${k.b}, ${k.a})`;
	ctx.stroke();
	ctx.lineWidth = 7 * k.a;
	ctx.strokeStyle = `rgba(255, 255, 255, ${k.a})`;
	ctx.stroke();

	k = animate(squish, wave * 2);
	canvas.style.transform = `scale(${k.x}, ${Math.min(k.y, 1.2)})`;

	k = animate(shadow, wave);
	canvas.style.boxShadow = `${k.h}px ${k.v}px ${k.b}px 0 rgba(${k.cr}, ${k.cg}, ${k.cb}, ${k.ca})`;

	window.requestAnimationFrame(loop);
};

window.onload = start;