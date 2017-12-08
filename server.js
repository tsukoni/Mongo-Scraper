// dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// require note and article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// scraping tools
var request = require("request");
var cheerio = require("cheerio");
// mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

mongoose.Promise = Promise;

// initialize express
var app = express();

// use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false
}));

// make public a static dir
app.use(express.static("public"));

// database configuration with mongoose
mongoose.connect("mongodb://heroku_0vmm96p8:asvcfubbgu4uf9q9n6udl95ivm@ds133876.mlab.com:33876/heroku_0vmm96p8");
var db = mongoose.connection;

// show any mongoose errors
db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

// once logged into the db through mongoose, log a success message
db.once("open", function() {
	console.log("Mongoose connection successful.");
});

// ROUTES

// simple index route
app.get("/", function(req, res) {
	res.send(index.html);
});

// a get request to scrape the luckypeach website
app.get("/scrape", function(req, res) {
	// first, we grab the body of the html with request
	request("https://www.luckypeach.com/features/", function(error, response, html) {
		// then, we load that into cheerio and save it to $ for shorthand
		var $ = cheerio.load(html);
		// now, we grab every h2 within an article tag and do the following:
		// $(".entry-title").each(function(i, element) {
		$("h2.archive-list--title").each(function(i, element) {
			
			// save an empty result object
			var result = {};
			
			// add the text and href of every link; save them as properties of the result object
			// result.title = $(this.h2).children("a").text();
			// result.link = $(this.h2).children("a").attr("href");
			// result.desc = $(this.div).children("p").text();

			// result.title = $(this.h2.archive-list--title).children("a").text();
			// result.link = $(this.h2.archive-list--title).children("a").attr("href");
			// result.desc = $(this.archive-list--excerpt).children("p").text();

			result.title = $(this).children("a").text();
			result.link = $(this).children("a").attr("href");

			// using our article model, create a new entry
			// this effectivly passes the result object to the entry (and the title lin )
			var entry = new Article(result);

			// now, save that entry to the db
			entry.save(function(err, doc) {
				// log any errors
				if (err) {
					console.log(error);
				}
				// or log the doc
				else {
					console.log(doc);
				}
			});
		});


	});
	// tell the browser that we finished scraping the website
	res.send("Scrape complete.");
});

// this will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
	// grab every doc in the articles array
	Article.find({}, function(error, doc) {
		// log any errors
		if (error) {
			console.log(error);
		}
		// otherwise send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});

// grab an article by its object id
app.get("/articles:id", function(req, res) {
	// using the id passed in the id parameter, prepare a query that finds the matching one in our db
	Article.findOne({ "_id": req.params.id })
	// and populates all of the notes associated with it
	.populate("note")
	// now execute our query
	.exec(function(error, doc) {
		// log any errors
		if (error) {
			console.log(error);
		}
		// otherwise send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});

// create a new note or replace and existing note
app.post("/articles/:id", function(req, res) {
	// create a new note and pass the req.body to the entry
	var newNote = new Note(req.body);

	// and save the new note to the db
	newNote.save(function(error, doc) {
		// log any errors
		if (error) {
			console.log(error);
		}
		// otherwise
		else {
		// use the article id to find and update its note
		Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
		// execute the above query
		.exec(function(error, doc) {
			// log any errors
			if (error) {
				console.log(error);
			}
			// otherwise send the document to the browser
			else {
				res.send(doc);
			}
		});
		}
	});
});


// listen on port 3000
app.listen(3000, function() {
	console.log("App running on port 3000!");
});