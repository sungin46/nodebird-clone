import React, { useCallback } from "react";
import { Avatar, Button, Card } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { logoutAction } from "../reducers/user";

const CardMeta = styled(Card.Meta)`
  margin: 10px 0;
`;

const UserProfile = () => {
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch(logoutAction());
  }, []);
  return (
    <Card
      actions={[
        <div key="twit">
          트윗트윗
          <br />0
        </div>,
        <div key="followings">
          팔로잉
          <br />0
        </div>,
        <div key="followers">
          팔로워
          <br />0
        </div>,
      ]}
    >
      <CardMeta avatar={<Avatar>SI</Avatar>} title="SungIn" />
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
  );
};

UserProfile.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default UserProfile;
