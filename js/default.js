// For an introduction to the Grid template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=232446
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;


    function doClickAdd() {
        WL.init();

        WL.login({
            scope: "wl.events_create"
        }).then(
                  function (response) {
                      WL.api({
                          path: "me/events",
                          method: "POST",
                          body: {
                              name: "Family Dinner",
                              description: "Dinner with Cynthia's family",
                              start_time: "2013-11-16T01:30:00-08:00",
                              end_time: "2013-11-16T03:00:00-08:00",
                              location: "Coho Vineyard and Winery, 123 Main St., Redmond WA 19532",
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

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();


    doClickAdd();

})();
