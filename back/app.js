// app.js라는 것을 실행할 때 node runtime이 이 코드를 실행해서 http가 서버 역할을 해준다.
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");

const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
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

app.use(cors({ origin: "*", credentials: false }));
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

app.get("/", (req, res) => {
  res.send("Hello API");
});

app.get("/posts", (req, res) => {
  res.json([
    { id: 1, content: "hello" },
    { id: 2, content: "hello2" },
    { id: 3, content: "hello3" },
  ]);
});

// post 라우터 분리
app.use("/post", postRouter);
app.use("/user", userRouter);

app.listen(3005, () => {
  console.log("서버 실행 중!!!!");
});
