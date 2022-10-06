import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { rms } from "../utils/rms";
import { getInterpolatedArray } from "../utils/getInterpolatedArray ";

var currentInterpolationArray: Array<string | undefined>,
  radius: number,
  hslColor: number[],
  baseRadius: number;

interface MeloDiscProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  centerImageSrc?: string;
  rotation?: true;
  bounceMultiplier?: number;
  bars?: number;
  barWidth?: number;
  barHeightMultiplier?: number;
  barColor?: {
    colorOne?: string;
    colorTwo?: string;
    hslColor?: number[];
  };
  circleProps?: { circleWidth: number; circleColor: string };
  centerColor?: string;
  canvasBackground?: string;
  baseRadiusValue?: number;
  fftSizeValue?:
    | 32
    | 64
    | 128
    | 256
    | 512
    | 1024
    | 2048
    | 4096
    | 8192
    | 16384
    | 32768;
  smoothingTimeConstant?: number;
  canvasWidth?: number;
  canvasHeight?: number;
}

export const MeloDisc: React.FC<MeloDiscProps> = ({
  audioRef,
  centerImageSrc,
  rotation = true,
  bounceMultiplier = 1,
  bars = 200,
  barWidth = 4,
  barHeightMultiplier = 1,
  barColor,
  circleProps = { circleWidth: 4, circleColor: "black" },
  centerColor = "white",
  canvasBackground = "white",
  baseRadiusValue = 150,
  fftSizeValue = 512,
  smoothingTimeConstant = 0.8,
  canvasWidth = 1200,
  canvasHeight = 1000,
}) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>();
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [audioSource, setAudioSource] = useState<MediaElementAudioSourceNode>();
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D>();
  // const [hslColor, setHslColor] = useState()

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioAnalyser = useRef<AnalyserNode>();
  const dataArray = useRef<Uint8Array>();

  useEffect(() => {
    canvasRef.current!.width = canvasWidth;

    canvasRef.current!.height = canvasHeight;

    setCanvasContext(
      canvasRef.current!.getContext("2d") as CanvasRenderingContext2D
    );

    setAudio(audioRef.current);
    setAudioContext(new AudioContext());
  }, []);

  useEffect(() => {
    if (audioSource) {
      audioSource.connect(audioAnalyser!.current as AudioNode);
      audioAnalyser.current!.connect(audioContext!.destination);

      drawSpectrum();
    }
  }, [audioSource]);

  useEffect(() => {
    if (audioContext) {
      setAudioSource(
        audioContext.createMediaElementSource(audio as HTMLAudioElement)
      );
      audioAnalyser.current = audioContext.createAnalyser();
      audioAnalyser.current!.fftSize = fftSizeValue;
      audioAnalyser.current!.smoothingTimeConstant = smoothingTimeConstant;
      dataArray.current = new Uint8Array(
        audioAnalyser.current!.frequencyBinCount
      );
    }

    // Resumes audioContext after user gesture
    if (audio && audioContext) {
      audio.addEventListener("play", () => {
        audioContext.resume();
      });
    }
  }, [audioContext]);

  // Loading Image Component
  const centerImage = new Image();

  if (centerImageSrc) {
    centerImage.src = centerImageSrc;
  }

  useEffect(() => {
    if (barColor) {
      if (Object.keys(barColor).length === 2) {
        if (barColor.colorOne && barColor.colorTwo) {
          currentInterpolationArray = getInterpolatedArray(
            barColor.colorOne,
            barColor.colorTwo,
            256
          );
        }
      } else if (Object.keys(barColor).length === 1) {
        if (barColor.hslColor) {
          hslColor = barColor.hslColor;
        } else if (barColor.colorOne) {
          currentInterpolationArray = getInterpolatedArray(
            barColor.colorOne,
            barColor.colorOne,
            256
          );
        } else if (barColor.colorTwo) {
          currentInterpolationArray = getInterpolatedArray(
            barColor.colorTwo,
            barColor.colorTwo,
            256
          );
        } else {
          hslColor = [2, 100, 50];
        }
      }
    } else {
      hslColor = [2, 100, 50];
    }
  }, [barColor]);

  const drawSpectrum = () => {
    //
    var drawVisual = requestAnimationFrame(drawSpectrum);

    audioAnalyser.current!.getByteFrequencyData(
      dataArray.current as Uint8Array
    );

    canvasContext!.fillStyle = canvasBackground;
    canvasContext!.fillRect(
      0,
      0,
      canvasRef.current!.width,
      canvasRef.current!.height
    );

    // Handling Bounce
    if (bounceMultiplier) {
      const currentRMS = rms(dataArray.current as Uint8Array);
      const workingRMS = Math.max(
        baseRadiusValue,
        baseRadiusValue + currentRMS * bounceMultiplier
      );

      baseRadius = workingRMS;
    } else if (!bounceMultiplier) {
      baseRadius = baseRadiusValue;
    }
    radius = baseRadius;

    const imageComponent = () => {
      if (canvasContext) {
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.arc(
          canvasRef.current!.width / 2,
          canvasRef.current!.height / 2,
          radius,
          0,
          2 * Math.PI
        );

        if (circleProps === undefined) {
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
              canvasRef.current!.width / 2,
              canvasRef.current!.height / 2
            );
            canvasContext.rotate(audio!.currentTime / 1);
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

              canvasRef.current!.width / 2 - radius,
              canvasRef.current!.height / 2 - radius,
              radius * 2, // These two tell the size of the image when we place it in the above coordinate
              radius * 2
            );
          }
        }
        canvasContext.restore();
      }
    };

    for (var i = 0; i < bars; i++) {
      const radians = (Math.PI * 2) / bars;
      // this defines the height of the bar
      const barHeight = dataArray.current![i] * barHeightMultiplier;

      // x and y are coordinates of where the end point of a bar any second should be
      const x = canvasRef.current!.width / 2 + Math.cos(radians * i) * radius;
      const y = canvasRef.current!.height / 2 + Math.sin(radians * i) * radius;
      const xEnd =
        canvasRef.current!.width / 2 +
        Math.cos(radians * i) * (radius + barHeight);
      const yEnd =
        canvasRef.current!.height / 2 +
        Math.sin(radians * i) * (radius + barHeight);

      let color;

      if (currentInterpolationArray) {
        color = currentInterpolationArray[dataArray.current![i]];
      }
      if (hslColor) {
        color = `hsl(${hslColor[0] * i}, ${hslColor[1]}%, ${hslColor[2]}%)`;
      }

      if (canvasContext) {
        canvasContext.strokeStyle = color as string;
        canvasContext.lineWidth = barWidth;
        canvasContext.beginPath();
        canvasContext.moveTo(x, y);
        canvasContext.lineTo(xEnd, yEnd);
        canvasContext.stroke();
      }
    }

    imageComponent();
  };

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};
