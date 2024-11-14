(function(theme)
{
    theme.views.register('details-viewer',
    {
        _source: 'prague/common/details-viewer/eparties',

        all:
        {
            create_eparties: function(div, data)
            {
                var self = this;

                if (! data)
                    return;

                self.showPartyDetails(div, data);
            }
        }
    });
})(IMu.Themes.get('prague'));
