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
	ctx: SV.Canvas.getContext("2d"),
	text(x, y, text) {
		this.ctx.fillText(text, x, y);
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
SV.Unit = function(team, x, y) {
	this.id = SV.OBJ.ID++;
	this.team = team;
	this.x = x;
	this.y = y;
	this.r = 10;
	this.hp = 1000;
	this.hpmax = 100;
	this.speed = 1;
	this.damage = 2;
	this.atkrange = 30;
	this.direction = 180 * this.team;
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
		this.isDead = true;
	}
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
						this.attack();
					}
					else {
						this.move();
					}
				}
			}
			else {
				this.findTarget();
			}
		}
	}
	SV.Draw.ctx.fillStyle = this.team > 0? "red" : "blue";
	SV.Draw.text(this.x, this.y - 10, this.hp);
	SV.Draw.circle(this.x, this.y, this.r);
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
	const bandHeight = SV.Canvas.height / 6;
	SV.OBJ.add(new SV.Unit(0, SV.Canvas.width * 0.3, bandHeight * 2));
	SV.OBJ.add(new SV.Unit(0, SV.Canvas.width * 0.3, bandHeight * 3));
	SV.OBJ.add(new SV.Unit(0, SV.Canvas.width * 0.3, bandHeight * 4));
	SV.OBJ.add(new SV.Unit(0, SV.Canvas.width * 0.1, bandHeight * 2.5));
	SV.OBJ.add(new SV.Unit(0, SV.Canvas.width * 0.1, bandHeight * 3.5));
	SV.OBJ.add(new SV.Unit(1, SV.Canvas.width * 0.7, bandHeight * 2));
	SV.OBJ.add(new SV.Unit(1, SV.Canvas.width * 0.7, bandHeight * 3));
	SV.OBJ.add(new SV.Unit(1, SV.Canvas.width * 0.7, bandHeight * 4));
	SV.OBJ.add(new SV.Unit(1, SV.Canvas.width * 0.9, bandHeight * 2.5));
	SV.OBJ.add(new SV.Unit(1, SV.Canvas.width * 0.9, bandHeight * 3.5));
	document.body.appendChild(SV.Canvas);
	window.requestAnimationFrame(SV.onUserUpdate);
};