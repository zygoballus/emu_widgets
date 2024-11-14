(function(theme)
{
    theme.views.register('record-browser', 'record-details',
    {
        _source: 'marrakech/common/record-browser',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.columns = 'browse';
            },

            _create: function()
            {
                var self = this;
            },

            resize: function()
            {
                var self = this;

            },

            show_default: function(data)
            {
                var self = this;

                var owner = self.emptyOwner();
                if (! data)
                    return;

                var div;

                // multimedia
                var info = self.showMultimedia(owner, data);

                div = info.child('div', 'description');
                div.css('clear', 'both');
                div.text(IMu.Format.sprintf('{0}', data));
            },

            show_enarratives: function(data)
            {
                var self = this;

                var owner = self.emptyOwner();
                if (! data)
                    return;

                // multimedia & narrative details
                var info = self.showNarrativesDetails(owner, data);
            },

            show_eparties: function(data)
            {
                var self = this;

                var owner = self.emptyOwner();
                if (! data)
                    return;

                // multimedia & party details
                var info = self.showPartyDetails(owner, data);
            },

            show_emultimedia: function(data)
            {
                var self = this;

                var owner = self.emptyOwner();
                if (! data)
                    return;

                // multimedia & details
                var info = self.showMultimediaDetails(owner,data);
            },

            collectionChanged: function()
            {
                var self = this;

                self.widget.owner.find('.select').each(function()
                {
                    var select = jQuery(this);
                    var module = select.attr('module');
                    var key = select.attr('key');
                    select.attr('checked', IMu.User.hasEntry(module, key));
                });
            }
        }
    });
})(IMu.Themes.get('marrakech'));
