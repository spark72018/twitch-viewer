// https://coolors.co/f05d5e-0f7173-e7ecef-272932-d8a47f


(function() {
    const mainContainer = document.getElementById('mainContainer');
    const allResults = document.getElementById('allResults');
    const buttonsContainer = document.getElementById('buttonsContainer');
    const onlineImgSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Button_Icon_Green.svg/300px-Button_Icon_Green.svg.png';
    const offlineImgSrc = 'http://www.clker.com/cliparts/N/v/B/D/u/e/glossy-red-icon-angle-md.png';
    const notAvailableSrc = 'https://i0.wp.com/dragosani-legacyswtor.sadesignz.org/wp-content/uploads/2016/06/antiragging.png';
    const userArray = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", 
                        "habathcx", "RobotCaleb", "noobs2ninjas"];
    var domResultsArr;                        
    const make = (elStr) => document.createElement(elStr)      
    const setAttrs = (obj) => (element) => {
        let keys = Object.keys(obj);
        keys.forEach((key) => element.setAttribute(key, obj[key]));
        return element;
    }     
    const makeTextNodeAndAppendToHeaderTag = (str) => (element) => {
        element.appendChild(document.createTextNode(str))
        return element;
    }
    const appendArrElements = (arr) => (parent) => arr.reduce((acc, el) => {
        acc.appendChild(el)
        return acc;
    }, parent)
    const makeUserBox = (obj, _name) => {
        const stream = obj.stream;
        const anchorTagWithAttrs = setAttrs({
                                        'class': 'resultContainer',
                                        'target': '_blank',
                                    })(make('a'));
        if(stream) {
            var channel = stream.channel;
            var game = channel.game,
                viewers = stream.viewers,
                name = channel.display_name,
                views = channel.views,
                imgSrc = channel.logo
            anchorTagWithAttrs.setAttribute('href', channel.url);
        }else {
            game = viewers = views = 'N/A';
            imgSrc = null;
            name = _name;
        }
        const nameHeader = makeTextNodeAndAppendToHeaderTag(name)(make('h4'));
        const viewersHeader = makeTextNodeAndAppendToHeaderTag('Viewers: ' + viewers)(make('h4'));
        const viewsHeader = makeTextNodeAndAppendToHeaderTag('Views: ' + views)(make('h4'));
        const logoBox = make('div');
        const statusBox = make('div');
        logoBox.setAttribute('class', 'logoBox');
        statusBox.setAttribute('class', 'statusBox');
        const logoTag = make('img');
        const statusTag = make('img');
        if(imgSrc) {
            logoTag.src = imgSrc;
            statusTag.src = onlineImgSrc;
        }else {
            logoTag.src = notAvailableSrc;
            statusTag.src = offlineImgSrc;
        }
        logoBox.appendChild(logoTag);
        statusBox.appendChild(statusTag);
        
        const infoBox = appendArrElements([nameHeader,
                                           viewersHeader,
                                           viewsHeader])(setAttrs({'class': 'infoBox'})(make('div')))
        const finalContainer = appendArrElements([logoBox,
                                                  infoBox,
                                                  statusBox])(anchorTagWithAttrs);
        return finalContainer;
    };           
    const displayAll = () => domResultsArr.forEach(domEl => allResults.appendChild(domEl))
    const displayOnline = () => domResultsArr.forEach(domEl => {
        if(domEl.href) {
            allResults.appendChild(domEl);
        }
    })
    const displayOffline = () => domResultsArr.forEach(domEl => {
        if(!domEl.href) {
            allResults.appendChild(domEl);
        }
    })                                                          
    const getUserData = (userStr) => {
        let headers = new Headers();
        headers.append('Client-ID', '52efe1d0j7ckxdffjpc9p5jmr5rl12w');
        const myInit = { method: 'GET',
                    headers: headers,
                    mode: 'cors',
                    cache: 'default' };    
        let request = new Request(`https://api.twitch.tv/kraken/streams/${userStr}`, myInit); 
        return fetch(request)
        .then(res => res.json())
        .then(json => (json['originalUser'] = userStr, json));
    };
    const resultsArr = Promise.all(userArray.map(user => getUserData(user)));
    resultsArr.then(arr => {
        domResultsArr = arr.map(obj => makeUserBox(obj, obj.originalUser));
        displayAll();
    });

    const handleClick = (e) => {
        while(allResults.firstElementChild) {
            allResults.removeChild(allResults.firstElementChild);
        }
        if(e.target !== e.currentTarget) {
            let id = e.target.id;
            switch(id) {
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
    }

    buttonsContainer.addEventListener('click', handleClick, false);
})();
