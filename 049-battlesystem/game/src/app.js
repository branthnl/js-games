const fileInput = document.getElementById("fileInput");

const BS = {
	debug: true,
	inputJSON: {},
	inputHasLoaded: false,
	onInputLoaded(result) {
		this.inputJSON = JSON.parse(result);
		this.inputHasLoaded = true;
	}
};

BS.Data = {
	UnitData: [
		{
			spriteName: "Knight"
		},
		{
			spriteName: "Knight"
		},
		{
			spriteName: "Knight"
		}
	],
	UnitState: {
		Attack: "Attack",
		Death: "Death",
		Idle: "Idle",
		JumpAndFall: "JumpAndFall",
		Shield: "Shield"
	},
	GetUnitDataByIconIndex(i) {
		return this.UnitData[i] || this.UnitData[0];
	}
};

/* BS.Spot ->
	+------|------+
	| 3  0 | 5  8 |
	| 4  1 | 6  9 |
	| .  2 | 7  . |
	+------|------+
	 army1   army2
*/
let w = 960, h = 540;
BS.Spot = [
	new Vector2(w * 0.4, h * 0.3),
	new Vector2(w * 0.4, h * 0.5),
	new Vector2(w * 0.4, h * 0.7),
	new Vector2(w * 0.2, h * 0.3),
	new Vector2(w * 0.2, h * 0.5),
	new Vector2(w * 0.6, h * 0.3),
	new Vector2(w * 0.6, h * 0.5),
	new Vector2(w * 0.6, h * 0.7),
	new Vector2(w * 0.8, h * 0.3),
	new Vector2(w * 0.8, h * 0.5)
];

class Unit extends BranthBehaviour {
	constructor(team, index, position, name, strength, iconIndex) {
		super(position.x, position.y);
		this.team = team; // army1 or army2
		this.index = index; // 0-4
		this.name = name;
		this.strength = strength;
		this.maxStrength = strength;
		this.iconIndex = iconIndex;
		this.data = BS.Data.GetUnitDataByIconIndex(this.iconIndex);
		this.state = BS.Data.UnitState.Idle;
		this.imageIndex = Math.irange(20);
		this.imageXScale = this.team === "army1"? 1 : -1;
		this.actionInterval = {
			min: 500,
			max: 1000
		};
		this.attackCount = 0;
		this.nonAttackCount = 0;
		this.alarm[0] = 50;
		this.alarm[1] = Math.range(this.actionInterval.min, this.actionInterval.max);
		this.iconDrawY = this.y;
	}
	changeState(newState) {
		this.imageIndex = 0;
		this.state = newState;
	}
	getAttackStrength() {
		return BS.Battle.averageDamage * Math.clamp(this.strength / this.maxStrength, 0.1, 1) * Math.range(1, 2);
	}
	takeDamage(amount) {
		this.strength -= amount;
		if (this.strength <= 0) {
			// If our team should be win but this unit's death will make it lose, prevent death
			if (this.team === BS.inputJSON.winner && this.getAlly().length < OBJ.take(Unit).length * 0.5) {
				this.strength = this.maxStrength;
				return;
			}
			// If this is the last unit from a team, they lost
			if (OBJ.take())
			this.changeState(BS.Data.UnitState.Death);
		}
	}
	isAlly(x) {
		return x.team === this.team;
	}
	isEnemy(x) {
		return x.team !== this.team;
	}
	getAlly() {
		return OBJ.take(Unit).filter(x => this.isAlly(x))
	}
	getEnemy() {
		return OBJ.take(Unit).filter(x => this.isEnemy(x));
	}
	render() {
		const name = `${this.data.spriteName}${this.state}`;
		const img = Draw.getStrip(name);
		switch (this.state) {
			case BS.Data.UnitState.Attack:
				if (this.imageIndex >= img.strip) {
					this.changeState(BS.Data.UnitState.Idle);
					// Take random enemy to hit
					try {
						Math.pick(this.getEnemy()).takeDamage(this.getAttackStrength());
					}
					catch {}
					this.alarm[1] = Math.range(this.actionInterval.min, this.actionInterval.max);
				}
				break;
			case BS.Data.UnitState.Death:
				if (this.imageIndex >= img.strip) {
					OBJ.destroy(this.id);
					return;
				}
				break;
			case BS.Data.UnitState.JumpAndFall:
				if (this.imageIndex >= img.strip) {
					this.changeState(BS.Data.UnitState.Idle);
					this.alarm[1] = Math.range(this.actionInterval.min * 0.7, this.actionInterval.max * 0.7);
				}
				break;
			case BS.Data.UnitState.Shield:
				if (this.imageIndex >= img.strip) {
					this.changeState(BS.Data.UnitState.Idle);
					this.alarm[1] = Math.range(this.actionInterval.min * 0.5, this.actionInterval.max * 0.5);
				}
				break;
		}
		this.iconDrawY = Math.range(this.iconDrawY, this.y - img.height + Math.sin(Time.time * 0.01 + this.id) * 4, 0.1);
		Draw.strip(name, this.imageIndex, this.x, this.y, this.imageXScale);
	}
	alarm0() {
		// Animate by increasing image index
		this.imageIndex++;
		this.alarm[0] = 50;
	}
	alarm1() {
		if (this.strength <= 0 || BS.Battle.time <= 0) return;
		// Simple action
		// Choose between: attack, defend, or dodge
		if (this.attackCount < 3) {
			if (Math.random() > 0.1) {
				this.attackCount++;
				this.changeState(BS.Data.UnitState.Attack);
			}
			else {
				this.nonAttackCount++;
				this.changeState(Math.choose(BS.Data.UnitState.JumpAndFall, BS.Data.UnitState.Shield));
			}
		}
		else {
			if (Math.random() > (this.attackCount - this.nonAttackCount) / (this.attackCount + this.nonAttackCount)) {
				this.attackCount++;
				this.changeState(BS.Data.UnitState.Attack);
			}
			else {
				this.nonAttackCount++;
				this.changeState(Math.choose(BS.Data.UnitState.JumpAndFall, BS.Data.UnitState.Shield));
			}
		}
	}
}

