(function () {
    "use strict";

    var months = {"Jan":1, "Feb":2, "Mar":3, "Apr":4, "May":5, "Jun":6, "Jul":7, "Aug":8, "Sep":9, "Oct":10, "Nov":11, "Dec":12 };

    var baseUrl = "http://services.tvrage.com/tools/quickinfo.php?show=";

    var _splitEpisode = function (string_episode) {
        var parts = string_episode.split('^');
        var se = parts[0].split('x');
        var parsed_date = Date.parse(parts[2]);
        var date = parts[2].split('/');

        return {
            season: se[0],
            episode: se[1],
            name: parts[1],
            date: new Date(date[2], months[date[0]], date[1])
        }
    }

    var _getEpisodes = function(show, callback) {
        WinJS.xhr({
            url: baseUrl + show
        }).done(function (result) {
            var lines = result.responseText.trim().split('\n');

            var response_obj = {};
            for (var i in lines) {
                var parts = lines[i].split('@');
                response_obj[parts[0]] = (parts.length > 1) ? parts[1] : "";
            }

            var episodes = [];
            var ep = response_obj['Latest Episode'];
            episodes.push(_splitEpisode(ep));

            ep = response_obj['Next Episode'];
            if (ep)
                episodes.push(_splitEpisode(ep));

            callback(episodes);
        },
        function (result) {
            //errors and stuff.

        });
    }

    WinJS.Namespace.define("App.tvrage.utils", {
        getEpisodes: _getEpisodes
    });


})();

