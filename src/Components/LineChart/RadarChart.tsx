import React, { FunctionComponent, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { G, Svg, Circle, Path, Text as SvgText } from "react-native-svg";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackListType } from "../../../App";
import { ChartColors } from "../../util/utils";
import Animated, {
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

interface RadarChartProps {
  navigation: StackNavigationProp<StackListType>;
}

const pentagonData = () => {
  return [
    {value : Math.floor(Math.random() * 90 + 10)},
    {value : Math.floor(Math.random() * 90 + 10)},
    {value : Math.floor(Math.random() * 90 + 10)},
    {value : Math.floor(Math.random() * 90 + 10)},
    {value : Math.floor(Math.random() * 90 + 10)}
  ]
}



const DegreeToRadian = (type: "PATH"|"COOR"|"TEXT" = "PATH" , Degree : number = 0, theta:  number = 0, index: number = 0) => {
  const startX = 175;
  const startY = 175;
  let Radius : number = 0;

  if(type === "PATH" || type === "COOR"){
    Radius = (theta > 0) ? theta * 1.75 : 175;
  }

  if(type === "TEXT"){
    Radius = theta * 1.75;
  }

  const Radian = (Math.PI/180) * Degree;
  const nextX  = Radius * Math.cos(Radian) + 175;
  const nextY  = Radius * Math.sin(Radian) + 175;
  if(type === "PATH"){
    return `M${startX}, ${startY} L${nextX}, ${nextY}`
  }else if(type === "COOR"){
    return {x: nextX, y : nextY };
  }else if(type === "TEXT"){
    console.log(index, theta, nextX, nextY);
    let deltaX = 0;
    let deltaY = 0;
    if(index === 0){
      if(theta < 85){
        deltaX = 15;
        deltaY = 0;
      }else{
        deltaX = -20;
        deltaY = 10;
      }
    }else if(index === 1){
      if(theta < 85) {
        deltaX = 10;
        deltaY = 15;
      }else{
        deltaX = -15;
        deltaY = -15;
      }
    }else if(index === 2){
      if(theta < 85) {
        deltaX = -5;
        deltaY = 15;
      }else{
        deltaX = 10;
        deltaY = -15;
      }
    }else if(index === 3){
      if(theta < 85) {
        deltaX = -15;
        deltaY = 0;
      }else{
        deltaX = 20;
        deltaY = 10;
      }
    }else if(index === 4){
      if(theta < 85) {
        deltaX = 0;
        deltaY = -10;
      }else{
        deltaX = -5;
        deltaY = 30;
      }
    }
    return { x: nextX + (deltaX), y : nextY + (deltaY) };
  }
};


const makeInitData = () => {
  let path = "", tail = ""
  const tempArray : { x : number, y: number }[] = [];
  const originData = pentagonData();
  [...originData].sort((a,b) => (a.value > b.value) ? 1 : (a.value === b.value) ? 0 : -1 ).forEach((el,index) => {
    const coorXY : any = DegreeToRadian(  "COOR", index * (360/originData.length) - ((360/4) - (360/originData.length)) , el.value);
    tempArray.push(coorXY);
    if(index === 0){
      path += "M"+coorXY.x+","+ coorXY.y + " ";
      tail += coorXY.x+", "+ coorXY.y+"Z";
    }else if(index === 1){
      path += "L"+coorXY.x+","+ coorXY.y + " ";
    }else{
      path += coorXY.x+","+ coorXY.y + " ";
    }
  });
  return {
    path : path+tail,
    data : originData,
    dataXY : tempArray,
  }
}

const setData = makeInitData();

const AnimatedPath = Animated.createAnimatedComponent(Path);

const RadarChart = ({ navigation } : RadarChartProps) => {

  const [originData, setOriginData] = useState<{ value : number}[]>(setData.data);
  const progress = useSharedValue(0);
  //const aniLine  = useSharedValue(setData.path);
  const aniData  = useSharedValue<{ x : number, y: number }[]>(setData.dataXY);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Radar Chart"
    });
  }, [navigation]);

  useEffect(()=>{
    console.log("init Datas");
    startAnimation();
    return () => {
      cancelAnimation(progress);
    }
  },[])

  const updateDatas = () => {
    const { path, data, dataXY } = makeInitData();
    setOriginData(data);
    aniData.value = dataXY;
    startAnimation();
  }

  const startAnimation = () =>{
    // await makeLine();
    progress.value = 0;
    progress.value = withTiming(1);
  }

  const AnimatedPathStyle = useAnimatedProps(() => {
    const newTemp = [...aniData.value];
    let path : string = ``;
    newTemp.forEach((el, index) => {
        const data = {
           x : interpolate(progress.value,[0,1],[175,newTemp[index].x])
          ,y : interpolate(progress.value,[0,1],[175,newTemp[index].y])
        }
        path += (index === 0) ? `M${data.x},${data.y} ` : (index === 1) ? `L${data.x},${data.y} ` : `${data.x},${data.y} `;
        if(index === newTemp.length-1){
          path += "Z"; // `${firstData.x},${firstData.y}`+
        }
    });
    return { d : path };
  });

  return (
    <>
      <Animated.View
        style={{
          width: 350, height: 350, backgroundColor: "#FFFFFF", marginTop: 15
          , borderWidth: 0, marginBottom: 50, borderRadius: 350 / 2
        }}>
        <Svg style={StyleSheet.absoluteFill}>
          <G y={0} x={0}>
            <Circle cx={175} cy={175} r={175} strokeWidth={1} stroke={'#333333'} opacity={0.2} fill={'transparent'} />
            <Circle cx={175} cy={175} r={125} strokeWidth={1} stroke={'#333333'} opacity={0.2} fill={'transparent'} />
            <Circle cx={175} cy={175} r={75}  strokeWidth={1} stroke={'#333333'} opacity={0.2} fill={'transparent'} />
            <Circle cx={175} cy={175} r={25}  strokeWidth={1} stroke={'#333333'} opacity={0.2} fill={'transparent'} />

            { originData.map((el,index) => {
                return (
                  <Path key={index}
                        d={`${ DegreeToRadian("PATH", index * (360/originData.length) - ((360/4) - (360/originData.length)) ,0) }`}
                        stroke={'#333333'}
                        strokeWidth={1}
                        opacity={0.2}
                        fill={'transparent'}
                  >
                  </Path>)
                })
            }

            { [...originData].sort((a,b) => (a.value > b.value) ? 1 : (a.value === b.value) ? 0 : -1 ).map((el,index) => {
                return (
                  <Path key={index}
                    d={`${ DegreeToRadian(  "PATH", index * (360/originData.length) - ((360/4) - (360/originData.length)) , el.value) }`}
                    stroke={ChartColors[index]}
                    strokeWidth={15}
                    opacity={0.5}
                    fill={'transparent'}
                  />)
              })
            }

            { (originData && originData.length > 0) &&
              <AnimatedPath
                animatedProps={AnimatedPathStyle}
                stroke={"#333333"}
                strokeWidth={1}
                fill={'transparent'}
              />
            }

            { [...originData].sort((a,b) => (a.value > b.value) ? 1 : (a.value === b.value) ? 0 : -1 ).map((el,index) => {
              const cood : any = DegreeToRadian(  "TEXT", index * (360/originData.length) - ((360/4) - (360/originData.length)) , el.value, index);
              return (
                <SvgText
                  key={index}
                  //fill={ChartColors[index]}
                  stroke={"black"}
                  fontSize="10"
                  x={cood.x}
                  y={cood.y}
                  textAnchor="middle"
                >{el.value}</SvgText>)
            })}

          </G>
        </Svg>
      </Animated.View>

      <View style={{
          width: "100%"
        , backgroundColor: "#FFFFFF"
        , padding: 5
        , flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-start",marginBottom: 10
      }}>

        { (originData && originData.length > 0) && [...originData].sort((a,b) => (a.value > b.value) ? 1 : (a.value === b.value) ? 0 : -1 ).map((el,index) => {
            return <View
              key={index}
              style={{width: "18%", height: 20,backgroundColor: 'transparent',marginRight: 5,justifyContent:'center', alignItems:'center', flexDirection: "row"}}
            >
              <View style={{ width:'30%', height:'100%', backgroundColor: ChartColors[index], opacity: 0.5 }}/>
              <View style={{ width:'70%', height:'100%',justifyContent:'center', alignItems:'center'}}>
                <Text>{el.value}</Text>
              </View>
            </View>
        })
        }

      </View>

      <View style={{
        width: "100%"
        , backgroundColor: "#FFFFFF"
        , padding: 5
        , flexDirection: "row", flexWrap: "wrap", alignContent: "center", justifyContent: "center"
      }}>
        <TouchableOpacity
          style={{width: "25%", height: 30,backgroundColor: '#EE3399',marginRight: 5,justifyContent:'center', alignItems:'center'}}
          onPress={startAnimation}>
          <Text>play</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{width: "72%", height: 30,backgroundColor: '#33b3ee',marginRight: 5,justifyContent:'center', alignItems:'center'}}
          onPress={updateDatas}>
          <Text>Random</Text>
        </TouchableOpacity>

      </View>
    </>
  );
};

export default RadarChart;
