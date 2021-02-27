import React from "react";
import SpaceForce from "./components/SpaceForce";
import NewSpaceForce from "./components/SpaceForceNew";
import kshmr from "./img/kshmrOneMoreRound.jpg";
function App() {
  return (
    <div>
      {/* <SpaceForce /> */}
      <NewSpaceForce
        bars={[32]} // done
        barColor={"lightpink"} //  done
        baseRadiusValue={100} //  done
        barDimensions={[4, 0.8]}
        bounceMultiplier={2}
        centerImageSrc={kshmr} //  done
        circProperties={[12, "black"]}
      />
    </div>
  );
}

export default App;
