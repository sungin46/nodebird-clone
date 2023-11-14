import React, { useCallback } from "react";
import { Avatar, Button, Card } from "antd";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { logoutRequestAction } from "../reducers/user";

export const CardMeta = styled(Card.Meta)`
  margin: 10px 0;
`;

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user);

  const onLogout = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);
  return (
    <Card
      actions={[
        <div key="twit">
          <Link href={`/user/${me.id}`} legacyBehavior>
            <a>트윗트윗</a>
          </Link>
          <br />
          {me.Posts.length}
        </div>,
        <div key="followings">
          <Link href="/profile" legacyBehavior>
            <a>
              팔로잉
              <br />
              {me.Followings.length}
            </a>
          </Link>
        </div>,
        <div key="followers">
          <Link href="/profile" legacyBehavior>
            <a>
              팔로워
              <br />
              {me.Followers.length}
            </a>
          </Link>
        </div>,
      ]}
    >
      <CardMeta
        avatar={
          <Link href={`/user/${me.id}`} legacyBehavior>
            <a>
              <Avatar>{me.nickname[0]}</Avatar>
            </a>
          </Link>
        }
        title={me.nickname}
      />
      <Button onClick={onLogout} loading={logOutLoading}>
        로그아웃
      </Button>
    </Card>
  );
};

export default UserProfile;
