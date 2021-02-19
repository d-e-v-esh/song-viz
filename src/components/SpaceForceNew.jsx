// Next goal is to make things modular and make use of the helper function
import React, { useEffect, createRef } from "react";
import songFile from "../audio/water.mp3";
import { getPoints } from "../utils/helper";

// Changing Variables
let ctx, x_end, y_end, bar_height, rafId;

// constants
const width = window.innerWidth;
const height = window.innerHeight;
const bars = 64;
const radius = 50;
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
  // let points = getPoints(
  //   "circle",
  //   height / 2,
  //   [width / 2, height / 2],
  //   frequency_array.length,
  //   frequency_array,
  //   { offset: 35, rotate: 270 }
  // );

  // Shape => circle
  // size => height/2 => the viz will take half the screen
  // originX, originY => [width / 2, height / 2], => The origin of the circle would be in the middle of the screen
  // pointCount => data.length, => Point count would be the number of elements in our data array
  // endPoints => data
  // options ={} => { offset: 35, rotate: 270 }

  const animationLooper = (canvas) => {
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");

    // This makes the background black
    // ctx.fillStyle = "black";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    // This makes the inner circle (is not visible on black background)

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

    // This is text styling
    // ctx.font = "500 24px Helvetica Neue";
    // ctx.fillStyle = "rgb(" + 50 + ", " + (200 - avg) + ", " + avg + ")";
    // ctx.textAlign = "center";
    // ctx.textBaseline = "top";
    // ctx.fillText("SPACE", canvas.width / 2, canvas.height / 2 - 24);
    // ctx.fillText("FORCE", canvas.width / 2, canvas.height / 2 + 6);

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
      // let color =
      //   "rgb(" +
      //   200 +
      //   ", " +
      //   (200 - frequency_array[i]) +
      //   ", " +
      //   frequency_array[i] +
      //   ")";
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
