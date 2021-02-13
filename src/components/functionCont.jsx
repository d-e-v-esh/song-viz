import React, { useState, useEffect } from "react";
import VisualDemo from "./functionViz";
// import VisualDemo from "./VisualDemo";
import soundFile from "../audio/water.mp3";

const FunctionCont = () => {
  const [audioData, setAudioData] = useState();
  const audioFile = React.useRef(new Audio());
  const frequencyBandArray = [...Array(25).keys()];

  const initializeAudioAnalyser = React.useCallback(() => {
    const audioContext = new AudioContext();
    audioFile.current.src = soundFile;
    audioFile.current.crossOrigin = "anonymous";
    const source = audioContext.createMediaElementSource(audioFile.current);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;

    source.connect(audioContext.destination);
    source.connect(analyser);

    console.log(analyser);

    setAudioData(analyser);
  }, [audioFile, setAudioData]);

  useEffect(initializeAudioAnalyser, [initializeAudioAnalyser]);

  const getFrequencyData = React.useCallback(
    (styleAdjuster) => {
      const bufferLength = audioData.frequencyBinCount;
      const amplitudeArray = new Uint8Array(bufferLength);
      audioData.getByteFrequencyData(amplitudeArray);
      styleAdjuster(amplitudeArray);
    },
    [audioData]
  );

  const toggleAudio = React.useCallback(() => {
    if (audioFile.current.paused) {
      audioFile.current.play();
    } else {
      audioFile.current.pause();
    }
  }, [audioFile]);

  return (
    <div>
      <VisualDemo
        toggleAudio={toggleAudio}
        frequencyBandArray={frequencyBandArray}
        getFrequencyData={getFrequencyData}
        // audioData={audioData}
        audioFile={audioFile}
      />
    </div>
  );
};

export default FunctionCont;
