import React, { FunctionComponent, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import Header, { HEADER_HEIGHT } from './Header';
import {PIZZA_SIZE, BREAD_PADDING, PADDING, assets, defaultState } from './ImageData';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import SelectIngredient from "./Ingredients/SeletIngredients";
import Ingredients from "./Ingredients/Ingredients";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9F5F2",
    alignItems: "center",
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  content: {
    marginTop: PIZZA_SIZE + PADDING * 2 + HEADER_HEIGHT,
  },
  pizza: {
    margin: 32,
    width: PIZZA_SIZE,
    height: PIZZA_SIZE,
  },
  plate: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  bread: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    top: BREAD_PADDING,
    left: BREAD_PADDING,
    right: BREAD_PADDING,
    bottom: BREAD_PADDING,
  },
});

interface MainInterface {
  navigation : StackNavigationProp<any, 'Main'>;
}

type MainProps = MainInterface;
const Pizza : FunctionComponent<MainProps>= ({ navigation } : MainInterface) => {
  const [state, setState] = useState(defaultState);
  const selected = useSharedValue(false);

  const aniStyle = useAnimatedStyle(() => ({
    transform : [
      {
        scale: withTiming(selected ? 1.05 : 1)
      }
    ],
  }));

  return (
    <View style={styles.root}>

      <View style={styles.container}>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.content}
          horizontal={true}
        >
          <SelectIngredient
            asset={assets.basil[2]}
            ingredient={"basil"}
            state={[state, setState]}
            selected={selected}
          />

          <SelectIngredient
            asset={assets.sausage[3]}
            ingredient={"sausage"}
            state={[state, setState]}
            selected={selected}
          />

          <SelectIngredient
            asset={assets.onion[1]}
            ingredient={"onion"}
            state={[state, setState]}
            selected={selected}
          />

          <SelectIngredient
            asset={assets.broccoli[1]}
            ingredient={"broccoli"}
            state={[state, setState]}
            selected={selected}
          />

          <SelectIngredient
            asset={assets.mushroom[1]}
            ingredient={"mushroom"}
            state={[state, setState]}
            selected={selected}
          />
        </ScrollView>
      </View>
      <Header />
      <Animated.View style={[styles.pizza,aniStyle]}>
        <Image source={assets.plate} style={styles.plate} />
        <Image source={assets.bread[0]} style={styles.bread} />
        <Ingredients zIndex={state.basil} assets={assets.basil} />
        <Ingredients zIndex={state.sausage} assets={assets.sausage} />
        <Ingredients zIndex={state.sausage} assets={assets.sausage} />
        <Ingredients zIndex={state.onion} assets={assets.onion} />
        <Ingredients zIndex={state.broccoli} assets={assets.broccoli} />
        <Ingredients zIndex={state.mushroom} assets={assets.mushroom} />
      </Animated.View>
    </View>
  );
};

export default Pizza;
