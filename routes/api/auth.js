const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const User = require("../../models/Auth");

// define the home page route
router.get("/", (req, res) => {
  res.send("Auth home");
});

/**
 * @route  POST: api/auth/register
 * @description register a user
 * @access Public - hey, you need access to register!
 */
router.post("/register", (req, res) => {
  // find user by email
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        // user exists; return an error
        return res
          .status(400)
          .json({ email: "A user with that email already exists!" });
      } else {
        //  user doesn't exist; let's create one
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          avatar: req.body.avatar,
          password: req.body.password,
        });

        // let's hash the password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            // handle the err and hash/ our new pswd
            if (err) throw err;
            newUser.password = hash;

            // now let's save the user
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) =>
                console.error(
                  "**** an err occurred while saving the new user *****",
                  err
                )
              );
          });
        });
      }
    })
    .catch((err) =>
      console.error(
        "**** an err occurred while fetching the user by email ******",
        err
      )
    );
});

/**
 * @route  POST: api/auth/register
 * @description register a user
 * @access Public - hey, you need access to register!
 */
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  User.findOne({ email })
    .then((user) => {
      // return an error if the user doesn't exist
      if (!user) {
        return res
          .status(404)
          .json({ email: "A user with that email address was not found" });
      }

      // if user exists, let's check if the passwords match
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res
              .status(400)
              .json({ password: "The password that you entered is incorrect" });
          }

          // return the user?
          return res.json(user);
        })
        .catch((err) => console.error("**** err: comparing passwords *****"));
    })
    .catch((err) =>
      console.error(
        "**** login: an error occurred while fetching user by email ***"
      )
    );
});
module.exports = router;
