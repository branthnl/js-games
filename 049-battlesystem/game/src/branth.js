const SV = {};
SV.Input = null;
SV.battleTime = 15;
SV.countdownTime = 3;
SV.parityCheck = false;
SV.DISPLAY_ICON = 1; // Above soldier
SV.DISPLAY_NAME = 1; // Above icon
SV.DISPLAY_NAME_AS_SYMBOL = 1; // Display 3 letters of symbol instead of the name
SV.DISPLAY_SPOT = 1; // Blue or red circle under soldier
SV.DISPLAY_TIMER = 1;
SV.DISPLAY_ARMY_FLAG = 1;
SV.DISPLAY_ARMY_NICKNAME = 1;
SV.DISPLAY_COUNTDOWN_TEXT = 1;
SV.DISPLAY_WINNER_TEXT = 1; // e.g. display "Avenger won!"
SV.DISPLAY_GAME_OVER_BACKGROUND = 1; // Blue or red overlay behind the winner text
SV.ENABLE_SE = 1; // Sound effects
SV.ENABLE_BGM = 1; // Background music
SV.DISPLAY_UI = (b) => {
	SV.DISPLAY_ICON = b;
	SV.DISPLAY_NAME = b;
	SV.DISPLAY_SPOT = b;
	SV.DISPLAY_TIMER = b;
	SV.DISPLAY_ARMY_FLAG = b;
	SV.DISPLAY_ARMY_NICKNAME = b;
	SV.DISPLAY_COUNTDOWN_TEXT = b;
	SV.DISPLAY_WINNER_TEXT = b;
	SV.DISPLAY_GAME_OVER_BACKGROUND = b;
};
SV.ENABLE_SOUNDS = (b) => {
	SV.ENABLE_SE = b;
	SV.ENABLE_BGM = b;
};
SV.onBattleStart = () => {};
SV.onBattleEnd = () => {};
SV.NAMES = {};
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
SV.C = {
	black: "#000000"
};
SV.Font = {
	s: "10px Montserrat, serif",
	m: "16px Montserrat, serif",
	l: "24px Montserrat, serif",
	xl: "36px Montserrat, serif",
	xxl: "48px Montserrat, serif"
};
SV.Align = {
	l: 'left',
	r: 'right',
	c: 'center',
	t: 'top',
	b: 'bottom',
	m: 'middle'
};
SV.Draw = {
	list: {},
	ctx: SV.Canvas.getContext("2d"),
	add(key, url, imageNumber) {
		const img = new Image();
		img.src = url;
		img.in = imageNumber;
		this.list[key] = img;
		return img;
	},
	setFont(font) {
		this.ctx.font = font;
	},
	setColor(c) {
		this.ctx.fillStyle = c;
		this.ctx.strokeStyle = c;
	},
	setHVAlign(h, v) {
		this.ctx.textAlign = h;
		this.ctx.textBaseline = v;
	},
	text(x, y, text) {
		this.ctx.fillText(text, x, y);
	},
	sprite(key, imageIndex, x, y, xs=1, ys=1, ox=0.5, oy=0.5) {
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
SV.UnitData = [
	{
		speed: 1,
		damage: 2,
		atkrange: 30,
		spriteType: "Knight",
		imageSpeed: 0.4
	},
	{
		speed: 0.5,
		damage: 3,
		atkrange: 30,
		spriteType: "Heavy",
		imageSpeed: 0.2
	},
	{
		speed: 1.2,
		damage: 1,
		atkrange: 200,
		spriteType: "Archer",
		imageSpeed: 0.4
	}
];
SV.Unit = function(team, type, name, strength, x, y) {
	this.id = SV.OBJ.ID++;
	this.team = team;
	this.type = type;
	this.name = name;
	this.strength = strength;
	this.data = SV.UnitData[this.type];
	this.x = x;
	this.y = y;
	this.r = 10;
	this.hp = strength;
	this.hpmax = strength;
	this.speed = this.data.speed;
	this.damage = this.data.damage;
	this.atkrange = this.data.atkrange;
	this.direction = 180 * this.team;
	this.spriteType = this.data.spriteType;
	this.spriteName = "Idle";
	this.imageIndex = Math.random() * 10;
	this.imageSpeed = this.data.imageSpeed;
	this.stopAction = ["Dodge", "Defense"];
	this.stopActionCount = 5;
	this.isDead = false;
	this.hudy = this.y;
}
SV.Unit.prototype.getSpriteKey = function() {
	return this.spriteType + this.spriteName;
};
SV.Unit.prototype.applySpeed = function() {
	this.x += this.speed * Math.cos(this.direction * Math.PI / 180);
	this.y += this.speed * Math.sin(this.direction * Math.PI / 180);
};
SV.Unit.prototype.move = function() {
	if (this.stopAction.includes(this.spriteName)) return;
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
SV.Unit.prototype.die = function() {
	this.spriteName = "Death";
	this.imageIndex = 0;
	this.imageSpeed = 0.2;
	this.isDead = true;
};
SV.Unit.prototype.dodge = function() {
	if (--this.stopActionCount <= 0) return;
	if (this.changeAction("Dodge")) {
		this.imageIndex = 0;
	}
};
SV.Unit.prototype.attack = function() {
	this.target.respondAttack(this.damage);
};
SV.Unit.prototype.defense = function() {
	if (--this.stopActionCount <= 0) return;
	if (this.changeAction("Defense")) {
		this.imageIndex = 0;
	}
};
SV.Unit.prototype.findTarget = function() {
	this.target = SV.OBJ.nearest(this.x, this.y, n => n.id !== this.id && n.team !== this.team && !n.isDead);
};
SV.Unit.prototype.respondAttack = function(dmg) {
	if (this.isDead) return;
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
		if (this.getTeamAliveCount() <= 1) {
			if (SV.GetWinnerTeamIndex() === this.team) {
				this.hp = this.hpmax;
				return;
			}
			else {
				SV.battleTime = 0;
			}
		}
		this.die();
	}
};
SV.Unit.prototype.getTeamAliveCount = function() {
	return SV.OBJ.list.filter(n => n.team === this.team && !n.isDead).length;
};
SV.Unit.prototype.getTeamColor = function() {
	return SV.GetTeamColor(this.team);
};
SV.Unit.prototype.getImageXScale = function() {
	return this.direction > 90 && this.direction < 270? -1 : 1;
};
SV.Unit.prototype.changeAction = function(name) {
	if (!this.stopAction.includes(this.spriteName)) {
		this.spriteName = name;
		return true;
	}
	return false;
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
						this.changeAction("Attack");
						this.attack();
					}
					else {
						this.changeAction("Run");
						this.move();
					}
				}
			}
			else {
				this.changeAction("Idle");
				this.findTarget();
			}
		}
	}
	const img = SV.Draw.list[this.getSpriteKey()];
	this.imageIndex += this.imageSpeed * (1 + 0.2 * Math.random());
	if (this.isDead && this.imageIndex > img.in - 1) {
		return;
	}
	else if ((this.spriteName === "Dodge" || this.spriteName === "Defense") && this.imageIndex > img.in - 1) {
		this.spriteName = "Idle";
	}
	this.hudy += (this.y - img.height - this.hudy) * 0.09;
	if (SV.DISPLAY_SPOT) {
		SV.Draw.setColor(this.getTeamColor());
		SV.Draw.circle(this.x, this.y, this.r);
	}
	SV.Draw.sprite(this.getSpriteKey(), ~~this.imageIndex, this.x, this.y, this.getImageXScale(), 1, 0.5, 1);
	if (SV.DISPLAY_ICON) {
		SV.Draw.sprite(this.name, 0, this.x, this.hudy, 0.5, 0.5, 0.5, 1);
	}
	if (SV.DISPLAY_NAME) {
		SV.Draw.setFont(SV.Font.s);
		SV.Draw.setColor(SV.C.black);
		SV.Draw.setHVAlign(SV.Align.c, SV.Align.b);
		SV.Draw.text(this.x, this.hudy - SV.Draw.list[this.name].height - 2, SV.DISPLAY_NAME_AS_SYMBOL? this.name : SV.NAMES[this.name]);
	}
};
SV.state = "countdown";
SV.GetFlagIndex = (flag) => ["R", "P", "S"].indexOf(flag);
SV.GetTeamColor = (team) => team === 0? "rgba(0, 0, 255, 0.2)" : "rgba(255, 0, 0, 0.2)";
SV.GetWinnerTeamIndex = () => SV.Input.winner === "army1"? 0 : 1;
SV.onUserUpdate = (t) => {
	SV.Time.update(t);
	SV.Draw.clear();
	SV.OBJ.render();
	if (SV.DISPLAY_ARMY_FLAG) {
		SV.Draw.ctx.globalAlpha = 0.8;
		SV.Draw.sprite("Flag", 0, 180, SV.Canvas.height - 120, -1, 1, 0, 0);
		SV.Draw.sprite("Flag", 0, SV.Canvas.width - 180, SV.Canvas.height - 120, 1, 1, 0, 0);
		SV.Draw.sprite("RPS", SV.GetFlagIndex(SV.Input.army1.flag), 100, SV.Canvas.height - 70);
		SV.Draw.sprite("RPS", SV.GetFlagIndex(SV.Input.army2.flag), SV.Canvas.width - 100, SV.Canvas.height - 70);
		SV.Draw.ctx.globalAlpha = 1;
	}
	if (SV.DISPLAY_ARMY_NICKNAME) {
		SV.Draw.setFont(SV.Font.l);
		SV.Draw.setColor(SV.C.black);
		SV.Draw.setHVAlign(SV.Align.l, SV.Align.t);
		SV.Draw.text(40, 20, SV.Input.army1.nickname);
		SV.Draw.setHVAlign(SV.Align.r, SV.Align.t);
		SV.Draw.text(SV.Canvas.width - 40, 20, SV.Input.army2.nickname);
	}
	switch (SV.state) {
		case "countdown":
			SV.countdownTime -= SV.Time.deltaTime * 0.001;
			if (SV.countdownTime <= 0) {
				SV.state = "battle";
			}
			if (SV.DISPLAY_COUNTDOWN_TEXT) {
				SV.Draw.setFont(SV.Font.xxl);
				SV.Draw.setColor(SV.C.black);
				SV.Draw.setHVAlign(SV.Align.c, SV.Align.b);
				SV.Draw.text(SV.Canvas.width * 0.5, SV.Canvas.height * 0.5, Math.max(1, Math.floor(SV.countdownTime + 1)));
			}
			break;
		case "battle":
			SV.battleTime -= SV.Time.deltaTime * 0.001;
			if (SV.battleTime <= 0) {
				for (let i = SV.OBJ.list.length - 1; i >= 0; --i) {
					const j = SV.OBJ.list[i];
					if (!j.isDead) {
						if (j.team !== SV.GetWinnerTeamIndex()) {
							j.die();
						}
						else if (SV.parityCheck) {
							const parityCheck = SV.OBJ.list.filter(n => n.type === j.type);
							const friend = parityCheck.filter(n => n.team === j.team && n.isDead);
							const enemy = parityCheck.filter(n => n.team !== j.team);
							if (friend.length < enemy.length && j.getTeamAliveCount() > 1) {
								j.die();
							}
						}
						if (!j.isDead) {
							j.spriteName = "Idle";
						}
					}
				}
				SV.state = "over";
				SV.onBattleEnd();
			}
			if (SV.DISPLAY_TIMER) {
				SV.Draw.setFont(SV.Font.xl);
				SV.Draw.setColor(SV.C.black);
				SV.Draw.setHVAlign(SV.Align.c, SV.Align.m);
				SV.Draw.text(SV.Canvas.width * 0.5, SV.Canvas.height - 68, SV.battleTime.toFixed(2));
			}
			break;
		case "over":
			if (SV.DISPLAY_GAME_OVER_BACKGROUND) {
				SV.Draw.setColor(SV.GetTeamColor(SV.GetWinnerTeamIndex()));
				SV.Draw.ctx.fillRect(0, 0, SV.Canvas.width, SV.Canvas.height);
			}
			if (SV.DISPLAY_WINNER_TEXT) {
				SV.Draw.setFont("bold " + SV.Font.xl);
				SV.Draw.setColor(SV.C.black);
				SV.Draw.setHVAlign(SV.Align.c, SV.Align.m);
				SV.Draw.text(SV.Canvas.width * 0.5, SV.Canvas.height - 68, `${SV.Input[SV.Input.winner].nickname} won!`);
			}
			break;
	}
	window.requestAnimationFrame(SV.onUserUpdate);
};
const StartGame = (options={}) => {
	SV.Input = options.input;
	SV.battleTime = options.battleTime || 15;
	SV.countdownTime = options.countdownTime || 3;
	SV.parityCheck = options.parityCheck || false;
	if (options.onBattleEnd) SV.onBattleEnd = options.onBattleEnd;
	if (options.onBattleStart) SV.onBattleStart = options.onBattleStart;
	for (let i = ICONS.items.length - 1; i >= 0; --i) {
		const j = ICONS.items[i];
		SV.Draw.add(j.symbol, j.icon, 1);
		SV.NAMES[j.symbol] = j.name;
	}
	SV.Draw.add("ArcherAttack", "src/img/ArcherAttack_strip14.png", 14);
	SV.Draw.add("ArcherDeath", "src/img/ArcherDeath_strip24.png", 24);
	SV.Draw.add("ArcherDefense", "src/img/ArcherDefense_strip22.png", 22);
	SV.Draw.add("ArcherDodge", "src/img/ArcherDodge_strip12.png", 12);
	SV.Draw.add("ArcherIdle", "src/img/ArcherIdle_strip8.png", 8);
	SV.Draw.add("ArcherRun", "src/img/ArcherRun_strip8.png", 8);
	SV.Draw.add("Flag", "src/img/Flag_strip1.png", 1);
	SV.Draw.add("HeavyAttack", "src/img/HeavyAttack_strip30.png", 30);
	SV.Draw.add("HeavyDeath", "src/img/HeavyDeath_strip40.png", 40);
	SV.Draw.add("HeavyDefense", "src/img/HeavyDefense_strip18.png", 18);
	SV.Draw.add("HeavyDodge", "src/img/HeavyDodge_strip25.png", 25);
	SV.Draw.add("HeavyIdle", "src/img/HeavyIdle_strip16.png", 16);
	SV.Draw.add("HeavyRun", "src/img/HeavyRun_strip8.png", 8);
	SV.Draw.add("Icons", "src/img/Icons_strip3.png", 3);
	SV.Draw.add("KnightAttack", "src/img/KnightAttack_strip26.png", 26);
	SV.Draw.add("KnightDeath", "src/img/KnightDeath_strip15.png", 15);
	SV.Draw.add("KnightDefense", "src/img/KnightDefense_strip20.png", 20);
	SV.Draw.add("KnightDodge", "src/img/KnightDodge_strip12.png", 12);
	SV.Draw.add("KnightIdle", "src/img/KnightIdle_strip15.png", 15);
	SV.Draw.add("KnightRun", "src/img/KnightRun_strip8.png", 8);
	SV.Draw.add("RPS", "src/img/RPS_strip3.png", 3);
	const bandHeight = SV.Canvas.height / 6;
	const a1 = SV.Input.army1.units;
	const a2 = SV.Input.army2.units;
	SV.OBJ.add(new SV.Unit(0, a1[0].type, a1[0].name, a1[0].strength, SV.Canvas.width * 0.3, bandHeight * 2));
	SV.OBJ.add(new SV.Unit(0, a1[1].type, a1[1].name, a1[1].strength, SV.Canvas.width * 0.3, bandHeight * 3));
	SV.OBJ.add(new SV.Unit(0, a1[2].type, a1[2].name, a1[2].strength, SV.Canvas.width * 0.3, bandHeight * 4));
	SV.OBJ.add(new SV.Unit(0, a1[3].type, a1[3].name, a1[3].strength, SV.Canvas.width * 0.1, bandHeight * 2.5));
	SV.OBJ.add(new SV.Unit(0, a1[4].type, a1[4].name, a1[4].strength, SV.Canvas.width * 0.1, bandHeight * 3.5));
	SV.OBJ.add(new SV.Unit(1, a2[0].type, a2[0].name, a2[0].strength, SV.Canvas.width * 0.7, bandHeight * 2));
	SV.OBJ.add(new SV.Unit(1, a2[1].type, a2[1].name, a2[1].strength, SV.Canvas.width * 0.7, bandHeight * 3));
	SV.OBJ.add(new SV.Unit(1, a2[2].type, a2[2].name, a2[2].strength, SV.Canvas.width * 0.7, bandHeight * 4));
	SV.OBJ.add(new SV.Unit(1, a2[3].type, a2[3].name, a2[3].strength, SV.Canvas.width * 0.9, bandHeight * 2.5));
	SV.OBJ.add(new SV.Unit(1, a2[4].type, a2[4].name, a2[4].strength, SV.Canvas.width * 0.9, bandHeight * 3.5));
	document.body.appendChild(SV.Canvas);
	SV.onBattleStart();
	window.requestAnimationFrame(SV.onUserUpdate);
};