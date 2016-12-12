module.exports = config => ({
    id: 'immobilienscout',
    name: 'ImmobilienScout24',
    adapter: function ($) {
        var items = [];
        $('article[data-obid]').each(function () {
            if (config.ignoreWithoutPicture && $(this).find('.gallery__nopicture-container').length) {
                return;
            }
            
            var exposeId = $(this).attr('data-obid');
            var title = $(this).find('a.result-list-entry__brand-title-container[data-go-to-expose-id]').clone();
            title.find('.result-list-entry__new-flag').remove();
            items.push({
                id: exposeId,
                url: `https://www.immobilienscout24.de/expose/${exposeId}`,
                title: title.text().trim()
            });
        });
        return items;
    }
});
