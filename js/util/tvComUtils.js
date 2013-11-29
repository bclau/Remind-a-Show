(function () {
    "use strict";

    var _baseUrl = "http://www.tv.com";
    var _uri = "/shows/";
    var _watch = "/watch/?episode_type_range=1-2&vdmid_free=checked";

    var _more_less_trimming = '<span class=\"_more\">more</span><span class=\"_less\">less</span>';

    var _list_class_name = "videos _standard_list",
        _image_class_name = "force_scale",
        _title_class_name = "title",
        _airing_class_name = "airing_info",
        _description_class_name = "body_text",
        _video_div_class_name = "vid_bg";

    var _getVideo = function (url, callback) {
        WinJS.xhr({
            url: url
        }).done(function (result) {
            var resultText = result.responseText;
            var startIndex = resultText.indexOf('<div class="' + _video_div_class_name + '">');
            var endIndex = resultText.indexOf('</div>', startIndex) + '</div>'.length;
            var div = resultText.substring(startIndex, endIndex);

            var div_element = document.createElement("div");
            div_element.innerHTML = div;

            callback(div);
        },
        function (result) {
            //errors and stuff.

        });
    }

    var _getEpisodes = function (show, callback) {
        var url = _baseUrl + _uri + show.split(' ').join('-') + _watch;
        WinJS.xhr({
            url: url
        }).done(function (result) {
            var el = document.createElement("div");
            el.innerHTML = window.toStaticHTML(result.responseText);
            var episodes = el.getElementsByClassName(_list_class_name)[0];

            var episodeNode, title_cont, airing_info_cont, se_parts, se_air_parts;
            var image_link, title, url, season, episode, air_date, description;
            for (var i = 0, child_count = episodes.children.length - 1; i < child_count; i++) {
                episodeNode = episodes.children[i];
                title_cont = episodeNode.getElementsByClassName(_title_class_name)[0];

                if (!title_cont.firstElementChild)
                    continue;

                airing_info_cont = episodeNode.getElementsByClassName(_airing_class_name)[0];
                se_air_parts = airing_info_cont.innerHTML.trim().split('-');
                se_parts = se_air_parts[0].trim().split(":");

                image_link = episodeNode.getElementsByClassName(_image_class_name)[0].src;
                title = title_cont.innerText;
                url = title_cont.firstElementChild.href;
                url = _baseUrl + url.substring(url.indexOf(_uri));
                season = se_parts[0].trim().substring(2);
                episode = se_parts[1].trim().substring(3);
                air_date = se_air_parts[1].trim();
                description = episodeNode.getElementsByClassName(_description_class_name)[0].innerHTML;
                description = description.replace(_more_less_trimming, "");
                description = description.replace("<span>", "").replace("</span>", "")
                description = description.replace("<p>", "").replace("</p>").trim();
               
                callback({
                    season: season,
                    episode: episode,
                    name: title,
                    air_date: air_date,
                    description: description,
                    image: image_link,
                    url: url
                });
            }


        },
        function (result) {
            //errors and stuff.

        });
    }

    WinJS.Namespace.define("App.tvcom.utils", {
        getEpisodes: _getEpisodes,
        getVideo: _getVideo
    });


})();

