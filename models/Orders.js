const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FurnitureSchema = require("./Furniture").schema;

const OrdersSchema = new Schema({
  orderNo: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  products: [FurnitureSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: "profile",
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Orders = mongoose.model("orders", OrdersSchema);
