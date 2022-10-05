import { MeloDisc } from "./components/MeloDisc";
import React, { useRef } from "react";
import songFile from "./IZECOLD - Close (feat. Molly Ann) [NCS Release].mp3";
import songCover from "./img/close brooks remix cover.jpg";

// Passing Empty barColor works but not passing it does not work.
// Not passing any barColor should set the barColor to RGB hsl value.

const App = () => {
  const audioRef = useRef();
  return (
    <div>
      <MeloDisc
        audioRef={audioRef}
        // centerImageSrc={songCover}
        barColor={{
          colorTwo: "rgba(25,97,4,255)",
          colorOne: "rgba(253,235,184,255)",
          // hslColor: [20, 100, 50]
        }}
        canvasWidth={1920}
        canvasHeight={1080}
      />

      <audio src={songFile} controls ref={audioRef} />
    </div>
  );
};

export default App;
