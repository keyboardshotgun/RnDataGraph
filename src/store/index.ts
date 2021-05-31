import {combineReducers} from 'redux';
import carReducer from '../reducer/carReducer';
import { createSelectorHook, TypedUseSelectorHook  } from "react-redux";

const rootReducer = combineReducers({
  carReducer,
});

export type RootReducerType = ReturnType<typeof rootReducer>;
//export const useMySelector  = createSelectorHook<RootReducerType>();

export default rootReducer;
