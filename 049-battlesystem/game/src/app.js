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
req.open("GET", window.location.href.substring(window.location.href.indexOf("?json=")).split("=").pop(), true);
req.send(null);