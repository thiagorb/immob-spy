module.exports = {
    id: 'wg-gesucht',
    name: 'WG-Gesucht',
    adapter: function ($) {
        var items = [];
        $('tr.listenansicht0,tr.listenansicht1').each(function () {
            var adUrl = $(this).attr('adid');
            items.push({
                id: adUrl.replace(/^.*\.([0-9]+)\.html/, "$1"),
                url: `http://www.wg-gesucht.de/${adUrl}`,
                title: $(this).find('td').map(function () {
                    return $(this).text().trim() 
                }).toArray().filter(x => x).join(', ')
            });
        });
        return items;
    }
};
