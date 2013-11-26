
(function () {
    "use strict";
    var FB = FBWinJS;

    var fbUser = {};
    WinJS.Namespace.define("App.fb", fbUser);
    fbUser = App.fb;

    var roamingFolder = Windows.Storage.ApplicationData.current.roamingFolder;
    var fbKeyFile = "fbKeyFile.txt";

    var myShows = null;

    FB.options({
        appId: '408764209210253'
    });

    // For logging responses
    var logResponse = function (response) {
        if (typeof console !== 'undefined')
            console.log('The response was', response);
    }

    var removeFbKey = function () {
        roamingFolder.
                getFileAsync(fbKeyFile).then(function (file) {
    if (file == null) {
        var v = new Windows.UI.Popups.MessageDialog("File was deleted");
        v.showAsync();
    } else {
        file.deleteAsync();
    }
});
    }

    var saveFbKey = function (key) {


        roamingFolder.createFileAsync(fbKeyFile, Windows.Storage.CreationCollisionOption.replaceExisting)
            .then(function (file) {
                return Windows.Storage.FileIO.writeTextAsync(file, key);
            }).done(function () {

            });
    }



    var askForPermissions = function (scope, callback) {
        var redirectUri = 'https://www.facebook.com/connect/login_success.html',
            loginUrl = FB.getLoginUrl({ scope: scope });
        try {

            Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
                Windows.Security.Authentication.Web.WebAuthenticationBroker.default,
                new Windows.Foundation.Uri(loginUrl),
                new Windows.Foundation.Uri(redirectUri))
                .then(function success(result) {
                    if (result.responseStatus == 2) {
                        console.log('error: ' + result.responseerrordetail);
                        callback(new Error(result.responseerrordetail));
                        return;
                    }

                    var parser = document.createElement('a');
                    parser.href = result.responseData;

                    var qs = _extractQuerystring(parser.hash.substr(1).split('&'));

                    if (qs.error) {
                        // most likely user clicked don't allow
                        console.log('error: ' + qs.error + ' : ' + qs.error_description);
                        return;
                    }
                     
                    //get 2month lifetime code

                    var clientId = "408764209210253";
                    var clientSecret = "d30a63511ec4584729312bf197d1b1b7";
                    var shortToken = qs.access_token;

                    var baseUrl = "https://graph.facebook.com/oauth/access_token?" +
                                    "&client_id=" + clientId +
                                    "&client_secret=" + clientSecret +
                                    "&grant_type=fb_exchange_token" +
                                    "&fb_exchange_token=" + shortToken;
                    WinJS.xhr({
                        url: baseUrl 
                    }).done(function (result) {


                        //var lines = result.responseText.trim().split('\n');
                        var body = result.responseText.split('&');
                        var key = "";
                        var value = "";
                        for (key in body) {
                          var  split = body[key].split('=');
                            if (split.length === 2) {
                                value = split[1];
                                if (!isNaN(value)) {
                                    result[split[0]] = parseInt(value);
                                } else {
                                    result[split[0]] = value;
                                }
                            }
                        }
                        
                        FB.setAccessToken(result["access_token"]);
                        callback(null, result["access_token"]);
                        
                    },
     function (result) {
         //errors and stuff.
         console.log(result);

     });
                   

                }, function error(err) {
                    console.log('Error Number: ' + err.number);
                    console.log('Error Message: ' + err.message);
                    callback(new Error(err.message));
                });

        } catch (e) {
            // error launching web auth
            console.log(e);
        }
    }

    var _extractQuerystring = function (a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    }

    /*
    // Handle status changes
    function handleStatusChange(response) {
        if (response.authResponse) {
            logResponse(response);
            window.location.hash = '#menu';
            updateUserInfo(response);
        } else {
            window.location.hash = '#login';
        }
    }


    // GRAPH API (OPEN GRAPH)
    function handleOGSuccess() {
        logResponse("[handleOGSuccess] done.");
        showPublishConfirmation();

        // Clear out selections
        selectedMealIndex = -1;
        selectedPlaceIndex = -1;
        selectedPlaceID = null;
        currentlySelectedPlaceElement = null;
        selectedFriends = {};
        // Reset the placeholders
        $('#select-meal').html("Select one");
        $('#select-location').html("Select one");
        $('#select-friends').html("Select friends");
        // Disable the announce button
        $('#announce').addClass('ui-disabled');

    }

    function handleGenericError(e) {
        logResponse("Error ..." + JSON.stringify(e));
    }

    function handlePublishOGError(e) {
        logResponse("Error publishing ..." + JSON.stringify(e));
        var errorCode = e.code;
        logResponse("Error code ..." + errorCode);
        if (errorCode == "200") {
            // Request publish actions, probably missing piece here
            reauthorizeForPublishPermissions();
        }
    }


    */

    var updateUserInfo = function (response) {
        FB.api('/me',
          { fields: "name,first_name,picture" },
          function (response) {
              //logResponse(response);
              fbUser["name"] = response.name;
              fbUser["pic"] = response.picture.data.url;
              var output = '';
              //output += '<img src="' + response.picture.data.url + '" width="25" height="25"></img>';
              //output += ' ' + response.first_name;
              //$('#user-identity').html(output);
              //document.getElementById("user-identity").html(output);
          });
    }


    // tv shows
    var getShows = function (callback) {
        // Check for and use cached data
        if (myShows)
            return;

        logResponse("[getShows] get show data.");
        // Use the Graph API to get the shows
        FB.api('/me/television', { fields: 'id', limit: '50' }, function (response) {
            if (!response || response.error) {
                logResponse("Error fetching data.");
            } else {
                getDetailedShows(response.data, callback);

            }
        });

    }

    var getDetailedShows = function (showList, callback) {
        for (var i in showList) {
            FB.api('/' + showList[i].id, { fields: 'about, description, genre, release_date, starring, website, name, cover' }, function (response) {
                if (!response || response.error) {
                    logResponse("Error fetching data.");
                } else {
                    callback(response);
                }
            });
        }
    }


    WinJS.Namespace.define("App.fb.utils", {
        getShows: getShows,
        askForPermissions: askForPermissions,
        updateUserInfo: updateUserInfo,
        saveFbKey: saveFbKey,
        removeFbKey: removeFbKey
    });


})();
