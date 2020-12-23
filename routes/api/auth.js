const express = require("express");
const router = express.Router();

// define the home page route
router.get("/", (req, res) => {
  res.send("Auth home");
});
// define the about route
router.get("/about", (req, res) => {
  res.send("about auth");
});

module.exports = router;
