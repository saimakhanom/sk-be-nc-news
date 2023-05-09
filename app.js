const express = require('express')
const { getAllTopics } = require('./controllers/topics.controllers')

const app = express()
app.use(express.json())


app.get('/api/topics', getAllTopics)




// error handlers
app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({message: 'Server error!'})
})




module.exports = app