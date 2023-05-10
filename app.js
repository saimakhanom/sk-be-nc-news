const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/app.controller");
const { getArticle, getAllArticles } = require("./controllers/articles.controller");

const app = express();

app.get("/api", getEndpoints);
app.get("/api/topics", getAllTopics);
app.get('/api/articles', getAllArticles)
app.get("/api/articles/:article_id", getArticle);

// error handlers
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log({err})
  res.status(500).send({ message: "Server error!" });
});

module.exports = app;
