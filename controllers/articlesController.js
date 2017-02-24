// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Requiring our Comment and Article models
var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");


//Write routes here