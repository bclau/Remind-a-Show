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
        function(title, description, picture) {
            this.title = title;
            this.description = description;
            this.picture = picture;
            //this.picture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY7h4+cp/AAhpA3h+ANDKAAAAAElFTkSuQmCC";
        
            this.episodes = [];
        },
        // instance members
        {
            addEpisode: function (episode) {
                this.episodes.push(episode);
            },
            addCategory: function (category) {
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
        Episode: episode,
        Show: show,
        Category: category
    });


})();
