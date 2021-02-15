import React, { useRef, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import { makeStyles } from "@material-ui/core/styles";
import "../stylesheets/App.scss";

const useStyles = makeStyles((theme) => ({
  flexContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingTop: "25%",
  },
}));

const VisualDemo = ({ toggleAudio, frequencyBandArray, getFrequencyData }) => {
  const classes = useStyles();

  const amplitudeValues = useRef(null);

  const adjustFreqBandStyle = React.useCallback(
    (newAmplitudeData) => {
      amplitudeValues.current = newAmplitudeData;
      let domElements = frequencyBandArray.map((num) =>
        document.getElementById(num)
      );
      for (let i = 0; i < frequencyBandArray.length; i++) {
        let num = frequencyBandArray[i];
        // This controls the color of every bar
        domElements[
          num
        ].style.backgroundColor = `rgb(0, 255, ${amplitudeValues.current[num]})`;
        // This controls the height of every bar
        domElements[num].style.height = `${amplitudeValues.current[num]}px`;
      }
    },
    [frequencyBandArray]
  );

  const runSpectrum = React.useCallback(() => {
    getFrequencyData(adjustFreqBandStyle);
    requestAnimationFrame(runSpectrum);
  }, [getFrequencyData, adjustFreqBandStyle]);

  const handleStartButtonClick = React.useCallback(() => {
    toggleAudio();
    requestAnimationFrame(runSpectrum);
  }, [toggleAudio, runSpectrum]);

  return (
    <div>
      <div>
        <Tooltip title="Start" aria-label="Start" placement="right">
          <IconButton id="startButton" onClick={handleStartButtonClick}>
            <EqualizerIcon />
          </IconButton>
        </Tooltip>
      </div>

      <div className={classes.flexContainer}>
        {frequencyBandArray.map((num) => (
          <Paper
            className={"frequencyBands"}
            elevation={24}
            id={num}
            key={num}
          />
        ))}
      </div>
    </div>
  );
};
export default VisualDemo;
