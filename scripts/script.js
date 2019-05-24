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

myApp.getMovies = function (e) {
    e.preventDefault();

    const oldYear = '1980'
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()

    const todaysDate = `${year}-${month}-${day}`
    const pastDate = `${oldYear}-${month}-${day}`

    if ($('input[type=radio]:checked').val() === 'new') {

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
            myApp.movieArray = response.results
            myApp.counter = Math.floor((Math.random() * response.results.length))
            $('img').attr({
                src: `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${myApp.movieArray[myApp.counter].poster_path}`,
                alt: `Movie poster for ${myApp.movieArray[myApp.counter].title}`
            })
            $('.movieTitle').text(myApp.movieArray[myApp.counter].title)
            $('.movieYear').text(myApp.movieArray[myApp.counter].release_date.slice(0, 4))
            $('#resultOverview').text(myApp.movieArray[myApp.counter].overview)
            $('#resultLanguage').text(myApp.movieArray[myApp.counter].original_language)
            $('#resultRating').text(myApp.movieArray[myApp.counter].vote_average)
            $('#resultGenre').empty()
            myApp.movieArray[myApp.counter].genre_ids.forEach(movieGenre => {
                for (item in myApp.genres) {
                    if (myApp.genres[item] === movieGenre) {
                        $('#resultGenre').append(`${item}, `)
                    }
                }
            });
        })
    } else if ($('input[type=radio]:checked').val() === 'old') {
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
            myApp.movieArray = response.results
            myApp.counter = Math.floor((Math.random() * response.results.length))
            $('img').attr({
                src: `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${myApp.movieArray[myApp.counter].poster_path}`,
                alt: `Movie poster for ${myApp.movieArray[myApp.counter].title}`
            })
            $('.movieTitle').text(myApp.movieArray[myApp.counter].title)
            $('.movieYear').text(myApp.movieArray[myApp.counter].release_date.slice(0, 4))
            $('#resultOverview').text(myApp.movieArray[myApp.counter].overview)
            $('#resultLanguage').text(myApp.movieArray[myApp.counter].original_language)
            $('#resultRating').text(myApp.movieArray[myApp.counter].vote_average)
            $('#resultGenre').empty()
            myApp.movieArray[myApp.counter].genre_ids.forEach(movieGenre => {
                for (item in myApp.genres) {
                    if (myApp.genres[item] === movieGenre) {
                        $('#resultGenre').append(`${item}, `)
                    }
                }
            });
        })
    }
}

myApp.nextMovie = function () {
    if (myApp.counter === myApp.movieArray.length - 1) {
        myApp.counter = 0;
        $('img').attr({
            src: `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${myApp.movieArray[myApp.counter].poster_path}`,
            alt: `Movie poster for ${myApp.movieArray[myApp.counter].title}`
        })
        $('.movieTitle').text(myApp.movieArray[myApp.counter].title)
        $('.movieYear').text(myApp.movieArray[myApp.counter].release_date.slice(0, 4))
        $('#resultOverview').text(myApp.movieArray[myApp.counter].overview)
        $('#resultLanguage').text(myApp.movieArray[myApp.counter].original_language)
        $('#resultRating').text(myApp.movieArray[myApp.counter].vote_average)
        $('#resultGenre').empty()
        myApp.movieArray[myApp.counter].genre_ids.forEach(movieGenre => {
            for (item in myApp.genres) {
                if (myApp.genres[item] === movieGenre) {
                    $('#resultGenre').append(`${item}, `)
                }
            }
        });
    } else {
        myApp.counter++
        $('img').attr({
            src: `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${myApp.movieArray[myApp.counter].poster_path}`,
            alt: `Movie poster for ${myApp.movieArray[myApp.counter].title}`
        })
        $('.movieTitle').text(myApp.movieArray[myApp.counter].title)
        $('.movieYear').text(myApp.movieArray[myApp.counter].release_date.slice(0, 4))
        $('#resultOverview').text(myApp.movieArray[myApp.counter].overview)
        $('#resultLanguage').text(myApp.movieArray[myApp.counter].original_language)
        $('#resultRating').text(myApp.movieArray[myApp.counter].vote_average)
        $('#resultGenre').empty()
        myApp.movieArray[myApp.counter].genre_ids.forEach(movieGenre => {
            for (item in myApp.genres) {
                if (myApp.genres[item] === movieGenre) {
                    $('#resultGenre').append(`${item}, `)
                }
            }
        });
    }
}

$(function () {
    myApp.getGenres();
    $('#submit').on('click', function (e) {
        myApp.getMovies(e);
    });

    $('#resultAnotherButton').on('click', function (e) {
        myApp.nextMovie();
    });
})