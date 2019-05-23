const myApp = {}

myApp.key = '9c167d58adbd031f02b8a3cbcf7273c1'
myApp.movieArray = [];

myApp.getGenres = function() {
    $.ajax({
        url: './scripts/json/genres.json',
        method: 'GET',
        dataType: 'json',
    }).then(function(response){
        $('select').empty();
        for (item in response) {
            $('select').append(`<option value="${response[item]}">${item}</option>`);
        }
    })
}

myApp.getMovies = function(e) {
    e.preventDefault();

    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()

    const todaysDate = `${year}-${month}-${day}`
    console.log(todaysDate)
    $.ajax({
        url: 'https://api.themoviedb.org/3/discover/movie',
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: myApp.key,
            with_genres: $('#genre').val(),
            primary_release_date: todaysDate
        }
    }).then(function (response) {
        myApp.movieArray = response.results
        randomNumber = Math.floor((Math.random() * 19))
        console.log(myApp.movieArray[randomNumber]);
        // console.log(myApp.movieArray);
        $('img').attr({
            src: `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${myApp.movieArray[randomNumber].poster_path}`,
            alt: `Movie poster for ${myApp.movieArray[randomNumber].title}`
        })
        $('.movieTitle').text(myApp.movieArray[randomNumber].title)
        $('.movieYear').text(myApp.movieArray[randomNumber].release_date.slice(0, 4))
        $('#resultOverview').text(myApp.movieArray[randomNumber].overview)
        $('#resultLanguage').text(myApp.movieArray[randomNumber].original_language)
        $('#resultRating').text(myApp.movieArray[randomNumber].vote_average)
    })
}

$(function(){
    myApp.getGenres();
    $('#submit').on('click', function(e) {
        myApp.getMovies(e);
    });
})