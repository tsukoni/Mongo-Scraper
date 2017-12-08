// initially hide articles div
$("#articles").hide();

// grab the articles as json on "scrape" click
$("#scrape").on("click", function() {
  // show articles div
  $("#articles").show();
  $.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    // $("#articles").append("<div class='newArticle'><p data-id='" + data[i]._id + "'><h3><a class='link' target='_blank' href='" + data[i].link + "'>" + data[i].title + "</a></h3><button type='button' id='" + data[i]._id + "' class='btn btn-default'>Add to Favorites</button></p></div>");
    $("#articles").append("<div class='newArticle'><p data-id='" + data[i]._id + "'><h3><a class='link' target='_blank' href='" + data[i].link + "'>" + data[i].title + "</a></h3><button type='button' id='favorite' data-id='" + data[i]._id + "' class='btn btn-default'>Add to Favorites</button></p></div>");
  }
  });  
});

// push saved articles to favorites page on button click
$("#articles").on("click", "#addNote", function() {
  console.log("clicked");
});

// Whenever someone clicks a p tag
$("thing").on("click", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


// for modals
$('lpModal').on('shown.bs.modal', function () {
  $('#myInput').focus()
})

$('#scrapeModal').on('shown.bs.modal', function () {
  $('#myInput').focus()
})

$('#0').on('shown.bs.modal', function () {
  $('#myInput').focus()
})