OBJ.add(Unit);

BS.Battle = {
	time: -1,
	over: false,
	duration: 15000,
	resultBGAlpha: 0,
	averageDamage: 0,
	CreateAverageDamage() {
		let dmg = 0;
		for (const i of OBJ.take(Unit).map(x => +x.maxStrength)) {
			dmg += i / 10;
		}
		return dmg / OBJ.take(Unit).length;
	},
	start() {
		this.time = this.duration;
		this.over = false;
		this.averageDamage = this.CreateAverageDamage();
	},
	update() {
		if (!this.over) {
			if (this.time !== -1) {
				if (this.time <= 0) {
					this.time = 0;
					this.over = true;
				}
				else {
					this.time -= Time.deltaTime;
				}
			}
		}
	}
};

const Boot = new BranthRoom("Boot");
const Game = new BranthRoom("Game");
Room.add(Boot);
Room.add(Game);

Boot.start = () => {
	Draw.addStrip(new Vector2(0.5, 1), "icons", "src/img/icons_strip3.png", 3);
	Draw.addStrip(new Vector2(0.5, 1), "KnightAttack", "src/img/KnightAttack_strip26.png", 26);
	Draw.addStrip(new Vector2(0.5, 1), "KnightDeath", "src/img/KnightDeath_strip15.png", 15);
	Draw.addStrip(new Vector2(0.5, 1), "KnightIdle", "src/img/KnightIdle_strip15.png", 15);
	Draw.addStrip(new Vector2(0.5, 1), "KnightJumpAndFall", "src/img/KnightJumpAndFall_strip12.png", 12);
	Draw.addStrip(new Vector2(0.5, 1), "KnightShield", "src/img/KnightShield_strip20.png", 20);
	fileInput.onchange = (e) => {
		const f = e.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			BS.onInputLoaded(e.target.result);
		};
		try {
			reader.readAsText(f);
		}
		catch {}
	};
	setTimeout(() => {
		Room.start("Game");
	}, 500); // Estimated time to load files
};

Boot.renderUI = () => {
	Draw.setFont(Font.xl);
	Draw.setColor(C.black);
	Draw.setHVAlign(Align.c, Align.m);
	Draw.text(Room.mid.w, Room.mid.h, "Loading...");
};

Game.render = () => {
	if (Input.keyDown(KeyCode.U)) BS.debug = !BS.debug;
	if (BS.debug) {
		Draw.setFont(Font.m);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.setAlpha(0.2);
		for (const i in BS.Spot) {
			const n = BS.Spot[i];
			Draw.setColor(C.white);
			Draw.circle(n.x, n.y, 24);
			Draw.setColor(C.black);
			Draw.text(n.x, n.y, i);
		}
		Draw.setAlpha(1);
	}
};

