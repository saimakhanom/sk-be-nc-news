const {
  fetchArticle,
  fetchAllArticles,
  fetchCommentsForArticle,
  postComment,
  updateArticle,
} = require("../models/articles.model");

exports.getArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticle(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles(
    req.query.sort_by,
    req.query.order,
    req.query.author,
    req.query.topic
  )
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsForArticle = (req, res, next) => {
  const articleId = req.params.article_id;

  fetchCommentsForArticle(articleId, req.query.sort_by, req.query.order)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentForArticle = (req, res, next) => {
  postComment(req.body, req.params.article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  const propertiesToUpdate = req.body;

  updateArticle(articleId, propertiesToUpdate)
      .then((article) => {
        console.log(article)
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
