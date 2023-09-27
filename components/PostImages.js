import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import ImagesZoom from "./ImagesZoom";

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  @media only screen and (max-width: 576px) {
    flex-direction: column;
  }
`;
const ImageMoreTwo = styled.img`
  display: inline-block;
  width: 50%;
  @media screen and (max-width: 576px) {
    width: 100%;
  }
`;

const ButtonWrapper = styled.div`
  display: inline-block;
  width: 50%;
  text-align: center;
  vertical-align: middle;
`;

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);
  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);
  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);
  if (images.length === 1) {
    return (
      <>
        <img
          role="presentation" // 시각장애인용으로, 스크린 리더에서 클릭할 순 있지만 굳이 클릭하지 않아도 됨을 알림
          src={images[0].src}
          alt={images[0].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <ImageMoreTwo
          role="presentation"
          src={images[0].src}
          alt={images[0].src}
          onClick={onZoom}
        />
        <ImageMoreTwo
          role="presentation"
          src={images[1].src}
          alt={images[1].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  return (
    // 현재 좌우 디자인 높이가 맞지 않는 이슈가 있음.
    // flex를 사용해서 디자인을 적용시켜보려 했으나 아예 styled-components가 적용되지 않는 이슈 발생
    <div>
      <ImageWrapper>
        <ImageMoreTwo
          role="presentation"
          src={images[0].src}
          alt={images[0].src}
          onClick={onZoom}
        />
        <ButtonWrapper role="presentation" onClick={onZoom}>
          <PlusOutlined />
          <br />
          {images.length - 1}개의 사진 더 보기
        </ButtonWrapper>
      </ImageWrapper>
      {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
    </div>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PostImages;
