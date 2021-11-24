import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  createRef,
  useMemo,
} from "react";

import songFile from "../water.wav";

let rafId;
let bars = 500;
let barHeightMultiplier = 2;
let barWidth = 2;
var drawVisual;
let radius = 200;

const Viz = () => {
  const audio = useMemo(() => {
    return new Audio(songFile);
  });
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

      audioAnalyser.current.getFloatFrequencyData(dataArray.current);

      console.log(dataArray.current);

      // audioSource.start(0);
      drawSpectrum();
      // audio.play();
    }

    // togglePlay();
  }, [audioSource]);

  useEffect(() => {
    if (audioContext) {
      setAudioSource(audioContext.createMediaElementSource(audio));

      audioAnalyser.current = audioContext.createAnalyser();
      dataArray.current = new Float32Array(
        audioAnalyser.current.frequencyBinCount
      );
      audio.play();
    }
  }, [audioContext]);

  useEffect(() => {
    console.log(dataArray);
  }, [dataArray.current]);

  const drawSpectrum = () => {
    drawVisual = requestAnimationFrame(drawSpectrum);

    // audioAnalyser.current.getByteFrequencyData(dataArray.current);

    // console.log(audioAnalyser.current);
    audioAnalyser.current.getFloatFrequencyData(dataArray.current);

    // analyser.getFloatFrequencyData(dataArray.current);

    canvasRef.current.width = 1000;

    canvasRef.current.height = 1000;
    // console.log(canvasRef.current);

    canvasContext.beginPath();
    canvasContext.rect(40, 40, 150, 100);

    canvasContext.fillStyle = "green";

    canvasContext.fill();

    for (var i = 0; i < bars; i++) {
      let radians = (Math.PI * 2) / bars;
      // this defines the height of the bar
      let barHeight = dataArray.current[i] * barHeightMultiplier + 100;
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

  // const tick = () => {
  //   drawSpectrum();
  //   audioAnalyser.current.getByteTimeDomainData(dataArray.current);
  //   rafId = requestAnimationFrame(tick);
  // };

  // const togglePlay = () => {
  //   console.log(audio.paused);
  //   if (audio.paused) {
  //     audio.play();
  //     rafId = requestAnimationFrame(tick);
  //   } else {
  //     audio.pause();
  //     cancelAnimationFrame(rafId);
  //   }
  // };

  return (
    <div>
      <canvas ref={canvasRef} />
      {/* <button onClick={togglePlay}>asdfasdf</button> */}
    </div>
  );
};

export default Viz;
