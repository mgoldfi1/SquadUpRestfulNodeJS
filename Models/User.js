const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1024,
    },
    verifiedEmail: {
      type: Boolean,
      required: false,
      default: false,
    },
    favoritedGames: [
      {
        type: Schema.Types.ObjectId,
        ref: "Game",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        pending: {
          type: Boolean,
          default: true,
        },
        required: false,
      },
    ],
    listings: [
      { type: Schema.Types.ObjectId, ref: "Listing", required: false },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
