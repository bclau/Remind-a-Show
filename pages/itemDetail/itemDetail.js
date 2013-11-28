﻿(function () {
    "use strict";

    var tvCom = App.tvcom.utils;


    var _loadEpisode = function (url) {
        if (!url)
            return;

        tvCom.getVideo(url, function (div) {
            var a = 4 + 5;
        });
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
            element.querySelector("article .item-title").textContent = item.title;
            element.querySelector("article .item-image").src = item.picture;
            element.querySelector("article .item-image").alt = item.title;
            element.querySelector("article .item-content").innerHTML = item.description;
            element.querySelector(".content").focus();

            var list = element.querySelector(".itemslist");
  
            for (var i in item.episodes) {
                var ep = item.episodes[i];
                var temp = document.createElement("div");
                var t = document.createElement("span");
                t.innerText = "Season: " + ep.season + "  Episode: " + ep.number;
                temp.appendChild(t);
                t = document.createElement("br");
                temp.appendChild(t);

                t = document.createElement("span");
                t.innerText = "Name: " + ep.name;
                temp.appendChild(t);

                t = document.createElement("br");
                temp.appendChild(t);

                t = document.createElement("div");
                t.innerHTML = ep.description;
                temp.appendChild(t);

                if (ep.url) {
                    t = document.createElement("br");
                    temp.appendChild(t);
                    t = document.createElement("a");
                    t.href = "#";
                    t.onclick = _createEventHandler(ep.url);
                    t.innerText = "Click here to watch it!";
                    temp.appendChild(t);
                }

                t = document.createElement("hr");
                temp.appendChild(t);

                list.appendChild(temp);
            }

        },

    });

    function initAppBar() {
        var appBarDiv = document.getElementById("scenarioAppBar");
        var appBar = document.getElementById("scenarioAppBar").winControl;
        // Add event listeners
        document.getElementById("cmdAdd").addEventListener("click", doClickAdd, false);
        document.getElementById("cmdRemove").addEventListener("click", doClickRemove, false);
        
        document.getElementById("cmdEventAdd").addEventListener("click", doClickEvent, false);
        //document.getElementById("cmdDelete").addEventListener("click", doClickDelete, false);
        //document.getElementById("cmdSelectAll").addEventListener("click", doClickSelectAll, false);
        //document.getElementById("cmdClearSelection").addEventListener("click", doClickClearSelection, false);
        //appBar.addEventListener("beforeshow", doAppBarShow, false);
        //appBar.addEventListener("beforehide", doAppBarHide, false);
        //// Hide selection group of commands
        //appBar.hideCommands(appBarDiv.querySelectorAll('.multiSelect'));
        // Disable AppBar until in full screen mode
        //appBar.disabled = true;
    }

    function doClickEvent() {

        var ghead = document.getElementsByTagName('h2');
        var ts = ghead[0].innerText;
        App.DataSource.createEvent(ts);
        window.focus();
    }

    function doClickAdd() {
        
        var ghead = document.getElementsByTagName('h2');
        var ts = ghead[0].innerText;
        App.DataSource.addShowToFavourites(ts);
        window.focus();
    }

    function doClickRemove()
    {
        var ghead = document.getElementsByTagName('h2');
        var ts = ghead[0].innerText;

    }

})();
