import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  createRef,
  useMemo,
} from "react";

// import songFile from "../water.wav";

let rafId;
let bars = 500;
let barHeightMultiplier = 1;
let barWidth = 2;
var drawVisual;
let radius = 200;

const Viz = ({ songFile, audioRef }) => {
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
      console.log(audioSource);
      console.log(audioContext);
      console.log(audioAnalyser);

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

  const drawSpectrum = () => {
    console.log(audio.currentTime);
    drawVisual = requestAnimationFrame(drawSpectrum);

    audioAnalyser.current.getByteFrequencyData(dataArray.current);

    canvasRef.current.width = 1000;

    canvasRef.current.height = 1000;

    for (var i = 0; i < bars; i++) {
      let radians = (Math.PI * 2) / bars;
      // this defines the height of the bar
      let barHeight = dataArray.current[i] * barHeightMultiplier;
      // console.log({ barHeight });

      // x and y are coordinates of where the end point of a bar any second should be
      let x = canvasRef.current.width / 2 + Math.cos(radians * i) * radius;
      let y = canvasRef.current.height / 2 + Math.sin(radians * i) * radius;
      let x_end =
        canvasRef.current.width / 2 +
        Math.cos(radians * i) * (radius + barHeight);
      let y_end =
        canvasRef.current.height / 2 +
        Math.sin(radians * i) * (radius + barHeight);

      canvasContext.strokeStyle = "red";
      canvasContext.lineWidth = barWidth;
      canvasContext.beginPath();
      canvasContext.moveTo(x, y);
      canvasContext.lineTo(x_end, y_end);
      canvasContext.stroke();
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Viz;
