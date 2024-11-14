(function(theme)
{
    theme.views.register('details-viewer',
    {
        _source: 'prague/common/details-viewer/emultimedia',

        all:
        {
            create_emultimedia: function(div, data)
            {
                var self = this;

                if (! data)
                    return;

                self.showMultimediaDetails(div, data);
            }
        }
    });
})(IMu.Themes.get('prague'));
