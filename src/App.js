import React, { useRef } from "react";
import songFile from "./water.wav";
import kshmr from "./img/kshmrOneMoreRound.jpg";
import Viz from "./components/Viz";

function App() {
  const audioRef = useRef();

  return (
    <div>
      <Viz
        canvasWidth={1000}
        canvasHeight={1000}
        audioRef={audioRef}
        centerImageSrc={kshmr}
        circleProps={{ circleWidth: 12, circleColor: "black" }}
        barColor={{
          // colorTwo: "rgba(255,97,45,255)",
          // colorOne: "rgba(253,235,184,255)",

          hslColor: [2, 100, 50],
        }}
        radius={200}
        rotation={true}
        baseRadiusValue={100}
        bounceMultiplier={0.5}
        fftSizeValue={2048}
        smoothingTimeConstant={0.8}
        bars={200}
        barWidth={4}
        barHeightMultiplier={1}
        centerColor="red"
        canvasBackground="white"
      />

      <audio src={songFile} controls ref={audioRef} />
    </div>
  );
}

export default App;
