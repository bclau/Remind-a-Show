(function () {
    "use strict";


    WL.init({
        scope: ["wl.events_create", "wl.basic", "wl.calendars"]
    }
     );
    //for new permissions
    //   WL.login();

    var _listEvents = function (start_time) {


        // WL.Event.subscribe("auth.login", onLogin);

        WL.api({                                                                        //start_time=2013-11-18T00:00:00Z&end_time=2013-11-20T00:00:00Z",
            path: "calendar.01066914f3c59917.7e7bb7e0e0724e109d5781535c3aa9cc/events?start_time=" + start_time + "&end_time", //?start_time=2011-08-01T00:00:00Z&end_time=2011-08-03T00:00:00Z
            method: "GET"
        }).then(
            function (response) {
                var a = 2;
            },
            function (responseFailed) {
                var a = 2;

            }
        );

    }



    var _addEvent = function (name, description, start_time, end_time, network) {

        _//listEvents(start_time);

        WL.api({
            path: "me/events",
            method: "POST",
            body: {
                name: name,
                description: description,
                start_time: start_time, //"2013-11-16T01:30:00-08:00",
                end_time: end_time, //"2013-11-16T03:00:00-08:00",
                location: network,
                is_all_day_event: "false",
                availability: "busy",
                visibility: "public"
            }
        }).then(
            function (response) {
                var a = 2;
            },
            function (responseFailed) {
                var a = 2;

            }
        );


    }

    WinJS.Namespace.define("App.Calendar", {
        addEvent: _addEvent,
        listEvents: _listEvents
    });


})();
