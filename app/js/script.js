'use strict';

// https://coolors.co/f05d5e-0f7173-e7ecef-272932-d8a47f


(function () {
    var mainContainer = document.getElementById('mainContainer');
    var allResults = document.getElementById('allResults');
    var buttonsContainer = document.getElementById('buttonsContainer');
    var onlineImgSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Button_Icon_Green.svg/300px-Button_Icon_Green.svg.png';
    var offlineImgSrc = 'http://www.clker.com/cliparts/N/v/B/D/u/e/glossy-red-icon-angle-md.png';
    var notAvailableSrc = 'https://i0.wp.com/dragosani-legacyswtor.sadesignz.org/wp-content/uploads/2016/06/antiragging.png';
    var userArray = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    var domResultsArr;
    var make = function make(elStr) {
        return document.createElement(elStr);
    };
    var setAttrs = function setAttrs(obj) {
        return function (element) {
            var keys = Object.keys(obj);
            keys.forEach(function (key) {
                return element.setAttribute(key, obj[key]);
            });
            return element;
        };
    };
    var makeTextNodeAndAppendToHeaderTag = function makeTextNodeAndAppendToHeaderTag(str) {
        return function (element) {
            return element.appendChild(document.createTextNode(str)), element;
        };
    };
    var appendArrElements = function appendArrElements(arr) {
        return function (parent) {
            return arr.reduce(function (acc, el) {
                acc.appendChild(el);
                return acc;
            }, parent);
        };
    };
    var makeUserBox = function makeUserBox(obj, name) {
        var stream = obj.stream;
        var anchorTagWithAttrs = setAttrs({
            'class': 'resultContainer',
            'target': '_blank'
        })(make('a'));
        if (stream) {
            var channel = stream.channel;
            var game = channel.game,
                viewers = stream.viewers,
                name = channel.display_name,
                views = channel.views,
                imgSrc = channel.logo;
            anchorTagWithAttrs.setAttribute('href', channel.url);
        } else {
            game = viewers = views = 'N/A';
            imgSrc = null;
            name = name;
        }
        var nameHeader = makeTextNodeAndAppendToHeaderTag(name)(make('h4'));
        var viewersHeader = makeTextNodeAndAppendToHeaderTag('Viewers: ' + viewers)(make('h4'));
        var viewsHeader = makeTextNodeAndAppendToHeaderTag('Views: ' + views)(make('h4'));
        var logoBox = make('div');
        var statusBox = make('div');
        logoBox.setAttribute('class', 'logoBox');
        statusBox.setAttribute('class', 'statusBox');
        var logoTag = make('img');
        var statusTag = make('img');
        if (imgSrc) {
            logoTag.src = imgSrc;
            statusTag.src = onlineImgSrc;
        } else {
            logoTag.src = notAvailableSrc;
            statusTag.src = offlineImgSrc;
        }
        logoBox.appendChild(logoTag);
        statusBox.appendChild(statusTag);

        var infoBox = appendArrElements([nameHeader, viewersHeader, viewsHeader])(setAttrs({ 'class': 'infoBox' })(make('div')));
        var finalContainer = appendArrElements([logoBox, infoBox, statusBox])(anchorTagWithAttrs);
        return finalContainer;
    };
    var displayAll = function displayAll() {
        return domResultsArr.forEach(function (domEl) {
            return allResults.appendChild(domEl);
        });
    };
    var displayOnline = function displayOnline() {
        return domResultsArr.forEach(function (domEl) {
            if (domEl.href) {
                allResults.appendChild(domEl);
            }
        });
    };
    var displayOffline = function displayOffline() {
        return domResultsArr.forEach(function (domEl) {
            if (!domEl.href) {
                allResults.appendChild(domEl);
            }
        });
    };
    var getUserData = function getUserData(userStr) {
        var headers = new Headers();
        headers.append('Client-ID', '52efe1d0j7ckxdffjpc9p5jmr5rl12w');
        var myInit = { method: 'GET',
            headers: headers,
            mode: 'cors',
            cache: 'default' };
        var request = new Request('https://api.twitch.tv/kraken/streams/' + userStr, myInit);
        return fetch(request).then(function (res) {
            return res.json();
        }).then(function (json) {
            return json['originalUser'] = userStr, json;
        });
    };
    var resultsArr = Promise.all(userArray.map(function (user) {
        return getUserData(user);
    }));
    resultsArr.then(function (arr) {
        domResultsArr = arr.map(function (obj) {
            return makeUserBox(obj, obj.originalUser);
        });
        displayAll();
    });

    var handleClick = function handleClick(e) {
        while (allResults.firstElementChild) {
            allResults.removeChild(allResults.firstElementChild);
        }
        if (e.target !== e.currentTarget) {
            var id = e.target.id;
            switch (id) {
                case 'showAll':
                    displayAll();
                    break;
                case 'showOnline':
                    displayOnline();
                    break;
                case 'showOffline':
                    displayOffline();
                    break;
            }
        }
    };

    buttonsContainer.addEventListener('click', handleClick, false);
})();