const SV = {};
SV.Input = null;
SV.battleTime = 15;
SV.countdownTime = 2;
SV.onBattleEnd = () => {};
SV.Time = {
	time: 0,
	lastTime: 0,
	deltaTime: 0,
	update(t) {
		this.lastTime = this.time;
		this.time = t;
		this.deltaTime = this.time - this.lastTime;
	}
};
SV.Canvas = document.createElement("canvas");
SV.Canvas.width = 960;
SV.Canvas.height = 540;
SV.Canvas.style.backgroundColor = "#eeeeee";
SV.Draw = {
	list: {},
	ctx: SV.Canvas.getContext("2d"),
	add(key, url, imageNumber) {
		const img = new Image();
		img.src = url;
		img.in = imageNumber;
		this.list[key] = img;
	},
	text(x, y, text) {
		this.ctx.fillText(text, x, y);
	},
	sprite(key, imageIndex, x, y, xs, ys, ox=0.5, oy=0.5) {
		const img = this.list[key];
		const s = {
			w: img.width / img.in,
			h: img.height
		};
		const d = {
			w: s.w * xs,
			h: s.h * ys
		};
		this.ctx.save();
		this.ctx.translate(x - d.w * ox, y - d.h * oy);
		this.ctx.scale(xs, ys);
		this.ctx.drawImage(img, s.w * (imageIndex % img.in), 0, s.w, s.h, 0, 0, s.w, s.h);
		this.ctx.restore();
	},
	circle(x, y, r) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, 2 * Math.PI);
		this.ctx.fill();
	},
	clear() {
		this.ctx.clearRect(0, 0, SV.Canvas.width, SV.Canvas.height);
	}
};
SV.OBJ = {
	ID: 0,
	list: [],
	add(i) {
		this.list.push(i);
	},
	nearest(x, y, callback) {
		let g = null;
		let h = Infinity;
		for (let i = this.list.length - 1; i >= 0; --i) {
			const j = this.list[i];
			if (callback(j)) {
				const k = Math.hypot(j.x - x, j.y - y);
				if (k <= h) {
					g = j;
					h = k;
				}
			}
		}
		return g;
	},
	render() {
		const j = this.list.slice().sort((a, b) => a.y > b.y? -1 : 1);
		for (let i = j.length - 1; i >= 0; --i) {
			j[i].render();
		}
	}
};
SV.Unit = function(team, type, x, y) {
	this.id = SV.OBJ.ID++;
	this.team = team;
	this.type = type;
	this.x = x;
	this.y = y;
	this.r = 10;
	this.hp = 500;
	this.hpmax = 500;
	this.speed = 1;
	this.damage = 2;
	this.atkrange = 30;
	this.direction = 180 * this.team;
	this.spriteName = "KnightIdle";
	this.imageIndex = 0;
	this.isDead = false;
}
SV.Unit.prototype.applySpeed = function() {
	this.x += this.speed * Math.cos(this.direction * Math.PI / 180);
	this.y += this.speed * Math.sin(this.direction * Math.PI / 180);
};
SV.Unit.prototype.move = function() {
	const xp = this.x;
	const yp = this.y;
	this.applySpeed();
	for (let i = SV.OBJ.list.length - 1; i >= 0; --i) {
		const j = SV.OBJ.list[i];
		if (j.id !== this.id && !j.isDead) {
			const distance = Math.hypot(j.x - this.x, j.y - this.y);
			if (distance < this.r + j.r) {
				this.x = xp;
				this.y = yp;
				this.direction += Math.sin(-Math.atan2(this.target.x - this.x, this.target.y - this.y) - (this.direction + 45) * Math.PI / 180) * 20;
				this.applySpeed();
			}
		}
	}
};
SV.Unit.prototype.dodge = function() {
};
SV.Unit.prototype.attack = function() {
	this.target.respondAttack(this.damage);
};
SV.Unit.prototype.defense = function() {
};
SV.Unit.prototype.findTarget = function() {
	this.target = SV.OBJ.nearest(this.x, this.y, n => n.id !== this.id && n.team !== this.team && !n.isDead);
};
SV.Unit.prototype.respondAttack = function(dmg) {
	const i = Math.random();
	if (i > 0.8) {
		this.dodge();
		this.hp -= dmg * 0.1;
	}
	else if (i > 0.5) {
		this.defense();
		this.hp -= dmg * 0.5;
	}
	else {
		this.hp -= dmg;
	}
	if (this.hp <= 0) {
		this.spriteName = "KnightDeath";
		this.imageIndex = 0;
		this.isDead = true;
	}
};
SV.Unit.prototype.getImageXScale = function() {
	return this.direction > 90 && this.direction < 270? -1 : 1;
};
SV.Unit.prototype.render = function() {
	if (SV.state === "battle") {
		if (!this.isDead) {
			if (this.target instanceof SV.Unit) {
				if (this.target.isDead) {
					this.target = null;
				}
				else {
					this.direction += Math.sin(-Math.atan2(this.target.x - this.x, this.target.y - this.y) - (this.direction - 90) * Math.PI / 180) * 10;
					if (Math.hypot(this.target.x - this.x, this.target.y - this.y) < this.atkrange) {
						this.spriteName = "KnightAttack";
						this.attack();
					}
					else {
						this.spriteName = "KnightRun";
						this.move();
					}
				}
			}
			else {
				this.spriteName = "KnightIdle";
				this.findTarget();
			}
		}
	}
	SV.Draw.ctx.fillStyle = this.team > 0? "red" : "blue";
	// SV.Draw.text(this.x, this.y - 10, this.hp);
	// SV.Draw.circle(this.x, this.y, this.r);
	this.imageIndex += 0.2 * Math.random() + 0.3;
	if (this.isDead && this.imageIndex > SV.Draw.list[this.spriteName].in - 1) {
		return;
	}
	SV.Draw.sprite("Icons", this.type, this.x, this.y - SV.Draw.list[this.spriteName].height, 1, 1, 0.5, 1);
	SV.Draw.sprite(this.spriteName, ~~this.imageIndex, this.x, this.y, this.getImageXScale(), 1, 0.5, 1);
};
SV.state = "countdown";
SV.onUserUpdate = (t) => {
	SV.Time.update(t);
	SV.Draw.clear();
	SV.OBJ.render();
	switch (SV.state) {
		case "countdown":
			SV.countdownTime -= SV.Time.deltaTime * 0.001;
			if (SV.countdownTime <= 0) {
				SV.state = "battle";
			}
			SV.Draw.text(SV.Canvas.width * 0.5, SV.Canvas.height * 0.5, SV.countdownTime);
			break;
		case "battle":
			SV.battleTime -= SV.Time.deltaTime * 0.001;
			if (SV.battleTime <= 0) {
				SV.state = "over";
			}
			SV.Draw.text(SV.Canvas.width * 0.5, SV.Canvas.height * 0.5, SV.battleTime);
			break;
		case "over":
			SV.Draw.text(SV.Canvas.width * 0.5, SV.Canvas.height * 0.5, `${SV.Input.winner} won!`);
			break;
	}
	window.requestAnimationFrame(SV.onUserUpdate);
};
const StartGame = (options={}) => {
	SV.Input = options.input;
	SV.battleTime = options.battleTime;
	SV.countdownTime = options.countdownTime;
	SV.onBattleEnd = options.onBattleEnd;
	SV.Draw.add("Icons", "src/img/Icons_strip3.png", 3);
	SV.Draw.add("KnightAttack", "src/img/KnightAttack_strip26.png", 26);
	SV.Draw.add("KnightDeath", "src/img/KnightDeath_strip15.png", 15);
	SV.Draw.add("KnightDefense", "src/img/KnightDefense_strip20.png", 20);
	SV.Draw.add("KnightDodge", "src/img/KnightDodge_strip12.png", 12);
	SV.Draw.add("KnightIdle", "src/img/KnightIdle_strip15.png", 15);
	SV.Draw.add("KnightRun", "src/img/KnightRun_strip8.png", 8);
	const bandHeight = SV.Canvas.height / 6;
	SV.OBJ.add(new SV.Unit(0, 1, SV.Canvas.width * 0.3, bandHeight * 2));
	SV.OBJ.add(new SV.Unit(0, 0, SV.Canvas.width * 0.3, bandHeight * 3));
	SV.OBJ.add(new SV.Unit(0, 1, SV.Canvas.width * 0.3, bandHeight * 4));
	SV.OBJ.add(new SV.Unit(0, 2, SV.Canvas.width * 0.1, bandHeight * 2.5));
	SV.OBJ.add(new SV.Unit(0, 2, SV.Canvas.width * 0.1, bandHeight * 3.5));
	SV.OBJ.add(new SV.Unit(1, 0, SV.Canvas.width * 0.7, bandHeight * 2));
	SV.OBJ.add(new SV.Unit(1, 1, SV.Canvas.width * 0.7, bandHeight * 3));
	SV.OBJ.add(new SV.Unit(1, 0, SV.Canvas.width * 0.7, bandHeight * 4));
	SV.OBJ.add(new SV.Unit(1, 2, SV.Canvas.width * 0.9, bandHeight * 2.5));
	SV.OBJ.add(new SV.Unit(1, 0, SV.Canvas.width * 0.9, bandHeight * 3.5));
	document.body.appendChild(SV.Canvas);
	window.requestAnimationFrame(SV.onUserUpdate);
};