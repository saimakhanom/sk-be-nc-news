const db = require("../db/connection");
const {
  checkAuthorExists,
  checkTopicExists,
} = require("../utils.js/articles.utils");

exports.fetchArticle = (articleId) => {
  return db
    .query(
      `
      SELECT * FROM articles
      WHERE article_id = $1
    `,
      [articleId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "This article doesn't exist",
        });
      } else {
        return result.rows[0];
      }
    });
};

exports.fetchAllArticles = (
  sortBy = "created_at",
  order = "desc",
  author,
  topic
) => {
  // validate sort_by and order
  const validSorts = ["created_at", "votes", "title", "author", "topic"];
  if (!validSorts.includes(sortBy)) {
    return Promise.reject({ status: 400, message: "Invalid sort query" });
  } else if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, message: "Invalid order query" });
  }
  const checkAuthors = checkAuthorExists(author);
  const checkTopics = checkTopicExists(topic);

  // get comments
  const queryPromise = db
    .query(`SELECT article_id FROM comments`)
    .then((result) => {
      const comments = result.rows;
      let queryStr = `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles`;
      let queryVals = [];

      if (author) {
        queryStr += ` WHERE author = $1`;
        queryVals.push(author);
      }

      if (!author && topic) {
        queryStr += ` WHERE topic = $1`;
        queryVals.push(topic);
      } else if (author && topic) {
        queryStr += ` AND topic = $2`;
        queryVals.push(topic);
      }

      queryStr += ` ORDER BY ${sortBy} ${order}`;

      // get articles and add comment count
      return db.query(queryStr, queryVals).then((result) => {
        const articles = result.rows;
        return articles.map((article) => {
          let count = 0;
          comments.forEach((comment) => {
            if (comment.article_id === article.article_id) {
              count++;
            }
          });

          article.comment_count = count;
          return article;
        });
      });
    });

  // if any query fails, then the whole promise rejcets with correct error message
  return Promise.all([checkAuthors, checkTopics, queryPromise]).then(
    (result) => {
      return result[2];
    }
  );
};
