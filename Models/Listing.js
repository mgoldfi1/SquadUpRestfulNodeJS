const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      min: 25,
      max: 255,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      required: true,
      min: 50,
    },
    active: {
      type: Boolean,
      default: true,
    },
    seekingCount: {
      type: Number,
      required: true,
    },
    experienceLevel: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
