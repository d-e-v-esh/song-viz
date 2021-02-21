import React from "react";
// import FunctionCont from "./components/functionCont";
// import Visualizer from "./components/Visualizer";
import SpaceForce from "./components/SpaceForce";
import NewSpaceForce from "./components/SpaceForceNew";
function App() {
  return (
    <div>
      {/* <FunctionCont /> */}
      {/* <Visualizer /> */}
      {/* <CircleFunc /> */}
      {/* <SpaceForce /> */}
      <NewSpaceForce
        bars={600}
        bar_width={1}
        fftSizeValue={2048}
        barColor={"blue"}
        RMSMultiplier={0.5}
        baseRadiusValue={100}
        barHeightValue={0.3}
      />
      {/* <Canvas /> */}
    </div>
  );
}

export default App;
