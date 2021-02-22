import React from "react";
import SpaceForce from "./components/SpaceForce";
import NewSpaceForce from "./components/SpaceForceNew";
import kshmr from "./img/kshmrOneMoreRound.jpg";
function App() {
  return (
    <div>
      {/* <SpaceForce /> */}
      <NewSpaceForce
        bars={50}
        barWidth={10}
        fftSizeValue={2048}
        barColor={"lightpink"}
        RMSMultiplier={2.5}
        baseRadiusValue={100}
        barHeightMultiplier={0.8}
        // centerImageSrc={kshmr}
        bounce={true}
        rootLineVisible={true}
      />
    </div>
  );
}

export default App;
