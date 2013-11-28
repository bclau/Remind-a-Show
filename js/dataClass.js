(function () {
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
        function (title, description, picture, showId) {

            this.title = title;
            this.description = description;
            this.showId = showId;
            if (picture)
                this.picture = picture;
            else
                //this.picture = grayTiles[Math.floor(Math.random() * 3)];
                if (title == "Skins")
                    this.picture = "https://fbcdn-sphotos-a-a.akamaihd.net/hphotos-ak-prn2/984248_10151592483837226_2077003679_n.jpg";
            if (title == "Suits")
                this.picture = "https://fbcdn-sphotos-h-a.akamaihd.net/hphotos-ak-prn1/12948_529633363782965_750167263_n.jpg";
            if (title == "Breaking Bad")
                this.picture = "https://fbcdn-sphotos-f-a.akamaihd.net/hphotos-ak-ash3/579118_10151923176067722_1094067595_n.png";
            if (!this.picture)
                this.picture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY7h4+cp/AAhpA3h+ANDKAAAAAElFTkSuQmCC";

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
        function (season, number, name, description, startDate, endDate) {
            this.season = season;
            this.number = number;
            this.name = name;
            this.description = description;
            this.link = "http://www.youtube.com/watch?v=Y9zte8wU3-s";
            this.startDate = startDate;
            this.endDate = endDate;

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
