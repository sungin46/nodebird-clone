import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";
import user from "./user";
import post from "./post";

// (이전상태, 액션) => 다음상태 형태의 함수
// combineReducers로 user와 post reducer를 합쳐준다.
// user와 post에 있는 initialState는 combineReducers가 알아서 합쳐준다.
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log("HYDRATE", action);
      return action.payload;
    default: {
      const combineReducer = combineReducers({
        user,
        post,
      });
      return combineReducer(state, action);
    }
  }
};

export default rootReducer;
