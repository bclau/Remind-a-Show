(function () {
    
    Show = WinJS.App.Show;
    Epiode = WinJS.App.Episode;

    var categories = ["Favorites", "Watched", "Comedy"];

    var shows = {
        Favorites: [
            {
                name: "The Big Bang Theory"
            },
            {
                name: "How I Met Your Mother"
            }],

        Watched: [
            {
                name: "The Big Bang Theory"
            }],

        Comedy: [
            {
                name: "How I Met Your Mother"
            }]

    }


    var episodes = {
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

    var getCategories = function () {
        return categories;
    }

    var getShowByName = function (name) {



        return show;
    }

    WinJS.Namespace.define("DataSource", {
        getCategories: getCategories,
        getShowByName: getShowByName
    });


})();
