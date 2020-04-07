const req = new XMLHttpRequest();
req.onreadystatechange = () => {
	if (req.readyState === XMLHttpRequest.DONE) {
		if (req.status === 200) {
			StartGame({
				input: JSON.parse(req.responseText),
				battleTime: 15,
				countdownTime: 3,
				parityCheck: false,
				onBattleStart() {
					console.log(`${SV.Input.winner} (${SV.Input[SV.Input.winner].nickname}) will won`);
				},
				onBattleEnd() {
					console.log("battle end");
				}
			});
			// SV.DISPLAY_UI(false);
			// ^ Definition: branth.js (line: 17)
		}
	}
};
const i = window.location.href.indexOf("?json=");
if (i === -1) {
	console.warn("Please provide url to a json file (?json=...)");
}
else {
	req.open("GET", window.location.href.substring(i).split("=").pop(), true);
	req.send(null);
}