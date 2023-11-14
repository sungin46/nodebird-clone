import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

// 해시태그 추출하기
const PostCardContent = ({ postData }) => (
  <div>
    {/* 정규표현식은 regexr.com 사이트에서 쉽게 테스트해볼 수 있다. */}
    {postData.split(/(#[^\s#]+)/g).map((v) => {
      // 인덱스를 키로 써도 되는 경우는 게시글 데이터가 수정될 때인데, 그 때는 Rerendering이 될 수밖에 없다.
      // postData는 사용자의 의도가 없는 한 바뀔 일이 없는 데이터다.
      if (v.match(/(#[^\s#]+)/)) {
        return (
          <Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={v}>
            {v}
          </Link>
        );
      }
      return v;
    })}
  </div>
);

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
