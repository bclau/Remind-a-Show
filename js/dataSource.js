(function () {

    var FBUtils = App.fb.utils;
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
            },
            {
                title: "How I Met Your Mother"
            }],

        Watched: [
            {
                title: "The Big Bang Theory"
            }]
    }


    var _raw_episodes = {
        "How I Met Your Mother":
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

        "The Big Bang Theory":
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
                new_show.addEpisode(new Episode(season, episode,
                    episodes[episode].name, episodes[episode].description))

            }
        }

        return new_show;
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

    var _subscribeListForAdd = function (list) {
        subscribers.push(list);

        for (var i in _shows) {
            list.push(_shows[i]);
        }
    }

    var _updateShowsFromFacebook = function () {
        if (retrievedFromFacebook)
            return;

        FBUtils.getShows(function (fb_show) {
            new_show = new Show(fb_show.name, fb_show.description, fb_show.cover.source);
            // new_show.category = fb_show.genre;
            if (fb_show.genre == undefined) {
                fb_show.genre = "Undefined";
            }
            new_show.category = fb_show.genre;
            if (!_categories[fb_show.genre])
                _categories[fb_show.genre] = {
                    name: fb_show.genre,
                    shows: []
                };

            _categories[fb_show.genre].shows.push(new_show);

            _shows.push(new_show);

            for (var i in subscribers) {
                subscribers[i].push(new_show);
            }
            var a = 2;
        });

    }

    var _addShowToFavourites = function (name) {
        var shows = _getShows();

        for (i in shows) {
            if (shows[i].title == name) {
                temp_show = new Show(shows[i].title, shows[i].description, shows[i].picture);
                _categories["Favorites"].shows.push(temp_show);
                for (var i in subscribers) {
                    subscribers[i].push(temp_show);
                }
                return;
            }
        }
    }

    WinJS.Namespace.define("App.DataSource", {
        getCategories: _getCategories,
        getShowsByCategory: _getShowsByCategory,
        getShows: _getShows,
        addShowToFavourites: _addShowToFavourites,
        subscribeListForAdd: _subscribeListForAdd,
        updateShowsFromFacebook: _updateShowsFromFacebook
    });


})();
