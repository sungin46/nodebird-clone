module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    // MySQL에는 comment 테이블 생성
    "Comment",
    {
      // id가 기본적으로 들어있음
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      // 한글 저장
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Comment);
  };
  return Comment;
};
