(function () {
    "use strict";


    WL.init({
        scope: ["wl.events_create", "wl.basic", "wl.calendars"]
    }
     );
    //for new permissions
    //   WL.login();

    var _checkEvent = function (ep,callback) {


        // WL.Event.subscribe("auth.login", onLogin);

        WL.api({   
            path: "me/events?start_time=" + ep.startDate + "&end_time=" + ep.endDate, 
            method: "GET"
        }).then(
            function (response) {
                if(response.data && response.data[0])
                    var showName = response.data[0].name;
                
                if (showName != ep.showName)
                    callback(ep);
            },
            function (responseFailed) {
                // old episodes with invalid date. ignore them.
               

            }
        );

    }

    var _addEvent = function (ep) {

        _checkEvent(ep, _insertEvent);

    }

    var _insertEvent = function (ep) {
        WL.api({
            path: "me/events",
            method: "POST",
            body: {
                name: ep.showName,
                description: ep.description,
                start_time: ep.startDate, 
                end_time: ep.endDate, 
                location: ep.network,
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

    var _addEvent2 = function (name, description, start_time, end_time, network) {

        _listEvents(name, start_time, end_time);

     /*   WL.api({
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
        */

    }

    WinJS.Namespace.define("App.Calendar", {
        addEvent: _addEvent
        
    });


})();
