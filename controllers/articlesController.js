// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Requiring our Comment and Article models
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");

module.exports = function (app) {
  app
    .get("/scrape", function (req, res) {
      //use request dependecy to grab the body of the html
      request("https://petapixel.com/", function (error, response, html) {
        //Save the body of the html into a variabl called $  within cheerio
        var $ = cheerio.load(html);
        // Now grab every a tag link within an article heading  and iterate through it
        // and perform the following
        $(".post-excerpt").each(function (i, element) {

          var title = $(this)
            .children("h2")
            .children("a")
            .text();
          var link = $(this)
            .children("h2")
            .children("a")
            .attr("href");
          var articleSnippet = $(this)
            .children("div.text")
            .text();

          if (title && link && articleSnippet) {
            // Save an empty result object
            var result = {}

            // Add the text and href of every link, and save them as properties of the
            // result object
            result.title = title;
            result.link = link;
            result.articleSnippet = articleSnippet;
          }

          // Using our Article model, create a new entry This effectively passes the
          // result object to the entry (and the title, articleSnippet and link)
          var entry = new Article(result);

          // Now, save that entry to the db
          entry.save(function (err, doc) {
            // Log any errors
            if (err) {
              console.log(err// Or log the doc
              );
            } else {
              console.log(doc);
            }
          });

        });
      });

      // Tell the browser that we finished scraping the text
      res.send("Scrape Complete");
    });

  // Get the articles we scraped from  mongoDB
  app.get("/articles", function (req, res) {
    // Grab every doc in the Articles array
    Article
      .find({}, function (error, doc) {
        // Log any errors
        if (error) {
          console.log(error// Or send the doc to the browser as a json object
          );
        } else {
          res.json(doc);
        }
      });
  });

  // Grab an article by it's ObjectId
  app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the
    // matching one in our db...
    Article.findOne({"_id": req.params.id})
    // ..and populate all of the comments associated with it
      .populate("comment")
    // now, execute our query
      .exec(function (error, doc) {
        // Log any errors
        if (error) {
          console.log(error// Otherwise, send the doc to the browser as a json object
          );
        } else {
          res.json(doc);
        }
      });
  });

  // Create a new comment or replace an existing comment
  app.post("/articles/:id", function (req, res) {
    // Create a new comment and pass the req.body to the entry
    var newComment = new Comment(req.body);

    // And save the new comment the db
    newComment.save(function (error, doc) {
      // Log any errors
      if (error) {
        console.log(error// Otherwise
        );
      } else {
        // Use the article id to find and update it's comment
        Article.findOneAndUpdate({
          "_id": req.params.id
        }, {"comment": doc._id})
        // Execute the above query
          .exec(function (err, doc) {
            // Log any errors
            if (err) {
              console.log(err);
            } else {
              // Or send the document to the browser
              res.send(doc);
            }
          });
      }
    });
  })
}