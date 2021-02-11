import React, { useState, useEffect } from "react";
import VisualDemo from "./functionViz";
// import VisualDemo from "./VisualDemo";
import soundFile from "../audio/water.mp3";

const FunctionCont = () => {
  const [audioData, setAudioData] = useState();
  let frequencyBandArray = [...Array(25).keys()];

  useEffect(() => {
    initializeAudioAnalyser();
  }, []);

  const audioFile = new Audio();
  useEffect(() => {
    audioFile.play();
  }, []);
  const initializeAudioAnalyser = () => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audioFile);
    const analyser = audioContext.createAnalyser();
    audioFile.src = soundFile;

    analyser.fftSize = 64;

    source.connect(audioContext.destination);
    source.connect(analyser);

    setAudioData(analyser);
  };
  const getFrequencyData = (styleAdjuster) => {
    const bufferLength = audioData.frequencyBinCount;
    const amplitudeArray = new Uint8Array(bufferLength);
    audioData.getByteFrequencyData(amplitudeArray);
    styleAdjuster(amplitudeArray);
  };

  return (
    <div>
      <VisualDemo
        initializeAudioAnalyser={initializeAudioAnalyser}
        frequencyBandArray={frequencyBandArray}
        getFrequencyData={getFrequencyData}
        // audioData={audioData}
        audioFile={audioFile}
      />
    </div>
  );
};

export default FunctionCont;
