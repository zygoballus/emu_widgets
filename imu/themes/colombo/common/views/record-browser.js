(function(theme)
{
    /* NOTE:
    **
    ** Module-specific code for the record-browser view should go in the
    ** appropriate file in the record-browser directory. For example,
    ** specific code for the Parties module should go in
    ** record-browser/eparties.js.
    **
    ** Common code belongs in this file.
    **
    ** AB - 11 April 2013
    */
    theme.views.register('record-browser', 'record-details',
    {
        _source: 'colombo/common/record-browser',

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

                self.showMultimedia(owner, data.multimedia);
                var div = owner.child('div', 'description');
                div.css('clear', 'both');
                div.text(IMu.Format.sprintf('{0}', data));
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
})(IMu.Themes.get('colombo'));
