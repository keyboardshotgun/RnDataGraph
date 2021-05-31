import {
  all, //call,
  delay,
  fork,
  put,
  takeLatest,
  //throttle,
} from 'redux-saga/effects';

import * as actionTypes from '../reducer/actionTypes';

function* addCount(action: any) {
  try{
    yield put({type: actionTypes.LOAD_CAR_DATA});
    yield put({type: actionTypes.COUNT_SET, data: 'up'});
    yield put({type: actionTypes.LOAD_DONE_CAR_DATA});
  } catch (err) {
    yield put({
      type: actionTypes.LOAD_ERROR_CAR_DATA,
      data: err.message,
    });
  }
}

function* addBackImage(action: any) {
  try{
    yield put({type: actionTypes.BACK_IMG_SET, data: action.data });
  } catch (err) {
    yield put({
      type: actionTypes.LOAD_ERROR_CAR_DATA,
      data: err.message,
    });
  }
}

function* removeCount() {
  try {
    yield put({type: actionTypes.LOAD_CAR_DATA});
    yield put({type: actionTypes.COUNT_SET, data: 'down'});
    yield put({type: actionTypes.LOAD_DONE_CAR_DATA});
  } catch (err) {
    yield put({
      type: actionTypes.LOAD_ERROR_CAR_DATA,
      data: err.message,
    });
  }
}

function* resetCount() {
  try {
    yield delay(500);
    yield put({type: actionTypes.LOAD_CAR_DATA});
    yield put({type: actionTypes.COUNT_SET, data: 'reset'});
    yield put({type: actionTypes.LOAD_DONE_CAR_DATA});
  } catch (err) {
    yield put({
      type: actionTypes.LOAD_ERROR_CAR_DATA,
      data: err.message,
    });
  }
}


function* updateCarData(action: any) {
  try {
    yield put({type: actionTypes.LOAD_CAR_DATA});
    yield put({type: actionTypes.SET_CAR_DATA, data: action.data});
    yield put({type: actionTypes.LOAD_DONE_CAR_DATA});
  } catch (err) {
    yield put({
      type: actionTypes.LOAD_ERROR_CAR_DATA,
      data: err.message,
    });
  }
}

function* watchAddBackImageSaga() {
  yield takeLatest(actionTypes.BACK_IMG_ADD, addBackImage);
}

function* watchAddCountSaga() {
  yield takeLatest(actionTypes.COUNT_UP, addCount);
}

function* watchRemoveCountSaga() {
  yield takeLatest(actionTypes.COUNT_DOWN, removeCount);
}

function* watchResetCountSaga() {
  yield takeLatest(actionTypes.COUNT_RESET, resetCount);
}

function* watchUpdateCarData() {
  yield takeLatest(actionTypes.UPDATE_CAR_DATA, updateCarData);
}

export default function* carSaga() {
  yield all([
    fork(watchAddCountSaga),
    fork(watchRemoveCountSaga),
    fork(watchResetCountSaga),
    fork(watchUpdateCarData),
    fork(watchAddBackImageSaga),
  ]);
}
