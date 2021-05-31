import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackListType } from "../../../App";
import { Pressable, Text, View, LayoutChangeEvent, TouchableOpacity } from "react-native";
import dataJson from '../LineChart/assets/candle_datas.json';
const dataMap : candleType[] = [...dataJson].map( (el) => (
  { ...el
    , time : el.date.split(" ")[1]
    , dateOnly : el.date.split(" ")[0].split("-")[1]+"-"+el.date.split(" ")[0].split("-")[2]
  }
  )).sort((a,b) => (a.date > b.date) ? 1 : -1);

import CandleChartMaker from "./CandleChartMaker";
import ValueInfoBoard from "./ValueInfoBoard";
export type candleType = { close: number, date: string, day: number, high: number, low :number, open : number, time: string, dateOnly? : string };

interface CandleChartProps {
  navigation : StackNavigationProp<StackListType>;
}

const CandleChart = ({ navigation } : CandleChartProps) => {
  const [domain, setDomain] = useState<[number, number]>([0,0]);
  const [originData,]   = useState<candleType[]>(dataMap);
  const [data, setData] = useState<candleType[] | undefined>(undefined);
  const [candleViewHeight, setCandleViewHeight] = useState(0);
  const [nowIndex, setNowIndex] = useState<null | number>(null);

  useEffect(()=>{
    dataUpdate("DAY");
  },[])

  const makeDomain = (dataMap: candleType[]) : [number, number] => {
    let high = -1, low = 0;
    dataMap.forEach((el)=>{
      if(el.high >= high){
        high = el.high;
      }
      if(low === 0){
        low = el.low;
      }else{
        if(el.low <= low){
          low = el.low;
        }
      }
    })
    return [low, high];
  }

  const dataUpdate = (type: "6H" | "12H" | "DAY" | "WEEK" | "MONTH" ) => {
    const sizeLimit : number =  (type ===  "6H") ? 6 : (type ===  "12H") ? 12 : (type ===  "DAY") ? 24 : (type ===  "WEEK") ? 24 * 7 : (type ===  "MONTH") ? 24 * 7 * 31 : originData.length;
    const tempData = [...originData].splice(0, sizeLimit); //.sort((a,b) => a.date > b.date ? 1 : -1);
    setDomain(makeDomain(tempData)); // 도메인 먼저 업데이트
    setData(tempData); // 그 다음에 데이터 업데이트
  }

  const updateCandleCharViewInfo = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if(height != null && height > 0){
      setCandleViewHeight(height);
    }
  }

  const updateNowIndex = (index: number) => {
    setNowIndex(index);
  }

  const [bg, setBg] = useState("#333333");
  const bgColor = ["#aaeead", "#333333" , '#ffa0a0' , "#31e7ff"];

  const changeChartBg = () => {
    let nowIndex = bgColor.indexOf(bg);
        nowIndex = nowIndex === 3 ? 0 : nowIndex + 1;
    console.log("updateBG", nowIndex , bgColor[nowIndex]);
    setBg(bgColor[nowIndex]);
  }

  return (
    <View style={{flex:1}}>

      <ValueInfoBoard dataMap={data} heightPercent={"20%"} nowIndex={nowIndex} />

      <View
        onLayout={updateCandleCharViewInfo}
        style={{height: "70%", width: '100%'}}>
        { (data && data.length > 0 && candleViewHeight > 0) ?
          <CandleChartMaker domain={domain} dataMap={data} height={candleViewHeight} onUpdateIndex={updateNowIndex} bg={bg}/>
          :
          null
        }
      </View>

      <View style={{ height: "10%", flexDirection:'row',paddingHorizontal: 10, justifyContent:'center', alignItems:'center'}}>
        <Pressable
          style={{width:30 , height: 30, justifyContent:'center', alignItems:'center', borderWidth: 1, borderRadius: 5, marginRight :5}}
          onPress={changeChartBg}>
          <View style={{ width: 20, height: 20, backgroundColor: bg, borderColor: '#000000', borderWidth: 2, borderRadius: 10 }}/>
        </Pressable>
        <Pressable
          style={{width:'17%', height: 30, justifyContent:'center', alignItems:'center', borderWidth: 1, borderRadius: 5, marginRight :5}}
          onPress={()=>dataUpdate("6H")}>
          <Text>{'6H'}</Text>
        </Pressable>
        <Pressable
          style={{width:'17%', height: 30, justifyContent:'center', alignItems:'center', borderWidth: 1, borderRadius: 5, marginRight :5}}
          onPress={()=>dataUpdate("12H")}>
          <Text>{'12H'}</Text>
        </Pressable>
        <Pressable
          style={{width:'17%', height: 30, justifyContent:'center', alignItems:'center', borderWidth: 1, borderRadius: 5, marginRight :5}}
          onPress={()=>dataUpdate("DAY")}>
          <Text>{'일봉'}</Text>
        </Pressable>
        <Pressable
          style={{width:'17%', height: 30, justifyContent:'center', alignItems:'center', borderWidth: 1, borderRadius: 5, marginRight :5}}
          onPress={()=>dataUpdate("WEEK")}>
          <Text>{'주봉'}</Text>
        </Pressable>

        <Pressable
          style={{width:'17%', height: 30, justifyContent:'center', alignItems:'center', borderWidth: 1, borderRadius: 5, marginRight :5}}
          onPress={()=>dataUpdate("MONTH")}>
          <Text>{'월봉'}</Text>
        </Pressable>

      </View>
    </View>
  )
}

export default CandleChart;
