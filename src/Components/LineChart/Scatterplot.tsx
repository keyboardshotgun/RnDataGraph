import React, { FunctionComponent, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import jsonData from './assets/chart_cars_data.json';
import Animated, {
  cancelAnimation,
  Easing, Extrapolate, interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { Svg, G, Path } from "react-native-svg";
import { linearRegression, linearRegressionLine } from 'simple-statistics';
import DotForPlot from "./DotForPlot";
import { getMinMax } from "../../util/utils";

type carObject = {
  Name: string;
  Miles_per_Gallon: number;
  Cylinders: number;
  Displacement: number;
  Horsepower: number;
  Weight_in_lbs: number;
  Acceleration: number;
  Year: number;
  Origin: string;
};

import { StackNavigationProp } from '@react-navigation/stack';
import { StackListType } from "../../../App";

interface ScatterplotProps {
  navigation: StackNavigationProp<StackListType>;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

type initSettingsType = {
  start: { x: number; y: number; };
  end: { x: number; y: number; };
  pointMake: { cx: number; cy: number; }[];
};

const initSettings = (carData: carObject[], size: number = 10) : initSettingsType => {
  const retData = {  start : {x:0,y:0},  end : {x:0,y:0},  pointMake : [{ cx: 0 , cy: 0}] };
  if(carData && carData.length > 0)
  {
    const pointMake = carData.map( (y, idx) => ( { cx : y.Horsepower * 1.521739 , cy : y.Miles_per_Gallon * 7.5107296 } )).splice(0, size);
    const hpMin = getMinMax<carObject,keyof carObject>("MIN", carData, "Horsepower");
    const hpMax = getMinMax<carObject,keyof carObject>("MAX", carData, "Horsepower");
    const linearPosition = linearRegression(pointMake.map((d, index) => [d.cx, d.cy]))
    const linearRegressionGetY = linearRegressionLine(linearPosition);
    retData.pointMake = pointMake;
    retData.start = { x : hpMin, y : linearRegressionGetY(hpMin) };
    retData.end = { x : hpMax, y : linearRegressionGetY(hpMax) };
    //const oilMin = getMinMax("MIN", carData, "Miles_per_Gallon"); const oilMax = getMinMax("MAX", carData, "Miles_per_Gallon");
  }
  return retData;
};

const Scatterplot = ({ navigation } : ScatterplotProps) : JSX.Element => {

  const BoxLayout = { width: 350, height: 350 };
  const [standData,] = useState(jsonData);
  const [position, setPosition] = useState<{ cx : number , cy : number }[]>([]);
  const progress = useSharedValue(0);
  const [linearRegPosition, setLinearRegPosition] = useState({ start: { x : 0, y: 0 }, end: { x : 0, y: 0 } } );
  const [dataSize, setDataSize] = useState(10);

  useLayoutEffect(() => {
    navigation.setOptions({
      title : "Scatter plot"
    });
  }, [navigation]);

  useEffect(()=>{
    startAnimation(dataSize).catch((e)=>console.log(e));
    return () => {
      console.log("clear animation, Scatter plot");
      cancelAnimation(progress);
    }
  },[])

  const startAnimation = async (size: number) => {
    const settings = await initSettings([...standData], size);
    setLinearRegPosition({ start : settings.start, end: settings.end });
    setPosition(settings.pointMake);
    progress.value = 0;
    progress.value = withTiming(350,{ duration: 1000 , easing : Easing.linear });
  };

  const updateSize = ( type: "MINUS" | "PLUS" ) => {
    let size = null;
    cancelAnimation(progress);
    progress.value = 0;
    if(dataSize <= 10)
    {
      if(type === "MINUS"){
        size = (dataSize === 2) ? 2 : dataSize - 2;
      }else{
        size = (dataSize === 10) ? dataSize + 10 : dataSize + 2;
      }
    }
    else
    {
      if(type === "MINUS"){
        size = dataSize - 10;
      }else{
        size = (dataSize === 400) ? 400 : dataSize + 10
      }
    }
    setDataSize(size);
    startAnimation(size).catch((e)=>console.log(e));
  };

  const AnimatedPathStyle = useAnimatedProps(() => {
        const endX = interpolate(progress.value,[0, 350],[linearRegPosition.start.x, linearRegPosition.end.x],Extrapolate.CLAMP)
        const endY = interpolate(progress.value,[0, 350],[linearRegPosition.start.y, linearRegPosition.end.y],Extrapolate.CLAMP)
        const currentPath = `M${linearRegPosition.start.x},${linearRegPosition.start.y} L${endX},${endY}`;
        return { d: currentPath };
  },[linearRegPosition]);

  return (
    <>
      <Animated.View
        style={{ width: BoxLayout.width, height: BoxLayout.height, backgroundColor: "#FFFFFF", marginTop: 15
          , borderWidth: StyleSheet.hairlineWidth, marginBottom : 30
        }}>
        <Svg style={StyleSheet.absoluteFill}>
          <AnimatedPath
            fill="red"
            stroke="red"
            strokeWidth="2"
            animatedProps={AnimatedPathStyle}
          />
          <G>
              { ( position && position.length > 0 ) && position.map( (el,index) => {
                  return <DotForPlot
                            key={index}
                            progress={progress}
                            index={index}
                            position={{ cx : el.cx , cy : el.cy }} />
              })
            }
          </G>
        </Svg>
      </Animated.View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 80,
          alignItems: "center",
          justifyContent: "center"
        }}>
        <Pressable
          style={{
            width: 50,
            height: 50,
            padding: 5,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1
          }}
          onPress={ () => updateSize("MINUS") }>
          <Text style={{fontSize: 20}}>{"◀"}</Text>
        </Pressable>

        <View
          style={{
            width: 100,
            height: 50,
            padding: 5,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            marginHorizontal : 15,
          }}>
          <Text>{dataSize}</Text>
        </View>

          <Pressable
            style={{
              width: 50,
              height: 50,
              padding: 5,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1
            }}
            onPress={ () => updateSize("PLUS") }>
            <Text style={{fontSize: 20}}>{"▶"}</Text>
          </Pressable>
      </View>
    </>
  );
};

export default Scatterplot;
