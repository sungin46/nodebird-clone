const express = require("express");
const { Post, User, Image, Comment } = require("../models");

const router = express.Router();

// GET /posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      limit: 10,
      order: [
        // 포스트를 내림차순 정렬하고
        ["createdAt", "DESC"],
        // 댓글들을 댓글 생성일 기준으로 내림차순 정렬한다.
        [Comment, "createdAt", "DESC"],
      ],
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
