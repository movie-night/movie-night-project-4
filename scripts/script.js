const myApp = {} //Namespace to hold all methods

myApp.key = '9c167d58adbd031f02b8a3cbcf7273c1'; //Api key
myApp.movieArray = [];  //Array to hold our movie results
myApp.counter = 0; //Counter to keep track of the index in the movie array
myApp.genres = {}; //Object holds all the key pairs of genres
myApp.voteAverage = 7; //Minimum movie rating
myApp.trashy = false;

//Start the app
myApp.start = function () {
  myApp.getGenres();
  myApp.getLanguages();
  //Event listener for submit button
  $('#submit').on('click', function (e) {
    myApp.getMovies(e);
    myApp.sectionTransitionFull();
  });

  //Event listener for 'Another' button
  $('#resultAnotherButton').on('click', function (e) {
    myApp.sectionTransitionPartial();
    setTimeout(function () { myApp.nextMovie() }, 800); //Delay nextMovie for 0.8s
  });
}

//API call to get movie data
myApp.serverCall = function (date) {
  $.ajax({
    url: 'https://api.themoviedb.org/3/discover/movie',
    method: 'GET',
    dataType: 'json',
    data: {
      'api_key': myApp.key,
      'with_genres': $('#genre').val(),
      'primary_release_date.lte': date,
      'vote_average.gte': myApp.voteAverage
    }
  }).then(function (response) {
    myApp.movieArray = response.results //Store API results into movie array
    myApp.counter = Math.floor((Math.random() * response.results.length)) //Generate a random number between 0 and the length of the movie array
    myApp.displayMovieInfo(response.results, myApp.counter)
  })
}

//API call to get trashy movie data
myApp.trashyServerCall = function (date) {
  $.ajax({
    url: 'https://api.themoviedb.org/3/discover/movie',
    method: 'GET',
    dataType: 'json',
    data: {
      'api_key': myApp.key,
      'with_genres': $('#genre').val(),
      'primary_release_date.lte': date,
      'vote_average.lte': myApp.voteAverage
    }
  }).then(function (response) {
    myApp.movieArray = response.results //Store API results into movie array
    myApp.counter = Math.floor((Math.random() * response.results.length)) //Generate a random number between 0 and the length of the movie array
    myApp.displayMovieInfo(response.results, myApp.counter)
  })
}

//Get the list of genres with their IDs
myApp.getGenres = function () {
  $.ajax({
    url: './scripts/json/genres.json',
    method: 'GET',
    dataType: 'json',
  }).then(function (response) {
    myApp.genres = response;
    $('select').empty();
    //Populate dropdown menu with genres
    for (item in response) {
      $('select').append(`<option value="${response[item]}">${item}</option>`);
    }
    $('select').append(`<option value="27" style="display:none" selected disabled>Choose a genre</option>`);
  })
}

//Get the list of languages
myApp.getLanguages = function () {
  $.ajax({
    url: './scripts/json/languages.json',
    method: 'GET',
    dataType: 'json',
  }).then(function (response) {
    myApp.languages = response; //Store languages
  })
}

//Get full spelling of movie's language
myApp.pickLanguage = function (lang) {
  //Return true/false if language exists in json file
  const langCompare = function (language) {
    return language.iso_639_1 === lang;
  }
  const output = myApp.languages.find(langCompare); //Find the language
  if ((output["name"] == '') || (output["name"] === output["english_name"])) {
    return `${output["english_name"]}` //Return English name if 'name' is blank or if 'name' and 'english_name' match
  } else {
    return `${output["english_name"]} (${output["name"]})` //Return English name
  }
}

//Display the genres of the movie
myApp.listGenres = function (data, index) {
  let genreArray = [];
  $('#resultGenre').empty()
  data[index].genre_ids.forEach(movieGenre => { //Check each movie genre ID
    for (item in myApp.genres) { //Compare movie genre ID with the list of genres ID
      if (myApp.genres[item] === movieGenre) { //If movie genre ID and genre ID match, add the genre key to the array
        genreArray.push(item);
      }
    }
    $('#resultGenre').text(genreArray.join(', ')); //Display the movie genre(s) on the page
  });
}

