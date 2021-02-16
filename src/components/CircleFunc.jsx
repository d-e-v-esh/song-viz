import React, { useEffect, createRef } from "react";
import songFile from "../audio/water.mp3";

// Changing Variables
let ctx, x_end, y_end, bar_height, rafId;

// constants
const width = window.innerWidth;
const height = window.innerHeight;
const bars = 555;
const bar_width = 1;
const radius = 0;
const center_x = width / 2;
const center_y = height / 2;

const CircleFunc = () => {
  const audio = new Audio(songFile);
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const canvas = createRef();
  const analyser = context.createAnalyser();
  const frequency_array = new Uint8Array(analyser.frequencyBinCount);
  useEffect(() => {
    console.log("component will mount executed");
    const source = context.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(context.destination);
  }, []);

  const animationLooper = (canvas) => {
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");

    for (var i = 0; i < bars; i++) {
      //divide a circle into equal part
      const rads = (Math.PI * 2) / bars;

      // Math is magical
      bar_height = frequency_array[i] * 2;

      const x = center_x + Math.cos(rads * i) * radius;
      const y = center_y + Math.sin(rads * i) * radius;
      x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
      y_end = center_y + Math.sin(rads * i) * (radius + bar_height);

      //draw a bar
      drawBar(x, y, x_end, y_end, frequency_array[i], ctx, canvas);
    }
  };

  const drawBar = (x1 = 0, y1 = 0, x2 = 0, y2 = 0, frequency, ctx, canvas) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(35, 7, 77, 1)");
    gradient.addColorStop(1, "rgba(204, 83, 51, 1)");
    ctx.fillStyle = gradient;

    const lineColor = "rgb(" + frequency + ", " + frequency + ", " + 205 + ")";
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = bar_width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const togglePlay = () => {
    if (audio.paused) {
      audio.play();
      rafId = requestAnimationFrame(tick);
    } else {
      audio.pause();
      cancelAnimationFrame(rafId);
    }
  };

  const tick = () => {
    animationLooper(canvas.current);
    analyser.getByteTimeDomainData(frequency_array);
    rafId = requestAnimationFrame(tick);
  };

  return (
    <>
      <button onClick={togglePlay}>Play/Pause</button>
      <canvas ref={canvas} />
    </>
  );
};

export default CircleFunc;
