import React, { useRef } from "react";
import NewSpaceForce from "./components/SpaceForceNew";
import songFile from "./water.wav";
import kshmr from "./img/kshmrOneMoreRound.jpg";
import "./stylesheets/App.scss";
import CircumferenceBars from "./components/CircumferenceBars";
import Viz from "./components/Viz";

function App() {
  // const audio = new Audio(songFile);

  const audioRef = useRef();

  return (
    <div>
      <div className="myCanvas">
        {/* <AUViz
          canvasWidth={1920}
          canvasHeight={1080}
          bars={60} // done
          baseRadiusValue={10} //  done
          barDimensions={{ width: 3, heightMultiplier: 0.8 }}
          bounceMultiplier={1}
          centerImageSrc={kshmr} //  done
          // circProperties={{ circWidth: 12, circColor: "black" }}
          fftSizeValue={2048}
          audioElement={audio}
          barColor={{
            colorOne: "rgb(248,239,179)",
            colorTwo: "rgb(124,13,50)",
          }}
        /> */}
      </div>

      <Viz
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

      <div>{/* <button onClick={togglePlay}>Play Out</button> */}</div>
    </div>
  );
}

export default App;
