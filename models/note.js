// require mongoose
var mongoose = require("mongoose");
// create a schema class
var Schema = mongoose.Schema;

// create the Note schema
var NoteSchema = new Schema({
	// just a string
	title: {
		type: String
	},
	// just a string
	body: {
		type: String
	}
});

// mongoose will automatically save the ObjectIds of the notes
// these ids are referred to in the article model

// create the note model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// export the Note model
module.exports = Note;