(function () {
    "use strict";

    var Notifications = Windows.UI.Notifications;
    var ToastContent = NotificationsExtensions.ToastContent;

    function _displayTextToast(toast) {
        // Get the toast manager.
        var notificationManager = Notifications.ToastNotificationManager;

        var content;
        content = ToastContent.ToastContentFactory.createToastText02();
        content.textHeading.text = toast.head;
        content.textBodyWrap.text = toast.body;

        // Create a toast, then create a ToastNotifier object
        // to send the toast.
        var toasty = content.createNotification();
        notificationManager.createToastNotifier().show(toasty);
    }

    var _sendTileTextNotification = function (text) {
        // Note: This sample contains an additional project, NotificationsExtensions.
        // NotificationsExtensions exposes an object model for creating notifications, but you can also modify the xml
        // of the notification directly. See the additional function sendTileTextNotificationWithXmlManipulation to see how
        // to do it by modifying Xml directly, or sendTileTextNotificationWithStringManipulation to see how to do it
        // by modifying strings directly

        // create the wide template
        var tileContent = NotificationsExtensions.TileContent.TileContentFactory.createTileWideText03();
        tileContent.textHeadingWrap.text = text;

        // Users can resize tiles to square or wide.
        // Apps can choose to include only square assets (meaning the app's tile can never be wide), or
        // include both wide and square assets (the user can resize the tile to square or wide).
        // Apps cannot include only wide assets.

        // Apps that support being wide should include square tile notifications since users
        // determine the size of the tile.

        // create the square template and attach it to the wide template
        var squareTileContent = NotificationsExtensions.TileContent.TileContentFactory.createTileSquareText04();
        squareTileContent.textBodyWrap.text = text;
        tileContent.squareContent = squareTileContent;

        // send the notification
        Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileContent.createNotification());

        WinJS.log && WinJS.log(tileContent.getContent(), "sample", "status");
    }

    var _sendTileLocalImageNotificationWithXmlManipulation = function () {
        // get a XML DOM version of a specific template by using getTemplateContent
        var tileXml = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(Windows.UI.Notifications.TileTemplateType.tileWideImageAndText01);

        // get the text attributes for this template and fill them in
        var tileTextAttributes = tileXml.getElementsByTagName("text");
        tileTextAttributes[0].appendChild(tileXml.createTextNode("This tile notification uses ms-appx images"));

        // get the image attributes for this template and fill them in
        var tileImageAttributes = tileXml.getElementsByTagName("image");
        tileImageAttributes[0].setAttribute("src", "ms-appx:///images/redWide.png");

        // fill in a version of the square template returned by GetTemplateContent
        var squareTileXml = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(Windows.UI.Notifications.TileTemplateType.tileSquareImage);
        var squareTileImageAttributes = squareTileXml.getElementsByTagName("image");
        squareTileImageAttributes[0].setAttribute("src", "ms-appx:///images/graySquare.png");

        // include the square template into the notification
        var node = tileXml.importNode(squareTileXml.getElementsByTagName("binding").item(0), true);
        tileXml.getElementsByTagName("visual").item(0).appendChild(node);

        // create the notification from the XML
        var tileNotification = new Windows.UI.Notifications.TileNotification(tileXml);

        // send the notification to the app's application tile
        Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);

        WinJS.log && WinJS.log(tileXml.getXml(), "sample", "status");
    }

    var _showCount = 0;
    var _totalShows = 0;
    WinJS.Namespace.define("App.tile.utils", {
        sendTileTextNotification: _sendTileTextNotification,
        sendTileLocalImageNotificationWithXmlManipulation: _sendTileLocalImageNotificationWithXmlManipulation,
        displayTextToast: _displayTextToast,
        showCount: _showCount,
        totalShows: _totalShows
    });
})();
