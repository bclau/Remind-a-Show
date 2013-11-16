var DEBUG_MODE = false;

var selectedMealIndex = -1;
var selectedPlaceIndex = -1;
var selectedPlaceID = null;
var nearbyPlaces = null;
var myShows = null;
var currentlySelectedPlaceElement = null;
var selectedFriends = {};
var fbUser = App.fb;


window.FB = FBWinJS;

FB.options({
    appId: '408764209210253'
});

// UTILITIES
    
// For logging responses
function logResponse(response) {
  if (typeof console !== 'undefined')
    console.log('The response was', response);
}

// DOCUMENT-READY FUNCTIONS
$(function () {

          // Click handlers
    
          // Logout click handler
            $("#logout").click(function () {
                logoutClicked();
                FB.setAccessToken('');
                window.location.hash = '#';
                return false;
            });

          $("#loginBtn").click(function () {
              loginClicked();
          });

          // Announce click handler
          $("#announce").click(function () {
            publishOGAction(null);
          });

          // Meal selection click handler
          $('#meal-list').on('click', 'li', function() {
            selectedMealIndex = $(this).index();
            logResponse("Link in meal listview clicked... " + selectedMealIndex);
            displaySelectedMeal();
          });

          $('#detail-meal-select').click(function() {
            //logResponse("Meal selected");
            $('#announce').removeClass('ui-disabled');
            $('#select-meal').html(meals[selectedMealIndex].title);
          });

          // Place selection click handler
          $('#places-list').on('click', 'li', function() {
            var selectionId = $(this).attr('data-name');
            logResponse("Selected place " + selectionId);

            var selectionStatus = $(this).attr('data-icon');
            if (selectionStatus == "false") {
              // De-select any previously selected place
              if (currentlySelectedPlaceElement) {
                currentlySelectedPlaceElement.buttonMarkup({ icon: false });
              }
              // Place has been selected.
              $(this).buttonMarkup({ icon: "check" });            
              // Set the selected place info
              selectedPlaceID = selectionId;
              selectedPlaceIndex = $(this).index();
              $('#select-location').html(nearbyPlaces[selectedPlaceIndex].name);
              // Set the currently selected place element
              currentlySelectedPlaceElement = $(this);
            } else {
              // Previously selected place has been deselected
              $(this).buttonMarkup({ icon: false });
              // Reset the selected place info
              selectedPlaceID = null;
              selectedPlaceIndex = -1;
              $('#select-location').html("Select one");
            } 
          });

          // Friend selection click handler
          $('#friends-list').on('click', 'li', function() {
            var selectionId = $(this).attr('data-name');
            logResponse("Selected friend " + selectionId);
            var selectedIndex = $(this).index();
            var selectionStatus = $(this).attr('data-icon');
            if (selectionStatus == "false") {
              // Friend has been selected.
              $(this).buttonMarkup({ icon: "check" });
              // Add to friend ID to selectedFriends associative array
              selectedFriends[selectionId] = myFriends[selectedIndex].name;
            } else {
              // Previously selected friend has been deselected
              $(this).buttonMarkup({ icon: false });
              // Remove the friend id
              delete selectedFriends[selectionId];
            } 
            var friendNameArray = [];
            for (var friendId in selectedFriends) {
              if (selectedFriends.hasOwnProperty(friendId)) {
                friendNameArray.push(selectedFriends[friendId]);
              }
            }

            if (friendNameArray.length > 2) {
              var otherFriends = friendNameArray.length - 1;
              $('#select-friends').html(friendNameArray[0] + " and " + otherFriends + " others");
            } else if (friendNameArray.length == 2) {
              $('#select-friends').html(friendNameArray[0] + " and " + friendNameArray[1]);
            } else if (friendNameArray.length == 1) {
              $('#select-friends').html(friendNameArray[0]);
            } else {
              $('#select-friends').html("Select friends");
            }
            
            logResponse("Current select friends list: " + selectedFriends);
          });

  });
    
$( document ).delegate("#meals", "pageinit", function() {
  displayMealList();
});


function logoutClicked() {
    FB.setAccessToken('');
    fbUser.name = "";
       
    
}

// AUTHENTICATION
function loginClicked() {

    askForPermissions('user_about_me', function (error, result) {
        if (error) {
            console.log(error);
            return;
        } else {
            if (result.access_token) {
                updateUserInfo();
                getShows();
                //window.location.hash = '#menu';
            }
        }
    });
}

function askForPermissions(scope, callback) {

    var redirectUri = 'https://www.facebook.com/connect/login_success.html',
        loginUrl = FB.getLoginUrl( {  scope: scope });

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

                var qs = extractQuerystring(parser.hash.substr(1).split('&'));

                if (qs.error) {
                    // most likely user clicked don't allow
                    console.log('error: ' + qs.error + ' : ' + qs.error_description);
                    return;
                }

                // set it as the default access token.
                FB.setAccessToken(qs.access_token);
                
                callback(null, qs);

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

function extractQuerystring(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

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

function updateUserInfo(response) {
  FB.api('/me', 
    {fields:"name,first_name,picture"},
    function(response) {
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
	logResponse("Error ..."+JSON.stringify(e));
}

function handlePublishOGError(e) {
	logResponse("Error publishing ..."+JSON.stringify(e));
	var errorCode = e.code;
	logResponse("Error code ..."+errorCode);
	if (errorCode == "200") {
		// Request publish actions, probably missing piece here
		reauthorizeForPublishPermissions();
	}
}

// tv shows
function getShows() {
  // Check for and use cached data
  if (myShows)
    return;

  logResponse("[getShows] get show data.");
  // Use the Graph API to get the shows
  FB.api('/me/television', { fields: 'category, name', limit: '50' }, function(response) {
  	if (!response || response.error) {
  		logResponse("Error fetching friend data.");
  	} else {
  	    myShows = response.data;
  		
  	}
  });
}


