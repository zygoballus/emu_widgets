(function(theme)
{
    theme.views.register('record-browser',
    {
        _source: 'prague/common/record-browser/enarratives',

        all:
        {
            show_enarratives: function(data)
            {
                var self = this;

                var owner = self.emptyOwner();
                if (! data)
                    return;

                self.showNarrativeDetails(owner, data);
            }
        }
    });
})(IMu.Themes.get('prague'));
