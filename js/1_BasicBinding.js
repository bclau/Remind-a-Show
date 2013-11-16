//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved

/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
/// <reference path="//Microsoft.WinJS.1.0/js/ui.js" />

(function () {
    "use strict";
    var page = WinJS.UI.Pages.define("/html/FacebookConnect2.html", {

        init: function (element, options) {
            // Our data source - not that this is not explicitly
            // bindable - that's done later.
            this.bindingSource = {
                text: App.fb.name,
                pic: App.fb.pic
            };
        },

        ready: function (element, options) {
            // Hook up our inputs so that they update the
            // appropriate places in our binding source.

            // First, we call WinJS.Binding.as to get the bindable proxy object
    
            // Now, hook up the declarative binding to our binding source.
            // This is done via a call to WinJS.Binding.processAll, passing the
            // target element and the binding source.

            WinJS.Binding.processAll(element.querySelector("#basicBindingOutput"), this.bindingSource)
                .done(function () {
                    // processAll is async. You can hook up a then or done handler
                    // if you need to wait for the binding to finish
                   
                });
        },



        //
        // Helper function to set up bindings on text boxes
        //
        

    });




})();
