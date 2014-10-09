navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

window.addEventListener("load", function() {
	var video = document.createElement("video");

	var canvas = document.getElementById("qr-canvas");

	var scale = 0.5;

	var ctx = canvas.getContext("2d");

	function maybeScanThatVideo() {
		canvas.width = video.videoWidth * scale;
		canvas.height = video.videoHeight * scale;

		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

		requestAnimationFrame(maybeScanThatVideo);

		try {
			qrcode.decode();
		} catch (e) {}
	}

	qrcode.callback = function(data) {
		console.log("About to tell the other guy");
		if("vibrate" in navigator)
			navigator.vibrate(100);
		window.aQRCodeWasScannedAndWeGotThis(data);
	};

	navigator.getUserMedia({video: true, audio: false}, 
		function(videoStream) {
			video.src = URL.createObjectURL(videoStream);
			setTimeout(video.play.bind(video), 100);
			window.video = video;

			requestAnimationFrame(maybeScanThatVideo);
		}, function(err) {
			alert("Welp, that didn't work.");
			window.close();
		});
});

