(function () {
    "use strict";

    WL.init({
        scope: "wl.events_create"}
        );


    var _addEvent = function(name, description, start_time, end_time) {
       
                   
                      WL.api({
                          path: "me/events",
                          method: "POST",
                          body: {
                              name: name,
                              description: description,
                              start_time: start_time, //"2013-11-16T01:30:00-08:00",
                              end_time: new Date(Date.parse(start_time)+60), //"2013-11-16T03:00:00-08:00",
                              //location: "Coho Vineyard and Winery, 123 Main St., Redmond WA 19532",
                              is_all_day_event: "false",
                              availability: "busy",
                              visibility: "public"
                          }
                      }).then(
                          function (response) {
                            
                          },
                          function (responseFailed) {
                             
                          }
                      );


    }

    WinJS.Namespace.define("App.Calendar", {
        addEvent: _addEvent
    });


})();
