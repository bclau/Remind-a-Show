
var FBUtils = App.fb.utils;
var fbUser = App.fb;
window.FB = FBWinJS;

var roamingFolder = Windows.Storage.ApplicationData.current.roamingFolder;
var fbKeyFile = "fbKeyFile.txt";

// UTILITIES
    
// For logging responses
function logResponse(response) {
  if (typeof console !== 'undefined')
    console.log('The response was', response);
}

function logoutClicked() {
    FB.setAccessToken('');
    fbUser.name = "";
    FBUtils.removeFbKey();
    App.DataSource.clearShows();
    //App.DataSource.updateShowsFromFacebook();
    window.focus();
}

// AUTHENTICATION
function loginClicked() {

    FBUtils.askForPermissions(['user_about_me','publish_stream', 'create_event'] , function (error, accessToken) {
        if (error) {
            console.log(error);
            return;
        } else {
            if (accessToken) {
                App.DataSource.updateShowsFromFacebook();
                FBUtils.updateUserInfo();
                FBUtils.saveFbKey(accessToken);
                //window.location.hash = '#menu';
            }
        }
    });
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
