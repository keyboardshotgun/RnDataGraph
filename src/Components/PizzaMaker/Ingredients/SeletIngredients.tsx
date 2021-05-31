import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import {
  PanGestureHandler,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { snapPoint } from "react-native-redash";
import { State } from "../ImageData";
import { HEADER_HEIGHT } from "../Header";

// 필수는 이렇게 처리
interface IngredientSelectionProps {
  asset: ReturnType<typeof require>;
  ingredient: keyof State;
  state: [State, Dispatch<SetStateAction<State>>];
  selected: Animated.SharedValue<boolean>;
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3E9C6",
    justifyContent: "center",
    alignItems: "center",
    margin: 16,
  },
});

const SelectIngredient = ({
                               asset,
                               state: [state, setState],
                               selected,
                               ingredient, }: IngredientSelectionProps) => {

  const onPress = useCallback(() => {
    setState({
      ...state,
      [ingredient]: state[ingredient] === 0 ? Math.max(...Object.values(state)) + 1 : 0,
    });
  }, [ingredient, setState, state]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(()=>{
    setIsSelected(state[ingredient] > 0);
  },[state])

  // 이미지에서 크기 추출 하기
  const { width, height } = Image.resolveAssetSource(asset);
  // 이미지 가로 세로 비율 처리
  const aspectRatio = height / width;

  const onTapEvent = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onEnd: () => {
      runOnJS(onPress)();
    },
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onActive: ({ translationX, translationY }) => {
      translateX.value = translationX;
      translateY.value = translationY;
      selected.value = translateY.value < -HEADER_HEIGHT;
    },
    onEnd: ({ velocityY }) => {
      const dest = snapPoint(translateY.value, velocityY, [-HEADER_HEIGHT, 0]);
      translateX.value = withTiming(0);
      translateY.value = withTiming(0, {}, () => {
        opacity.value = withTiming(1);
      });
      if (dest !== 0) {
        opacity.value = 0;
        selected.value = false;
        runOnJS(onPress)();
      }
    },
  });

  const style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <TapGestureHandler onGestureEvent={onTapEvent}>
      <Animated.View>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View style={[styles.container,{ borderWidth: isSelected ? 2 : 0, borderColor: '#cc6edd' }]}>
            <Animated.View style={style}>
              <Image
                source={asset}
                style={{ width: 50, height: 50 * aspectRatio }}
              />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
};

export default SelectIngredient;
