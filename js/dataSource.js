(function () {

    var calendar = App.Calendar;
    var tvrageUtils = App.tvrage.utils;
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
                title: "Skins",
                picture: "https://fbcdn-sphotos-a-a.akamaihd.net/hphotos-ak-prn2/984248_10151592483837226_2077003679_n.jpg"
            },
            {
                title: "Suits",
                picture: "https://fbcdn-sphotos-h-a.akamaihd.net/hphotos-ak-prn1/12948_529633363782965_750167263_n.jpg"
            }],

        Watched: [
            {
                title: "Breaking Bad",
                picture: "https://fbcdn-sphotos-f-a.akamaihd.net/hphotos-ak-ash3/579118_10151923176067722_1094067595_n.png"
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

            if (fb_show.genre == undefined) {
                fb_show.genre = "Undefined";
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

            tvrageUtils.getEpisodes(fb_show.name, function (episodes) {
                for (var i in episodes) {
                    var ep = episodes[i];
                    new_show.addEpisode(new Episode(ep.season, ep.episode, ep.name, ""));

                    if ((ep.date - Date.now()) >= 0)
                        calendar.addEvent(fb_show.name, "s" + ep.season + "e" + ep.episode + " - " + ep.name, ep.date);
                }
            });

        });


        var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;
        var settingName = "exampleCompositeSetting";

        var settingName1 = "one";
        var settingName2 = "hello";

        function compositeSettingsWriteCompositeSetting() {
            var composite = new Windows.Storage.ApplicationDataCompositeValue();
            composite[settingName1] = 1; // example value
            composite[settingName2] = "world"; // example value
            roamingSettings.values[settingName] = composite;

            compositeSettingsDisplayOutput();
        }
    }

    var _addShowToFavourites = function (name) {
        var shows = _getShows();

        for (i in shows) {
            if (shows[i].title == name) {
                temp_show = new Show(shows[i].title, shows[i].description, shows[i].picture);
                temp_show.category = "Favorites";
                _categories["Favorites"].shows.push(temp_show);
                for (var i in subscribers) {
                    subscribers[i].push(temp_show);
                }
                sendTileTextNotification(temp_show.title);
                return;
            }
        }
    }
    function sendTileTextNotification(showName) {
        // Note: This sample contains an additional project, NotificationsExtensions.
        // NotificationsExtensions exposes an object model for creating notifications, but you can also modify the xml
        // of the notification directly. See the additional function sendTileTextNotificationWithXmlManipulation to see how
        // to do it by modifying Xml directly, or sendTileTextNotificationWithStringManipulation to see how to do it
        // by modifying strings directly

        // create the wide template
        var tileContent = NotificationsExtensions.TileContent.TileContentFactory.createTileWideText03();
        tileContent.textHeadingWrap.text =showName+ " added to favourites."  ;

        // Users can resize tiles to square or wide.
        // Apps can choose to include only square assets (meaning the app's tile can never be wide), or
        // include both wide and square assets (the user can resize the tile to square or wide).
        // Apps cannot include only wide assets.

        // Apps that support being wide should include square tile notifications since users
        // determine the size of the tile.

        // create the square template and attach it to the wide template
        var squareTileContent = NotificationsExtensions.TileContent.TileContentFactory.createTileSquareText04();
        squareTileContent.textBodyWrap.text = showName + "was added to favourites.";
        tileContent.squareContent = squareTileContent;

        // send the notification
        Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileContent.createNotification());

        WinJS.log && WinJS.log(tileContent.getContent(), "sample", "status");
    }

    function sendTileLocalImageNotificationWithXmlManipulation() {
        // get a XML DOM version of a specific template by using getTemplateContent
        var tileXml = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(Windows.UI.Notifications.TileTemplateType.tileWideImageAndText01);

        // get the text attributes for this template and fill them in
        var tileTextAttributes = tileXml.getElementsByTagName("text");
        tileTextAttributes[0].appendChild(tileXml.createTextNode("This tile notification uses ms-appx images"));

        // get the image attributes for this template and fill them in
        var tileImageAttributes = tileXml.getElementsByTagName("image");
        tileImageAttributes[0].setAttribute("src", "ms-appx:///images/redWide.png");

        // fill in a version of the square template returned by GetTemplateContent
        var squareTileXml = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(Windows.UI.Notifications.TileTemplateType.tileSquareImage);
        var squareTileImageAttributes = squareTileXml.getElementsByTagName("image");
        squareTileImageAttributes[0].setAttribute("src", "ms-appx:///images/graySquare.png");

        // include the square template into the notification
        var node = tileXml.importNode(squareTileXml.getElementsByTagName("binding").item(0), true);
        tileXml.getElementsByTagName("visual").item(0).appendChild(node);

        // create the notification from the XML
        var tileNotification = new Windows.UI.Notifications.TileNotification(tileXml);

        // send the notification to the app's application tile
        Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);

        WinJS.log && WinJS.log(tileXml.getXml(), "sample", "status");
    }
    function _getShow(name) {
        var shows = _getShows();
        for (var i in shows)
            if (shows[i].title == name)
                return shows[i];
    }

    WinJS.Namespace.define("App.DataSource", {
        getCategories: _getCategories,
        getShowsByCategory: _getShowsByCategory,
        getShows: _getShows,
        getShow: _getShow,
        addShowToFavourites: _addShowToFavourites,
        subscribeListForAdd: _subscribeListForAdd,
        updateShowsFromFacebook: _updateShowsFromFacebook
    });


})();
