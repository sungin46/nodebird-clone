import React, { useCallback } from "react";
import propTypes from "prop-types";
import Link from "next/link";
import { Menu, Input, Row, Col } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Router from "next/router";

import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import useInput from "../hooks/useInput";

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayout = ({ children }) => {
  // redux 사용으로 없앰
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // reducer가 된 후에는 useSelector를 이용해 값을 불러온다.
  // const isLoggedIn을 {}로 감싸면 state.user만 쓰고 불러올 수 있다. user 자체를 받아와서 isLoggedIn을 구조분해할당 할 수 있다.
  // 최적화 때문에 둘 중 어느것을 사용할 지 정하면 된다.
  // const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const { me } = useSelector((state) => state.user);
  const [searchInput, onChangeSearchInput] = useInput("");

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  return (
    <div>
      <Menu
        mode="horizontal"
        items={[
          { label: <Link href="/">노드버드</Link>, key: "/" },
          { label: <Link href="/profile">프로필</Link>, key: "/profile" },
          {
            label: (
              <SearchInput
                enterButton
                value={searchInput}
                onChange={onChangeSearchInput}
                onSearch={onSearch}
              />
            ),
            key: "/search",
          },
          { label: <Link href="/signup">회원가입</Link>, key: "/signup" },
        ]}
      />
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a
            href="https://github.com/sungin46/nodebird-clone"
            target="_blank"
            rel="noreferrer noopener"
          >
            Made by Hong Sung In
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: propTypes.node.isRequired,
};

export default AppLayout;
