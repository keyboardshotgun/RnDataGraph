import React, { FunctionComponent, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Circle, Path, Svg, Text as svgText } from "react-native-svg";

import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  runOnJS,
  withSpring
  , useAnimatedGestureHandler
  , useDerivedValue, cancelAnimation
} from "react-native-reanimated";

import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import * as shape from "d3-shape";
import { scaleLinear } from "d3-scale";
import { getYForX, mixPath, parse } from "react-native-redash";

import Scatterplot from "./Scatterplot";
import AxisComponent from "./AxisComponent";
import PieChart from "./PieChart";
const tempX = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const pathArray = [
  [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  [10, 30, 10, 30, 40, 60, 70, 30, 80, 90, 40],
  [20, 40, 60, 30, 40, 60, 70, 90, 80, 90, 30],
  [30, 50, 70, 70, 90, 80, 70, 30, 30, 100, 10]
];

// HINT : D3.js
const pathMaker = (pArray: number[]) => {
  const reMake: [number, number][] = [...pArray].map((y, idx) => [y, tempX[idx]]);
  // [ 앞에 값이 Y , 뒤에 값이 X ] 로 넘겨야 정상적으로 출력 된다.
  const minValueX = Math.min(...tempX);
  const maxValueX = Math.max(...tempX);
  const minValueY = Math.min(...pArray);
  const maxValueY = Math.max(...pArray);
  const scaleX = scaleLinear().domain([minValueX, maxValueX]).range([0, 350]); // range 0 , component Size
  const scaleY = scaleLinear().domain([minValueY, maxValueY]).range([350, 0]); // range component Size , 0
  const path = shape
                .line()
                .x(([, x]) => scaleX(x) as number)
                .y(([y]) => scaleY(y) as number)
                .curve(shape.curveLinear)(reMake) as string;

  return parse(path);
};

const pathData = [
  {
    index: 0,
    path: pathMaker(pathArray[0])
  },
  {
    index: 1,
    path: pathMaker(pathArray[1])
  },
  {
    index: 2,
    path: pathMaker(pathArray[2])
  },
  {
    index: 3,
    path: pathMaker(pathArray[3])
  }
];

import { StackNavigationProp } from '@react-navigation/stack';
import { StackListType } from "../../../App";

interface LineChartProps {
  navigation: StackNavigationProp<StackListType>;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(svgText);

// type RangeOf<N extends number> = Partial<TupleOf<unknown, N>>["length"];
// type RangeOf2<From extends number, To extends number> = Exclude<RangeOf<To>, RangeOf<From>> | From;
// type ZeroToOne = RangeOf2<0,1>

const LineChart = ({ navigation } : LineChartProps) : JSX.Element => {
  const BoxLayout = { width: 350, height: 350 };
  const prevIndex = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const animateValue = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const titleY = useSharedValue(0);
  const isActive = useSharedValue(false);
  const CirCleRadius = 10;
  const [nowY, setNowY] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title : "Line plot"
    });
  }, [navigation]);

  useEffect(() => {
    return ()  => {
      console.log("clear animation, liner chart");
      translateX.value = 0;
      translateY.value = 0;
      animateValue.value = 0;
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      cancelAnimation(animateValue);
    }
  }, []);

  const updateArray = useCallback((index: number) => {
    prevIndex.value = currentIndex.value;
    currentIndex.value = index;
    startAnimation();
  },[]);

  const startAnimation = () => {
    translateX.value = 0;
    translateY.value = 0;
    animateValue.value = 0;
    animateValue.value = withTiming(1, {
      duration: 300,
      easing: Easing.bounce
    });
  };

  const AnimatedPathStyle = useAnimatedProps(() => {
    const prevPath = pathData[prevIndex.value].path;
    const currentPath = pathData[currentIndex.value].path;
    return {
      d: mixPath(animateValue.value, prevPath, currentPath)
    };
  });

  const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent
    , { x: number, y: number }>({
    onStart: (_, ctx) => {
      isActive.value = true;
      ctx.x = translateX.value;
      ctx.y = translateY.value;
    },
    onActive: ({ translationX, translationY }, { x, y }) => {
      translateX.value = x + translationX;
      if (translateX.value < 1.1) {
        translateX.value = 1;
      }
      if (translateX.value > BoxLayout.width - 1) {
        translateX.value = BoxLayout.width - 1;
      }
      translateY.value = getYForX(pathData[currentIndex.value].path, translateX.value);
    },
    onEnd: ({ velocityX, translationX, translationY, absoluteX, absoluteY }, { x, y }) => {
      titleY.value = translateY.value;
      isActive.value = false;
    }
  });

  const circleAnimation = useAnimatedProps(() => {
    return {
        cx : translateX.value
      , cy : translateY.value
      , strokeWidth: isActive.value ? "3" : "1"
      , r: withSpring(isActive.value ? 10 : 4)
    };
  });

  const updateText = useCallback(() => setNowY(Math.round(350 - titleY.value)), []);

  useDerivedValue(() => {
    if (isActive.value === false) {
      runOnJS(updateText)();
    }
    return true;
  }, [isActive.value]);

  const textAnimation = useAnimatedProps(() => {

    if(translateX.value < 6){
      return { x: translateX.value + 15 , y: withSpring(translateY.value - 5), fontSize: isActive.value ? 0 : 10 };
    }

    if (translateX.value > 324){
      return { x: withSpring(translateX.value - 20 ), y: translateY.value + 30 , fontSize: isActive.value ? 0 : 10 };
    }

    return { x: translateX.value - 5 , y: withSpring(translateY.value - 15), fontSize: isActive.value ? 0 : 10 };
  },[translateX,translateY]);

  return (
    <>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View
          style={{
            width: BoxLayout.width,
            height: BoxLayout.height,
            backgroundColor: "#FFFFFF",
            marginTop: 15,
            borderWidth: StyleSheet.hairlineWidth,
            marginBottom : 30
          }}>
          <Svg style={StyleSheet.absoluteFill}>

            <AnimatedText
              animatedProps={textAnimation}
              fill={"black"}
              stoke={"black"}
              fontWeight={"bold"}
              textAnchor="middle">
              {Math.round(nowY)}
            </AnimatedText>

            <AnimatedPath
              fill="none"
              stroke="black"
              strokeWidth="1"
              animatedProps={AnimatedPathStyle}
            />

            <AnimatedCircle
              animatedProps={circleAnimation}
              r={CirCleRadius}
              fill="transparent"
              stroke={"black"}
            />

          </Svg>
        </Animated.View>
      </PanGestureHandler>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 80,
          alignItems: "center",
          justifyContent: "space-around"
        }}>
        {pathArray.map((_, index) => {
          return (<Pressable
                    key={index}
                    style={{
                      width: 50,
                      height: 50,
                      padding: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1
                    }}
                    onPress={() => updateArray(index)}>
                    <Text>{index + 1}</Text>
          </Pressable>)
          })
        }
      </View>
    </>
  );
};

export default LineChart;
