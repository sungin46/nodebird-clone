import axios from "axios";
import { all, delay, fork, put, takeLatest } from "redux-saga/effects";

function logInAPI(data) {
  return axios.post("/api/login", data);
}

function* logIn(action) {
  try {
    // const result = yield call(logInAPI, action.data); //이 경우에는 fork를 사용하면 안된다. 요청을 보내놓고 응답을 받지 않은 상태이기 때문이다.
    yield delay(1000);
    yield put({
      type: "LOG_IN_SUCCESS",
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_IN_FAILURE",
      data: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post("/api/logout");
}

function* logOut(result) {
  try {
    // const result = yield call(logOutAPI); //이 경우에는 fork를 사용하면 안된다. 요청을 보내놓고 응답을 받지 않은 상태이기 때문이다.
    yield delay(1000); // 아직은 서버가 없으니 비동기적인 효과를 나타내보기 위해 딜레이 사용.
    yield put({
      type: "LOG_OUT_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_OUT_FAILURE",
      data: err.response.data,
    });
  }
}

function* watchLogIn() {
  yield takeLatest("LOG_IN_REQUEST", logIn);
}

function* watchLogOut() {
  yield takeLatest("LOG_OUT_REQUEST", logOut);
}

export default function* userSaga() {
  yield all([fork(watchLogIn), fork(watchLogOut)]);
}
