StartGame({
	input: {
		winner: "army2"
	},
	battleTime: 15,
	countdownTime: 3,
	onBattleEnd() {
		console.log("battle end");
	}
});