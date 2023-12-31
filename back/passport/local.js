const passport = require("passport");
const { Strategy: localStrategy } = require("passport-local");
const { User } = require("../models");
const bcrypt = require("bcrypt");

module.exports = () => {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          // 이메일 있는지 검사
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            // done(서버에러, 성공, 클라이언트 에러)
            return done(null, false, { reason: "존재하지 않는 이메일입니다." });
          }
          // 비밀번호 검사
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          return done(null, false, { reason: "비밀번호가 틀렸습니다." });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
