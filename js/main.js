/**
 * The method is called after the user selects one or other location to view its forecast
 * @param place
 */
function placeSelected(place) {
    // redirect to locally stored json
    var debug = getUrlParam("debug");
    var iconUrl = 'https://s.yimg.com/zz/combo?a/i/us/we/52/';

    if (debug == 1) {
        var placeSuffix;
        switch (place) {
            case 'Cologne, Germany':
                placeSuffix='k';
                break;
            default:
                placeSuffix='d';
        }

        $.getJSON("api/yql-" + placeSuffix + ".json", yqlSuccess);
    } else {

        $.ajax({
            url:'https://query.yahooapis.com/v1/public/yql',
            data:{
                q: 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+place+"\") and u='C' limit 3 ",
                format: 'json'
            },
            success: yqlSuccess
        });
    }

    // will be used as callback, either by loading from the yahoo or from local stored json.
    function yqlSuccess(data) {
        if (data.query.count > 0) {
            var channel = data.query.results.channel;
            var units = channel.units;
            var u = units.temperature;
            $('#description').empty();

            jQuery.each(channel.item.forecast, function(idx, f) {
                // console.log(f);
                var c = $('#weatherTemplate').clone();
                c.find('.weather_date').text(f.date);
                c.find('.weather_temp_min').text(f.low + u);
                c.find('.weather_temp_max').text(f.high + u);
                c.find('.weather_icon').attr('src', iconUrl + f.code + '.gif');
                c.find('.weather_text').text(f.text);

                c.css('display', 'inline-block');


                c.appendTo('#description');
                if (idx >= 2) {
                    return false;
                }
            });
        }
    }
}

// initia event listener for the select control, using jquery facility
$('#standort').on('change', function () {
    var place=this.value;
    placeSelected(place);
});

function getUrlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results && results[1] || 0;
}
