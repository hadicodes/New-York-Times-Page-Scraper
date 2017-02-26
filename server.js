// Our Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Using es6 js promise
mongoose.Promise = Promise;

// Initialize Express
var app = express();
var PORT = process.env.PORT || 8000;

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));

// allow the handlesbars engine to be in our toolset
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// Now set handlebars engine
app.set('view engine', 'handlebars');

// Make public a static dir to serve our static files
app.use(express.static("public"));

// Mongoose (orm) connects to our mongo db and allows us to have access to the MongoDB commands for easy CRUD 
mongoose.connect("mongodb://heroku_f9jqr8qs:efv0pqfn8qdqhqcv7k6fr8fhg@ds161039.mlab.com:61039/heroku_f9jqr8qs");
var db = mongoose.connection;

// if any errors than console errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// display a console message when mongoose has a conn to the db
db.once("open", function () {
  console.log("Mongoose connection successful.");
});

// Require the routes in our controllers js file
require("./controllers/articlesController.js")(app);

//Listen on PORT 8000 & notify us.
app.listen(PORT, function () {
  console.log("App running on port 8 THOUSAND!!!!!!!!");
});