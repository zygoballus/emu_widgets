(function(theme)
{
    theme.views.register('record-browser',
    {
        _source: 'prague/common/record-browser/eparties',

        all:
        {
            show_eparties: function(data)
            {
                var self = this;

                var owner = self.emptyOwner();
                if (! data)
                    return;

                self.showPartyDetails(owner, data);
            }
        }
    });
})(IMu.Themes.get('prague'));
