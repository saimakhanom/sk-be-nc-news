const express = require("express");
const apiRouter = require("./routes/api-router");
const { handlePSQLErrors, handleRequestErrors, handleServerErrors } = require("./error-handlers/error-handlers");

const app = express();
app.use(express.json());

// routes
app.use("/api", apiRouter);

// error handlers
app.use(handlePSQLErrors);

app.use(handleRequestErrors);

app.use(handleServerErrors);

module.exports = app;
