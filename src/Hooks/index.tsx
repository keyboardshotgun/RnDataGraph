import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { InitialState, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

export const usePromiseAll = (
  promises: Promise<void | any[]>[],
  cb: () => void
  ) =>  useEffect(() => {
    (async () => {
      await Promise.all(promises);
      cb();
    })();
  });

type AssetsType = { fonts: [], Images: [] };
export const Assets : AssetsType = { fonts: [], Images: [] };

// Global Hoc Example.
interface WrapperProps {
  assets? : number[];
  children : ReactElement | ReactElement[];
}

const WrapperComponent = ({ assets, children } : WrapperProps) => {
  const [isNavigationReady, setIsNavigationReady] = useState(!__DEV__);
  const [initialState, setInitialState] = useState<InitialState | undefined>();

  const restoreState = async () => {
    try {
      const savedStateString = await AsyncStorage.getItem("STATE-KEY");
      return savedStateString ? JSON.parse(savedStateString) : undefined;
    }catch(e){
      return e;
    }
  };

  useEffect(() => {
    if (!isNavigationReady) {
        restoreState().then((res) => {
          setInitialState(res);
          setIsNavigationReady(true);
        }).catch((err) => console.log("WrapperComponent/initState Fail : ", err));
    }
  }, [isNavigationReady]);

  const onStateChange = useCallback(
    (state) =>
      AsyncStorage.setItem("STATE-KEY", JSON.stringify(state))
    ,[]);

  return (isNavigationReady) ? (
        <NavigationContainer {...{ onStateChange, initialState }}>
          <StatusBar barStyle={'light-content'} />
          { children }
        </NavigationContainer>
    ) : null
}

export default WrapperComponent;
