
(function () {
    "use strict";
    var FB = FBWinJS;

    var fbUser = {};
    WinJS.Namespace.define("App.fb", fbUser);
    fbUser = App.fb;

    var roamingFolder = Windows.Storage.ApplicationData.current.roamingFolder;
    var fbKeyFile = "fbKeyFile.txt";

    var myShows = null;
    var _myFriends = null;

    FB.options({
        appId: '408764209210253'
    });

    // For logging responses
    var logResponse = function (response) {
        if (typeof console !== 'undefined')
            console.log('The response was', response);
    }

    var removeFbKey = function () {
        roamingFolder.getFileAsync(fbKeyFile).then(function (file) {
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

    var _getAccessToken = function (clientId, clientSecret, shortToken, callback) {
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
                var split = body[key].split('=');
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
                    _getAccessToken(clientId, clientSecret, shortToken, callback);

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
                var element_count = 0;
                for (var e in response.data)
                    if (response.data.hasOwnProperty(e))
                        element_count++;
                App.tile.utils.totalShows = element_count;
                getDetailedShows(response.data, callback);

            }
        });

    }

    var getDetailedShows = function (showList, callback) {
        for (var i in showList) {
            FB.api('/' + showList[i].id, { fields: 'about, description, genre, release_date, starring, website, name, picture, cover' }, function (response) {
                if (!response || response.error) {
                    logResponse("Error fetching data.");
                } else {
                    callback(response);
                }
            });
        }
    }

    var _createEvent = function (event) {
        var shows = App.DataSource.getShows();

        for (i in shows) {
            if (shows[i].showId == event.showId) {
                var eps = shows[i].episodes;
                for (var ep in eps) {
                    var startDate = Date.parse(eps[ep].startDate);
                    if (startDate - Date.now() >= 0) {
                        var eventEpisode = eps[ep];
                        break;
                    }
                }
                break;
            }
        }

        if (eventEpisode) {
            var params = {
                'name': "Show night! Watching " + shows[i].title + " " + eventEpisode.name,
                'picture': shows[i].picture,
                'privacy_type': 'SECRET',
                'location': event.location,
                'description': event.description + '\n\n\n\n\n Powered by Remind-a-Show.',
                'start_time': eventEpisode.startDate
            };

            FB.api('/me/events', 'post', params, function (response) {
                if (!response || response.error) {
                    var a = 2;
                    //  log(response.error);
                } else {
                    //success
                    _inviteToEvent(response.id, event.selectedFriends);
                    //  var a = 2;
                    //log('Post ID: ' + response.id);
                }
            });
        }

    }

    var _friendsSuggestion = function (showId, callback) {

        FB.api('/fql', {
            q: { "query1": "SELECT uid FROM page_fan WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me()) AND page_id = " + showId, "query2": "SELECT uid, name, pic_square FROM user where uid in (select uid from #query1)AND current_location.city in (SELECT current_location.city FROM user WHERE uid = me())" }
        },
        function (response) {
            // handle response
            if (!response || response.error) {

            } else {
                //success
                var friends = response.data[1].fql_result_set;
                callback(friends);
            }
        });
    }

    var _inviteToEvent = function (eventId, userIds) {
        var params = {
            'users': userIds
        };

        FB.api('/' + eventId + '/invited', 'post', params, function (response) {
            if (!response || response.error) {
                //  log(response.error);
            } else {
                //success

                var v = new Windows.UI.Popups.MessageDialog("Facebook event succesfully created!");
                v.showAsync();
                //log('Post ID: ' + response.id);
            }
        });
    }

    // Friends
    var _getFriends = function () {
        // Check for and use cached data
        if (_myFriends)
            return _myFriends;

        // logResponse("[getFriends] get friend data.");
        // Use the Graph API to get friends
        FB.api('/me/television', { fields: 'category, name', limit: '50' }, function (response) {
            if (!response || response.error) {
                //  logResponse("Error fetching friend data.");
            } else {
                _myFriends = response.data;
                return _myFriends;

                //  logResponse(myFriends);
                //                        displayFriends(myFriends);
            }
        });
    }

    WinJS.Namespace.define("App.fb.utils", {
        createEvent: _createEvent,
        friendsSuggestion: _friendsSuggestion,
        inviteToEvent: _inviteToEvent,
        getShows: getShows,
        getFriends: _getFriends,
        askForPermissions: askForPermissions,
        updateUserInfo: updateUserInfo,
        saveFbKey: saveFbKey,
        removeFbKey: removeFbKey
    });

})();
