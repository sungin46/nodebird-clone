import axios from "axios";
import { all, delay, fork, put, takeLatest } from "redux-saga/effects";

function addPostAPI(data) {
  return axios.post("/api/post", data);
}

function* addPost(action) {
  try {
    // const result = yield call(addPostAPI, action.data); //이 경우에는 fork를 사용하면 안된다. 요청을 보내놓고 응답을 받지 않은 상태이기 때문이다.
    yield delay(1000);
    yield put({
      type: "ADD_POST_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "ADD_POST_FAILURE",
      data: err.response.data,
    });
  }
}

//while take는 동기적으로 동작하지만 takeEvery는 비동기적으로 동작한다.
//takeLatest는 마지막 요청만 실행하고 앞의 요청은 전부 무시한다. (동시에 로딩중인 것들 중에서만)
//프론트에서 요청을 두 번 동시에 보냈다면 백엔드에서 같은 데이터가 쌓이진 않았는지 체크해야한다.
//요청은 취소하지 못하고 응답을 한 번만 한다.
//이것을 방지하기 위해 throttle같은 몇 초 이내에 한 번만 요청을 보내는 이펙트도 등장했다.
function* watchAddPost() {
  yield takeLatest("ADD_POST_REQUEST", addPost);
}
export default function* postSaga() {
  yield all([fork(watchAddPost)]);
}
