(function(theme)
{
    theme.views.register('sort-control', 'selection-control',
    {
        _source: 'prague/common/sort-control',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                var self = this;

                var widget = self.widget;

                self.control.bind('change', function(e)
                {
                    widget.sortValue = self.getValue();
                    widget.sortChanged();
                });

                var icons = jQuery('#combinedViewer.header.icons img');
                
            }
        }
    });
})(IMu.Themes.get('prague'));
