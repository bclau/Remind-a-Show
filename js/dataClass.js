﻿(function () {
    "use strict";


    var grayTiles = [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY3B0cPoPAANMAcOba1BlAAAAAElFTkSuQmCC", 
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY7h4+cp/AAhpA3h+ANDKAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY5g8dcZ/AAY/AsAlWFQ+AAAAAElFTkSuQmCC"
    ];

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

            if(picture)
                this.picture = picture;
            else
                this.picture = grayTiles[Math.floor(Math.random() * 3)];
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
            this.link = "http://www.youtube.com/watch?v=Y9zte8wU3-s";
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
