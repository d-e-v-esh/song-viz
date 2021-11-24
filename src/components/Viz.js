import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  createRef,
} from "react";

import songFile from "../water.mp3";

const Viz = () => {
  let rafId;
  let bars = 100;
  let barHeightMultiplier = 2;
  let barWidth = 10;

  let radius = 200;
  const canvasRef = createRef();

  const audio = new Audio(songFile);
  const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Creating audio Context
  const analyser = audioContext.createAnalyser(); // Creating Analyser Node
  analyser.smoothingTimeConstant = 0.9; //
  const bufferLength = analyser.frequencyBinCount;
  const frequency_array = new Uint8Array(bufferLength);

  useEffect(() => {
    const source = audioContext.createMediaElementSource(audio);

    togglePlay();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
  }, []);

  const drawSpectrum = (canvas) => {
    const canvasContext = canvas.getContext("2d");

    analyser.getByteFrequencyData(frequency_array);
    canvas.width = 1000;
    canvas.height = 1000;

    for (var i = 0; i < bars; i++) {
      let radians = (Math.PI * 2) / bars;
      // this defines the height of the bar
      let barHeight = frequency_array[i] * barHeightMultiplier;

      // x and y are coordinates of where the end point of a bar any second should be
      let x = canvas.width / 2 + Math.cos(radians * i) * radius;
      let y = canvas.height / 2 + Math.sin(radians * i) * radius;
      let x_end =
        canvas.width / 2 + Math.cos(radians * i) * (radius + barHeight);
      let y_end =
        canvas.height / 2 + Math.sin(radians * i) * (radius + barHeight);

      canvasContext.strokeStyle = "red";
      canvasContext.lineWidth = barWidth;
      canvasContext.beginPath();
      canvasContext.moveTo(x, y);
      canvasContext.lineTo(x_end, y_end);
      canvasContext.stroke();
    }
  };

  const tick = () => {
    drawSpectrum(canvasRef.current);
    analyser.getByteTimeDomainData(frequency_array);
    rafId = requestAnimationFrame(tick);
  };

  const togglePlay = () => {
    console.log(audio.paused);
    if (audio.paused) {
      audio.play();
      rafId = requestAnimationFrame(tick);
    } else {
      audio.pause();
      cancelAnimationFrame(rafId);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} />
      <button onClick={togglePlay}>asdfasdf</button>
    </div>
  );
};

export default Viz;
