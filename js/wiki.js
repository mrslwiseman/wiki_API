$(document).ready(function(){


  var Search = {
//empty object to store search results in
    results: {},

    init: function(){

//bind events
      $("#search").submit(function(e){
         e.preventDefault();
       });

      $('#search').on("keyup", function(keypress){
        if (keypress.keyCode === 13){
          Search.getResults();
        }
      })

$('#clearSearchBar').hide();

      $("#searchInput").on("keyup", this.getResultsOnKeypress );
          $("#searchInput").on("keyup", function(){
            $('#clearSearchBar').show();

            $('#clearSearchBar').on("click", function(){
              $("#searchInput").val('');
                $("#searchInput").focus();
                  $('#results').html('');
                  $('#clearSearchBar').hide();
            });
          })

      $("#randomBtn").on("click", this.getRandomResult );

      // remove the search button
    },



    getResultsOnKeypress: function(key){


      if($("#searchInput").val().length > 3){

        Search.getResults();
      }
    },

getRandomResult: function(){

  $("#searchInput").val('')

  $.ajax({
    url: "https://en.wikipedia.org/w/api.php",

    data: {
      // more functionality than opensearch protocol
      action: "query",
      format: "json",
      prop: "extracts",
      generator: "random",
      exsentences: "3",
      exlimit: "max",
      exintro: "1",
      grnnamespace: 0,

      explaintext: 1,
      // version 1 returns array sorted by ID #, 2 by index #
      formatversion: 2,
    },
    type: 'POST',
    dataType: 'jsonp',
    success: function(response){

        console.log(response);
        Search.results = response.query.pages;
        Search.displayResults();


    }
  });



},


    getResultsOnKeypress: function(keypress){

      //will not go past this if statement if not true....
      if ( keypress.keyCode === 13 || $('#searchInput').val().length < 3 ) return;

      // prevents code from executing every time keypressed

      //look into how this works a bit more later on...
      clearTimeout($.data(this, 'delay'));
      $(this).data('delay', setTimeout(Search.getResults, 400));


    },

    getResults: function(){
      console.log("getResults run")

      var userInput = $("#searchInput").val();

      $.ajax({
        url: "https://en.wikipedia.org/w/api.php",

        data: {
          // more functionality than opensearch protocol
          action: "query",
          format: "json",
          prop: "extracts",
          generator: "search",
          exsentences: "1",
          exlimit: "max",
          exintro: "1",
          grnnamespace: 0,

          explaintext: 1,
          // version 1 returns array sorted by ID #, 2 by index #
          formatversion: 2,
          gsrsearch: userInput,


          // version 1 returns array sorted by ID #, 2 by index #

        },
        type: 'POST',
        dataType: 'jsonp',
        success: function(response){
          if(response.query.extract !== ""){
              console.log("if ran");
            Search.results = response.query.pages;
            Search.displayResults();
          }
          else if (response.query.extract == ""){
            console.log("else if ran");
            console.log(response.query.extract);

            /// this doesnt work!
            Search.results = "<p>Sorry, we couldn't find what you were looking for. Please try again.</p>";

            Search.displayResults();
          }
        }
      });






    },

    displayResults: function(){
//clear last results
      $('#results').html('');
      console.log(Search.results);
//      $('#results').append('<div id="resultsDesc">Showing results for ' + '"<i>' + $("#searchInput").val() + '</i>"' + '</div>');
      $.each(Search.results, function(page){
        var title = Search.results[page].title;
        var id = Search.results[page].pageid;
        var extract = Search.results[page].extract;

        $("#results").append(
          '<div class="resultItem">'
          + '<a href="http://en.wikipedia.org/?curid='
          + id + '" target="_blank" class="resultItems">'

          + '<h2>' + title + '</h2>'
          + extract
          + '</a>'
          + '</div>'

        );
      })

    }


  } // end of Search object.


  Search.init();


}) // end ready
