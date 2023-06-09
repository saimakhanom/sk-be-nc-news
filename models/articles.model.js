const db = require("../db/connection");
const {
  checkAuthorExists,
  checkTopicExists,
  checkArticleExists,
} = require("../utils/articles.utils");
const format = require("pg-format");
const { createRef, formatComments } = require("../utils/seed.utils");

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
  const validSorts = ["created_at", "votes", "title", "author", "topic", "comment_count"];
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

exports.fetchCommentsForArticle = (
  articleId,
  sortBy = "created_at",
  order = "desc"
) => {
  const validSorts = ["created_at", "votes", "author", "article_id"];
  if (!validSorts.includes(sortBy)) {
    return Promise.reject({ status: 400, message: "Invalid sort query" });
  } else if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, message: "Invalid order query" });
  }

  const checkArticle = checkArticleExists(articleId);

  return Promise.all([
    checkArticle,
    db.query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY ${sortBy} ${order}`,
      [articleId]
    ),
  ]).then((result) => {
    return result[1].rows;
  });
};

exports.postComment = (reqBody, articleId) => {
  if (!reqBody.username || !reqBody.body) {
    return Promise.reject({ status: 400, message: 'Bad request' });
  }

  const checkArticle = checkArticleExists(articleId);
  const queryPromise = db
    .query(`SELECT * FROM articles;`)
    .then(({ rows: articleRows }) => {
      reqBody.created_at = Date.now();
      reqBody.article_id = articleId;
      reqBody.author = reqBody.username;

      const articleIdLookup = createRef(articleRows, "title", "article_id");
      const formattedCommentData = formatComments([reqBody], articleIdLookup);
      const insertCommentsQueryStr = format(
        "INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L RETURNING *;",
        formattedCommentData.map(
          ({ body, author, article_id, votes = 0, created_at }) => [
            body,
            author,
            article_id,
            votes,
            created_at,
          ]
        )
      );

      return db.query(insertCommentsQueryStr).then((result) => {
        return result.rows[0];
      });
    });

  return Promise.all([checkArticle, queryPromise]).then((result) => {
    return result[1];
  });
};

exports.updateArticle = (articleId, propertiesToUpdate) => {
  const keysToUpdate = Object.keys(propertiesToUpdate)
  const keysAllowedUpdate = ['body', 'votes', 'article_img_url', 'topic', 'title', 'inc_votes']
  if (keysToUpdate.length === 0) {
    return Promise.reject({ status: 400, message: 'Bad request' });
  }

  for (let key of keysToUpdate) {
    if (!keysAllowedUpdate.includes(key)) {
      return Promise.reject({ status: 400, message: 'Bad request' });
    }
  }

  const checkArticle = checkArticleExists(articleId)
  const queryPromise = db.query(`SELECT * FROM articles`)
  .then((result) => {
    const articles = result.rows
    const articleKeys = Object.keys(articles[0])
      articleKeys.push('inc_votes')
      
      for (let key in propertiesToUpdate) {
        if (!articleKeys.includes(key)) {
          return Promise.reject({ status: 400, message: 'Bad request' })
        }
      }
      
      if (Object.keys(propertiesToUpdate).includes('inc_votes')) {
        const article = articles.find((article) => {
          return article.article_id == articleId
        })
        propertiesToUpdate.votes = article.votes + propertiesToUpdate.inc_votes
        delete propertiesToUpdate.inc_votes
      }

      let sets = [];
      for (let key in propertiesToUpdate) {
        sets.push(format(`%I = %L`, key, propertiesToUpdate[key]));
      }
      let setStrings = sets.join(",");
      const query = format(
        `UPDATE articles SET %s WHERE article_id = %L RETURNING *;`,
        setStrings,
        articleId
      );
    
      return db.query(query)
  }).then((result) => {
    return result.rows[0];
  }); 

  return Promise.all([checkArticle, queryPromise]).then((result) => {
    return result[1]
  })

};
