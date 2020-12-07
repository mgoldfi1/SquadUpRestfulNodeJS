//Dependencies
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var jwt = require("jsonwebtoken");

//Verify token -> Call before each function that requires authorization
const verifyJWT = (token) => {
  try {
    let decoded = jwt.verify(token, "whatsgoodmotherfucker");
    return decoded;
  } catch (error) {
    console.log("Err:", error);
    return false;
  }
};

//Models
const Game = require("../Models/Game");
const Listing = require("../Models/Listing");

//Image processing for game photo uploads
var multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "public/images/games");
  },
  filename: function (req, file, callback) {
    console.log(req);
    console.log(file);
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

//Controller

//Should not be public, used to add game via postman to mongodb

router.post("/addGame", upload.single("image"), async function (req, res) {
  try {
    const newGame = new Game({
      name: req.body.name,
      image: req.file.originalname,
    });
    const saved = await newGame.save();
    res.json({ game: saved });
  } catch (error) {
    console.log(error);
  }
});

// Retrieve all games

router.get("/all", jsonParser, async function (req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verified = verifyJWT(token);
    if (verified) {
      try {
        const allGames = await Game.find({}, { players: 0, __v: 0 });
        res.status(200).json({ status: "OK", games: allGames });
      } catch (error) {
        console.log(error);
        res
          .status(400)
          .json({ status: "Error", message: "Resource not found" });
      }
    } else {
      res.status(403).json({ status: "Error", message: "Invalid token" });
    }
  } catch (error) {
    res.status(403).json({ status: "Error", message: "Invalid token" });
  }
});

//Retrieve all listings for a specified game ID

router.get("/listings", jsonParser, async function (req, res) {
  try {
    const gameId = req.body._id;
    console.log(req.body);
    if (!gameId) {
      throw { message: "no game id" };
    }
    const token = req.headers.authorization.split(" ")[1];
    const verified = verifyJWT(token);
    if (verified) {
      try {
        const listings = await Listing.find({ game: gameId });
        res.status(200).json({ status: "OK", listings });
      } catch (error) {
        console.log(error);
        res
          .status(400)
          .json({ status: "Error", message: "Resource not found" });
      }
    } else {
      res.status(403).json({ status: "Error", message: "Invalid token" });
    }
  } catch (error) {
    console.log(error);
    res.status(403).json({ status: "Error", message: "Invalid token" });
  }
});

//Create a new listing in the database for a specific game and user

router.post("/listing/new", jsonParser, async function (req, res) {
  try {
    const formData = req.body;

    const token = req.headers.authorization.split(" ")[1];
    const verified = verifyJWT(token);
    if (verified) {
      try {
        const listing = new Listing(formData);
        const savedListing = await listing.save();

        res.status(200).json({ status: "OK", listing });
      } catch (error) {
        console.log(error);

        res.status(400).json({ status: "Error", message: "Invalid listing" });
      }
    } else {
      res.status(403).json({ status: "Error", message: "Invalid token" });
    }
  } catch (error) {
    console.log(error);
    res.status(403).json({ status: "Error", message: "Invalid token" });
  }
});

module.exports = router;
