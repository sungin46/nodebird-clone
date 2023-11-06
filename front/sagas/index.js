import { all, fork } from "redux-saga/effects";
import axios from "axios";
import postSaga from "./post";
import userSaga from "./user";

// baseURL을 3005로 설정했기 때문에 saga에 있는 주소 앞에 무조건 localhost:3005가 붙는다.
// 중복된 주소를 줄일 수 있다.
axios.defaults.baseURL = "http://localhost:3005";

export default function* rootSaga() {
  // fork or call 로 함수를 실행해준다.
  // call은 동기 함수호출, fork는 비동기 함수호출
  yield all([fork(postSaga), fork(userSaga)]);
}
