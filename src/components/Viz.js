import React, { useState, useRef, useEffect, createRef } from "react";

var currentInterpolationArray;

const Viz = ({
  audioFile,
  audioRef,
  circleProps,
  centerImageSrc,
  barColor,
  radius,
  rotation,
  barHeightMultiplier,
  baseRadiusValue,
  bounceMultiplier,
  fftSizeValue,
  smoothingTimeConstant,
  bars,
  barWidth,
  centerColor,
  canvasBackground,
}) => {
  const [audio, setAudio] = useState();
  // const [audio] = useState(new Audio(songFile));

  const [audioContext, setAudioContext] = useState();
  const [audioSource, setAudioSource] = useState();
  const [canvasContext, setCanvasContext] = useState();

  const canvasRef = createRef();
  const audioAnalyser = useRef();
  const dataArray = useRef();

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasContext(canvasRef.current.getContext("2d"));
    }
  }, [canvasRef]);

  // need to skip this if you use songFile
  // TODO: Fix this tomorrow so both functions can be used and user can choose whichever is good
  useEffect(() => {
    // if (audioFile) {
    // setAudio(new Audio(audioFile));
    // } else {
    setAudio(audioRef.current);
    // }
  }, []);

  useEffect(() => {
    setAudioContext(new AudioContext());
  }, []);

  useEffect(() => {
    if (audioSource) {
      audioSource.connect(audioAnalyser.current);
      audioAnalyser.current.connect(audioContext.destination);

      drawSpectrum();
    }
  }, [audioSource]);

  useEffect(() => {
    if (audioContext) {
      setAudioSource(audioContext.createMediaElementSource(audio));
      audioAnalyser.current = audioContext.createAnalyser();
      audioAnalyser.current.fftSize = fftSizeValue;
      audioAnalyser.current.smoothingTimeConstant = smoothingTimeConstant;
      dataArray.current = new Uint8Array(
        audioAnalyser.current.frequencyBinCount
      );
    }
  }, [audioContext]);

  // Loading Image Component
  const centerImage = new Image();
  centerImage.src = centerImageSrc;

  // Color input handling according to if one color is entered or two
  if (Object.keys(barColor).length === 1 && barColor.colorOne) {
    currentInterpolationArray = getInterpolatedArray(
      barColor.colorOne,
      barColor.colorOne,
      256
    );
  } else if (Object.keys(barColor).length === 1 && barColor.colorTwo) {
    currentInterpolationArray = getInterpolatedArray(
      barColor.colorTwo,
      barColor.colorTwo,
      256
    );
  } else if (Object.keys(barColor).length === 2) {
    currentInterpolationArray = getInterpolatedArray(
      barColor.colorOne,
      barColor.colorTwo,
      256
    );
  }

  const drawSpectrum = () => {
    var drawVisual = requestAnimationFrame(drawSpectrum);

    audioAnalyser.current.getByteFrequencyData(dataArray.current);

    canvasRef.current.width = 1000;

    canvasRef.current.height = 1000;
    canvasContext.fillStyle = canvasBackground;
    canvasContext.fillRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    // Handling Bounce
    if (bounceMultiplier) {
      const currentRMS = rms(dataArray.current);
      const workingRMS = Math.max(
        baseRadiusValue,
        baseRadiusValue + currentRMS * bounceMultiplier
      );

      var baseRadius = workingRMS;
    } else if (!bounceMultiplier) {
      baseRadius = baseRadiusValue;
    }
    radius = baseRadius;

    const imageComponent = () => {
      canvasContext.save();
      canvasContext.beginPath();
      canvasContext.arc(
        canvasRef.current.width / 2,
        canvasRef.current.height / 2,
        radius,
        0,
        2 * Math.PI
      );

      if (circleProps === false || circleProps === undefined) {
        canvasContext.strokeStyle = "white"; // color of the circle
        canvasContext.lineWidth = 1;
      } else if (circleProps) {
        canvasContext.lineWidth = circleProps.circleWidth;
        canvasContext.strokeStyle = circleProps.circleColor; // color of the circle
      }

      canvasContext.stroke();
      canvasContext.clip();

      // If an image is passed then it will be showed otherwise nothing will be showed
      if (centerImageSrc === undefined) {
        // fill the circle with one color
        canvasContext.fillStyle = centerColor;
        canvasContext.fill();
        canvasContext.stroke();
      }

      if (centerImageSrc) {
        if (rotation) {
          canvasContext.setTransform(
            1,
            0,
            0,
            1,
            canvasRef.current.width / 2,
            canvasRef.current.height / 2
          );
          canvasContext.rotate(audio.currentTime / 1);
          canvasContext.drawImage(
            centerImage,
            -radius,
            -radius,
            radius * 2, // These two tell the size of the image when we place it in the above coordinate
            radius * 2
          );

          canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        } else {
          canvasContext.drawImage(
            centerImage,

            canvasRef.current.width / 2 - radius,
            canvasRef.current.height / 2 - radius,
            radius * 2, // These two tell the size of the image when we place it in the above coordinate
            radius * 2
          );
        }
      }
      canvasContext.restore();
    };

    for (var i = 0; i < bars; i++) {
      let radians = (Math.PI * 2) / bars;
      // this defines the height of the bar
      let barHeight = dataArray.current[i] * barHeightMultiplier;

      // x and y are coordinates of where the end point of a bar any second should be
      let x = canvasRef.current.width / 2 + Math.cos(radians * i) * radius;
      let y = canvasRef.current.height / 2 + Math.sin(radians * i) * radius;
      let x_end =
        canvasRef.current.width / 2 +
        Math.cos(radians * i) * (radius + barHeight);
      let y_end =
        canvasRef.current.height / 2 +
        Math.sin(radians * i) * (radius + barHeight);

      const color = currentInterpolationArray[dataArray.current[i]];

      canvasContext.strokeStyle = color;
      canvasContext.lineWidth = barWidth;
      canvasContext.beginPath();
      canvasContext.moveTo(x, y);
      canvasContext.lineTo(x_end, y_end);
      canvasContext.stroke();
    }

    imageComponent(canvasRef.current);
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
    }
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

export default Viz;
