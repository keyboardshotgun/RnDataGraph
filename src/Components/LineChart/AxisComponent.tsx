import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface AxisComponentProps {
  ticks: number;
  min: number;
  max: number;
  screenSize: number;
}

const BoxLayout = { width: 350, height: 350, topPadding: 10, bottomHeight: 40 };

const AxisComponent = ({ ticks = 5, min = 0, max = 100, screenSize = 350 } : AxisComponentProps) => {
  const [loops, setLoops] = useState(20);
  const [tickWidthHeight,setTickWidthHeight] = useState(17.5);
  const [space,setSpace] = useState(0);
  const [spaceMargin, setSpaceMargin] = useState(0);

  useEffect(()=>{
       setLoops((max / ticks) + 1);
       setTickWidthHeight(screenSize / (max/ticks) );
       // tick = 20 ? ->  20
       // tick = 10   ->   0
       // tick = 5    ->  -5
       setSpace((BoxLayout.topPadding + BoxLayout.bottomHeight));
       setSpaceMargin((5 * ticks -40) / 3);
  },[ticks,max,screenSize])

  return (
    <View style={{position:'absolute',left:0,top:0,width:'100%', height:BoxLayout.height+space,backgroundColor:'white',justifyContent:'flex-start',alignItems:"center",flexDirection:'row'}}>

      <View style={{position:'absolute',left:0,bottom : space + spaceMargin , width: 15,height:BoxLayout.height,backgroundColor:'transparent'}}>
        { Array.from({length : loops}).fill(0).map((el,index) =>
          <View
            key={index}
            style={{width:'100%',height: tickWidthHeight ,justifyContent:'center', alignContent:'flex-start'}}>
            <Text style={{color: (index === loops-1) ? 'transparent' : 'black', fontSize: 7, textAlign:'right'}} >{ max - index * ticks }</Text>
          </View>
        )}
      </View>

      <View style={{position:'absolute',left:0,bottom:0,width:'100%',height:BoxLayout.bottomHeight,backgroundColor:'transparent',justifyContent:'flex-start',alignItems:"center",paddingHorizontal: 20, flexDirection:'row'}}>
        { Array.from({length : loops}).fill(0).map((el,index) =>
          <View
            key={index}
            style={{ width : tickWidthHeight , height:'100%',justifyContent:'center', alignContent:'flex-start'}}>
            <Text style={{color:'black', fontSize: 7}} >{index * ticks}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default React.memo(AxisComponent);
