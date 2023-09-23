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
      content: "첫 번째 게시글 #해시태그 #익스프레스",
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
  postAdded: false,
};

// 액션 이름을 상수로 뺀 이유는 액션에서도 사용 가능하고 reducer 내에서도 사용 가능하기 때문이다.
const ADD_POST = "ADD_POST";
export const addPost = {
  type: ADD_POST,
};

const dummyPost = {
  id: 2,
  User: {
    id: 1,
    nickname: "홍성인",
  },
  content: "더미데이터입니다.",
  Images: [],
  Comments: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        // dummyPost를 앞에 선언해야 최신글이 위에 올라온다.
        mainPosts: [dummyPost, ...state.mainPosts],
        postAdded: true,
      };
    default:
      return state;
  }
};

export default reducer;
