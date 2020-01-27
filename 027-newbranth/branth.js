class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}
Math.clamp = (a, b, c) => Math.min(c, Math.max(b, a));
Math.range = (min, max, t) => min + (t || (t === 0? 0 : Math.random())) * (max - min);
Math.irange = (min, max) => Math.floor(Math.range(min, max));
Math.degtorad = (d) => d * Math.PI / 180;
Math.radtodeg = (d) => d * 180 / Math.PI;
Math.lendirx = (l, d) => l * Math.cos(Math.degtorad(d));
Math.lendiry = (l, d) => l * Math.sin(Math.degtorad(d));
Math.lendir = (l, d) => new Vector2(Math.lendirx(l, d), Math.lendiry(l, d));
Math.randneg = (t = 0.5) => Math.random() > t? -1 : 1;
Math.choose = (...args) => args[Math.irange(0, args.length)];