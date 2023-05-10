const { fetchArticle, fetchAllArticles } = require("../models/articles.model")


exports.getArticle = (req, res, next) => {
    const articleId = req.params.article_id
    fetchArticle(articleId).then((article) => {
        res.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
    fetchAllArticles(req.query.sort_by, req.query.order, req.query.author, req.query.topic).then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}