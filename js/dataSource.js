(function () {

    var calendar = App.Calendar;
    var tvrageUtils = App.tvrage.utils;
    var tvcomUtils = App.tvcom.utils;
    var FBUtils = App.fb.utils;
    var tileUtils = App.tile.utils;
    var Show = App.Show;
    var Episode = App.Episode;

    var retrievedFromFacebook = false;
    var subscribers = [];

    var _categories = {
        "Favorites": {
            name: "Favorites",
            shows: []
        },
        "Watched": {
            name: "Watched",
            shows: []
        }
    };

    var _raw_shows = {
        Favorites: [
            {
                title: "The Big Bang Theory",
                description: "The Big Bang Theory is awesome",
                picture: "https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-ash3/1395177_10151801519989678_193317412_n.jpg"
            },
            {
                title: "Suits",
                description: "Suits is awesome",
                picture: "https://fbcdn-sphotos-h-a.akamaihd.net/hphotos-ak-prn1/12948_529633363782965_750167263_n.jpg"
            }],

        Watched: [
            {
                title: "Breaking Bad",
                description: "Breaking Bad is awesome",
                picture: "https://fbcdn-sphotos-f-a.akamaihd.net/hphotos-ak-ash3/579118_10151923176067722_1094067595_n.png"
            }]
    }

    var _raw_episodes = {
        "Suits":
            //seasons
            [
                //episodes
                [
                    {
                        name: "Pilot",
                        description: "First episode"
                    }
                ]

            ],

        "Breaking Bad":
            //seasons
            [
                //episodes
                [
                    {
                        name: "Pilot",
                        description: "First episode"
                    }
                ]

            ]
    }

    _shows = [];

    var _getCategories = function () {
        return _categories;
    }

    var _getShowsByCategory = function (category) {
        return _categories[category];
    }

    var _getShows = function () {
        return _shows;
    }

    var _getShowByName = function (name) {
        var new_show = new Show(name)

        var seasons = _raw_episodes[name];
        for (season in seasons) {
            episodes = seasons[season];
            for (episode in episodes) {
                new_show.addEpisode(new Episode(season + 1, episode + 1,
                    episodes[episode].name, episodes[episode].description))
            }
        }

        _get_tvrage_episodes(new_show);
        _get_tvcom_episodes(new_show);

        return new_show;
    }

    var _subscribeListForAdd = function (list) {
        subscribers.push(list);

        for (var i in _shows) {
            list.push(_shows[i]);
        }
    }

    var _get_tvrage_episodes = function (new_show) {
        tvrageUtils.getEpisodes(new_show.title, function (episodes) {
            for (var i in episodes) {
                var ep = episodes[i];

                var episodeDate = ep.startDate;
                try {
                    var q = Date.parse(ep.startDate);
                    if (!q) {
                        datum = ep.startDate;
                        var utcHour = datum.split('T');
                        if (utcHour[1].split("-").length > 1) {
                            var hoursToChange = utcHour[1].split("-")[1];
                            var toReplacePrefix = "-";

                        }
                        else {
                            var hoursToChange = utcHour[1].split("+")[1];
                            var toReplacePrefix = "+";
                        }
                        var toReplace = toReplacePrefix + hoursToChange;
                        if (hoursToChange.split(":")[0].length == 1) newHour = "0" + hoursToChange.split(":")[0] + ":" + hoursToChange.split(":")[1];
                        datum = datum.replace(toReplace, toReplacePrefix + newHour);

                        ep.startDate = datum;
                        var utcDateFromIso = Date.parse(datum);
                        episodeDate = utcDateFromIso;
                        var endDate = utcDateFromIso + parseInt(ep.runtime) * 60 * 1000;
                        var date = new Date(endDate);
                        endDate = date.toISOString();
                        //var eppDate3 = episodeDate.format("isoUtcDateTime");

                    }

                }
                catch (ex) {
                    var a = ex;
                }

                ep.endDate = endDate;

                App.tile.utils.showCount++;
                if (App.tile.utils.totalShows == App.tile.utils.showCount)
                    App.tile.utils.displayTextToast({ "head": "Episodes synced.", "body": "Thank you for your patience." });

                if ((episodeDate - Date.now()) >= 0) {
                    ep.showName = new_show.title;
                    ep.description = "s" + ep.season + "e" + ep.episode + " - " + ep.name;
                    new_show.addEpisode(new Episode(ep.season, ep.episode, ep.name, "", ep.startDate, ep.endDate));
                    tileUtils.sendTileTextNotification("Succesfully synced episodes for " + new_show.title);
                    calendar.addEvent(ep);
                }
            }
        });
    }

    var _get_tvcom_episodes = function (new_show) {
        tvcomUtils.getEpisodes(new_show.title, function (episode) {
            var ep = new Episode(episode.season, episode.episode, episode.name, episode.description);
            ep.url = episode.url;
            ep.image = episode.image;
            new_show.addEpisode(ep);
        });
    }

    var _updateShowsFromFacebook = function () {
        if (retrievedFromFacebook)
            return;

        App.tile.utils.displayTextToast({ "head": "Syncing episodes", "body": "Please be patient." });

        FBUtils.getShows(function (fb_show) {
            //var cover = "";
            //if (fb_show.cover) cover = fb_show.cover.source;
            //else if (fb_show.picture && !fb_show.picture.data.is_silhouette)
            //    cover = fb_show.picture.data.url || "";

            var cover = (fb_show.cover) ? fb_show.cover.source : fb_show.pict;
            var new_show = new Show(fb_show.name, fb_show.description, cover, fb_show.id);
            if (fb_show.genre == undefined) {
                fb_show.genre = "No Category";
            }
            new_show.category = fb_show.genre;

            if (!_categories[fb_show.genre])
                _categories[fb_show.genre] = {
                    name: fb_show.genre,
                    shows: []
                }

            _categories[fb_show.genre].shows.push(new_show);
            _shows.push(new_show);

            for (var i in subscribers) {
                subscribers[i].push(new_show);
            }

            _get_tvrage_episodes(new_show);
            _get_tvcom_episodes(new_show);
        });

        tileUtils.sendTileTextNotification("Succesfully synced with facebook.");
    }

    var _clearShows = function () {

        for (var j in subscribers) {
            subscribers[j].length = 0;
        }

        for (var member in _categories) delete _categories[member];

        for (category in _raw_shows) {
            raw_show_list = _raw_shows[category];
            for (i in raw_show_list) {
                temp_show = _getShowByName(raw_show_list[i].title);
                temp_show.category = category;

                if (!_categories[category])
                    _categories[category] = {
                        name: category,
                        shows: []
                    }

                _categories[category].shows.push(temp_show);
                _shows.push(temp_show);

                for (var i in subscribers) {
                    subscribers[i].push(temp_show);
                }

            }

        }
    }

    var _addShowToFavourites = function (name) {
        //  App.Calendar.listEvents();
        var shows = _getShows();
        for (i in shows) {
            if (shows[i].title == name) {
                temp_show = new Show(shows[i].title, shows[i].description, shows[i].picture, shows[i].showId);

                temp_show.category = "Favorites";
                _categories["Favorites"].shows.push(temp_show);
                for (var i in subscribers) {
                    subscribers[i].push(temp_show);
                }
                tileUtils.sendTileTextNotification(temp_show.title + " added to favourites.");
                return;
            }
        }
    }

    function _getShow(name) {
        var shows = _getShows();
        for (var i in shows)
            if (shows[i].title == name)
                return shows[i];
    }

    for (category in _raw_shows) {
        raw_show_list = _raw_shows[category];
        for (i in raw_show_list) {
            temp_show = _getShowByName(raw_show_list[i].title);
            temp_show.category = category;

            _categories[category].shows.push(temp_show);
            _shows.push(temp_show);
        }
    }

    WinJS.Namespace.define("App.DataSource", {
        clearShows: _clearShows,
        getCategories: _getCategories,
        getShowsByCategory: _getShowsByCategory,
        getShows: _getShows,
        getShow: _getShow,
        addShowToFavourites: _addShowToFavourites,
        subscribeListForAdd: _subscribeListForAdd,
        updateShowsFromFacebook: _updateShowsFromFacebook
    });



})();
