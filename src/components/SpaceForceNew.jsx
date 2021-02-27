import React, { useEffect, createRef, useState } from "react";

import rms from "../utils/RMS";
// Changing Variables
let ctx, rafId;
// TODO: need to change this
const width = window.innerWidth;
const height = window.innerHeight;
const NewSpaceForce = ({
  bars,
  barDimensions,
  fftSizeValue,
  barColor,
  baseRadiusValue,
  centerImageSrc,
  bounceMultiplier,
  circProperties,
  audioSrc,
}) => {
  let bounce, RMSMultiplier, circWidth, circColor;
  const songFile = audioSrc;

  const [isPlaying, setIsPlaying] = useState(false);
  // TODO: Add type checking for the props

  // Setting bar dimensions
  const barWidth = barDimensions[0];
  const barHeightMultiplier = barDimensions[1];

  // Setting bounce and RMS
  if (bounceMultiplier) {
    bounce = true;
    RMSMultiplier = bounceMultiplier;
  }

  // Setting Circumference properties
  if (circProperties) {
    circWidth = circProperties[0];
    circColor = circProperties[1];
  }

  if (fftSizeValue === undefined) {
    fftSizeValue = 2048;
  }
  // Setting default prop values

  // if (bars === undefined) {
  //   bars = 600;
  // }

  // console.log(bars)
  // if (barWidth === undefined) {
  //   barWidth = 5;
  // }
  // if (barColor === undefined) {
  //   barColor = "lightpink";
  // }
  // if (baseRadiusValue === undefined) {
  //   baseRadiusValue = 100;
  // }
  // if (RMSMultiplier === undefined) {
  //   RMSMultiplier = 1;
  // }
  // if (barHeightMultiplier === undefined) {
  //   barHeightMultiplier = 1;
  // }
  // if (bounce === undefined) {
  //   bounce = true;
  // }

  // Loading Image Component
  const centerImage = new Image();
  centerImage.src = centerImageSrc;
  // Managing Audio
  const audio = new Audio(songFile); // Loading audio file
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // Creating audio Context
  const canvas = createRef();
  const analyser = audioCtx.createAnalyser(); // Creating Analyser Node
  analyser.fftSize = fftSizeValue;
  // analyser.smoothingTimeConstant = 0.9; // default is 0.8
  const bufferLength = analyser.frequencyBinCount;
  const frequency_array = new Uint8Array(bufferLength);

  useEffect(() => {
    const source = audioCtx.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }, []);

  const animationLooper = (canvas) => {
    ctx = canvas.getContext("2d");
    analyser.getByteFrequencyData(frequency_array);
    canvas.width = width;
    canvas.height = height;

    let radius, color;

    // Handling Bounce Prop
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

    const imageComponent = (ctx) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
      ctx.lineWidth = 40; // width of the baseline

      if (circProperties === false || circProperties === undefined) {
        ctx.strokeStyle = "white"; // color of the circle
        ctx.lineWidth = 1;
      } else if (circProperties) {
        ctx.lineWidth = circWidth;
        ctx.strokeStyle = circColor; // color of the circle
      }

      ctx.stroke();
      ctx.clip();

      // If an image is passed then it will be showed otherwise nothing will be showed
      // There is a better way to do this (truthy and falsy)
      if (centerImageSrc === undefined) {
      }
      if (centerImageSrc) {
        // Rotation would probably happen from changing the second and third values
        ctx.drawImage(
          centerImage,
          canvas.width / 2 - radius,
          canvas.height / 2 - radius,
          radius * 2,
          radius * 2
        );
      }

      ctx.restore();
      // this is just to fill the circle with a color
      // ctx.fillStyle = "red";
      // ctx.fill();
      // ctx.stroke();
      ctx.rotate((20 * Math.PI) / 180);
    };
    // Find a better way to call this function
    const avg =
      [...Array(255).keys()].reduce(
        (acc, curr) => acc + frequency_array[curr],
        0
      ) / 255;

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

      // if (colorReact) {
      //   color =
      //     "rgb(" +
      //     40 +
      //     ", " +
      //     (avg / 10 - frequency_array[i]) +
      //     ", " +
      //     frequency_array[i] +
      //     ")";
      // } else if (!colorReact) {
      // color = barColor;
      // }

      color = barColor;
      ctx.strokeStyle = color;
      ctx.lineWidth = barWidth;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x_end, y_end);
      ctx.stroke();
    }
    // imageComponent is called here so that the border layer is above the bar layer
    imageComponent(ctx);
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

// RMSMultiplier and bounce can be combined into bounceMultiplier. If this prop is passed then it is true itself. It can take a second value that can define the frequency range that the RMS should react to.
//-------------------------
// We need a useState hook setting the play and paused state with true and false and shift the app dependency from audio playing and pausing to hook being true and false
// Will try making caps for better effects in the next version.
