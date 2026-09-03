(function(theme)
{
    theme.views.register('page',
    {
        _source: 'prague/client/page',

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
                self.toggle = undefined;
            },

            _create: function()
            {
                var self = this;

                self.holder = self.widget.owner.child('div', 'holder');

                /*
                self.header = self.holder.child('div', 'header');
                self.header.css
                ({
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    top: 0
                });
                self.createHeader();

                self.footer = self.holder.child('div', 'footer');
                self.footer.css
                ({
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    bottom: 0
                });
                self.createFooter();
                */

                self.sidebar = self.holder.child('div', 'sidebar');
                self.sidebar.css
                ({
                    position: 'absolute'
                });
                self.createSidebar();

                self.content = self.holder.child('div', 'content');
                self.createContent();
                var sidebarWidth = self.sidebar.fullWidth();
                self.content.css
                ({
                    position: 'absolute'
                });
                self.content.css(IMu.Languages.current.far, 0);

                if (self.widget.options.showToggle)
                {
                    self.toggle = self.holder.child('button', 'toggle');
                    self.toggle.css
                    ({
                        position: 'absolute'
                    });

                    self.toggle.bind('click', function(e)
                    {
                        self.sidebar.toggle();
                        window.setTimeout(function()
                        {
                            IMu.Events.trigger('dom-resize');
                        }, 0);
                    });
                }
            },

            resize: function()
            {
                var self = this;

                //var headerHeight = self.header.fullHeight();
                var headerHeight = 0;
                //var footerHeight = self.footer.fullHeight();
                var footerHeight = 0;
                self.sidebar.css('top', headerHeight);
                self.sidebar.css('bottom', footerHeight);

                var sidebarWidth = 0;
                if (self.sidebar.visible())
                    sidebarWidth = self.sidebar.fullWidth();
                self.sidebar.css('display', 'none');

                self.content.css('top', headerHeight);
                self.content.css('bottom', footerHeight);
                self.content.css(IMu.Languages.current.near, sidebarWidth -1);
            
                if (self.widget.options.showToggle)
                {
                    self.toggle.css(IMu.Languages.current.near, 0);
                    self.toggle.css('bottom', footerHeight);
                    var label;
                    var title;

                    if (sidebarWidth > 0)
                    {
                        label = IMu.string('page-sidebar-hide-label');
                        title = IMu.string('page-sidebar-hide-title');
                    }
                    else
                    {
                        label = IMu.string('page-sidebar-show-label');
                        title = IMu.string('page-sidebar-show-title');
                    }

                    self.toggle.html(label);
                    self.toggle.attr('title', title);
                }

                self.resizeSidebar();
                if (sidebarWidth > 0)
                {
                    self.sidebar.css('display', 'block');
                }
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

            createContent: function()
            {
            },

            resizeSidebar: function()
            {
            }
        }
    });
})(IMu.Themes.get('prague'));
