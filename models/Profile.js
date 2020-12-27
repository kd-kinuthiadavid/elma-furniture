const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FurnitureSchema = require("./Furniture").schema;
const OrdersSchema = require("./Orders").schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "auth",
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  orderHistory: [OrdersSchema],
  shippingInfo: {
    city: {
      type: String,
      required: true,
    },
    town: {
      type: String,
      required: true,
    },
    addressOrBuilding: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
    },
  },
  // we'll add paymentInfo once we figure out what we're going to use for payments
  wishList: [FurnitureSchema],
  cart: [FurnitureSchema],
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
