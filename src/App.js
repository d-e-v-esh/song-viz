import React from "react";
import NewSpaceForce from "./components/SpaceForceNew";
import songFile from "./water.mp3";
import kshmr from "./img/kshmrOneMoreRound.jpg";
import "./stylesheets/App.scss";
import CircumferenceBars from "./components/CircumferenceBars";
import Viz from "./components/Viz";

function App() {
  const audio = new Audio(songFile); // Loading audio file

  const togglePlay = () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };
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

      <Viz />
      <div>{/* <button onClick={togglePlay}>Play Out</button> */}</div>
    </div>
  );
}

export default App;
