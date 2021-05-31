import React, { FunctionComponent } from 'react';
import { Text, View } from "react-native";

interface ValueInfoProps {
  title : string,
  value : number | string
  sign? : string | null
}

const ValueInfo = ({ title , value, sign }: ValueInfoProps) => {
  return (
    <View style={{width:'48%', height:'27%', justifyContent:'center', alignItems:'center', flexDirection:'row',marginBottom : 5 }}>
      <View style={{
          borderTopLeftRadius : 3
        , borderBottomLeftRadius : 3
        , backgroundColor:'#FFFFFF' ,width:'35%', height:'100%', justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
        <Text>{title}</Text>
      </View>
      <View style={{width:'65%'
        , borderTopRightRadius : 3
        , borderBottomRightRadius : 3
        , height:'100%', justifyContent:'flex-end', alignItems:'center', flexDirection:'row',backgroundColor:'#FFEEFF',paddingRight: 10}}>
        <Text style={{fontSize: 16, color: (sign) ? sign : "#333333" }}>{value}</Text>
      </View>
    </View>
  );
};

export default ValueInfo;
