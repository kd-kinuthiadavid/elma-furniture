const express = require("express");
const dbConnection = require("./config/db");

const app = express();

// make db connection
dbConnection();

const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Hello you sexy creature !!!"));

app.listen(port, () => console.log(`server running on PORT ${port}`));
