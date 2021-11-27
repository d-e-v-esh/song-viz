import React, {
  useState,
  useRef,
  useEffect,
  createRef,
  useCallback,
} from "react";
import { Canvas } from "./Canvas";
import PropTypes from "prop-types";

/*
  Currently the problems that are available is that we are getting maximum depth exceeded because of the useEffect hooks in case the default values are being used

  canvasRef.current is null on Render after a refresh.
*/

var currentInterpolationArray;

const Viz = ({
  audioRef,
  circleProps = { circleWidth: 12, circleColor: "black" },
  centerImageSrc,
  barColor = { hslColor: [2, 100, 50] },
  radius = 200,
  rotation = true,
  barHeightMultiplier = 1,
  baseRadiusValue = 200,
  bounceMultiplier = 0.5,
  fftSizeValue = 512,
  smoothingTimeConstant = 0.8,
  bars = 250,
  barWidth = 5,
  centerColor = "white",
  canvasBackground = "black",
}) => {
  const [audio, setAudio] = useState();
  const [audioContext, setAudioContext] = useState();
  const [audioSource, setAudioSource] = useState();
  const [canvasContext, setCanvasContext] = useState();
  const [hslColor, setHslColor] = useState();

  const canvasRef = useRef(null);
  const audioAnalyser = useRef();
  const dataArray = useRef();

  useEffect(() => {
    canvasRef.current.width = 1000;

    canvasRef.current.height = 1000;

    setCanvasContext(canvasRef.current.getContext("2d"));
    console.log("1");

    setAudio(audioRef.current);
    setAudioContext(new AudioContext());
  }, []);

  useEffect(() => {
    if (audioSource) {
      audioSource.connect(audioAnalyser.current);
      audioAnalyser.current.connect(audioContext.destination);

      console.log("2");
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
    //
    console.log(typeof audio);
  }, [audioContext]);

  // Loading Image Component
  const centerImage = new Image();
  centerImage.src = centerImageSrc;

  useEffect(() => {
    switch (Object.keys(barColor).length) {
      case 1:
        if (barColor.colorOne) {
          currentInterpolationArray = getInterpolatedArray(
            barColor.colorOne,
            barColor.colorOne,
            256
          );
        }
        if (barColor.colorTwo) {
          currentInterpolationArray = getInterpolatedArray(
            barColor.colorTwo,
            barColor.colorTwo,
            256
          );
        }
        if (barColor.hslColor) {
          setHslColor(barColor.hslColor);
        }
        break;
      case 2:
        if (barColor.colorOne && barColor.colorTwo) {
          currentInterpolationArray = getInterpolatedArray(
            barColor.colorOne,
            barColor.colorTwo,
            256
          );
        }
        break;
      default:
        currentInterpolationArray = getInterpolatedArray(
          "rgb(0,0,0)",
          "rgb(255,255,255)",
          256
        );
    }
  }, [barColor]);

  // if (Object.keys(barColor).length === 1 && barColor.colorOne) {
  // } else if (Object.keys(barColor).length === 1 && barColor.colorTwo) {
  //   currentInterpolationArray = getInterpolatedArray(
  //     barColor.colorTwo,
  //     barColor.colorTwo,
  //     256
  //   );
  // } else if (Object.keys(barColor).length === 2) {
  //   currentInterpolationArray = getInterpolatedArray(
  //     barColor.colorOne,
  //     barColor.colorTwo,
  //     256
  //   );
  // }

  const drawSpectrum = () => {
    //
    var drawVisual = requestAnimationFrame(drawSpectrum);

    audioAnalyser.current.getByteFrequencyData(dataArray.current);

    // canvasRef.current.width = 1000;

    // canvasRef.current.height = 1000;
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

      if (centerImageSrc === undefined) {
        // If image is not provided then the center circle will be filled up with one Color
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
            radius * 2,
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

      // const color = `hsl(${i}, 100%,  50%)`;
      // /
      let color;

      if (hslColor) {
        color = `hsl(${hslColor[0] * i}, ${hslColor[1]}%, ${hslColor[2]}%)`;
        // console.log(color);
      } else {
        // console.log(color);

        color = currentInterpolationArray[dataArray.current[i]];
      }

      // color = currentInterpolationArray[dataArray.current[i]];
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
      {/* <Canvas ref={canvasRef} height={720} maxWidth={1280} /> */}
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

Viz.propTypes = {
  audioRef: PropTypes.object.isRequired,
  circleProps: PropTypes.shape({
    circleWidth: PropTypes.number,
    circleColor: PropTypes.string,
  }),
  centerImageSrc: PropTypes.string,
  barColor: PropTypes.shape({
    colorTwo: PropTypes.string,
    colorOne: PropTypes.string,

    hslColor: PropTypes.arrayOf(PropTypes.number),
  }),
  radius: PropTypes.number,
  rotation: PropTypes.bool,
  barHeightMultiplier: PropTypes.number,
  baseRadiusValue: PropTypes.number,
  bounceMultiplier: PropTypes.number,
  fftSizeValue: PropTypes.number,
  smoothingTimeConstant: PropTypes.number,
  bars: PropTypes.number,
  barWidth: PropTypes.number,
  centerColor: PropTypes.string,
  canvasBackground: PropTypes.string,
};

export default Viz;
