// Next goal is to make things modular and make use of the helper function
import React, { useEffect, createRef } from "react";
import songFile from "../audio/water.wav";
import rms from "../utils/RMS";
import kshmr from "../img/kshmrOneMoreRound.jpg";
// Changing Variables
let ctx, rafId;

// TODO: need to change this
const width = window.innerWidth;
const height = window.innerHeight;
// const barColor = "red";
// const bar_width = 2;
const bounce = true;
const rootLineVisible = true;
const colorReact = true;
const NewSpaceForce = ({
  bars,
  bar_width,
  fftSizeValue,
  barColor,
  baseRadiusValue,
  RMSMultiplier,
  barHeightValue,
}) => {
  // Setting default props
  const oneMoreRound = new Image(200, 200); // Image constructor
  oneMoreRound.src = kshmr;
  // console.log(kshmr);
  const audio = new Audio(songFile);
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const canvas = createRef();
  const analyser = context.createAnalyser();
  analyser.fftSize = fftSizeValue; // This is the default anyway
  const bufferLength = analyser.frequencyBinCount;
  const frequency_array = new Uint8Array(bufferLength);

  useEffect(() => {
    const source = context.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(context.destination);
  }, []);

  const animationLooper = (canvas) => {
    ctx = canvas.getContext("2d");
    // analyser.getByteTimeDomainData(frequency_array);
    analyser.getByteFrequencyData(frequency_array);
    // console.log(frequency_array);
    canvas.width = width;
    canvas.height = height;

    let radius, color;
    if (bounce) {
      const currentRMS = rms(frequency_array);
      const workingRMS = Math.max(
        baseRadiusValue,
        baseRadiusValue + currentRMS * RMSMultiplier
      );

      var baseRadius = workingRMS;
    } else if (!bounce) {
      baseRadius = baseRadiusValue;
    }
    radius = baseRadius;
    // console.log(workingRMS, currentRMS);
    const makeRootLineVisible = (ctx) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
      // ctx.drawImage(kshmr, 10, 10);
      ctx.strokeStyle = "#2465D3"; // color of the circle
      ctx.stroke();
      ctx.clip();
      // 1000 here can be radius * 2
      ctx.drawImage(
        oneMoreRound,
        canvas.width / 2 - radius,
        canvas.height / 2 - radius,
        radius * 2,
        radius * 2
      );
      ctx.restore();
      // this is just to fill the circle with a color
      // ctx.fillStyle = "red";
      // ctx.fill();
      ctx.stroke();
    };
    if (rootLineVisible) {
      makeRootLineVisible(ctx);
      // console.log(ctx);
    }
    // The average value here is just used to make the color of the bars and text react to the music
    // const avg =
    //   [...Array(255).keys()].reduce(
    //     (acc, curr) => acc + frequency_array[curr],
    //     0
    //   ) / 255;

    for (var i = 0; i < bars; i++) {
      let radians = (Math.PI * 2) / bars;
      // this defines the height of the bar
      let bar_height = frequency_array[i] * barHeightValue;

      // x and y are coordinates of where the end point of a bar any second should be
      let x = canvas.width / 2 + Math.cos(radians * i) * radius;
      let y = canvas.height / 2 + Math.sin(radians * i) * radius;
      let x_end =
        canvas.width / 2 + Math.cos(radians * i) * (radius + bar_height);
      let y_end =
        canvas.height / 2 + Math.sin(radians * i) * (radius + bar_height);

      if (colorReact) {
        color =
          "rgb(" +
          200 +
          ", " +
          (200 - frequency_array[i]) +
          ", " +
          frequency_array[i] +
          ")";
      } else if (!colorReact) {
        color = barColor;
      }

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
      {/* <img src={oneMoreRound} alt="Logo" />
       */}
    </>
  );
};

export default NewSpaceForce;
