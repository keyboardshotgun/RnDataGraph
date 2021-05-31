import {all, fork} from 'redux-saga/effects';

// import Axios from 'axios'; default Axios settings
// Axios.defaults.baseURL = 'http://localhost:3065';
// Axios.defaults.withCredentials = true; // req시 쿠키를 담아서 보내는 것을 허락함. (node/app.js도 세팅 필요)

import carSaga from './carSaga';

export default function* watchSaga() {
  yield all([fork(carSaga)]);
}
