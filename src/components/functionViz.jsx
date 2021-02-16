import React, { useRef } from "react";

const VisualDemo = ({ toggleAudio, frequencyBandArray, getFrequencyData }) => {
  const canvas = useRef(null);
  const amplitudeValues = useRef(null);
  // constants
  const width = window.innerWidth;
  const height = window.innerHeight;
  const bars = 555;
  const bar_width = 1;
  const radius = 0;
  const center_x = width / 2;
  const center_y = height / 2;

  let ctx, x_end, y_end, bar_height;

  const animationLooper = (canvas) => {
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");

    for (var i = 0; i < bars; i++) {
      //divide a circle into equal part
      const rads = (Math.PI * 2) / bars;

      // Math is magical
      bar_height = this.frequency_array[i] * 2;

      const x = center_x + Math.cos(rads * i) * radius;
      const y = center_y + Math.sin(rads * i) * radius;
      x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
      y_end = center_y + Math.sin(rads * i) * (radius + bar_height);

      //draw a bar
      this.drawBar(x, y, x_end, y_end, this.frequency_array[i], ctx, canvas);
    }
  };
  // const runSpectrum = React.useCallback(() => {
  // getFrequencyData(loopSpectrum);
  //   requestAnimationFrame(runSpectrum);
  // }, [getFrequencyData, loopSpectrum]);

  const handleStartButtonClick = React.useCallback(() => {
    toggleAudio();
    requestAnimationFrame(runSpectrum);
  }, [toggleAudio, runSpectrum]);

  return (
    <div>
      <div>
        <button onClick={toggleAudio}>Play/Pause</button>
        <canvas ref={canvas} />
      </div>
    </div>
  );
};
export default VisualDemo;
