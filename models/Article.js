// Require mongoose orm
var mongoose = require("mongoose");
// Create Schema object constructor
var Schema = mongoose.Schema;

// Create an article schematic to define the rules of the articles beings
// scraped.
var ArticleSchema = new Schema({
  // Here title is a required string because it's value is set to true for the
  // key, required.
  title: {
    type: String,
    required: true,
    unique: true
  },
  // link is a required string and also unique to prevent duplicates
  link: {
    type: String,
    required: true,
    unique: true
  },
  // articleSnippet is a required string and also unique to prevent duplicates
  articleSnippet: {
    type: String,
    required: true,
    unique: true
  },
  // This  saves an array of all the comments as a property of article schema, ref
  // refers to the Comment model
  comment: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Exports the model
module.exports = Article;
