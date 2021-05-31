import React, { useState } from "react";
import { Dimensions, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Animated, {
  interpolate, runOnJS,
  useAnimatedGestureHandler, useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Svg, { G, Line } from "react-native-svg";
import Candle from "./Candle";
import { scaleLinear } from "d3-scale";
import { candleType } from "./CandleChart";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TextInput
} from "react-native-gesture-handler";

import { debounce } from "../../util/utils";

interface CandleChartProps {
  dataMap : candleType[];
  domain : [number, number];
  height : number;
  onUpdateIndex : (index: number) => void;
  bg : string;
}
export const {  width: size } = Dimensions.get("window");

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
export const MARGIN = 2;

const CandleChartMaker = ({ dataMap, domain, height, onUpdateIndex, bg = "#333333" } : CandleChartProps) => {

  const marginViewHorizontal = 0.05;
  const reSize = (size - (size * marginViewHorizontal));
  const width  = reSize  / dataMap.length;
  const scaleY    = scaleLinear().domain(domain).range([reSize, 0]); // scaleY
  const scaleBody = scaleLinear().domain([0, Math.max(...domain) - Math.min(...domain)]).range([0, reSize]); // scaleX
  const transX  = useSharedValue(0);
  const transY  = useSharedValue(0);
  const valueBoxHeight = 40;
  const totalWidth = (width + MARGIN * 2) * dataMap.length;
  const eachWidth = (width + MARGIN * 2);

  const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent,{ x : number, y : number }>({

    onStart : ({ absoluteX , absoluteY, x, y } ,  ctx) => {
      transX.value = x;
      transY.value = y;
      ctx.x = transX.value;
      ctx.y = transY.value;
    },
    onActive : ({translationX , translationY, absoluteX, absoluteY }, {x, y}) => {

      // console.log(absoluteY, y , translationY, ); // 화면상의 실제값 , 시작값 , 이동방향에 따른 이동거리
      if(absoluteX <= 0){
       // transX.value = (size * marginViewHorizontal/2);
      }else if(absoluteX >= reSize){
        transX.value = reSize;
      }else{
        transX.value = x + translationX;
      }

      if(transY.value <= 0){
        transY.value = 0;
      }else if( transY.value >= height ){
        //transY.value = dHeight * 0.8;
      }else{
        transY.value = y + translationY; // 기존 거리에서 + 이동한 거리의 합 => 현재 위치
      }
    },
    onEnd : ({translationX, translationY, velocityX, velocityY, absoluteX, absoluteY }, {x, y}) => {

    },
  });

  const horizonLineAnimation = useAnimatedStyle(()=>{
    return {
      transform : [
        {
          translateY : transY.value,
        }
      ]
    }
  })

  const updateIndex = debounce((index: number) => {
    if(index >= 0){
      onUpdateIndex(index);
    }
  },100);

  const verticalLineAnimation = useAnimatedStyle(()=>{
    const X = interpolate(transX.value,[0, reSize], [ 0 , totalWidth ]);
    let index = 0;
    if(X >= (totalWidth-eachWidth)){
      index = (dataMap.length-1);
    }else{
      index = Math.floor(Math.floor(X) / Math.floor(eachWidth));
    }

    runOnJS(updateIndex)(index);

    return {
      transform : [
        {
          translateX : transX.value,
        }
      ]
    }
  })

  const animatedTextprops = useAnimatedProps(() => {
    const Y = interpolate(transY.value,[0, reSize],[domain[1], domain[0]]);
    return {
      text : `₩ ${Y.toFixed(2)}`
    };
  })

  const animatedTextStyle = useAnimatedStyle(()=>{
    const delta = valueBoxHeight + 10;
    const Y = (transY.value >= (height - delta)) ? (transY.value - delta) : transY.value;
    return {
      transform : [
        {
          translateY :Y
        }
      ]
    }
  })

  return (
    <View
      style={{ height: '100%', width: size,justifyContent:'center', alignItems:'center', backgroundColor: bg }}>

      <View
        pointerEvents={"none"}
        style={{position:'absolute', left: 0, top : '95%' , backgroundColor:'#535353'
        , width: size, height: 20,  paddingLeft : (size * marginViewHorizontal/2)
        , paddingRight : 5, flexDirection:'row'
        , justifyContent:"space-between"
      }}>
        <View style={{width:'30%', height: "100%",justifyContent:'center', alignItems:'flex-start',paddingHorizontal:5}}>
            <Text style={{color:"#cacaca", fontSize: 10, fontStyle:'italic'}}>{ dataMap[0].dateOnly +", "+ dataMap[0].time}</Text>
        </View>

        <View style={{width:'30%', height: "100%",justifyContent:'center', alignItems:'flex-end',paddingHorizontal:5}}>
          <Text style={{color:"#cacaca", fontSize: 10, fontStyle:'italic'}}>{ dataMap[dataMap.length-1].dateOnly +", "+ dataMap[dataMap.length-1].time }</Text>
        </View>
      </View>

      <Svg
        pointerEvents={"none"}
        style={[StyleSheet.absoluteFill,{ marginLeft: (size * marginViewHorizontal/2)}]}>
        { dataMap.map( (el, index) => {
          return <Candle
                    key={el.date}
                    index={index}
                    data={el}
                    width={width}
                    scaleY={scaleY}
                    scaleBody={scaleBody}
                />
          })
        }

        <AnimatedLine
          x1="0" y1="0" x2={ size - 20 } y2="0"
          stroke={"#FFFFFF"} strokeWidth="1" strokeOpacity={0.5} strokeDasharray={3}
          animatedProps={horizonLineAnimation}
        />

        <AnimatedLine
          x1="0" y1={0} x2={0}  y2={height}
          stroke={"#FFFFFF"} strokeWidth="1" strokeOpacity={0.5} strokeDasharray={3}
          animatedProps={verticalLineAnimation}
        />
      </Svg>

      <PanGestureHandler minDist={0} onGestureEvent={onGestureEvent}>
        <Animated.View style={[StyleSheet.absoluteFill,{ marginLeft: (size * marginViewHorizontal/2)}]}>
            <Animated.View
              pointerEvents={"none"}
              style={[animatedTextStyle,
                  { elevation: 4, borderRadius: 15, width: 80, height: valueBoxHeight, backgroundColor: '#FFFFFF', justifyContent:'center',alignSelf:'flex-end', marginRight: 5 }
                ]}>
                <AnimatedTextInput
                  pointerEvents={"none"}
                  style={{ fontSize: 12, color: "#333333", height: 40, textAlign : 'center' }}
                  underlineColorAndroid="transparent"
                  editable={false}
                  value={"₩"}
                  animatedProps={animatedTextprops}
                />
            </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )

};

export default CandleChartMaker;
