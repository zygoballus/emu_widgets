(function(theme)
{
    theme.views.register('paged-display',
    {
        _source: 'shared/common/paged-display',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.holder = undefined;
                self.header = undefined;
            },

            _create: function()
            {
                var self = this;

                self._super();

                var widget = self.widget;

                self.holder = widget.owner.child('div', 'holder');

                if (self.getOption('showHeader'))
                {
                    self.header = self.holder.child('div', 'header');
                    self.createHeader();
                }

                for (var i = 0; i < widget.pages.length; i++)
                {
                    (function(n)
                    {
                        var page = widget.pages[n];
                        self.holder.append(page.owner);
                        page.owner.css('clear', 'both');
                        if (n == widget.selected)
                        {
                            page.owner.visible(true);
                            page.widget.resize();
                        }
                    })(i);
                }
            },

            resize: function()
            {
                var self = this;

                self._super();

                if (! self.fixedHeight)
                    return;

                var widget = self.widget;

                self.holder.fullHeight(widget.owner.height());

                var holderHeight = self.holder.height();
                var headerHeight = self.header ? self.header.fullHeight() : 0;
                var itemHeight = holderHeight - headerHeight;
                for (var i = 0; i < widget.pages.length; i++)
                {
                    var page = widget.pages[i];
                    page.owner.fullHeight(itemHeight);
                }
            },

            select: function(index)
            {
                var self = this;

                var widget = self.widget;

                if (self.header)
                    self.selectHeader(index);

                var from = widget.pages[widget.selected];
                from.owner.visible(false);

                var to = widget.pages[index];
                to.owner.visible(true);
                to.widget.resize();

                self.resize();

                return true;
            }
        }
    });
})(IMu.Themes.shared);
