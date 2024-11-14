(function(theme)
{
    theme.views.register('record-browser',
    {
        _source: 'prague/common/record-browser/emultimedia',

        all:
        {
            show_emultimedia: function(data)
            {
                var self = this;

                var owner = self.emptyOwner();
                if (! data)
                    return;

                self.showMultimediaDetails(owner, data);
            }
        }
    });
})(IMu.Themes.get('prague'));
