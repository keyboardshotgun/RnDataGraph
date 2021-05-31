import React from "react";
import { StatusBar } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { composeWithDevTools } from "redux-devtools-extension";
import { createStore, compose, applyMiddleware } from "redux";
import rootReducer from "./src/store/index";
import createSagaMiddleware from "redux-saga";
import watchSaga from "./src/saga/index";
import { Provider } from "react-redux";

import Main from "./src/Components/Main";
import Charts from "./src/Components/LineChart/Charts";
import CandleChart from "./src/Components/CandleChart/CandleChart";

//saga settings
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const enhancer =
  process.env.NODE_ENV === "production"
    ? compose(applyMiddleware(...middlewares))
    : composeWithDevTools(applyMiddleware(...middlewares));
const store = createStore(rootReducer, enhancer);

sagaMiddleware.run(watchSaga);

export type StackListType = {
  Main: undefined;
  Charts : undefined;
  CandleChart : undefined;
};

type RootStackParamList = { Main: StackListType, }
const Stack = createStackNavigator<StackListType>();
const RootStack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
        <Stack.Navigator>

            <Stack.Screen
              options={{
                headerShown: false,
                title: "Item List"
              }}
              name={"Main"}
              component={Main}
            />

            <Stack.Screen
              options={{
                headerShown: true,
                title: "Charts"
              }}
              name={'Charts'}
              component={Charts}
            />

            <Stack.Screen
              options={{
                headerShown: true,
                title: "CandleChart"
              }}
              name={'CandleChart'}
              component={CandleChart}
            />

        </Stack.Navigator>
    </>
  );
};

const CombineStack = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack.Navigator mode={"modal"}>
          <RootStack.Screen
            name={"Main"}
            component={App}
            options={{ headerShown: false, animationEnabled: false }}
          />
          {/*<RootStack.Screen*/}
          {/*  name={"SettingLocation"}*/}
          {/*  component={SettingLocation}*/}
          {/*  options={{*/}
          {/*    headerShown: false,*/}
          {/*    animationEnabled: false,*/}
          {/*  }}*/}
          {/*/>*/}
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default CombineStack;
