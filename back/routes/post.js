// node에서는 import, export를 사용하지 않고 require, module.exports를 사용한다.
// node는 웹 팩을 사용하지 않기 때문에 그렇다.
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Post, Comment, Image, User, Hashtag } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads 폴더가 없으므로 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      // 파일명.png
      const ext = path.extname(file.originalname); // 확장자 추출(.png)
      const basename = path.basename(file.originalname, ext); // 파일명
      done(null, basename + "_" + new Date().getTime() + ext); // 파일명173461341.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20mb
});

// POST /post
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({ where: { name: tag.slice(1).toLowerCase() } })
        )
      ); // result의 모양이 [[노드, true], [익스프레스, true]] 형태로 오기때문에 첫번째 인자만 가져오도록 한다.
      await post.addHashtags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      // 이미지를 여러개 올리면 image: [img1.png, img2.png]
      if (Array.isArray(req.body.image)) {
        // 배열을 시퀄라이즈 create하여 넣어주면 promise 배열이 된다.
        // DB에 파일 자체를 저장하는 것이 아니라 파일은 uploads폴더, DB에는 파일 주소를 넣는다.
        // 파일은 캐싱을 할 수 있지만 DB에 넣으면 캐싱을 하지 못한다.
        // 그래서 파일은 S3클라우드에 올려서 CDN 캐싱을 적용하고, DB에는 이미지 주소만 저장한다.
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        );
        await post.addImages(images);
      }
      // 이미지를 하나 올리면 imgae: img1.png
      else {
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
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
          attributes: ["id", "nickname"],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /post/images
router.post(
  "/images",
  isLoggedIn,
  upload.array("image"),
  async (req, res, next) => {
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
  }
);

// POST /post/1/retweet
router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      // /models/post.js에 as: 'Retweet을 해뒀기 때문에'
      include: [
        {
          model: Post,
          as: "Retweet",
        },
      ],
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    if (
      // 자신의 글 리트윗 방지
      req.user.id === post.UserId ||
      // 자신의 글을 리트윗한 타인의 리트윗 글을 다시 리트윗 방지
      (post.Retweet && post.Retweet.UserId === req.user.id)
    ) {
      return res.status(403).send("자신의 글은 리트윗 할 수 없습니다.");
    }
    // 타인의 글을 리트윗한 타인의 글을 리트윗할 수는 있다.
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await Post.findOne({
      where: { UserId: req.user.id, RetweetId: retweetTargetId },
    });
    if (exPost) {
      return res.status(403).send("이미 리트윗했습니다.");
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet",
    });
    const retweetWithPrevPost = await Post.findOne({
      where: {
        id: retweet.id,
      },
      include: [
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
      ],
    });
    res.status(201).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /post/1/comment
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET /post/1
router.get("/:postId", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(404).send("존재하지 않는 게시글입니다.");
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
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
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: User,
          as: "Likers",
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
      ],
    });
    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//PATCH /post/1/like
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    await post.addLikers(req.user.id);
    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// DELETE /post/1
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: { id: req.params.postId, UserId: req.user.id },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
