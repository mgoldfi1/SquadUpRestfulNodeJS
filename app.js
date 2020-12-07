const express = require("express");
const app = express();
const port = 8080;
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

//Remote Database connection *OBSCURE URL*

mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("connected to db")
);

///Route imports
var auth = require("./routes/auth");
var games = require("./routes/games");

app.use(morgan("short"));

app.use("/auth", auth);
app.use("/games", games);
app.use(express.static(__dirname + "/public"));

// start the server
app.listen(port, function () {
  console.log("app started");
});

// route our app
app.get("/", function (req, res) {
  res.send("hello world!");
});
