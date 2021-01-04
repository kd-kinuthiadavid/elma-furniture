const express = require("express");
const passport = require("passport");
const router = express.Router();

const Orders = require("../../models/Orders");
const Profile = require("../../models/Profile");

/**
 * @route  GET: api/orders/:order_id
 * @description get a single order
 * @access Private
 */
router.get(
  "/:order_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Orders.findById(req.params.order_id)
      .then((order) => {
        if (!order) {
          return res.status(404).json({
            msg: "err: The order that you're looking for doesn't exist",
          });
        }

        // if order exists
        return res.json(order);
      })
      .catch((err) => {
        console.error(
          "**** err: an error occurred while fetching order by id *****",
          err
        );
        return res.status(400).json({
          msg:
            "mongoose err: an error occurred while fetching order by id, please check your logs",
          err,
        });
      });
  }
);

/**
 * @route  GET: api/orders/all/orders
 * @description get all orders
 * @access Private
 */
router.get(
  "/all/orders",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Orders.find()
      .then((orders) => {
        if (!orders) {
          return res.status(404).json({ msg: "We couldn't find any orders" });
        }

        return res.json(orders);
      })
      .catch((err) => {
        console.error(
          "**** err: an error occurred while fetching a list of orders ****",
          err
        );
        return res.status(400).json({
          msg:
            " mongoose err: an error occurred while fetching a list of orders",
          err,
        });
      });
  }
);

/**
 * @route  POST: api/orders
 * @description create an order
 * @access Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // let's define a parsed order
    const parsedOrder = {};
    if (req.body.orderNo) parsedOrder.orderNo = req.body.orderNo;
    if (req.body.products) parsedOrder.products = req.body.products;
    if (req.body.amount) parsedOrder.amount = req.body.amount;
    if (req.body.date) parsedOrder.date = req.body.date;

    // let's get the associated profile
    const userId = req.user.id;
    Profile.findOne({ profile: userId })
      .populate("profile", ["phoneNumber", "shippingInfo"])
      .then((prof) => {
        if (!prof) {
          return res
            .status(404)
            .json({ msg: "we couldn't find a profile matching that userId" });
        }

        parsedOrder.user = prof;
      })
      .catch((err) =>
        console.log(
          "*** orders err: an error occurred while fetching a profile by userid ****",
          err
        )
      );

    // let's create a new order
    new Orders(parsedOrder)
      .save()
      .then((createdOrder) =>
        res.json({
          msg: "Order has been created successfully",
          data: createdOrder,
        })
      )
      .catch((err) => {
        console.error("*** err: when creating an order ***", err);
        return res.status(400).json({
          msg: "err: when creating an order",
          err,
        });
      });
  }
);

/**
 * @route  PATCH: api/orders/:order_id
 * @description update an order
 * @access Private
 */
router.patch(
  "/:order_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const orderId = req.params.order_id;
    // let's define a parsed order
    const parsedOrder = {};
    if (req.body.orderNo) parsedOrder.orderNo = req.body.orderNo;
    if (req.body.profile) parsedOrder.profile = req.body.profile;
    if (req.body.products) parsedOrder.products = req.body.products;
    if (req.body.amount) parsedOrder.amount = req.body.amount;
    if (req.body.date) parsedOrder.date = req.body.date;

    Orders.findOneAndUpdate({ _id: orderId }, parsedOrder, { new: true })
      .then((updatedOrder) => {
        if (!updatedOrder) {
          return res.status(404).json({
            msg: "We couldn't find the order that you're trying to update",
          });
        }

        return res.json({
          msg: `order ${orderId} was updated successfully`,
          data: updatedOrder,
        });
      })
      .catch((err) =>
        res.status(400).json({
          msg: `err: an err occurred while updating order ${orderId}`,
          err,
        })
      );
  }
);

module.exports = router;
