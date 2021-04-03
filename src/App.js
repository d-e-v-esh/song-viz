import React, {useState} from "react";
// import NewSpaceForce from "./components/SpaceForceNew";
import BarsCirc from './components/Bars'
import songFile from "./audio/water.wav"; import kshmr from "./img/kshmrOneMoreRound.jpg";
function App() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const audio = new Audio(songFile); // Loading audio file
  const majorToggle = () => {

    if(audio.paused){
      audio.play()
    }else{
      audio.pause()
    }

    // console.log(isAudioPlaying)
  }


  return (
    <div>
      <BarsCirc
        bars={600} // done
        barColor={"lightpink"} //  done
        baseRadiusValue={100} //  done
        barDimensions={[3, 0.8]}
        bounceMultiplier={1}
        centerImageSrc={kshmr} //  done
        circProperties={[12, "black"]}
        isAudioPlaying={isAudioPlaying}
        audioSrc={songFile}
        audio={audio}
      />
      <button onClick={majorToggle}>Toggle</button>
    </div>
  );
}

export default App;
