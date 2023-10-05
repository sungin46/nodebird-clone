module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    // MySQL에는 users 테이블 생성
    "User",
    {
      // id가 기본적으로 들어있음
      email: {
        // 많이 쓰이는 타입 : STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
        unique: true, // 고유 값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, // 필수
      },
    },
    {
      // 한글 저장
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  // 관계형 DB
  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "FollowingId",
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "FollowerId",
    });
  };
  return User;
};
