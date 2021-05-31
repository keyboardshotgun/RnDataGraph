import React from "react";
import Animated, { interpolate, useAnimatedProps } from "react-native-reanimated";
import { Rect } from "react-native-svg";
import { TextInput } from "react-native-gesture-handler";

interface BarProps {
  index : number,
  progress : Animated.SharedValue<number>;
  rectData : {
    title : string;
    x: number;
    y: number;
    width : number;
    height : number;
    fill: string;
  };
}

const AnimatedRect = Animated.createAnimatedComponent(Rect);


const Bar = ({ index, progress, rectData } : BarProps ) : JSX.Element => {

  const animateStyle = useAnimatedProps(() => {
    const height = interpolate(progress.value,[0,1],[0, rectData.height]);
    return {
      y : 350-height,
      height : rectData.height,
      x : rectData.x,
    }
  });

  return (
    <AnimatedRect
      animatedProps={animateStyle}
      fill={rectData.fill}
      width={rectData.width}
    />
  );
};

export default Bar;
