(function(theme)
{
    theme.views.register('details-viewer',
    {
        _source: 'prague/common/details-viewer/enarratives',

        all:
        {
            create_enarratives: function(div, data)
            {
                var self = this;

                if (! data)
                    return;

                self.showNarrativeDetails(div, data);
            }
        }
    });
})(IMu.Themes.get('prague'));
