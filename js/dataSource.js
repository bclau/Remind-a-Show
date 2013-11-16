(function () {

    var Show = App.Show;
    var Episode = App.Episode;

    var _categories = {
        "Favorites": {
            name: "Favorites",
            shows: []
        },
        "Watched": {
            name: "Watched",
            shows: []
        },
        "Comedy": {
            name: "Comedy",
            shows: []
        },
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
            }],

        Comedy: [
            {
                title: "How I Met Your Mother"
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


    WinJS.Namespace.define("App.DataSource", {
        getCategories: _getCategories,
        getShowsByCategory: _getShowsByCategory,
        getShows: _getShows
    });


})();
