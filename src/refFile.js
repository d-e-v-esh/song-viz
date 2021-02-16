const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");

let freqs;

navigator.mediaDevices.enumerateDevices().then((devices) => {
  devices.forEach((d, i) => console.log(d.label, i));
  navigator.mediaDevices
    .getUserMedia({
      audio: {
        deviceId: devices[17].deviceId,
      },
    })
    .then((stream) => {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = context.createAnalyser();
      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.connect(context.destination);

      freqs = new Uint8Array(analyser.frequencyBinCount);

      function draw() {
        let radius = 75;
        let bars = 100;

        // Draw Background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

        // Draw circle
        ctx.beginPath();
        ctx.arc(
          myCanvas.width / 2,
          myCanvas.height / 2,
          radius,
          0,
          2 * Math.PI
        );
        ctx.stroke();
        analyser.getByteFrequencyData(freqs);

        // Draw label
        ctx.font = "500 24px Helvetica Neue";
        const avg =
          [...Array(255).keys()].reduce((acc, curr) => acc + freqs[curr], 0) /
          255;
        ctx.fillStyle = "rgb(" + 200 + ", " + (200 - avg) + ", " + avg + ")";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("SPACE", myCanvas.width / 2, myCanvas.height / 2 - 24);
        ctx.fillText("FORCE", myCanvas.width / 2, myCanvas.height / 2 + 6);

        // Draw bars
        for (var i = 0; i < bars; i++) {
          let radians = (Math.PI * 2) / bars;
          let bar_height = freqs[i] * 0.5;

          let x = myCanvas.width / 2 + Math.cos(radians * i) * radius;
          let y = myCanvas.height / 2 + Math.sin(radians * i) * radius;
          let x_end =
            myCanvas.width / 2 + Math.cos(radians * i) * (radius + bar_height);
          let y_end =
            myCanvas.height / 2 + Math.sin(radians * i) * (radius + bar_height);
          let color =
            "rgb(" + 200 + ", " + (200 - freqs[i]) + ", " + freqs[i] + ")";
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x_end, y_end);
          ctx.stroke();
        }

        requestAnimationFrame(draw);
      }

      requestAnimationFrame(draw);
    });
});
