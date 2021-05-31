import React, { useEffect, useLayoutEffect, useState } from "react";

import {
  Easing,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { G, Svg } from "react-native-svg";
import { ChartColors } from "../../util/utils";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackListType } from "../../../App";
import jsonData from "./assets/chart_cars_data.json";
import Bar from "./Bar";

export type rectType = {
  title : string;
  y: number;
  x: number;
  width : number;
  height : number;
  fill: string;
}

//const totalSum = sumOfObjectBykey<Record<"name" | "Horsepower", any>, keyof Record<"name" | "Horsepower", any>>(data, "Horsepower");
interface BarChartProps {
  navigation: StackNavigationProp<StackListType>;
}

const BarChart = ({ navigation }: BarChartProps): JSX.Element => {
  const [defaultData,] = useState([...jsonData].splice(0, 20));
  const [rectData, setRectData] = useState<rectType[]>([]);
  const [sortType, setSortType] = useState<"ASC" | "DESC" | "STANDARD">("STANDARD");
  const progress = useSharedValue(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Bar chart"
    });
  }, [navigation]);

  useEffect(()=>{
    makeRect(sortType).then((res)=> {
      if(res){
        startAnimation();
      }
    });
  },[sortType]);

  const makeRect = async (type:  "ASC" | "DESC" | "STANDARD" ) => {

    const data : {name:string, Horsepower:number}[] = await defaultData.map( (el) => ({ name: el.Name, Horsepower: el.Horsepower }) );

    const retData = await data.map((el : any, index:number) => {
      return {
        title : data[index].name,
        x: index * 17.5,
        y: 350-parseInt(el.Horsepower), // 350 - height 가 빈값의 높이다.
        width : 15,
        height : parseInt(el.Horsepower),
        fill: ChartColors[index],
      }});

    if(type === "ASC"){
      await retData.sort((a,b) =>  a.height < b.height ? 1 : -1).map((el,index)=> { return el.x = index * 17.5; });
    }else if(type === "DESC"){
      await retData.sort((a,b) =>  a.height < b.height ? -1 : 1).map((el,index)=> { return el.x = index * 17.5; });
    }
    setRectData(retData);
    return true;
  };

  const startSorting = (type: "ASC" | "DESC") => {
    setSortType(type);
  }

  const startAnimation = () => {
    progress.value = 0;
    progress.value = withTiming(1);
  }

  return (
    <>
      <View
        style={{
          width: 350, height: 350, backgroundColor: "#FFFFFF", marginTop: 15
          , borderWidth: 0, marginBottom: 50, borderRadius: 350 / 2
        }}>
            <Svg style={StyleSheet.absoluteFill}>
              <G y={0} x={0}>
                { sortType && (rectData && rectData.length > 0) && rectData.map((rect, index) => {
                    return <Bar key={index} index={index} progress={progress} rectData={rect} />
                  })
                }
              </G>
            </Svg>
      </View>

      <View style={{
        width: "100%"
        , backgroundColor: "#FFFFFF"
        , padding: 5
        , flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between"
      }}>
        <TouchableOpacity
          style={{width: "32%", height: 30,backgroundColor: '#EE3399',marginRight: 5,justifyContent:'center', alignItems:'center'}}
          onPress={startAnimation}>
          <Text>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{width: "32%", height: 30,backgroundColor: '#7e8bdd',marginRight: 5,justifyContent:'center', alignItems:'center'}}
          onPress={()=>startSorting("ASC")}>
          <Text>Sort ASC</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{width: "32%", height: 30,backgroundColor: '#c6db8c',marginRight: 5,justifyContent:'center', alignItems:'center'}}
          onPress={()=>startSorting("DESC")}>
          <Text>Sort DESC</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default BarChart;
