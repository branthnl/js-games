const Game = new BranthRoom('Game');
Room.add(Game);

Game.start = () => {
};

Game.render = () => {
	for (let y = 0; y < Room.h / 2 ; y++) {
		for (let x = 0; x < Room.w; x++) {

			let perspective = y / (Room.h / 2);

			let middlePoint = 0.5;
			let roadWidth = perspective;
			let clipWidth = roadWidth * 0.15;

			roadWidth *= 0.5;

			let leftGrass = (middlePoint - roadWidth - clipWidth) * Room.w;
			let leftClip = (middlePoint - roadWidth) * Room.w;
			let rightClip = (middlePoint + roadWidth) * Room.w;
			let rightGrass = (middlePoint + roadWidth + clipWidth) * Room.w;

			if (x >= 0 && x < leftGrass) {
				Draw.setColor(C.green);
				Draw.rect(x, y, 1, 1);
			}
			if (x >= leftGrass && x < leftClip) {
				Draw.setColor(C.red);
				Draw.rect(x, y, 1, 1);
			}
			if (x >= leftClip && x < rightClip) {
				Draw.setColor(C.grey);
				Draw.rect(x, y, 1, 1);
			}
			if (x >= rightClip && x < rightGrass) {
				Draw.setColor(C.red);
				Draw.rect(x, y, 1, 1);
			}
			if (x >= rightGrass && x < Room.w) {
				Draw.setColor(C.green);
				Draw.rect(x, y, 1, 1);
			}
		}
	}
};

BRANTH.start(300, 150);
Room.start('Game');