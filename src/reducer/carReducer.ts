import * as actionTypes from './actionTypes';
import immerProduce from '../util/immerProduce';
import {Draft} from 'immer';

export type initProps = {
  readonly carData: {
    readonly selected: {
      car_name: string;
      size: string;
      price: string;
    };
  };
  readonly counter: number;
  readonly carDataLoad: boolean;
  readonly carDataLoadError: boolean | null;
  readonly carDataLoadDone: boolean;
  readonly backImage: [{uri : string}] | object[];
};

const initState: initProps = {
  carData: {
    selected: {
      car_name: '',
      size: '',
      price: '',
    },
  },
  counter: 0,
  carDataLoad: false,
  carDataLoadError: false,
  carDataLoadDone: false,
  backImage : []
};

type setCounterPropsType = {
  data: string
}

export const setCount = (action: setCounterPropsType) => ({
  type: actionTypes.COUNT_SET,
  data: action.data,
});

export const resetCounter = () => ({
  type: actionTypes.COUNT_RESET,
});

type setCarDataPropsType = {
   data: {
     car_name: string,
     size: string,
     price: string,
   }
}

export const setCarData = (action: setCarDataPropsType) => ({
  type: actionTypes.SET_CAR_DATA,
  data: action.data
})

type setBackImageType = {
  data : {
    uri: string,
  }
}

export const setBackImage = (action: setBackImageType) => ({
  type: actionTypes.BACK_IMG_SET,
  data: action.data
})

type CounterAction =
  | ReturnType<typeof setCount>
  | ReturnType<typeof resetCounter>
  | ReturnType<typeof setCarData>
  | ReturnType<typeof setBackImage>;

const carReducer = (state: initProps = initState, action: CounterAction) =>
  immerProduce(state, (draft: Draft<initProps>) => {
    switch (action.type) {
      case actionTypes.BACK_IMG_SET:
        draft.backImage.unshift(action.data);
        break;
      case actionTypes.COUNT_SET:
        if (action.data === 'up') {
          draft.counter++;
        } else if (action.data === 'down') {
          if (draft.counter === 0) {
            draft.counter = 0;
          } else {
            draft.counter--;
          }
        } else if (action.data === 'reset') {
          draft.counter = 0;
        }
        break;
      case actionTypes.COUNT_RESET:
        draft.counter = 0;
        break;
      // case actionTypes.LOAD_CAR_DATA:
      //   draft.carDataLoad = true;
      //   draft.carDataLoadError = null;
      //   draft.carDataLoadDone = false;
      //   break;
      // case actionTypes.LOAD_ERROR_CAR_DATA:
      //   draft.carDataLoad = false;
      //   draft.carDataLoadError = true;
      //   draft.carDataLoadDone = false;
      //   break;
      // case actionTypes.LOAD_DONE_CAR_DATA:
      //   draft.carDataLoad = false;
      //   draft.carDataLoadError = false;
      //   draft.carDataLoadDone = true;
      //   break;
       case actionTypes.SET_CAR_DATA:
         draft.carData.selected = {
           car_name: action.data.car_name,
           size: action.data.size,
           price: action.data.price,
         };
         break;
      // case actionTypes.DELETE_CAR_DATA:
      //   draft.carData.selected = {
      //     car_name: '',
      //     size: '',
      //     price: '',
      //   };
      //   break;
      // case actionTypes.RESET_DATA:
      //   return initState;
      //   break;
      default:
        break;
    }
  });

export default carReducer;
