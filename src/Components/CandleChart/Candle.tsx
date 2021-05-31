import React, { FunctionComponent, useEffect, useState } from "react";
import Svg, { Line, Path, Rect } from "react-native-svg";
import { candleType } from "./CandleChart";
import { ScaleLinear } from "d3-scale";
import { MARGIN } from "./CandleChartMaker";

interface CandleProps {
  index: number;
  data : candleType;
  width: number;
  scaleY: ScaleLinear<number, number>;
  scaleBody: ScaleLinear<number, number>;
}

const Candle = ({ index, data, width, scaleY, scaleBody }: CandleProps) => {

  const { close , high, low, open } = data;
  const fillColor = Math.sign(open - close) === Math.sign(1) ? "#296bff" : "#ff2727";
  const x = index * width;
  const max = Math.max(open, close);
  const min = Math.min(open, close);

  return data && data.hasOwnProperty("date") ?
    (
      <>
        <Line
          x1={x + width / 2}
          y1={scaleY(low)}
          x2={x + width / 2}
          y2={scaleY(high)}
          stroke={fillColor}
          strokeWidth={1}
        />
        <Rect
          x={x+MARGIN}
          y={scaleY(max)}
          fill={fillColor}
          height={scaleBody(max - min)}
          width={width - MARGIN * 2}
        />
    </>
    )
    :
    null
};

export default Candle;
