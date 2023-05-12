const db = require("../db/connection");

exports.checkCommentExists = (commentId) => {
  return db
    .query(`SELECT comment_id FROM comments WHERE comment_id = $1`, [commentId])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "This comment doesn't exist",
        });
      }
    });
};
