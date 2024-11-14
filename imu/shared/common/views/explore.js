(function(theme)
{
    theme.views.register('explore', 'base',
    {
        _source: 'shared/common/explore',

        all:
        {
            _construct: function()
            {
                var self = this;
                self._super.apply(this, arguments);

                self.owner = undefined;

                self.header = undefined;
                self.sidebar = undefined;
                self.content = undefined;
                self.footer = undefined;

                self.toTopButton = undefined;

                // The distance (in pixels) from the end of result set before
                // more records are loaded.
                self.loadDistance = 0;
            },

            _create: function()
            {
                var self = this;
                self._super.apply(this, arguments);

                self.createPage();
                self.loadDistance = $(window).outerHeight() / 2;
            },

            /* A generic view layout
            ** Expected to be overridden in theme/view
            */
            createPage: function()
            {
                var self = this;

                //TODO: this needs to look at widget options to see how to create page
                //eg num columns, sidebar, header

                self.owner = self.widget.owner;
                var options = self.widget.options;

                /* Create sections as per current theme
                */
                if (options.showHeader)
                    self.createHeader();

                if (options.showSidebar)
                    self.createSidebar();

                self.createContent();

                self.createFooter();
            },

            /* Empty by default
            */
            createHeader: function()
            {
            },
            createSidebar: function()
            {
            },
            createContent: function()
            {
                var self = this;

//                self.content = self.widget.owner.child('div', 'content');
                self.content = self.owner.child('div', 'content');
                self.content.css('position', 'relative');

                var table = self.content.child('table');
                table.css('table-layout', 'fixed');

                var tbody = table.child('tbody');
                tbody.css('width', '100%');

                var tr = tbody.child('tr', 'row content');
                self.content = tr;
            },

            createFooter: function()
            {
                var self = this;

                self.footer = self.owner.child('div', 'footer');
                self.footer.css('position', 'relative');

                self.footer.text(IMu.string('loading'));
            },

            setLoadInterval: function(interval)
            {
                var self = this;

                if (! interval)
                    return;
               
                /*
                var owner = jQuery("body > .swipe > .swipe-wrap > .holder");
                if (holder.length != 1)
                    holder = jQuery("body > .holder");
                if (holder.length != 1)
                    return;
                holder = holder[0];

                self.loadInterval = setInterval(function()
                {
                    var scrollHeight = holder.scrollHeight;
                    var scrollTop = holder.scrollTop;

                    var distance = scrollHeight - $(window).height() - scrollTop;
                    if (distance <= self.loadDistance)
                        IMu.Events.trigger('load-records');
                }, interval);
                */
            },
            
            clearLoadInterval: function()
            {
                var self = this;
                clearInterval(self.loadInterval);
            }
        }
    });
})(IMu.Themes.shared);
