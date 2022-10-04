export const getInterpolatedArray = (
  firstColor: string,
  secondColor: string,
  noOfSteps: number
) => {
  // Returns a single rgb color interpolation between given rgb color
  function interpolateColor(
    color1: number[],
    color2: number[],
    factor: number
  ) {
    // if we don't pass in factor then set default value

    let resultRGB;
    if (arguments.length < 3) {
      factor = 0.5;
    }
    var result = color1.slice();
    console.log({ result });
    for (var i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
      resultRGB = `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
    }
    return resultRGB;
  }

  // function to interpolate between two colors completely, returning an array
  const interpolateColors = (color1: string, color2: string, steps: number) => {
    var stepFactor = 1 / (steps - 1);
    var interpolatedColorArray = [];
    const colorOneNumberArray = color1.match(/\d+/g)!.map(Number);
    const colorTwoNumberArray = color2.match(/\d+/g)!.map(Number);

    for (var i = 0; i < steps; i++) {
      interpolatedColorArray.push(
        interpolateColor(
          colorOneNumberArray,
          colorTwoNumberArray,
          stepFactor * i
        )
      );
    }
    return interpolatedColorArray;
  };

  return interpolateColors(firstColor, secondColor, noOfSteps);
};
