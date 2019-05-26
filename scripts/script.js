const myApp = {}

myApp.key = '9c167d58adbd031f02b8a3cbcf7273c1';
myApp.movieArray = [];
myApp.counter = 0;
myApp.genres = {};
myApp.voteAverage = 7;

myApp.start = function () {
    myApp.getGenres();
    $('.result').addClass('removeBlock');

    $('#submit').on('click', function (e) {
        myApp.getMovies(e);
    });

    $('#resultAnotherButton').on('click', function (e) {
        myApp.nextMovie();
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
    $('.posterImage').attr({
        src: `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${data[index].poster_path}`,
        alt: `Movie poster for ${data[index].title}`
    })
    $('.bannerImage').attr({
        'style': `background-image:url(https://image.tmdb.org/t/p/w1280${data[index].backdrop_path})`
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
    const sectionTransition = function () {
        $('header').toggleClass('headerMoveUp');
        $('.result').toggleClass('removeBlock');
        $('.search').toggleClass('removeBlock');
        $('main').toggleClass('expandSection');
        $('.search').removeClass('sectionHidden');
    }
    $('.banner').removeClass('removeBlock');
    $('.search').addClass('sectionHidden');
    setTimeout(function () {
        sectionTransition();
        $('.banner').addClass('bannerFade');
    }, 800);
    setTimeout(function () { $('.result').toggleClass('sectionHidden') }, 1000);

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
    myApp.start()
})