
var myFriends = null;
window.FB = FBWinJS;
(function () {
    "use strict";

    var dataSource = App.DataSource;
    var fbUtil = App.fb.utils;

    var list = new WinJS.Binding.List();
    //var categories = dataSource.getCategories();

    var groupedItems = list.createGrouped(
        function groupKeySelector(item) {
            return item.category;
        },
        function groupDataSelector(item) {
            return dataSource.getCategories()[item.category];
        }
    );

    // TODO: Replace the data with your real data.
    // You can add data from asynchronous sources whenever it becomes available.

    dataSource.subscribeListForAdd(list);//.forEach(function (item) {
    //    list.push(item);
    //});

    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference
    });

    // Get a reference for an item, using the group key and item title as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.category, item.title];
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.category === group.name; });
    }

    // Get the unique group corresponding to the provided group key.
    function resolveGroupReference(key) {
        return dataSource.getCategories()[key];
        /*
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).key === key) {
                return groupedItems.groups.getAt(i);
            }
        }
        */
    }

    // Get a unique item from the provided string array, which should contain a
    // group key and an item title.
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.category === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }

    // Returns an array of sample data that can be added to the application's
    // data list. 
    function generateSampleData() {
        // These three strings encode placeholder images. You will want to set the
        // backgroundImage property in your real data to be URLs to images.
        
        //var colors = [darkGray, lightGray, mediumGray];

        var friends = fbUtil.getFriends();
        for (var i in friends) {
            sampleGroups[i]["title"] = friends[i];
        }

        // Each of these sample items should have a reference to a particular
        var sampleItems = dataSource.getShows();
        return sampleItems;
    }
})();
