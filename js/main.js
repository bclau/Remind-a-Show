
var FBUtils = App.fb.utils
var fbUser = App.fb;
window.FB = FBWinJS;


// UTILITIES
    
// For logging responses
function logResponse(response) {
  if (typeof console !== 'undefined')
    console.log('The response was', response);
}

function logoutClicked() {
    FB.setAccessToken('');
    fbUser.name = "";
       
    
}

// AUTHENTICATION
function loginClicked() {

    FBUtils.askForPermissions('user_about_me', function (error, result) {
        if (error) {
            console.log(error);
            return;
        } else {
            if (result.access_token) {
                App.DataSource.updateShowsFromFacebook();
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
