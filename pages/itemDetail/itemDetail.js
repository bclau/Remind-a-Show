﻿(function () {
    "use strict";

    var tvCom = App.tvcom.utils;

    var _shadow_box_id = "black_overlay";
    var _video_box_id = "video_container";

    var _loadEpisode = function (url) {
        if (!url)
            return;

        tvCom.getVideo(url, function (div) {
            var shadowBox = document.getElementById(_shadow_box_id);
            var videoBox = document.getElementById(_video_box_id);

            shadowBox.className = "visible";
            videoBox.className = "visible";

            //var iframe = document.createElement("iframe");
            //iframe.appendChild(div);
            WinJS.Utilities.setInnerHTMLUnsafe(videoBox, div);
            //videoBox.appendChild(iframe);
        });
    }

    var _clear = function () {
        var shadowBox = document.getElementById(_shadow_box_id);
        var videoBox = document.getElementById(_video_box_id);
        shadowBox.className = "hidden";
        videoBox.className = "hidden";
    }

    var _createEventHandler = function (url) {
        return function () {
            _loadEpisode(url);
        };
    }

    WinJS.UI.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.

        ready: function (element, options) {

            initAppBar();
            var item = options && options.item ? Data.resolveItemReference(options.item) : Data.items.getAt(0);
            element.querySelector(".titlearea .pagetitle").textContent = item.category;
            element.querySelector("article .item-title").setAttribute("id", item.showId);
            element.querySelector("article .item-title").textContent = item.title;
            element.querySelector("article .item-image").src = item.picture;
            element.querySelector("article .item-image").alt = item.title;
            element.querySelector("article .item-content").innerHTML = item.description;
            element.querySelector("#black_overlay").onclick = _clear;
            element.querySelector(".content").focus();

            var list = element.querySelector(".itemslist");

            for (var i in item.episodes) {
                var ep = item.episodes[i];
                var temp = document.createElement("div");
                var tt, t = document.createElement("span");
                t.innerText = "Season: " + ep.season + "  Episode: " + ep.number;
                temp.appendChild(t);
                t = document.createElement("br");
                temp.appendChild(t);

                t = document.createElement("span");
                t.innerText = "Name: " + ep.name;
                temp.appendChild(t);

                t = document.createElement("div");
                t.innerText = "\n";
                temp.appendChild(t);

                t = document.createElement("div");

                if (ep.image) {
                    tt = document.createElement("img");
                    tt.src = ep.image;
                    t.appendChild(tt);
                }

                tt = document.createElement("div");
                tt.innerHTML = ep.description;
                t.appendChild(tt);
                temp.appendChild(t);

                if (ep.url) {
                    t = document.createElement("br");
                    temp.appendChild(t);
                    t = document.createElement("a");
                    t.href = ep.url;
                    //t.href = "#";
                    //t.onclick = _createEventHandler(ep.url);
                    t.innerText = "Click here to watch it!";
                    temp.appendChild(t);
                }

                t = document.createElement("hr");
                temp.appendChild(t);

                list.appendChild(temp);
            }

        },

    });

    var eventDetails = {
        selectedFriends: [],
        description: "",
        location: "",
        showId: ""

    };

    
    function initAppBar() {
        var appBarDiv = document.getElementById("scenarioAppBar");
        var appBar = document.getElementById("scenarioAppBar").winControl;
        // Add event listeners
        //document.getElementById("cmdAdd").addEventListener("click", doClickAdd, false);
        //document.getElementById("cmdRemove").addEventListener("click", doClickRemove, false);

        //document.getElementById("cmdEventAdd").addEventListener("click", doClickEvent, false);
        document.getElementById("createEventButton").addEventListener("click", function (e) {
            hideFlyoutAndAppBar();
            App.fb.utils.createEvent(eventDetails);
        });


        document.getElementById("cmdEventAdd").addEventListener("click", function (e) {
            if (eventDetails.selectedFriends) eventDetails.selectedFriends = [];
            if (eventDetails.description) eventDetails.description="";
            if (eventDetails.location) eventDetails.location="";
            if (eventDetails.showId) eventDetails.showId="";
            
            var eventBindings = document.getElementById("eventDetails");
            var observableEvent = WinJS.Binding.as(eventDetails);

            document.getElementById("location").addEventListener("change", function (evt) {
                observableEvent.location= toStaticHTML(evt.target.value);
            }, false);


            document.getElementById("description").addEventListener("change", function (evt) {
                observableEvent.description = toStaticHTML(evt.target.value);
            }, false);

            WinJS.Binding.processAll(eventBindings, observableEvent);
            

            var id = document.getElementsByTagName('h2')[0].id;
            var showId = parseInt(id);
            eventDetails.showId = showId;
            App.fb.utils.friendsSuggestion(showId, function (result) {

                var listView = document.getElementById("personList").winControl;

                listView.itemDataSource = new WinJS.Binding.List(result).dataSource;

                // Handle the selectionchanged event
                listView.addEventListener("selectionchanged", function () {
                    listView.selection.getItems().done(function (items) {
                        // Copy selected items into new array
                        var selectedFriends = [];
                        items.forEach(function (item) {
                            observableEvent.selectedFriends.push(item.data.uid);
                            selectedFriends.push(item.data.uid);
                           
                        });
                        eventDetails.selectedFriends = selectedFriends;

                    });
                });

            });
        });



    }

    function hideFlyoutAndAppBar() {
        document.getElementById("createEventFlyout").winControl.hide();
        document.getElementById("scenarioAppBar").winControl.hide();
    }

    //function doClickEvent() {

    //    var ghead = document.getElementsByTagName('h2');
    //    var ts = ghead[0].innerText;
    //    //App.DataSource.createEvent(ts);
    //    window.focus();
    //}

    function doClickAdd() {

        var ghead = document.getElementsByTagName('h2');
        var ts = ghead[0].innerText;
        App.DataSource.addShowToFavourites(ts);
        window.focus();
    }

    function doClickRemove() {
        var ghead = document.getElementsByTagName('h2');
        var ts = ghead[0].innerText;
        App.DataSource.removeShowToFavourites(ts);
        window.focus();

    }

})();
