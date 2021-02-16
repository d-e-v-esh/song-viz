import React, { useRef, useEffect } from "react";
import { __toRadians__ } from "../utils/helper";
const Visualizer = () => {
  const res = __toRadians__(120);
  return (
    <div>
      <div>
        {"this is res "}
        {res}
      </div>
    </div>
  );
};

export default Visualizer;
