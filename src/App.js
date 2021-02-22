import React from "react";
import SpaceForce from "./components/SpaceForce";
import NewSpaceForce from "./components/SpaceForceNew";
function App() {
  return (
    <div>
      {/* <SpaceForce /> */}
      <NewSpaceForce
        bars={600}
        bar_width={1}
        fftSizeValue={2048}
        barColor={"blue"}
        RMSMultiplier={2.5}
        baseRadiusValue={100}
        barHeightValue={0.8}
      />
    </div>
  );
}

export default App;
