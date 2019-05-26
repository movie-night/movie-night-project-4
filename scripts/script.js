const myApp = {}

myApp.key = '9c167d58adbd031f02b8a3cbcf7273c1';
myApp.movieArray = [];
myApp.counter = 0;
myApp.genres = {};

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

myApp.listGenres = function (data, index) {
    let genreArray = [];
    $('#resultGenre').empty()
    data[index].genre_ids.forEach(movieGenre => {
        for (item in myApp.genres) {
            // SWITCHED TO ARRAY.JOIN() METHOD TO KEEP P TAGS
            if (myApp.genres[item] === movieGenre) {
                genreArray.push(item);
            }
        }
        $('#resultGenre').text(genreArray.join(', '));
    });
}

myApp.diplayMovieInfo = function (data, index) {
    $('.posterImage').attr({
        src: `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${data[index].poster_path}`,
        alt: `Movie poster for ${data[index].title}`
    })
    $('.movieTitle').text(data[index].title)
    $('.movieYear').text(data[index].release_date.slice(0, 4))
    $('#resultOverview').text(data[index].overview)
    $('#resultLanguage').html(`<span class='upperCase'>${data[index].original_language}</span>`)
    $('#resultRating').text(data[index].vote_average)
    myApp.listGenres(data, index)
}

myApp.getMovies = function (e) {
    e.preventDefault();

    $('header').toggleClass('headerMoveUp');
    $('.result').toggleClass('removeBlock');
    $('.search').toggleClass('removeBlock');
    $('main').toggleClass('expandSection');

    const oldYear = '1980'
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()

    const todaysDate = `${year}-${month}-${day}`
    const pastDate = `${oldYear}-${month}-${day}`

    if ($('#age').is(':checked')) {
        $.ajax({
            url: 'https://api.themoviedb.org/3/discover/movie',
            method: 'GET',
            dataType: 'json',
            data: {
                api_key: myApp.key,
                with_genres: $('#genre').val(),
                'primary_release_date.lte': todaysDate,
                'vote_average.gte': 7
            }
        }).then(function (response) {
            console.log(response)
            myApp.movieArray = response.results
            myApp.counter = Math.floor((Math.random() * response.results.length))
            myApp.diplayMovieInfo(response.results, myApp.counter)
        })
    } else {
        $.ajax({
            url: 'https://api.themoviedb.org/3/discover/movie',
            method: 'GET',
            dataType: 'json',
            data: {
                api_key: myApp.key,
                with_genres: $('#genre').val(),
                'primary_release_date.lte': pastDate,
                'vote_average.gte': 7
            }
        }).then(function (response) {
            console.log(response)
            myApp.movieArray = response.results
            myApp.counter = Math.floor((Math.random() * response.results.length))
            myApp.diplayMovieInfo(response.results, myApp.counter)
        })
    }
}

myApp.nextMovie = function () {
    if (myApp.counter === myApp.movieArray.length - 1) {
        myApp.counter = 0;
        myApp.diplayMovieInfo(myApp.movieArray, myApp.counter)
    } else {
        myApp.counter++
        myApp.diplayMovieInfo(myApp.movieArray, myApp.counter)
    }
}

$(function () {
    myApp.getGenres();
    $('.result').addClass('removeBlock');

    $('#submit').on('click', function (e) {
        myApp.getMovies(e);
    });

    $('#resultAnotherButton').on('click', function (e) {
        myApp.nextMovie();
    });
})