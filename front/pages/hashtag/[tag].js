// hashtag/[tag].js
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { END } from "redux-saga";
import { useDispatch, useSelector } from "react-redux";

import wrapper from "../../store/configureStore";
import {
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_USER_POSTS_REQUEST,
} from "../../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";

const Hashtag = () => {
  const router = useRouter();
  const { tag } = router.query;
  const dispatch = useDispatch();
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );

  // 인피니트 스크롤링
  useEffect(() => {
    const onScroll = () => {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        // loadPostLoading을 이용해서 request를 한 번만 보낼 수 있게 설정한다.
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            lastId,
            data: tag,
          });
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      // 메모리에 쌓이기 때문에 이벤트리스너 삭제
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts.length, hasMorePosts, tag, loadPostsLoading]);

  return (
    <AppLayout>
      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, params }) => {
      const cookie = req ? req.headers.cookie : "";
      axios.defaults.headers.Cookie = "";
      if (req && cookie) {
        axios.defaults.headers.Cookie = cookie;
      }
      store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
      });
      store.dispatch({
        type: LOAD_HASHTAG_POSTS_REQUEST,
        data: params.tag,
      });
      store.dispatch(END);
      await store.sagaTask.toPromise();
    }
);

export default Hashtag;
