module.exports = notification => {
    var output = [];
    notification.items.forEach(trackerNewItems => {
        output.push(`<h3>${trackerNewItems.tracker.name}</h3>`);
        var i = 0;
        
        while (i < trackerNewItems.items.length) {
            var currentFilter = trackerNewItems.items[i].filterUrl;
            output.push(`<h4><a href="${currentFilter}">${currentFilter}</a></h4>`);
            output.push(`<ul>`);
            while (i < trackerNewItems.items.length && currentFilter == trackerNewItems.items[i].filterUrl) {
                var item = trackerNewItems.items[i];
                output.push(`<li><a href="${item.url}">${item.title}</a></li>`);
                i++;
            }
            output.push(`</ul>`);
        }
    });
    
    return output.join('');
};