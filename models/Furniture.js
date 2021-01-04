const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FurnitureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  pictures: [String],
  dimensions: {
    height: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
    depth: {
      type: String,
      required: true,
    },
  },
  materials: {
    frame: [String],
    padding: [String],
    cushion: [String],
    fabric: [String],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Furniture = mongoose.model("furniture", FurnitureSchema);
