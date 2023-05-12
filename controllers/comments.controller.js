const { removeComment } = require("../models/comments.model")

exports.deleteComment = (req, res, next) => {
    removeComment(req.params.comment_id).then((result) => {
        res.status(204).send()
    }).catch((err) => {
        next(err)
    })
}