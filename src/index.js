require('./config');

const express = require("express");
const app = express();
const router = require("./router");

app.use(router);

app.listen('5000', () => {
  console.log("server is now listening on port 5000");
})
