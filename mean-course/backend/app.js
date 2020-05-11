const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Post = require("./model/post");
const mongoose = require("mongoose");
const postRoutes = require('./routes/post');

mongoose
  .connect(
    //1) for local
    "mongodb://localhost:27017/MyPosts?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false"

    //2) for cloud
    //"mongodb+srv://lland0504:<password>@cluster0-muikb.mongodb.net/MyPosts" for cloud
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

// Lets attach the body-parser middleware
// bodyParser.json() -> this will tell only to process json type data from the request body
app.use(bodyParser.json());
//another example showing body-parser can process other types of body other than json
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  //* means any domains
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});
module.exports = app;
app.use("/api/posts", postRoutes);