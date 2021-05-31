import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { StackNavigationProp } from '@react-navigation/stack';
import { StackListType } from "../../../App";
import { Surface } from "gl-react-native";
import { Pressable, Text, View } from "react-native";
import HelloBlue from "./HelloBlue";
import Slider from '@react-native-community/slider';
import {
  cancelAnimation,
  Easing,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming
} from "react-native-reanimated";

interface GradBoxGLProps {
  navigation: StackNavigationProp<StackListType>;
}

const GradBoxGL = ( { navigation } : GradBoxGLProps) => {

  const [red,setRed]     = useState(0.1);
  const [green,setGreen] = useState(0.1);
  const [blue,setBlue]   = useState(0.1);
  const [opacity, setOpacity] = useState(0.1);
  const aniValue = useSharedValue(0.1);
  const [graphType, setGraphType] = useState('TRI');

  useLayoutEffect(() => {
    navigation.setOptions({
      title : "GLSL diagram"
    });
  }, [navigation]);

  useEffect(()=>{
      aniValue.value = withTiming(1,{
        duration: 1000,
        easing: Easing.ease
      });
      return ()=>{
        console.log("clear animation, GL charts");
        cancelAnimation(aniValue);
      }
  },[])

  const updateWrapper = useCallback(( value: number) => {
      setOpacity(value);
  },[]);

  useDerivedValue(() => {
    runOnJS(updateWrapper)(aniValue.value);
    return aniValue.value;
  },[aniValue]);

  const chnageRgb = (type: 'RED' | 'GREEN' |'BLUE' , value: number) => {
    if(type === 'RED'){
      setRed(value);
    }else if(type === 'GREEN'){
      setGreen(value);
    }else if(type === 'BLUE'){
      setBlue(value);
    }
  }

  const updateOpacity = (value: number) => {
    setOpacity(value);
  }

  const updatePlotStyle = (type: 'TRI' | 'RECT') => {
    setGraphType(type);
  }

  return (
    <>
      <Surface style={ { width:350, height: 350, marginTop: 15, marginBottom : 30} }>
        <HelloBlue
          red={red}
          green={green}
          blue={blue}
          opacity={opacity}
          type={graphType}
        />
      </Surface>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 40,
          alignItems: "center",
          justifyContent: "center"
        }}>
        <View  style={{
          width: "15%",
          height: 40,
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: 5,
        }}>
          <Text>{'Red'}</Text>
        </View>
        <View  style={{
          width: "10%",
          height: 40,
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: 5,
        }}>
          <Text numberOfLines={1}>{ red.toFixed(1) }</Text>
        </View>
        <Slider
          onValueChange={ (value) => chnageRgb('RED', value) }
          style={{width: "75%", height: 40}}
          minimumValue={0.1}
          maximumValue={1}
          step={0.01}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 40,
          alignItems: "center",
          justifyContent: "center"
        }}>
        <View  style={{
          width: "15%",
          height: 40,
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: 5,
        }}>
          <Text>{'Green'}</Text>
        </View>
        <View  style={{
          width: "10%",
          height: 40,
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: 5,
        }}>
          <Text numberOfLines={1}>{ green.toFixed(1) }</Text>
        </View>
        <Slider
          onValueChange={ (value) => chnageRgb('GREEN', value) }
          style={{width: "75%", height: 40}}
          minimumValue={0.1}
          maximumValue={1}
          step={0.01}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 40,
          alignItems: "center",
          justifyContent: "center"
        }}>
        <View  style={{
          width: "15%",
          height: 40,
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: 5,
        }}>
          <Text>{'Blue'}</Text>
        </View>
        <View  style={{
          width: "10%",
          height: 40,
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: 5,
        }}>
          <Text numberOfLines={1}>{ blue.toFixed(1) }</Text>
        </View>
        <Slider
          onValueChange={ (value) => chnageRgb('BLUE', value) }
          style={{width: "75%", height: 40}}
          minimumValue={0.1}
          maximumValue={1}
          step={0.01}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 40,
          alignItems: "center",
          justifyContent: "center"
        }}>
        <View  style={{
          width: "15%",
          height: 40,
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: 5,
        }}>
          <Text>{'Opacity'}</Text>
        </View>
        <View  style={{
          width: "10%",
          height: 40,
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: 5,
        }}>
          <Text numberOfLines={1}>{ opacity.toFixed(1) }</Text>
        </View>
        <Slider
          value={opacity}
          onValueChange={updateOpacity}
          style={{width: "75%", height: 40}}
          minimumValue={0.1}
          maximumValue={1}
          step={0.01}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 20,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal : 10
        }}>
        <Pressable
          style={{width: '50%', height: '100%',justifyContent:'center', alignItems:'center', backgroundColor: graphType === 'TRI' ? '#f5f5f5' : '#333333' }}
          onPress={()=>updatePlotStyle('TRI')}>
            <Text>TRI</Text>
        </Pressable>
        <Pressable
          style={{width: '50%', height: '100%',justifyContent:'center', alignItems:'center', backgroundColor: graphType === 'RECT' ? '#f5f5f5' : '#333333' }}
          onPress={()=>updatePlotStyle('RECT')}>
            <Text>RECT</Text>
        </Pressable>
      </View>
    </>
  )
}

export default GradBoxGL;
