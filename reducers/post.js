import shortId from "shortid";
import { produce } from "immer";

export const initialState = {
  mainPosts: [
    {
      id: 1,
      // 대문자로 사용하는 이유는 DB의 시퀄라이즈 때문
      // 어떤 정보와 다른 정보가 관계가 있다면 합쳐주는데, 합쳐진 것이 대문자로 나온다.
      // 소문자로 쓴 것은 게시글 자체의 속성이고
      // 대문자로 쓴 것은 다른 정보들과 합쳐서 준다.
      User: {
        id: 1,
        nickname: "홍성인",
      },
      content: "첫 번째 게시글 #해시태그 #IVE #아이브",
      Images: [
        {
          id: shortId.generate(),
          src: "https://i.ytimg.com/vi/A7eDNlAWHZk/maxresdefault.jpg",
        },
        {
          id: shortId.generate(),
          src: "https://i.ytimg.com/vi/9hhYHk7GVpI/maxresdefault.jpg",
        },
        {
          id: shortId.generate(),
          src: "https://img.segye.com/content/image/2023/04/18/20230418526190.jpg",
        },
      ],
      Comments: [
        {
          id: shortId.generate(),
          User: {
            id: shortId.generate(),
            nickname: "envy",
          },
          content: "Next.js와 redux!",
        },
        {
          id: shortId.generate(),
          User: {
            id: shortId.generate(),
            nickname: "envy",
          },
          content: "배움은 즐거워!",
        },
      ],
    },
  ],
  imagePaths: [],
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

// 액션 이름을 상수로 뺀 이유는 액션에서도 사용 가능하고 reducer 내에서도 사용 가능하기 때문이다.
export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const dummyPost = (data) => ({
  // data에 id와 content가 담기게 되어 두가지 데이터를 다시 바꿔준다.
  id: data.id,
  content: data.content,
  User: {
    id: 1,
    nickname: "홍성인",
  },
  Images: [],
  Comments: [],
});

const dummyCommnets = (data) => ({
  id: shortId.generate(),
  content: data,
  User: {
    id: 1,
    nickname: "홍성인",
  },
  Images: [],
  Comments: [],
});

// reducer - 이전 상태를 액션을 통해 다음 상태로 만들어내는 함수 (불변성을 지키면서)
// immer 도입
// draft는 불변성 상관없이 바꿔도 된다. 그러면 immer가 알아서 state를 불변성을 지켜서 다음 상태로 만들어준다.
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.addPostLoading = true;
        draft.addPostDone = true;
        // dummyPost를 앞에 선언해야 최신글이 위에 올라온다.
        draft.mainPosts.unshift(dummyPost(action.data));
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;
      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.removePostLoading = false;
        draft.removePostDone = true;
        // filter 함수를 사용해 지정한 id 이외의 게시글만 남기게 된다.
        draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS: {
        // 불변성을 지키기 위해 이렇게 만든다.
        // 바뀌는 것만 새로운 객체로 만들고 원래 것은 참조만 해야한다.
        // 그래야 메모리를 절약할 수 있다.
        // 이 부분때문에 immer를 사용했다. 확실하게 코드 양이 줄었다.
        const post = draft.mainPosts.find((v) => v.id === action.data.postId);
        post.Comments.unshift(dummyCommnets(action.data.content));
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
        // const postIndex = state.mainPosts.findIndex(
        //   (v) => v.id === action.data.postId
        // );
        // const post = { ...state.mainPosts[postIndex] };
        // post.Comments = [dummyCommnets(action.data.content), ...post.Comments];
        // const mainPosts = [...state.mainPosts];
        // mainPosts[postIndex] = post;
        // return {
        //   ...state,
        //   mainPosts,
        //   addCommentLoading: false,
        //   addCommentDone: true,
        // };
      }
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;
      default:
        return state;
    }
  });
export default reducer;
