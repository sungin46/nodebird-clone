const express = require("express");
const { Op } = require("sequelize");
const { Post, User, Image, Comment } = require("../models");

const router = express.Router();

// GET /posts
router.get("/", async (req, res, next) => {
  try {
    const where = {};
    // 초기 로딩이 아닐 때
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const posts = await Post.findAll({
      where,
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
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
