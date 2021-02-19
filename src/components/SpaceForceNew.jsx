// Next goal is to make things modular and make use of the helper function
import React, { useEffect, createRef } from "react";
import songFile from "../audio/water.mp3";

// Changing Variables
let ctx, x_end, y_end, bar_height, rafId;

// constants
const width = window.innerWidth;
const height = window.innerHeight;
const bars = 64;
const bar_width = 15;
const fftSize = 1024;

const NewSpaceForce = () => {
  const audio = new Audio(songFile);
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const canvas = createRef();
  const analyser = context.createAnalyser();
  // 1024 seems the best yet for fftSize
  analyser.fftSize = fftSize;
  const frequency_array = new Uint8Array(analyser.frequencyBinCount);
  useEffect(() => {
    console.log("component will mount executed");
    const source = context.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(context.destination);
  }, []);

  const rms = (input) => {
    var sum = 0;
    for (var i = 0; i < input.length; i++) {
      sum += input[i] * input[i];
    }
    return Math.sqrt(sum / input.length);
  };
  const dataArray = new Uint8Array(analyser.fftSize); // Uint8Array should be the same length as the fftSize
  analyser.getByteTimeDomainData(dataArray);

  const loudness = 10;

  const animationLooper = (canvas) => {
    canvas.width = width;

    console.log(rms(frequency_array));
    canvas.height = height;
    const baseRadius = 50;
    // const radius = baseRadius * loudness;
    const radius = baseRadius + rms(frequency_array);

    ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
    ctx.stroke();

    analyser.getByteFrequencyData(frequency_array);
    // The average value here is just used to make the color of the bars and text react to the music
    const avg =
      [...Array(255).keys()].reduce(
        (acc, curr) => acc + frequency_array[curr],
        0
      ) / 255;

    for (var i = 0; i < bars; i++) {
      let radians = (Math.PI * 2) / bars;
      // this defines the height of the bar
      let bar_height = frequency_array[i] * 1;

      // x and y are coordinates of where the end point of a bar any second should be
      let x = canvas.width / 2 + Math.cos(radians * i) * radius;
      let y = canvas.height / 2 + Math.sin(radians * i) * radius;
      let x_end =
        canvas.width / 2 + Math.cos(radians * i) * (radius + bar_height);
      let y_end =
        canvas.height / 2 + Math.sin(radians * i) * (radius + bar_height);

      let color = "#FF69B4";
      ctx.strokeStyle = color;
      ctx.lineWidth = bar_width;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x_end, y_end);
      ctx.stroke();
    }
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

export default NewSpaceForce;
