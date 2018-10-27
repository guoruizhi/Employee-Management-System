// set up ========================
const express = require("express");
const app = express(); // create our app with express
const mongoose = require("mongoose"); // mongoose for mongodb
const morgan = require("morgan"); // log requests to the console (express4)
const bodyParser = require("body-parser"); // pull information from HTML POST (express4)

// database connect =================
mongoose.connect(
  "mongodb://dlxh:1988grz@ds159631.mlab.com:59631/dlxh",
  { useNewUrlParser: true }
);

// configuration =================

// app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json
app.use(express.static("public/uploads/")); //Fetch the image

// routes =========================
require("./routes/api")(app);

// port ======================================================================
const port = "4000";
app.listen(port);
console.log("Magic happens at " + port);
