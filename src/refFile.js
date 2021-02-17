const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let frequency_array;

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

      frequency_array = new Uint8Array(analyser.frequencyBinCount);

      function draw() {
        let radius = 75;
        let bars = 100;

        // Draw Background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw circle
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
        ctx.stroke();
        analyser.getByteFrequencyData(frequency_array);

        // Draw label
        ctx.font = "500 24px Helvetica Neue";
        const avg =
          [...Array(255).keys()].reduce(
            (acc, curr) => acc + frequency_array[curr],
            0
          ) / 255;
        ctx.fillStyle = "rgb(" + 200 + ", " + (200 - avg) + ", " + avg + ")";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("SPACE", canvas.width / 2, canvas.height / 2 - 24);
        ctx.fillText("FORCE", canvas.width / 2, canvas.height / 2 + 6);

        // Draw bars
        for (var i = 0; i < bars; i++) {
          let radians = (Math.PI * 2) / bars;
          let bar_height = frequency_array[i] * 0.5;

          let x = canvas.width / 2 + Math.cos(radians * i) * radius;
          let y = canvas.height / 2 + Math.sin(radians * i) * radius;
          let x_end =
            canvas.width / 2 + Math.cos(radians * i) * (radius + bar_height);
          let y_end =
            canvas.height / 2 + Math.sin(radians * i) * (radius + bar_height);
          let color =
            "rgb(" +
            200 +
            ", " +
            (200 - frequency_array[i]) +
            ", " +
            frequency_array[i] +
            ")";
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
