import React, { useCallback } from "react";
import { Button, Form, Input } from "antd";
import useInput from "../hooks/useInput";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import styled from "styled-components";

const CommentFormWrapper = styled(Form)`
  position: relative;
  margin: 0;
`;
const CommentButton = styled(Button)`
  position: absolute;
  right: 0;
  bottom: -40px;
  z-index: 1;
`;

const CommentForm = ({ post }) => {
  const id = useSelector((state) => state.user.me?.id);
  const [commentText, onChangeCommentText] = useInput("");
  const onSubmitComment = useCallback(() => {
    console.log(post.id, commentText);
  }, [commentText]);
  return (
    <CommentFormWrapper onFinish={onSubmitComment}>
      <Input.TextArea
        value={commentText}
        onChange={onChangeCommentText}
        rows={4}
      />
      <CommentButton type="primary" htmlType="submit">
        째액
      </CommentButton>
    </CommentFormWrapper>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
