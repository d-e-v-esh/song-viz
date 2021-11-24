import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  createRef,
  useMemo,
} from "react";

let bars = 500;
let barHeightMultiplier = 1;
let barWidth = 4;
var drawVisual;
var currentInterpolationArray;
let radius = 200;
let baseRadiusValue = 100;
let bounceMultiplier = 0.5;

const Viz = ({ songFile, audioRef, circleProps, centerImageSrc, barColor }) => {
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
  useEffect(() => {
    setAudio(audioRef.current);
  }, []);

  useEffect(() => {
    setAudioContext(new AudioContext());
  }, []);

  useEffect(() => {
    if (audioSource) {
      // console.log(audioSource);
      // console.log(audioContext);
      // console.log(audioAnalyser);

      audioSource.connect(audioAnalyser.current);
      audioAnalyser.current.connect(audioContext.destination);

      drawSpectrum();
    }
  }, [audioSource]);

  useEffect(() => {
    if (audioContext) {
      setAudioSource(audioContext.createMediaElementSource(audio));
      audioAnalyser.current = audioContext.createAnalyser();
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

  const drawSpectrum = () => {
    console.log(audio.currentTime);
    drawVisual = requestAnimationFrame(drawSpectrum);

    audioAnalyser.current.getByteFrequencyData(dataArray.current);

    canvasRef.current.width = 1000;

    canvasRef.current.height = 1000;

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
      // There is a better way to do this (truthy and falsy)
      if (centerImageSrc === undefined) {
        // do nothing
      }

      if (centerImageSrc) {
        // Rotation would probably happen from changing the second and third values
        canvasContext.drawImage(
          centerImage,
          canvasRef.current.width / 2 - radius,
          canvasRef.current.height / 2 - radius,
          radius * 2,
          radius * 2
        );
      }
      canvasContext.restore();
      // this is just to fill the whole circle with a single color
      // ctx.fillStyle = "red";
      // ctx.fill();
      // ctx.stroke();
      canvasContext.rotate((20 * Math.PI) / 180);
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

      canvasContext.strokeStyle =
        currentInterpolationArray[dataArray.current[i]];
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

export default Viz;
