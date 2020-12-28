const express = require("express");
const passport = require("passport");

// models
const Furniture = require("../../models/Furniture");

const router = express.Router();

/**
 * @route  GET: api/furniture/:furnitureId
 * @description get a single record for furniture
 * @access Public
 */
router.get("/:furnitureId", (req, res) => {
  Furniture.findById(req.params.furnitureId)
    .then((furn) => {
      if (!furn) {
        return res.status(404).json({ msg: "That product does not exist" });
      }

      // if furn exists
      return res.json(furn);
    })
    .catch((err) =>
      console.error(
        "**** err: an error occurred while fetching furn by furnId *****",
        err
      )
    );
});

/**
 * @route  GET: api/furniture/all
 * @description get all existing furniture
 * @access Public
 */
router.get("/all/furniture", (req, res) => {
  Furniture.find()
    .then((furn) => {
      if (!furn) {
        return res.status(404).json({ msg: "no furn found" });
      }

      return res.json(furn);
    })
    .catch((err) =>
      console.error(
        "***** err: an error occurred while fetching all furn ****",
        err
      )
    );
});

/**
 * @route  POST: api/furniture
 * @description create a piece of furniture
 * @access Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const parsedFurn = {};
    if (req.body.name) parsedFurn.name = req.body.name;
    if (req.body.description) parsedFurn.description = req.body.description;
    if (req.body.price) parsedFurn.price = req.body.price;
    if (req.body.pictures) parsedFurn.pictures = req.body.pictures;
    if (req.body.dimensions) parsedFurn.dimensions = req.body.dimensions;
    if (req.body.materials) parsedFurn.materials = req.body.materials;
    if (req.body.date) parsedFurn.date = req.body.date;

    // let's create a furniture
    new Furniture(parsedFurn)
      .save()
      .then((createdFurn) =>
        res.json({
          msg: "Furniture was created successfully",
          data: createdFurn,
        })
      )
      .catch((err) =>
        res.status(400).json({
          msg: "err: an error occurred while creating a piece of furniture",
          err,
        })
      );
  }
);

/**
 * @route  PATCH: api/furniture/:furnitureId
 * @description update a piece of furniture
 * @access Private
 */
router.patch(
  "/:furnitureId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // let's get the parsed furn
    const parsedFurn = {};
    if (req.body.name) parsedFurn.name = req.body.name;
    if (req.body.description) parsedFurn.description = req.body.description;
    if (req.body.price) parsedFurn.price = req.body.price;
    if (req.body.date) parsedFurn.date = req.body.date;
    if (req.body.pictures) parsedFurn.pictures = req.body.pictures;
    /**
     * @note - it's worth noting that mongoose doesn't support atomic updates for nested objects, i.e,
     * say you have: { ..., dimensions: {height: 100cm, width: 100cm, depth: 100cm}} and in your payload you have
     * { ..., dimensions: {height: 100cm}}, width and depth will be deleted. One way of fixing this is by explicitly
     * checking for the nested properties in req.body. However, that can be tedious and doesn't scale, suppose you had
     * 10 nested fields (or more) with each having more than 5 properties (or more). A better way of fixing this is
     * making sure that the client copies the object that it wishes to update and sends the existing data as part of the nested object
     * 
     * @see - https://stackoverflow.com/questions/16400892/mongoose-js-atomic-update-of-nested-properties
     * @see - https://stackoverflow.com/questions/23832921/updating-nested-object-in-mongoose
     *
     */
    if (req.body.dimensions) parsedFurn.dimensions = req.body.dimensions;
    if (req.body.materials) parsedFurn.materials = req.body.materials;

    // find the doc and update it
    const query = { _id: req.params.furnitureId };
    const payload = { $set: parsedFurn };
    const options = { new: true };

    Furniture.findOneAndUpdate(query, payload, options)
      .then((updatedFurn) =>
        res.json({
          msg: `Furn ${req.params.furnitureId} was updated successfully`,
          data: updatedFurn,
        })
      )
      .catch((err) => {
        console.error(
          "**** err: an error occurred while updating a piece of furniture ****",
          err
        );
        return res.status(400).json({
          msg: "err: an error occurred while updating a piece of furniture",
          err,
        });
      });
  }
);

module.exports = router;
