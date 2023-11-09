import React from "react";
import Proptypes from "prop-types";
import { Button, Card, List } from "antd";
import { StopOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { REMOVE_FOLLOWER_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";

const FollowList = ({ header, data }) => {
  const dispatch = useDispatch();
  // 반복문 안에서 값을 가져와야 할 경우, 고차 함수를 사용해서 값을 불러온다.
  const onUnfollow = (id) => () => {
    if (header === "팔로잉") {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: id,
      });
    }
    dispatch({
      type: REMOVE_FOLLOWER_REQUEST,
      data: id,
    });
  };

  return (
    <List
      style={{ marginBottom: 20 }}
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size="small"
      header={<div>{header}</div>}
      loadMore={
        <div style={{ textAlign: "center", margin: "10px 0" }}>
          <Button>더 보기</Button>
        </div>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginTop: 20 }}>
          <Card
            actions={[
              <StopOutlined key="stop" onClick={onUnfollow(item.id)} />,
            ]}
          >
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
      )}
    />
  );
};

FollowList.propTypes = {
  header: Proptypes.string.isRequired,
  data: Proptypes.array.isRequired,
};

export default FollowList;
