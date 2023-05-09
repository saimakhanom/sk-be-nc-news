const { fetchArticle } = require("../models/articles.model")


exports.getArticle = (req, res, next) => {
    const articleId = req.params.article_id
    fetchArticle(articleId).then((article) => {
        res.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}