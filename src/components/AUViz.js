import { Divider } from "@material-ui/core";
import { plugins } from "pretty-format";
import React, { useEffect, createRef } from "react";
// Changing Variables
let canvasContext, rafId;

const AUViz = ({
  canvasWidth,
  canvasHeight,
  bars,
  barDimensions,
  fftSizeValue,
  barColor,
  baseRadiusValue,
  centerImageSrc,
  bounceMultiplier,
  circProperties,
  audioElement,
  audioId,
}) => {
  // audioElement is something that we can either pass in directly or we can extract from the passed in audioId
  // audioElement = new Audio(songFile)

  let bounce,
    RMSMultiplier,
    circWidth,
    circColor,
    color,
    mediaElementSource,
    analyser,
    audioContext;

  useEffect(() => {
    prepareAudioSource();
    prepareAPIs();
    prepareAudioNode();
    // drawVisualizer();
  }, []);

  const barWidth = barDimensions.width;
  const barHeightMultiplier = barDimensions.heightMultiplier;

  let isPlaying = false;
  var currentInterpolationArray;

  const canvasRef = createRef(null);

  const prepareAudioSource = () => {
    if (!audioId && !audioElement) {
      console.log("target audio not found!");
      return;
    } else if (audioId) {
      audioElement = document.getElementById(audioId);
    }
  };

  // const pauseAndPlayHandler = () => {
  audioElement.onpause = () => {
    isPlaying = false;
    console.log({ isPlaying });
  };
  audioElement.onplay = () => {
    isPlaying = true;
    console.log({ isPlaying });
    // prepareAudioNode();
    drawVisualizer();
  };
  // };

  // Color input handling according to if one color is entered or two

  if (Object.keys(barColor).length === 1 && barColor.colorOne) {
    currentInterpolationArray = getInterpolatedArray(
      barColor.colorOne,
      barColor.colorOne,
      255
    );
  } else if (Object.keys(barColor).length === 1 && barColor.colorTwo) {
    currentInterpolationArray = getInterpolatedArray(
      barColor.colorTwo,
      barColor.colorTwo,
      255
    );
  } else if (Object.keys(barColor).length === 2) {
    currentInterpolationArray = getInterpolatedArray(
      barColor.colorOne,
      barColor.colorTwo,
      255
    );
  }

  const centerImage = new Image();
  centerImage.src = centerImageSrc;

  const prepareAudioNode = () => {
    if (!analyser) {
      analyser = audioContext.createAnalyser();
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 2048;
      analyser.connect(audioContext.destination);
    }
    if (!mediaElementSource) {
      // mediaElementSource = audioContext.createMediaElementSource(audioElement);
      // mediaElementSource.connect(audioContext.destination);
      // mediaElementSource.connect(analyser);
    }
  };

  const prepareAPIs = () => {
    // fix browser vender for AudioContext and requestAnimationFrame
    window.AudioContext =
      window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.msAudioContext;
    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame;
    window.cancelAnimationFrame =
      window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.msCancelAnimationFrame;
    try {
      audioContext = new window.AudioContext(); // 1.set audioContext
    } catch (e) {
      // console.error('!Your browser does not support AudioContext')
      console.log(e);
    }
  };

  const drawVisualizer = () => {
    const canvas = canvasRef.current;

    const bufferLength = analyser.frequencyBinCount;
    const frequency_array = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(frequency_array);
    canvasContext = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Handling Bounce
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

    let radius = baseRadius;
    const imageComponent = (ctx) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);

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
        // do nothing
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
      // this is just to fill the whole circle with a single color
      // ctx.fillStyle = "red";
      // ctx.fill();
      // ctx.stroke();
      ctx.rotate((20 * Math.PI) / 180);
    };

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

      color = currentInterpolationArray[frequency_array[i]];

      canvasContext.strokeStyle = color;
      canvasContext.lineWidth = barWidth;
      canvasContext.beginPath();
      canvasContext.moveTo(x, y);
      canvasContext.lineTo(x_end, y_end);
      canvasContext.stroke();
    }
    // imageComponent is called here so that the border layer is above the bar layer
    imageComponent(canvasContext);

    canvasContext.fillStyle = "green";
    canvasContext.fillRect(10, 10, 150, 100);
    console.log(frequency_array);
  };

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

const rms = (args) => {
  var rms = 0;
  for (var i = 0; i < args.length; i++) {
    rms += Math.pow(args[i], 2);
  }

  rms = rms / args.length;
  rms = Math.sqrt(rms);

  return rms;
};

const getInterpolatedArray = (firstColor, secondColor, noOfSteps) => {
  // Returns a single rgb color interpolation between given rgb color
  function interpolateColor(color1, color2, factor) {
    // if we don't pass in factor then set default value
    if (arguments.length < 3) {
      factor = 0.5;
    }
    var result = color1.slice();
    for (var i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
      var resultRGB = `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
      // console.log(result, "this is result");
    }
    // console.log(resultRGB, "this is result");
    return resultRGB;
  }
  // function to interpolate between two colors completely, returning an array
  const interpolateColors = (color1, color2, steps) => {
    var stepFactor = 1 / (steps - 1),
      interpolatedColorArray = [];
    color1 = color1.match(/\d+/g).map(Number);
    color2 = color2.match(/\d+/g).map(Number);

    for (var i = 0; i < steps; i++) {
      interpolatedColorArray.push(
        interpolateColor(color1, color2, stepFactor * i)
      );
    }
    return interpolatedColorArray;
  };
  return interpolateColors(firstColor, secondColor, noOfSteps);
};

export default AUViz;
