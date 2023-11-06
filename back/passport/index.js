const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    // 쿠키에 id만 담고
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // id를 통해 DB에서 유저를 가져온다
      const user = await User.findOne({ where: { id } });
      done(null, user);
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};
