import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import ValueInfo from "./ValueInfo";
import { candleType } from "./CandleChart";

interface ValueInfoBoardProps {
  dataMap : candleType[] | undefined;
  heightPercent : string;
  nowIndex : number | null;
}

const ValueInfoBoard = ({  dataMap , heightPercent, nowIndex  } : ValueInfoBoardProps) => {
  const [valueInfo, setValueInfo] = useState<candleType | null>(null);
  const [signColor, setSignColor] = useState<string | null>(null);
  const [rate, setRate] = useState(0);
  useEffect(()=>{
      updateState();
  },[nowIndex]);

  const updateState = () => {
    if(nowIndex != null && dataMap){
      const {close, date, day, high, low, open, time} = dataMap[nowIndex];
      const color = (Math.sign(close - open) === Math.sign(1)) ? "#ff2727" : "#296bff";
      const diffRate = ((close - open) / open) * 100;
      setSignColor(color);
      setRate(diffRate);
      setValueInfo({close, date, day, high, low, open, time});
    }
  }

  return (
    <View style={{ height: heightPercent , width: '100%', backgroundColor:'#333333',padding : 5}}>
      { (valueInfo && signColor) &&
          <View style={
            { borderRadius: 5, flexDirection:'row',height: "100%", flexWrap:'wrap', justifyContent:'center', alignContent: 'center' ,backgroundColor:'#b79e9e',padding : 5 }
          }>
            <ValueInfo title={"시가"} value={"₩ " + valueInfo.open.toFixed(2)} />
            <View style={{width:'2%'}}/>
            <ValueInfo title={"종가"} value={"₩ " + valueInfo.close.toFixed(2)} />
            <ValueInfo title={"고가"} value={"₩ " + valueInfo.high.toFixed(2)} />
            <View style={{width:'2%'}}/>
            <ValueInfo title={"저가"} value={"₩ " + valueInfo.low.toFixed(2)} />
            <View style={{width:'48%', height:'27%', justifyContent:'center', alignItems:'center',borderRadius: 5, elevation: 5, flexDirection:'row',marginBottom : 5 ,backgroundColor:'#ffffff' }}>
              <Text style={{color:"#000000", fontSize: 16, fontWeight : 'bold' }}>{valueInfo.date}</Text>
            </View>
            <View style={{width:'2%'}}/>
            <ValueInfo title={"증감율"} value={rate.toFixed(3) + " ⁒"} sign={signColor} />
          </View>
      }
    </View>
  )
}

export default ValueInfoBoard;
