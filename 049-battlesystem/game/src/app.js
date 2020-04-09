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
			SV.DISPLAY_UI(displayUI);
			SV.ENABLE_SOUNDS(enableSound);
			// ^ Definition: branth.js (line: 18)
		}
	}
};
const uri = decodeURIComponent(window.location.href);
const getValue = (name) => uri.split(`${name}=`).pop().split("&").shift();
const displayUI = true;
const enableSound = true;
const jsonValue = getValue("json");
if (uri.includes("displayUI")) getValue("displayUI") === "on";
if (uri.includes("enableSound")) getValue("enableSound") === "on";
if (uri.includes("json")) {
	req.open("GET", jsonValue, true);
	req.send(null);
}
else console.warn("Please provide url to a json file (?json=...)");
window.onmousedown = () => {
	console.log("mouse clicked (an interaction made sound enabled)");
};