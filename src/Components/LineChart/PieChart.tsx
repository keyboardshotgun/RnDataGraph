import React, { useEffect, useLayoutEffect, useState } from "react";
import * as shape from "d3-shape";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Extrapolate, cancelAnimation
} from "react-native-reanimated";
import { StyleSheet, Text, View } from "react-native";
import { G, Path, Svg } from "react-native-svg";
import jsonData from "./assets/chart_cars_data.json";
import { ChartColors, sumOfObjectBykey } from "../../util/utils";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackListType } from "../../../App";

const wheeldata = [...jsonData.splice(0, 15)].map((el) => {
  return { name: el.Name, Horsepower: el.Horsepower };
});

// 정적 그래프는 d3로 그리는게 빠를듯.
const makeWheel = () => {
  const data: any = wheeldata.sort((a, b) => a.Horsepower > b.Horsepower ? 1 : -1);
  const arcs = shape.pie()(data.map((el: any, _: number) => el.Horsepower));
  // arc [ {"data": 1971, "endAngle": 2.0943951023931953, "index": 1, "padAngle": 0, "startAngle": 1.0471975511965976, "value": 1971} ... ]
  const totalSum = sumOfObjectBykey<Record<"name" | "Horsepower", any>, keyof Record<"name" | "Horsepower", any>>(data, "Horsepower");
  return arcs.map((arc: any, index) => {
    const instance = shape.arc()
      .padAngle(0.05)
      .endAngle((Math.PI * 2) * (arc.value / totalSum))
      .outerRadius(300 / 2)
      .innerRadius(100);

    return {
      name: data[index].name,
      path: instance(arc),                               // Path string : M0.7972313889133061,149.9978813920801A150,150,0,0,0,88.89543094987081,-120.82053780809268L59.50537234855089,-80.36859250764763A100,100,0,0,1,0.8319504417094656,99.99653923242813Z
      color: ChartColors[index],
      value: data[index].Horsepower,                       // [200 ~ 2200]
      centroid: instance.centroid(arc)                     // array [38.62712429686843, -118.88206453689419]
    };
  });
};

interface PieChartProps {
  navigation: StackNavigationProp<StackListType>;
}

const PieChart = ({ navigation }: PieChartProps): JSX.Element => {
  const [wheels, setWheels] = useState<{ name: any; path: never; color: string; value: number; centroid: [number, number]; }[]>([]);
  const scale = useSharedValue(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Pie chart"
    });
  }, [navigation]);

  useEffect(() => {
    const temp : any = makeWheel();
    if (temp && temp.length > 0) {
      setWheels(temp);
      scale.value = withTiming(1, {
        duration: 2000,
        easing: Easing.ease
      });
    }
    return () => {
      console.log("clear animation, Pie Chart");
      cancelAnimation(scale);
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(scale.value, [0, 1], [1080, 0], Extrapolate.CLAMP);
    return {
      transform: [
        {
          scale: scale.value
        },
        {
          rotate: rotateValue + "deg"
        }
      ]
    };
  });

  const isItWorks = (arc: { centroid: [number, number], color: string
    , name: string, path: string, value: number } ) => {
    console.log("arc : ", arc);
    console.log("centroid : ", arc.centroid);
    console.log("color : ", arc.color);
    console.log("name : ", arc.name);
    console.log("path : ", arc.path);
    console.log("value : ", arc.value);
    //"M 4.506469636178472,-149.93229048946796
    // A 150,150,0,0,1,74.64838645147344,-130.10618125281934
    // L 48.45615299710473,-87.47571798345629
    // A 100,100,0,0,0,4.50646963617847,-99.89840705145504Z"
  };

  return (
    <>
      <Animated.View
        style={[animatedStyle, {
          width: 350, height: 350, backgroundColor: "#FFFFFF", marginTop: 15
          , borderWidth: 0, marginBottom: 50, borderRadius: 350 / 2
        }]}>
        <Svg style={StyleSheet.absoluteFill}>
          <G y={350 / 2} x={350 / 2}>
            {(wheels && wheels.length > 0) &&
            wheels.map((arc, i) => (
              <G key={`arc-${i}`}>
                <Path
                  onPress={() => isItWorks(arc)}
                  d={arc.path}
                  fill={arc.color}
                />
              </G>
            ))
            }
          </G>
        </Svg>
      </Animated.View>
      <View style={{
        width: "100%"
        , backgroundColor: "#FFFFFF"
        , padding: 5
        , flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-start"
      }}>
        {(wheels && wheels.length > 0) &&
        wheels.map((arc, i, array) => (
          <View
            key={`text-${i}`}
            style={{
              width: "21%",
              marginRight: "3%",
              height: 20,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center"
            }}>
            <View
              style={{ width: 10, height: 10, backgroundColor: array[(array.length - 1) - i].color, marginRight: 5 }} />
            <Text
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={{ color: "#333333", fontSize: 8, overflow: "hidden" }}>{array[(array.length - 1) - i].name}
            </Text>
          </View>
        ))
        }
      </View>
    </>
  );
};

export default PieChart;
