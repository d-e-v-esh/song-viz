import React from "react";
import VisualDemo from "./VisualDemo";
import soundFile from "../audio/water.mp3";

class ContainerMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.frequencyBandArray = [...Array(25).keys()];
  }

  initializeAudioAnalyser = () => {
    const audioFile = new Audio();
    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audioFile);
    const analyser = audioContext.createAnalyser();
    audioFile.src = soundFile;
    // fftSize is how many different frequencies you want to control
    //  A higher value will result in more details in the frequency domain but fewer details in the time domain.
    analyser.fftSize = 64;

    source.connect(audioContext.destination);
    source.connect(analyser);
    audioFile.play();
    this.setState({
      audioData: analyser,
    });
  };

  getFrequencyData = (styleAdjuster) => {
    const bufferLength = this.state.audioData.frequencyBinCount;
    const amplitudeArray = new Uint8Array(bufferLength);
    this.state.audioData.getByteFrequencyData(amplitudeArray);
    styleAdjuster(amplitudeArray);
  };

  render() {
    return (
      <div>
        <VisualDemo
          initializeAudioAnalyser={this.initializeAudioAnalyser}
          frequencyBandArray={this.frequencyBandArray}
          getFrequencyData={this.getFrequencyData}
          audioData={this.state.audioData}
        />
      </div>
    );
  }
}

export default ContainerMain;
