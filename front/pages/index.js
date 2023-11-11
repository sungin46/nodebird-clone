import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_POST_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =
    useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    dispatch({
      type: LOAD_POST_REQUEST,
    });
  }, []);

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
            type: LOAD_POST_REQUEST,
            lastId,
          });
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      // 메모리에 쌓이기 때문에 이벤트리스너 삭제
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {/* map함수를 사용할 때 index를 key로 사용하지 말 것. */}
      {/* 게시글이 지워질 가능성이 있을 경우, 순서가 달라지거나 중간에 무언가가 추가될 때 */}
      {mainPosts.length > 0 &&
        mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
};
export default Home;
