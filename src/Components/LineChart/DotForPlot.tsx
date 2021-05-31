import React from "react";
import Animated, { interpolate, useAnimatedProps, Extrapolate } from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { Circle } from "react-native-svg";

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  }
});

interface CircleProps {
  progress: Animated.SharedValue<number>; // //goesDown: Animated.SharedValue<boolean>;
  index: number;
  position: { cx : number, cy: number }
}

// const transform = (theta: number, value: number) => {
//    "worklet";
//    const translateX = mix(value, 0, x); // value -> x 값 interploate
//    const translateY = mix(value, 0, y); // value -> y 값 interploate
//    return [{ translateX }, { translateY }, { scale: mix(value, 0.3, 1) }];
// };

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const DotForPlot = ({ progress, position, index }: CircleProps) => {
  const dotAnimation = useAnimatedProps(() => {
    const cx = interpolate(progress.value
      ,[0, 350]
      ,[index * 5, position.cx]
      ,Extrapolate.CLAMP);
    const cy = interpolate(progress.value
      ,[0, 350]
      ,[125, position.cy]
      ,Extrapolate.CLAMP);
      return {
          cx : cx,
          cy : cy
      }
  });
  return (
    <AnimatedCircle
      animatedProps={dotAnimation}
      fill={"black"}
      r={1}
    />
  );
};

export default DotForPlot;
