// require mongoose
var mongoose = require("mongoose");
// create schema class
var Schema = mongoose.Schema;

// create article schema
var ArticleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	// link is a required string
	link: {
		type: String,
		required: true
	},
	// this only saves one note's ObjectId, ref refers to the note model
	note: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
});

// create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// export the model
module.exports = Article;