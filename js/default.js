// For an introduction  to the Grid template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=232446
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var fbKeyFile = "fbKeyFile.txt";
    var roamingFolder = Windows.Storage.ApplicationData.current.roamingFolder;
    var FBUtils = App.fb.utils;
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;


    var readFbKey = function () {

        roamingFolder.getFileAsync(fbKeyFile)
            .then(function (file) {
                return Windows.Storage.FileIO.readTextAsync(file);
            }).done(function (fbKey) {
                if (fbKey) {

                    FB.setAccessToken(fbKey);
                    App.DataSource.updateShowsFromFacebook();
                    FBUtils.updateUserInfo();
                }
                else {

                 
                }

            }, function () {
                var v = new Windows.UI.Popups.MessageDialog("Welcome\n\nLooks like it's your first time visiting. Try syncing with your facebook account (Settings -> Connect to facebook).\n Promise you won't regret it!");
                v.showAsync();
            });
    }



    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {

            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
                readFbKey();

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
        else if (args.detail.kind === activation.ActivationKind.search) {

            var title = args.detail.queryText;
            var item = App.DataSource.getShow(title);
            nav.navigate("/pages/itemDetail/itemDetail.html", { item: Data.getItemReference(item) });
        }
    }
    )
    ;

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };
    WinJS.Application.onsettings = function (e) {

        if (!App.fb.name) {
            e.detail.applicationcommands = { "connect": { title: "Connect to Facebook", href: "/html/FacebookConnect.html" } };
            WinJS.UI.SettingsFlyout.populateSettings(e);
            return;
        }
        e.detail.applicationcommands = { "connect": { title: "Connect to Facebook", href: "/html/FacebookConnect2.html", name: "aa" } };
        WinJS.UI.SettingsFlyout.populateSettings(e);


    };

    app.start();


    //  doClickAdd();

})();
