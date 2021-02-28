import React from "react";
import NewSpaceForce from "./components/SpaceForceNew";
import songFile from "./audio/water.wav";
import kshmr from "./img/kshmrOneMoreRound.jpg";
function App() {
  return (
    <div>
      <NewSpaceForce
        bars={600} // done
        barColor={"lightpink"} //  done
        baseRadiusValue={100} //  done
        barDimensions={[3, 0.8]}
        bounceMultiplier={1}
        centerImageSrc={kshmr} //  done
        circProperties={[12, "black"]}
        audioSrc={songFile}
      />
    </div>
  );
}

export default App;
