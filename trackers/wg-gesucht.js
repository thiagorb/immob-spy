module.exports = {
    id: 'wg-gesucht',
    name: 'WG-Gesucht',
    adapter: function ($) {
        var items = [];
        $('tr.listenansicht0,tr.listenansicht1').each(function () {
            var adId = $(this).attr('adid');
            items.push({
                id: adId,
                url: `http://www.wg-gesucht.de/${adId}`,
                title: $(this).find('td').map(function () {
                    return $(this).text().trim() 
                }).toArray().filter(x => x).join(', ')
            });
        });
        return items;
    }
};