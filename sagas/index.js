import { all, fork } from "redux-saga/effects";

import postSaga from "./post";
import userSaga from "./user";

export default function* rootSaga() {
  // fork or call 로 함수를 실행해준다.
  // call은 동기 함수호출, fork는 비동기 함수호출
  yield all([fork(postSaga), fork(userSaga)]);
}
