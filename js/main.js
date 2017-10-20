/**
 * The method is called after the
 * @param place
 */
function placeSelected(place) {
    $.ajax({
        url:'https://query.yahooapis.com/v1/public/yql',
        data:{
            q: 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+place+"\") and u='C'",
            format: 'json'
        },
        success: function (data) {
            var count=data.query.count;
            var forecastItem = data.query.results.channel.item;
            console.log (forecastItem);
            var description = forecastItem.description;
            console.log (description);

            $('#description').html(description);
        }
    });
}


$('#standort').on('change', function () {
    placeSelected(this.value);
});
