module.exports = {
    id: 'immobilienscout',
    name: 'ImmobilienScout24',
    adapter: function ($) {
        var items = [];
        $('a.result-list-entry__brand-title-container[data-go-to-expose-id]').each(function () {
            var exposeId = $(this).attr('data-go-to-expose-id');
            var clone = $(this).clone();
            clone.find('.result-list-entry__new-flag').remove();
            items.push({
                id: exposeId,
                url: `https://www.immobilienscout24.de/expose/${exposeId}`,
                title: clone.text().trim()
            });
        });
        return items;
    }
};