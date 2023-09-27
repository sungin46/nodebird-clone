import shortId from "shortid";

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
          src: "https://i.ytimg.com/vi/A7eDNlAWHZk/maxresdefault.jpg",
        },
        {
          src: "https://i.ytimg.com/vi/9hhYHk7GVpI/maxresdefault.jpg",
        },
        {
          src: "https://img.segye.com/content/image/2023/04/18/20230418526190.jpg",
        },
      ],
      Comments: [
        {
          User: {
            nickname: "envy",
          },
          content: "Next.js와 redux!",
        },
        {
          User: {
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
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

// 액션 이름을 상수로 뺀 이유는 액션에서도 사용 가능하고 reducer 내에서도 사용 가능하기 때문이다.
export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

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
  id: shortId.generate(),
  content: data,
  User: {
    id: 1,
    nickname: "홍성인",
  },
  Images: [],
  Comments: [],
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST:
      return {
        ...state,
        addPostLoading: true,
        addPostDone: false,
        addPostError: null,
      };
    case ADD_POST_SUCCESS:
      return {
        ...state,
        // dummyPost를 앞에 선언해야 최신글이 위에 올라온다.
        mainPosts: [dummyPost(action.data), ...state.mainPosts],
        addPostLoading: true,
        addPostDone: true,
      };
    case ADD_POST_FAILURE:
      return {
        ...state,
        addPostLoading: false,
        addPostError: action.error,
      };
    case ADD_COMMENT_REQUEST:
      return {
        ...state,
        addCommentLoading: true,
        addCommentDone: false,
        addCommentError: null,
      };
    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        // dummyPost를 앞에 선언해야 최신글이 위에 올라온다.
        addCommentLoading: true,
        addCommentDone: true,
      };
    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        addCommentLoading: false,
        addCommentError: action.error,
      };
    default:
      return state;
  }
};

export default reducer;
