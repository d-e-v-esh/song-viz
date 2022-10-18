# song-viz

> React Song Visualizer

[![NPM](https://img.shields.io/npm/v/song-viz.svg)](https://www.npmjs.com/package/song-viz) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

### [Video Link](https://user-images.githubusercontent.com/59534570/147430697-01fb9d2d-e58d-41a7-aa19-73458cbfa4ae.mp4)

## Install

### npm

```bash
npm install song-viz
```

### yarn

```bash
yarn add song-viz
```

## Usage

Most of the props in this component have default values so you can get started with just the essential props:

```jsx
import React, { useRef } from 'react'
import songFile from './songAudio.wav'
import imageFile from './img/imageFile.jpg'
import { RecordDisk } from 'song-viz'

const App = () => {
  const audioRef = useRef()
  return (
    <div>
      <RecordDisk audioRef={audioRef} centerImageSrc={imageFile} />
      <audio src={songFile} controls ref={audioRef} />
    </div>
  )
}

export default App
```

This component with all the props looks like this:

```jsx
import React, { useRef } from 'react'
import songFile from './songAudio.wav'
import imageFile from './img/imageFile.jpg'
import { RecordDisk } from 'song-viz'

const App = () => {
  const audioRef = useRef()
  return (
    <div>
      <RecordDisk
        audioRef={audioRef}
        centerImageSrc={imageFile}
        rotation={true}
        bounceMultiplier={0.5}
        bars={200}
        barWidth={4}
        barHeightMultiplier={1}
        barColor={{
          // Either add one/two colors
          colorTwo: 'rgba(255,97,45,255)',
          colorOne: 'rgba(253,235,184,255)',

          // Or Add HSL Values, do not add both
          hslColor: [2, 100, 50]
        }}
        circleProps={{ circleWidth: 12, circleColor: 'black' }}
        centerColor='red'
        canvasBackground='white'
        baseRadiusValue={100}
        fftSizeValue={2048}
        smoothingTimeConstant={0.8}
				canvasWidth = {1200},
  			canvasHeight = {1000}
      />

      <audio src={songFile} controls ref={audioRef} />
    </div>
  )
}

export default App
```

# Props and Default Values

| property              | description                                                | type           | default                                    | isRequired |
| --------------------- | ---------------------------------------------------------- | -------------- | ------------------------------------------ | ---------- |
| audioRef              | Ref of the audio player which is made with `useRef` hook   | useRef object  | -                                          | true       |
| centerImageSrc        | Import name of the image that will be placed in the circle | image          | -                                          | false      |
| rotation              | Controls whether the center image will rotate or not       | boolean        | true                                       | false      |
| bounceMultiplier      | Controls the how much the circle will bounce               | number         | 1                                          | false      |
| bars                  | Number of bars that will appear on the circle              | number         | 200                                        | false      |
| barWidth              | Width of the bar                                           | number         | 4                                          | false      |
| barHeightMultiplier   | Controls the height of the bars                            | number         | 1                                          | false      |
| barColor              | The color of the bars that will visualize the frequencies  | object         | `{ hslColor: [2, 100, 50] }`               | false      |
| circleProps           | Props of the circle on which the bars will appear          | object         | `{ circleWidth: 4, circleColor: 'black' }` | false      |
| centerColor           | Color of the circle if no image is provided                | string (color) | 'white'                                    | false      |
| canvasBackground      | Background color behind the visualizer                     | string (color) | 'white'                                    | false      |
| baseRadiusValue       | Minimum radius of the center circle                        | number         | 150                                        | false      |
| fftSizeValue          | Must be a power of 2 between 2^5 and 2^15.                 | number         | 512                                        | false      |
| smoothingTimeConstant | Smoothness of the bar visualization.                       | number (0-1)   | 0.8                                        | false      |
| canvasWidth           | Width of the canvas                                        | number         | 1200                                       | false      |
| canvasHeight          | Height of the canvas                                       | number         | 1000                                       | false      |

## License

MIT © [d-e-v-esh](https://github.com/d-e-v-esh)
