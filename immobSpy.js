var fs = require('fs');
var cheerio = require('cheerio');
var fetchUrl = require('./fetchUrl');
var config = require('./config');
//require('./heapdump').init('dump');

var notifiers = config.notifiers
    .filter(notifierConfig => notifierConfig.active)
    .map(notifierConfig => require(notifierConfig.module)(notifierConfig));
    
var trackers = config.trackers
    .filter(trackerConfig => trackerConfig.active)
    .map(trackerConfig => {
        var tracker = require(trackerConfig.module);
        return {
            id: tracker.id,
            name: tracker.name,
            adapter: tracker.adapter,
            config: trackerConfig
        };
    });

var readAlreadySeen = function () {
    if (!fs.existsSync('alreadySeen.json')) {
        return null;
    }
    
    return JSON.parse(fs.readFileSync('alreadySeen.json'));
};

var saveNewItems = function (trackersNewItems, alreadySeen) {
    alreadySeen = alreadySeen || {};
    trackersNewItems.forEach(trackerNewItems => {
        var newItems = alreadySeen[trackerNewItems.tracker.id] || {};
        trackerNewItems.items.forEach(item => newItems[item.id] = true);
        alreadySeen[trackerNewItems.tracker.id] = newItems;
    });
    fs.writeFileSync('alreadySeen.json', JSON.stringify(alreadySeen));
};

var fetchItems = tracker => 
    Promise.all(
        tracker.config.urls.map(url => fetchUrl(url).then(html =>
            tracker.adapter(cheerio.load(html)).map(item => {
                item.filterUrl = url;
                return item;
            })
        ))
    ).then(results => {
        var merged = [];
        var ids = {};
        results.forEach(result => {
            result.forEach(item => {
                if (!ids[item.id]) {
                    ids[item.id] = true;
                    merged.push(item);
                }
            });
        });
        return {
            tracker: tracker,
            items: merged
        };
    });

var iteration = () => 
    Promise.all(
        trackers.map(fetchItems)
    ).then(trackersResult => {
        var alreadySeen = readAlreadySeen();
        if (!alreadySeen) {
            saveNewItems(trackersResult);
            return Promise.resolve(false);
        }

        var newItems = trackersResult
            .map(trackerResult => 
                ({
                    tracker: trackerResult.tracker,
                    items: trackerResult.items.filter(item => 
                        !alreadySeen[trackerResult.tracker.id] || !alreadySeen[trackerResult.tracker.id][item.id]
                    )
                })
            )
            .filter(trackerNewItems => trackerNewItems.items.length > 0);

        var countNewItems = newItems.map(trackerNewItems => trackerNewItems.items.length).reduce((a, b) => a + b, 0);
        console.log(new Date(), `new items: ${countNewItems}`);

        if (!countNewItems) {
            return Promise.resolve(false);
        }
        
        var notification = { items: newItems };
        
        return Promise.all(
            notifiers.map(notifier => Promise.resolve(notifier(notification)))
        ).then(() => saveNewItems(newItems, alreadySeen) || true);
    });

var delayedLoop = () => setTimeout(loop, config.waitTime);
var errorHandling = error => {
    console.log(error);
    delayedLoop();
};

var loop = () => iteration().then(delayedLoop, errorHandling).catch(errorHandling);

loop();