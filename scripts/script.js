const myApp = {}

myApp.getGenres = function(query) {
    $.ajax({
        url: './scripts/json/genres.json',
        method: 'GET',
        dataType: 'json',
    }).then(function(response){
    for (item in response) {
        $('select').append(`<option value="${response[item]}">${item}</option>`);
    }
    })
}

$(function(){
    myApp.getGenres();
})