Game.renderUI = () => {
	if (!BS.inputHasLoaded) {
		const t = 2 * (0.5 + 0.5 * Math.sin(Time.time * 0.01));
		Draw.CTX.save();
		Draw.CTX.translate(0, t);
		Draw.setColor(C.yellow);
		Draw.primitiveBegin();
		Draw.vertex(32 - 8, 8);
		Draw.vertex(32, 0);
		Draw.vertex(32 + 8, 8);
		Draw.vertex(32, 0);
		Draw.vertex(32, 32);
		Draw.vertex(64, 32);
		Draw.primitiveEnd(Primitive.line);
		Draw.setFont(Font.m);
		Draw.setHVAlign(Align.l, Align.m);
		Draw.text(70, 32, "Choose JSON file input");
		Draw.CTX.restore();
	}
	else {
		const n = BS.inputJSON;
		if (BS.debug) {
			Draw.setFont(Font.l);
			Draw.setColor(C.yellow);
			Draw.setHVAlign(Align.c, Align.t);
			Draw.text(Room.mid.w, 64, `winner: ${n.winner}`);
			Draw.setFont(Font.m);
			Draw.setColor(C.black);
			for (const i of OBJ.take(Unit)) {
				txt = `#${i.index + 1} ${i.name}\nstr: ${Math.ceil(i.strength)}/${i.maxStrength}\nicon: ${i.iconIndex}`;
				Draw.text(i.x, i.y + 10, txt);
			}
			for (const i of OBJ.take(Unit)) {
				Draw.strip("icons", i.iconIndex, i.x, i.iconDrawY);
			}
		}
		Draw.setFont(Font.xl);
		Draw.setColor(C.yellow);
		Draw.setHVAlign(Align.c, Align.t);
		Draw.text(Room.mid.w, 20, Time.toSeconds(BS.Battle.time) + "s");
		BS.Battle.update();
		if (Input.keyDown(KeyCode.Space)) {
			OBJ.clearAll();
			let spotCount = 0;
			for (let h = 0; h < 2; h++) {
				const team = `army${h + 1}`;
				for (let i = 0; i < 5; i++) {
					const unit = n[team][`s${i + 1}`];
					OBJ.create(Unit, team, i, BS.Spot[spotCount++], unit.name, unit.strength, unit.iconIndex);
				}
			}
			BS.Battle.start();
		}
		if (BS.Battle.over) {
			BS.Battle.resultBGAlpha = Math.range(BS.Battle.resultBGAlpha, 1, 0.1);
		}
		else {
			BS.Battle.resultBGAlpha = Math.range(BS.Battle.resultBGAlpha, 0, 0.1);
		}
		let y = 32;
		Draw.setFont(Font.l);
		Draw.setColor(C.black);
		Draw.setHVAlign(Align.c, Align.t);
		if (BS.debug) {
			Draw.text(Room.w * 0.2, y, `army1 (${n.army1.nickname})`);
			Draw.text(Room.w * 0.8, y, `army2 (${n.army2.nickname})`);
			y += Font.size + 2;
			Draw.setFont(Font.m);
			Draw.text(Room.w * 0.2, y, `flag: ${n.army1.flag}`);
			Draw.text(Room.w * 0.8, y, `flag: ${n.army2.flag}`);
		}
		else {
			Draw.text(Room.w * 0.2, y, n.army1.nickname);
			Draw.text(Room.w * 0.8, y, n.army2.nickname);
		}
		Draw.setColor(C.black);
		Draw.setAlpha(BS.Battle.resultBGAlpha * 0.2);
		Draw.rect(0, 0, Room.w, Room.h);
		Draw.setFont(Font.xxl);
		Draw.setColor(C.white);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.setAlpha(BS.Battle.resultBGAlpha);
		const s = 1.1 - 0.1 * BS.Battle.resultBGAlpha;
		Draw.textTransformed(Room.mid.w, Room.mid.h, `The winner is ${BS.inputJSON[BS.inputJSON.winner].nickname}!`, s, s);
		Draw.setAlpha(1);
	}
	Draw.setFont(Font.m);
	Draw.setColor(C.yellow);
	Draw.setHVAlign(Align.l, Align.b);
	Draw.text(16, Room.h - 16, `Press <U> to ${BS.debug? "hide" : "show"} debug${BS.inputHasLoaded? "\nPress <Space> to start or restart battle" : ""}`);
};

BRANTH.start(960, 540);
Room.start("Boot");