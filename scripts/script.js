const myApp = {}

myApp.key = '9c167d58adbd031f02b8a3cbcf7273c1';
myApp.movieArray = [];
myApp.counter = 0;
myApp.genres = {};
myApp.voteAverage = 7;

myApp.start = function () {
  myApp.getGenres();

  $('#submit').on('click', function (e) {
    myApp.getMovies(e);
    sectionTransitionFull();
  });

  $('#resultAnotherButton').on('click', function (e) {
    sectionTransitionPartial();
    setTimeout(function () { myApp.nextMovie() }, 800);
  });
}

myApp.serverCall = function (date) {
  $.ajax({
    url: 'https://api.themoviedb.org/3/discover/movie',
    method: 'GET',
    dataType: 'json',
    data: {
      api_key: myApp.key,
      with_genres: $('#genre').val(),
      'primary_release_date.lte': date,
      'vote_average.gte': myApp.voteAverage
    }
  }).then(function (response) {
    myApp.movieArray = response.results
    myApp.counter = Math.floor((Math.random() * response.results.length))
    myApp.displayMovieInfo(response.results, myApp.counter)
  })
}

myApp.getGenres = function () {
  $.ajax({
    url: './scripts/json/genres.json',
    method: 'GET',
    dataType: 'json',
  }).then(function (response) {
    myApp.genres = response;
    $('select').empty();
    for (item in response) {
      $('select').append(`<option value="${response[item]}">${item}</option>`);
    }
  })
}

myApp.getLanguages = function () {
  $.ajax({
    url: './scripts/json/languages.json',
    method: 'GET',
    dataType: 'json',
  }).then(function (response) {
    myApp.languages = response;
  })
}

myApp.pickLanguage = function (lang) {
  const langCompare = function(language) {
    return language.iso_639_1 === lang;
  }
  const output = myApp.languages.find(langCompare);
  if ((output["name"] == '') || (output["name"] === output["english_name"])) {
    return `${output["english_name"]}`
  } else {
    return `${output["english_name"]} (${output["name"]})`
  }
}

myApp.listGenres = function (data, index) {
  let genreArray = [];
  $('#resultGenre').empty()
  data[index].genre_ids.forEach(movieGenre => {
    for (item in myApp.genres) {
      if (myApp.genres[item] === movieGenre) {
        genreArray.push(item);
      }
    }
    $('#resultGenre').text(genreArray.join(', '));
  });
}

myApp.displayMovieInfo = function (data, index) {
  if (data[index].poster_path !== '') {
  $('.posterImage').attr({
    src: `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${data[index].poster_path}`,
    alt: `Movie poster for ${data[index].title}`
  })
  } else {
    $('.posterImage').attr({
      src: `./assets/noposter.jpg`,
      alt: `Movie has no poster`
    })
  }
  $('.bannerImage').attr({
    'style': `background-image:url(https://image.tmdb.org/t/p/w1280${data[index].backdrop_path})`
  })
  $('.movieTitle').text(data[index].title)
  $('.movieYear').text(data[index].release_date.slice(0, 4))
  $('#resultOverview').text(data[index].overview)
  $('#resultLanguage').text(myApp.pickLanguage(data[index].original_language))
  $('#resultRating').text(data[index].vote_average)
  myApp.listGenres(data, index)
}

myApp.getMovies = function (e) {
  e.preventDefault();

  const oldYear = '1980'
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const day = new Date().getDate()

  const todaysDate = `${year}-${month}-${day}`
  const pastDate = `${oldYear}-${month}-${day}`

  if ($('#age').is(':checked')) {
    setTimeout(myApp.serverCall(todaysDate), 500)
  } else {
    setTimeout(myApp.serverCall(pastDate), 500)
  }
}

myApp.nextMovie = function () {
  if (myApp.counter === myApp.movieArray.length - 1) {
    myApp.counter = 0;
    myApp.displayMovieInfo(myApp.movieArray, myApp.counter)
  } else {
    myApp.counter++
    myApp.displayMovieInfo(myApp.movieArray, myApp.counter)
  }
}

$(function () {
  myApp.getLanguages();
  myApp.start();
})

const sectionTransitionFull = function () {
  $('body').addClass('stopScroll');
  $('.banner').removeClass('removeBlock');
  $('.search').addClass('sectionHidden');
  setTimeout(function () {
    $('header').addClass('headerMoveUp');
    $('.result').removeClass('removeBlock');
    $('.search').addClass('removeBlock');
    $('main').addClass('expandSection');
    $('.search').removeClass('sectionHidden');
  }, 800);
  setTimeout(function () {
    $('.banner').addClass('bannerFade');
    $('.result').removeClass('sectionHidden');
  }, 1000);
  setTimeout(function () {
    $('body').removeClass('stopScroll');
  }, 1200);
}

const sectionTransitionPartial = function () {
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
