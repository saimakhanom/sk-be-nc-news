const db = require("../db/connection");
const { checkCommentExists } = require("../utils/comments.utils");

exports.removeComment = (commentId) => {
  const checkComment = checkCommentExists(commentId);
  const queryPromise = db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [commentId])
    .then((result) => {
      return;
    });

  return Promise.all([checkComment, queryPromise]).then((res) => {
    return;
  });
};
