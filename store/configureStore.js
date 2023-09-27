import { createWrapper } from "next-redux-wrapper";
import {
  applyMiddleware,
  compose,
  legacy_createStore as createStore, // createStore가 더이상 추천되지 않는다고 한다. 그래도 기능은 계속 쓸 수 있다고 한다.
} from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import createSagaMiddleware from "redux-saga";
import reducer from "../reducers";
import rootSaga from "../sagas";

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  // applyMiddleware([])로 하면 에러가 난다. 직접 배열을 넣는 것이 아니라 spread 해서 넣어야한다.
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares));
  const store = createStore(reducer, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === "development",
});

export default wrapper;
