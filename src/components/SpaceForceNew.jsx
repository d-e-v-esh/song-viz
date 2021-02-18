import React, { useEffect, createRef } from "react";
import songFile from "../audio/water.mp3";

// Changing Variables
let ctx, x_end, y_end, bar_height, rafId;

// constants
const width = window.innerWidth;
const height = window.innerHeight;
const bars = 100;
const bar_width = 1;
const radius = 75;
const center_x = width / 2;
const center_y = height / 2;

const NewSpaceForce = () => {
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
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
    ctx.stroke();
    analyser.getByteFrequencyData(frequency_array);
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
  };

  // function draw() {

  //   // Draw Background

  //   // Draw circle

  //   // Draw label

  //   // Draw bars

  //   requestAnimationFrame(draw);
  // }

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

export default NewSpaceForce;
