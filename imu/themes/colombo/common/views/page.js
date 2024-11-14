(function(theme)
{
    theme.views.register('page',
    {
        _source: 'colombo/common/page',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.holder = undefined;

                self.header = undefined;
                self.footer = undefined;
                self.sidebar = undefined;
                self.content = undefined;
                self.searchForm = undefined;
                self.overlay = undefined;
                self.toggle = undefined;
            },

            _create: function()
            {
                var self = this;

                self.overlay = self.widget.owner.child('div', 'overlay');
                self.overlay.css
                ({
                    bottom: 0,
                    display: 'none',
                    left: 0,
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    'z-index': 9999
                });
                self.overlay.click(function()
                {
                    IMu.Events.trigger('close-overlay');
                });

                self.holder = self.widget.owner.child('div', 'holder');
                self.holder.css('position', 'relative');

                self.header = self.holder.child('div', 'header');
                self.header.css('position', 'relative');
                self.createHeader();

                self.footer = self.holder.child('div', 'footer');
                self.footer.css
                ({
                    position: 'absolute',
                    bottom: 0
                });
                self.createFooter();

/* removed due to restructuring

                self.sidebar = self.holder.child('div', 'sidebar');
                self.sidebar.css
                ({
                    position: 'fixed'
                });
                self.createSidebar();
*/
                self.content = self.holder.child('div', 'content');
                self.content.css('position', 'relative');
                self.createContent();

                self.searchForm = self.holder.child('div', 'search');
                self.createSearchForms();

                self.createMenus();

                self.resize();
            },

            resize: function()
            {
            },

            /* Do nothing by default */
            createHeader: function()
            {
            },

            createFooter: function()
            {
            },

            createSidebar: function()
            {
            },

            createSearchForms: function()
            {
            },

            createContent: function()
            {
            },

            // TODO: do i still use this?
            resizeSidebar: function()
            {
            },

            // TODO: do i still use this?
            toggleSidebar: function()
            {
            },

            createMenus: function()
            {
            }
        }
    });
})(IMu.Themes.get('colombo'));
