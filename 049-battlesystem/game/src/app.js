const DATA = {
	UnitState: {
		Attack: "Attack",
		Death: "Death",
		Idle: "Idle",
		JumpAndFall: "JumpAndFall",
		Roll: "Roll",
		Run: "Run",
		Shield: "Shield"
	}
};

const Boot = new BranthRoom("Boot");
const Menu = new BranthRoom("Menu");
const Game = new BranthRoom("Game");
Room.add(Boot);
Room.add(Menu);
Room.add(Game);

Boot.start = () => {
	const origin = () => new Vector2(0.5, 1);
	Draw.addStrip(origin, "KnightAttack", "src/img/KnightAttack_strip.png");
	Draw.addStrip(origin, "KnightDeath", "src/img/KnightDeath_strip.png");
	Draw.addStrip(origin, "KnightIdle", "src/img/KnightIdle_strip.png");
	Draw.addStrip(origin, "KnightJumpAndFall", "src/img/KnightJumpAndFall_strip.png");
	Draw.addStrip(origin, "KnightRoll", "src/img/KnightRoll_strip.png");
	Draw.addStrip(origin, "KnightRun", "src/img/KnightRun_strip.png");
	Draw.addStrip(origin, "KnightShield", "src/img/KnightShield_strip.png");
	setTimeout(() => {
		Room.start("Menu");
	}, 200); // Estimated time to load files
};

Menu.render = () => {
};

BRANTH.start(960, 540);