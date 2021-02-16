import React, { useState, useEffect } from "react";
import VisualDemo from "./functionViz";
// import VisualDemo from "./VisualDemo";
import soundFile from "../audio/water.mp3";

const FunctionCont = () => {
  const [audioData, setAudioData] = useState();
  const audioFile = React.useRef(new Audio());

  // This is just the number of bars that would appear when we run the app => 25
  const frequencyBandArray = [...Array(40).keys()];

  const initializeAudioAnalyser = React.useCallback(() => {
    const audioContext = new AudioContext();
    audioFile.current.src = soundFile;
    audioFile.current.crossOrigin = "anonymous";
    // source is the source of the audio that will be played
    // here we connect the "water" audio file to the source
    const source = audioContext.createMediaElementSource(audioFile.current);
    // Here we create an analyzer
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;

    // connecting to the destination => connecting to the output (speakers)
    source.connect(audioContext.destination);
    // then we connect it to the analyzer

    // Then we connect the analyzerNode to the context so that everything that comes out of the source gets analyzed
    source.connect(analyser);

    console.log(analyser);
    // We set the analyzer to the state audioData
    setAudioData(analyser);
  }, [audioFile, setAudioData]);

  useEffect(initializeAudioAnalyser, [initializeAudioAnalyser]);

  // This function is being run to get every frame
  const getFrequencyData = React.useCallback(
    (styleAdjuster) =>  
      const bufferLength = audioData.frequencyBinCount;
      // frequency band array contains all the current frequencies for the audio
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
