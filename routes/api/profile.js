const express = require("express");
const passport = require("passport");

// models
const Profile = require("../../models/Profile");

const router = express.Router();

/**
 * @route  GET: api/profile
 * @description get the signed in user
 * @access Private - you have to be signed in
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .populate("user", ["firstName", "lastName", "email", "avatar"])
      .then((profile) => {
        if (!profile) {
          return res.status(404).json({ msg: "We couldn't find that profile" });
        }

        // if profile exists
        return res.json(profile);
      })
      .catch((err) =>
        res.json({
          msg: "err: an error occurred while fetching the current profile",
          err,
        })
      );
  }
);

/**
 * @route  POST: api/profile
 * @description create or update a profile
 * @access Private - you have to be signed in
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const parsedProfile = {};
        parsedProfile.user = req.user.id;
        if (req.body.phoneNumber)
          parsedProfile.phoneNumber = req.body.phoneNumber;
        if (req.body.orderHistory)
          parsedProfile.orderHistory = req.body.orderHistory;
        if (req.body.shippingInfo)
          parsedProfile.shippingInfo = req.body.shippingInfo;
        if (req.body.wishList) parsedProfile.wishList = req.body.wishList;
        if (req.body.cart) parsedProfile.cart = req.body.cart;

        // if profile exists; let's update it.
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: parsedProfile },
            { new: true }
          )
            .then((updatedProfile) =>
              res.json({
                msg: "A user with that profile exists, and has been updated!",
                data: updatedProfile,
              })
            )
            .catch((err) =>
              res.json({ msg: "err: profile update failed", err })
            );
        }

        // if profile doesn't exist; let's create one

        const newProfile = new Profile(parsedProfile);

        // let's make sure that the phone number is unique
        Profile.findOne({ phoneNumber: req.body.phoneNumber }).then((prof) => {
          if (prof) {
            return res.status(400).json({
              msg: "err: user with that phone number already exists !!!",
            });
          }
          // let's save the profile
          newProfile
            .save()
            .then((profile) =>
              res.json({
                msg: "profile was successfully created",
                data: profile,
              })
            )
            .catch((err) =>
              res.status(400).json({ msg: "err: profile was not created", err })
            );
        });
      })
      .catch((err) =>
        console.error("err when fetching profile by phone number", err)
      )
      .catch((err) =>
        res.json({
          msg: "err: an error occurred while creating/updating a profile",
          err,
        })
      );
  }
);

module.exports = router;
