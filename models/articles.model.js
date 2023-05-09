const db = require("../db/connection");

exports.fetchArticle = (articleId) => {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1
    `,
      [articleId]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 400,
          message: "This article doesn't exist",
        });
        } else {
            return response.rows[0];
      }
    });
};
