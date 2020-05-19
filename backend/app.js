const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./router");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0-iutku.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch(ex => {
    console.log("Failed connected to database");
    console.log(ex);
  });

app.use(bodyParser.json());
app.use("/images", express.static("images"));
app.use("/", express.static(path.join(__dirname, "src")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.enable("trust proxy");
app.use("/api/", routes);
if (!process.env.isTestEnv) {
  app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "src", "index.html"));
  });
}

module.exports = app;