//Displays the movie information
myApp.displayMovieInfo = function (data, index) {
  if (data[index].poster_path !== '') { //Checks if movie has a poster
    $('.posterImage').attr({
      src: `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${data[index].poster_path}`,
      alt: `Movie poster for ${data[index].title}`
    })
  } else { //If theres no poster, insert dummy image
    $('.posterImage').attr({
      src: `./assets/noposter.jpg`,
      alt: `Movie has no poster`
    })
  }
  $('.bannerImage').attr({ //Display banner image in background
    'style': `background-image:url(https://image.tmdb.org/t/p/w1280${data[index].backdrop_path})`
  })
  $('.movieTitle').text(data[index].title) //Display movie title
  $('.movieYear').text(data[index].release_date.slice(0, 4)) //Display movie's release year
  $('#resultOverview').text(data[index].overview) //Display sypnopsis
  $('#resultLanguage').text(myApp.pickLanguage(data[index].original_language)) //Display movie's language
  $('#resultRating').text(data[index].vote_average) //Display movie's average vote rating
  myApp.listGenres(data, index) //Display movie's genre(s)
  $('.popcornRating').attr({  // Scale popcorn image to match rating
    'style': `width:${data[index].vote_average * 18}px`
  })
}


//Get movie data
myApp.getMovies = function (e) {
  e.preventDefault();
  myApp.trashCheck();
  if (myApp.trashy) {
    setTimeout(myApp.trashyServerCall(myApp.ageCheck(), 500));
  } else {
    setTimeout(myApp.serverCall(myApp.ageCheck(), 500));
  }
}

//If age is checked
myApp.ageCheck = function () {
  const oldYear = '1980' //Year for old movies
  const year = new Date().getFullYear() //Get current year
  const month = new Date().getMonth() + 1 //Get current month
  const day = new Date().getDate() //Get current day
  const todaysDate = `${year - 1}-${month}-${day}` //Create current date minus 1 year for API call
  const pastDate = `${oldYear}-${month}-${day}` //Create past date for API call
  if ($('#age').is(':checked')) {
    return todaysDate
  } else {
    return pastDate
  }
}

//Cylces through the movie array
myApp.nextMovie = function () {
  if (myApp.counter === myApp.movieArray.length - 1) { //Checks if the counter has reached the end of the array
    myApp.counter = 0; //Reset counter back to 0
    myApp.displayMovieInfo(myApp.movieArray, myApp.counter) //Display next movie
  } else {
    myApp.counter++ //Increase counter
    myApp.displayMovieInfo(myApp.movieArray, myApp.counter) //Display next movie
  }
}

//  Checking to see if user wants trashy movie
myApp.trashCheck = function () {
  if (!($('#trash').is(':checked'))) {
    myApp.trashy = true;
    myApp.voteAverage = 5;
  }
}

//Function for initial transition
myApp.sectionTransitionFull = function () {
  $('body').addClass('stopScroll');
  $('.banner').removeClass('removeBlock');
  $('.search').addClass('sectionHidden');
  $('.popcornLogo').addClass('visiblyHidden');
  $('.subHeaderText').addClass('visiblyHidden');
  setTimeout(function () {
    $('header').addClass('headerMoveUp');
    $('.result').removeClass('removeBlock');
    $('.search').addClass('removeBlock');
    $('main').addClass('expandSection');
    $('.search').removeClass('sectionHidden');
    $('.popcornLogo').addClass('removeBlock');
    $('.subHeaderText').addClass('removeBlock');
  }, 800);
  setTimeout(function () {
    $('.banner').addClass('bannerFade');
    $('.result').removeClass('sectionHidden');
  }, 1000);
  setTimeout(function () {
    $('body').removeClass('stopScroll');
  }, 1200);
}

//Function for transition through movie array
myApp.sectionTransitionPartial = function () {
  $('body').addClass('stopScroll');
  $('.banner').removeClass('bannerFade');
  $('.result').addClass('sectionHidden');
  setTimeout(function () {
    $('.banner').addClass('bannerFade');
    $('.result').removeClass('sectionHidden');
  }, 1000);
  setTimeout(function () {
    $('body').removeClass('stopScroll');
  }, 1200);
}

$(function () {
  myApp.start();
})