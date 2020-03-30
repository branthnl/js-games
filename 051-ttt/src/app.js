let player = 0;

const ttt = [
	  -1, -1, -1
	, -1, -1, -1
	, -1, -1, -1
];

const swapPlayer = () => {
	if (player === 0) {
		player = 1;
	}
	else {
		player = 0;
	}
};

const getMinimax = () => {
	return 0;
};

const Game = new BranthRoom("Game");
Room.add(Game);

Game.render = () => {
	if (Input.keyDown(KeyCode.Space)) {
		const i = getMinimax();
		ttt[i] = player;
		swapPlayer();
	}
	if (Input.keyDown(KeyCode.Q)) {
		ttt[0] = player;
		swapPlayer();
	}
	if (Input.keyDown(KeyCode.W)) {
		ttt[1] = player;
		swapPlayer();
	}
	if (Input.keyDown(KeyCode.E)) {
		ttt[2] = player;
		swapPlayer();
	}
	if (Input.keyDown(KeyCode.A)) {
		ttt[3] = player;
		swapPlayer();
	}
	if (Input.keyDown(KeyCode.S)) {
		ttt[4] = player;
		swapPlayer();
	}
	if (Input.keyDown(KeyCode.D)) {
		ttt[5] = player;
		swapPlayer();
	}
	if (Input.keyDown(KeyCode.Z)) {
		ttt[6] = player;
		swapPlayer();
	}
	if (Input.keyDown(KeyCode.X)) {
		ttt[7] = player;
		swapPlayer();
	}
	if (Input.keyDown(KeyCode.C)) {
		ttt[8] = player;
		swapPlayer();
	}
	for (let h = 0; h < 9; h++) {
		const i = (h % 3) * 32;
		const j = ~~(h / 3) * 32;
		Draw.rect(i, j, 32, 32, true);
		switch (ttt[h]) {
			case 0: Draw.circle(i + 16, j + 16, 10); break;
			case 1: Draw.plus(i + 16, j + 16, 10); break;
		}
	}
	Draw.setFont(Font.m);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.text(8, 102, player);
};

BRANTH.start();
Room.start("Game");