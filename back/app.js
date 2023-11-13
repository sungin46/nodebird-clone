// app.js라는 것을 실행할 때 node runtime이 이 코드를 실행해서 http가 서버 역할을 해준다.
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");

const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const hashtagRouter = require("./routes/hashtag");
const db = require("./models");
const passportConfig = require("./passport");

dotenv.config();
const app = express();
db.sequelize
  .sync()
  .then(() => {
    console.log("DB 연결 성공");
  })
  .catch(console.error);

passportConfig();

app.use(morgan("dev"));

// cookie를 같이 전달하고 싶을 때는 credentials를 true로 바꿔줘야한다.
// 보안이 더 강력해졌기 때문에 origin에 정확한 주소를 적어줘야 한다.
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// 운영 체제마다 path가 / 일수도 있고 \ 일수도 있기 때문에 path.join을 써준다.
app.use("/", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
// 보통 네이밍을 할 때 REST API 방식으로 많이 짓는다.
// app.get(가져오기), post(생성하기), put(전체수정), delete(제거), patch(부분수정)
// options(찔러보기?), head(헤더만 가져오기(헤더/바디)) 정도를 많이 사용한다.

// app.{METHOD}("URL", (req, res) => {})
app.get("/", (req, res) => {
  res.send("Hello Express");
});

// 라우터 분리
app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/hashtag", hashtagRouter);

// 기본적으로도 마지막 부분에서 에러처리가 되지만 커스터마이징을 하고싶다면 따로 에러처리 미들웨어를 선언해서 커스터마이징이 가능하다.
// app.use((err, req, res, next) => {});

app.listen(3005, () => {
  console.log("서버 실행 중!!!!");
});
