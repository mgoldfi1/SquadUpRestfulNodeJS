const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const gameSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 1,
      max: 255,
    },
    // players: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    playerCount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    // listings: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Listing",
    //   },
    // ],
    listingCount: {
      open: {
        type: Number,
        default: 0,
      },
      closed: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
