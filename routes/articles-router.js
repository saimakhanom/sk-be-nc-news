const { getAllArticles, getArticle, getCommentsForArticle, patchArticle, postCommentForArticle } = require("../controllers/articles.controller");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id", getArticle);
articlesRouter.get("/:article_id/comments", getCommentsForArticle);
articlesRouter.post("/:article_id/comments", postCommentForArticle);
articlesRouter.patch("/:article_id", patchArticle);


module.exports = articlesRouter;
