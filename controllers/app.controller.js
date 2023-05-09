const fs = require("fs/promises");

exports.getEndpoints = (req, res, next) => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf8")
    .then((data) => {
      const endpoints = JSON.parse(data);
      return endpoints;
    })
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    });
};
