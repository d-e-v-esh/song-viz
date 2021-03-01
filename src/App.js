import React from "react";
import NewSpaceForce from "./components/SpaceForceNew";
import songFile from "./audio/water.wav";
import kshmr from "./img/kshmrOneMoreRound.jpg";
import "./stylesheets/App.scss";
import CircumferenceBars from "./components/CircumferenceBars";

function App() {
  return (
    <div>
      <div className="myCanvas">
        {/* <NewSpaceForce
          mainCanvasWidth={500}
          mainCanvasHeight={500}
          bars={600} // done
          baseRadiusValue={100} //  done
          barDimensions={[3, 0.8]}
          bounceMultiplier={1}
          centerImageSrc={kshmr} //  done
          circProperties={[12, "black"]}
          audioSrc={songFile}
        /> */}

        <CircumferenceBars
          mainCanvasWidth={500}
          mainCanvasHeight={500}
          bars={600} // done
          baseRadiusValue={10} //  done
          barDimensions={{ width: 3, heightMultiplier: 0.8 }}
          bounceMultiplier={0.1}
          centerImageSrc={kshmr} //  done
          // circProperties={{ circWidth: 12, circColor: "black" }}
          fftSizeValue={2048}
          audioSrc={songFile}
          barColor={{
            colorOne: "rgb(248,239,179)",
            colorTwo: "rgb(124,13,50)",
          }}
        />
      </div>
      <div></div>
    </div>
  );
}

export default App;
