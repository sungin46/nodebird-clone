module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    // MySQL에는 users 테이블 생성
    "Post",
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // RetweetId
    },
    {
      // 이모티콘 쓰려면 mb4를 같이 붙인다.
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" });
    db.Post.belongsTo(db.Post, { as: "Retweet" });
  };
  return Post;
};
