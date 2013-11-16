(function () {
    "use strict";

    WL.init();

    function addEvent(name, description, start_time, end_time) {
        WL.login({
            scope: "wl.events_create"
        }).then(
                  function (response) {
                      WL.api({
                          path: "me/events",
                          method: "POST",
                          body: {
                              name: name,
                              description: description,
                              start_time: start_time, //"2013-11-16T01:30:00-08:00",
                              end_time: end_time, //"2013-11-16T03:00:00-08:00",
                              //location: "Coho Vineyard and Winery, 123 Main St., Redmond WA 19532",
                              is_all_day_event: "false",
                              availability: "busy",
                              visibility: "public"
                          }
                      }).then(
                          function (response) {
                              document.getElementById("resultDiv").innerHTML =
                                  "ID: " + response.id +
                                  "<br/>Name: " + response.name;
                          },
                          function (responseFailed) {
                              document.getElementById("infoArea").innerText =
                                  "Error calling API: " + responseFailed.error.message;
                          }
                      );
                  },
                  function (responseFailed) {
                      document.getElementById("infoArea").innerText =
                          "Error signing in: " + responseFailed.error_description;
                  }
              );

    }

    WinJS.Namespace.define("App.Calendar", {
        addEvent: addEvent
    });


})();
