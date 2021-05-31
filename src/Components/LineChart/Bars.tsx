import React, { useCallback, useEffect, useState } from "react";
import { rectType } from "./BarChart";
import Bar from "./Bar";
import { G } from "react-native-svg";
import Animated from "react-native-reanimated";

interface BarsProps {
  data : rectType[];
  progress : Animated.SharedValue<number>;
  sort : "ASC" | "DESC" | "STANDARD"
}

const Bars = ( { data, progress } : BarsProps ) : JSX.Element[] => {
    return data.map((rect, index) => {
      return <Bar key={index} index={index} progress={progress} rectData={rect} />
    });
};

export default Bars;
