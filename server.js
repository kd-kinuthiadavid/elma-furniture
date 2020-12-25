const express = require("express");
const dbConnection = require("./config/db");
const bodyParser = require("body-parser");
const passport = require("passport");

const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const furniture = require("./routes/api/furniture");

// create an app instance
const app = express();

// make db connection
dbConnection();

// passport config
require("./config/passport")(passport);

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());

// routes
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/furniture", furniture);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Hello you sexy creature !!!"));

app.listen(port, () => console.log(`server running on PORT ${port}`));
