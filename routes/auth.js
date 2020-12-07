//Dependencies
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var jwt = require("jsonwebtoken");

//Models
const User = require("../Models/User");

//Encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

//Registration and Login

router.post("/register", jsonParser, async (req, res) => {
  const existingUser = User.findOne(
    { email: req.body.email },
    (err, result) => {
      if (err) {
        console.log(`ERROR ${err}`);
        res.status(500);
      } else {
        if (result) {
          res.status(200).json({
            status: "Error",
            message: "A user registered with this email already exists.",
          });
          return true;
        } else {
          bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(req.body.password, salt, async function (err, hash) {
              const user = new User({
                email: req.body.email,
                password: hash,
              });
              try {
                const savedUser = await user.save();
                const token = await jwt.sign(
                  {
                    email: user.email,
                    _id: user._id,
                  },
                  process.env.JWT_SECRET,
                  { expiresIn: "10d" }
                );
                res.status(200).json({
                  status: "OK",
                  message: "Account created successfully",
                  token,
                });
              } catch (error) {
                res.status(500);
              }
            });
          });
        }
      }
    }
  );
});

router.post("/login", jsonParser, async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      console.log(user);
      const match = await bcrypt.compare(req.body.password, user.password);

      if (match) {
        const token = await jwt.sign(
          {
            email: user.email,
            _id: user._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "10d" }
        );

        res.json({ status: "OK", token });
      } else {
        res.status(200).json({
          status: "Error",
          message: "Incorrect username or password",
        });
      }
    } else {
      res.status(200).json({
        status: "Error",
        message: "Incorrect username or password",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
