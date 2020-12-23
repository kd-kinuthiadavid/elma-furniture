const express = require("express");
const dbConnection = require("./config/db");

const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const furniture = require("./routes/api/furniture");

// create an app instance
const app = express();

// make db connection
dbConnection();

// routes
app.use("/auth", auth);
app.use("/profile", profile);
app.use("/furniture", furniture);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Hello you sexy creature !!!"));

app.listen(port, () => console.log(`server running on PORT ${port}`));
