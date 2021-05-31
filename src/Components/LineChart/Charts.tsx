import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import AxisComponent from "./AxisComponent";
import Scatterplot from "./Scatterplot";
import PieChart from "./PieChart";
import LineChart from "./LineChart";

import { StackNavigationProp } from '@react-navigation/stack';
import { StackListType } from "../../../App";
interface ChartProps {
  navigation: StackNavigationProp<StackListType>;
};

import { Constants } from 'react-native-unimodules';
import GradBoxGL from "./GradBoxGL";
import BarChart from "./BarChart";
import RadarChart from "./RadarChart";

console.log("Constants.systemFonts", Constants.systemFonts);

const Charts = ({ navigation } : ChartProps ) : JSX.Element => {
    const [chartStyle, setChartStyle] = useState(0);
    const changeChartStyle = () => {
      setChartStyle(prev => (chartStyle === 5) ? 0 : prev+1);
    };

    return (
      <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", backgroundColor: "#eeeeee" }}>

        <AxisComponent ticks={5} min={0} max={100} screenSize={350} />

        { (chartStyle === 5) ? <BarChart  navigation={navigation}   /> : null }
        { (chartStyle === 1) ? <Scatterplot navigation={navigation} /> : null }
        { (chartStyle === 2) ? <PieChart  navigation={navigation}   /> : null }
        { (chartStyle === 3) ? <GradBoxGL navigation={navigation}   /> : null }
        { (chartStyle === 4) ? <LineChart navigation={navigation}   /> : null }
        { (chartStyle === 0) ? <RadarChart navigation={navigation}  /> : null }

        <View style={{
          flexDirection: "row",
          width: "100%",
          height: 80,
          alignItems: "center",
          justifyContent: "space-around",
        }}>
          {
            <Pressable
              style={{
                width: 150,
                height: 35,
                padding: 5,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderRadius : 5,
              }}
              onPress={changeChartStyle}>
              <Text>{"Change Style"}</Text>
            </Pressable>
          }
        </View>
      </View>
    );
};

export default Charts;
