(function () {
    "use strict";

    var category = WinJS.Class.define(

        // constructor
        function (name) {
            this.shows = [];
        },
        // instance members
        {
            addShow: function (show) {
                this.shows.push(show);
            }
        },
        // static members
        {

        }
    );

    var show = WinJS.Class.define(

        // constructor
        function(name, pictures) {
            this.name = name;
            this.pictures = pictures;
            this.episodes = [];
        },
        // instance members
        {
            addEpisode: function (episode) {
                this.episodes.push(episode);
            }
        },
        // static members
        {

        }
    );
    

    var episode = WinJS.Class.define(
        //constructor
        function(season, number, name, description) {
            this.season = season;
            this.number = number;
            this.name = name;
            this.description = description;
        },
        // instance members
        {

        },
        // static members
        {

        })


    WinJS.Namespace.define("App", {
        Show: show,
        Category: category
    });


})();
