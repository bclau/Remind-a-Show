(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            initAppBar();
            var item = options && options.item ? Data.resolveItemReference(options.item) : Data.items.getAt(0);
            element.querySelector(".titlearea .pagetitle").textContent = item.category;
            element.querySelector("article .item-title").textContent = item.title;
            element.querySelector("article .item-image").src = item.backgroundImage;
            element.querySelector("article .item-image").alt = item.title;
            element.querySelector("article .item-content").innerHTML = item.description;
            element.querySelector(".content").focus();
             
        }
    });

    function initAppBar() {
        var appBarDiv = document.getElementById("scenarioAppBar");
        var appBar = document.getElementById("scenarioAppBar").winControl;
        // Add event listeners
        document.getElementById("cmdAdd").addEventListener("click", doClickAdd, false);
        document.getElementById("cmdRemove").addEventListener("click", doClickRemove, false);
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

    function doClickAdd() {
        
        var ghead = document.getElementsByTagName('h2');
        var ts =ghead[0].innerText;
        

    }

    function doClickRemove()
    {
        var ghead = document.getElementsByTagName('h2');
        var ts = ghead[0].innerText;
    }

})();
