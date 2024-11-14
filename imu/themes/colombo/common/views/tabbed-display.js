(function(theme)
{
    theme.views.register('tabbed-display', 'paged-display',
    {
        _source: 'colombo/client/tabbed-display',

        all:
        {
            createMenu: function(owner)
            {
                if (! owner)
                    return;

                this._super();
                var self = this;
                
                var widget = self.widget;
                for (var i = 0; i < widget.pages.length; i++)
                {
                    (function(n)
                    {
                        var page = widget.pages[n];
                        var index = n + 1;

                        page.menu = owner.child('div');
                        

                    })(i);
                }
            },
            
            selectHeader: function(index)
            {
                this._super(index);
                this.updateMenu(index);
            },

            updateMenu: function(index)
            {
            }
        }
    });
})(IMu.Themes.get('colombo'));
