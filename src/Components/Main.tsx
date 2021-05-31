import React, { FunctionComponent, useState } from "react";
import { Pressable, ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

interface MainInterface {
  navigation : StackNavigationProp<any, 'Main'>;
}
type MainProps = MainInterface;
const Main : FunctionComponent<MainProps>= ({ navigation } : MainInterface) => {
  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>

        <View style={{width:'100%',height: 80, marginTop: 10, padding:10}}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[{width: '100%', height: '100%', justifyContent:'center', alignItems: 'center', backgroundColor: '#FFFFFF', elevation: 2}]}
            onPress={()=>navigation.navigate('Charts')}>
            <Text style={{fontSize: 16}}>{'Charts'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{width:'100%',height: 80, marginTop: 10, padding:10}}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[{width: '100%', height: '100%', justifyContent:'center', alignItems: 'center', backgroundColor: '#FFFFFF', elevation: 2}]}
            onPress={()=>navigation.navigate('CandleChart')}>
            <Text style={{fontSize: 16}}>{'CandleChart'}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};
export default Main;
