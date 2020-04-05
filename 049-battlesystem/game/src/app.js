const req = new XMLHttpRequest();
req.onreadystatechange = () => {
	if (req.readyState === XMLHttpRequest.DONE) {
		if (req.status === 200) {
			StartGame({
				input: JSON.parse(req.responseText),
				battleTime: 15,
				countdownTime: 3,
				onBattleEnd() {
					console.log("battle end");
				}
			});
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