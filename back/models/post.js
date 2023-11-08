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
    // 관계 메소드에 의해 아래 주석과 같은 관계가 형성된다.
    db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // post.addHashtags
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments
    db.Post.hasMany(db.Image); // post.addImages, post.getImages
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // post.addLikers, post.removeLikers
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // post.addRetweet
  };
  return Post;
};
