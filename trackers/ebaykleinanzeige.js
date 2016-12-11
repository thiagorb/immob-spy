module.exports = {
    id: 'ebaykleinanzeige',
    name: 'eBay Kleinanzeige',
    adapter: function ($) {
        var items = [];
        $('article.aditem').each(function () {
            var link = $(this).find('.text-module-begin a');
            items.push({
                id: $(this).attr('data-adid'),
                url: `https://www.ebay-kleinanzeigen.de/${link.attr('href')}`,
                title: link.text()
            });
        });
        return items;
    }
};