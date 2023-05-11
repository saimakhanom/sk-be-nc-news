const db = require("../db/connection");


exports.checkTopicExists = (topic) => {
    return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then((result) => {
        if (result.rows.length === 0 && topic) {
            return Promise.reject({
                status: 404,
                message: "This topic doesn't exist",
            });
        }
    });
}

exports.checkAuthorExists = (author) => {
    return db
    .query(`SELECT author FROM articles WHERE author = $1`, [author])
    .then((result) => {
        if (result.rows.length === 0 && author) {
        return Promise.reject({
          status: 404,
          message: "This author doesn't exist",
        });
      }
    });
};

// check article exists
exports.checkArticleExists = (articleId) => {
    return db.query(`SELECT article_id FROM articles WHERE article_id = $1`, [articleId]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({
                status: 404,
                message: "This article doesn't exist",
              });
        }
    })
}
