(function(theme)
{
    theme.views.register('tabbed-display', 'paged-display',
    {
        _source: 'shared/common/tabbed-display',

        all:
        {
            createHeader: function()
            {
                this._super();

                var self = this;
                var widget = self.widget;
                for (var i = 0; i < widget.pages.length; i++)
                {
                    (function(n)
                    {
                        var page = widget.pages[n];
                        var index = n + 1;

                        page.tab = self.header.child('div');
                        page.tab.addClass('tab');
                        page.tab.addClass('tab-' + index);
                        page.tab.css('float', IMu.Languages.current.near);
                        page.tab.click(function()
                        {
                            self.widget.select(n);
                            window.setTimeout(function()
                            {
                                IMu.Events.trigger('dom-resize');
                            }, 0);
                        });

                        var title = IMu.string(page.title);
                        if (page.icon)
                        {
                            page.img = page.tab.child('img', 'icon');
                            page.img.attr('title', title);
                        }
                        else
                        {
                            page.p = page.tab.child('p', 'title');
                            page.p.text(title);
                        }

                        self.updateTab(page, n == widget.selected);
                    })(i);
                }
            },

            selectHeader: function(index)
            {
                this._super();

                var self = this;
                var widget = self.widget;

                self.updateTab(widget.pages[widget.selected], false);
                self.updateTab(widget.pages[index], true);
            },

            // private
            updateTab: function(page, selected)
            {
                if (selected)
                    page.tab.addClass('tab-selected');
                else
                    page.tab.removeClass('tab-selected');
                if (page.img)
                {
                    var src = IMu.Request.getURL('Image');
                    src += '&name=' + page.icon;
                    if (selected)
                        src += '-selected';
                    if (page.img.attr('src') != src)
                        page.img.attr('src', src);
                }
            }
        }
    });
})(IMu.Themes.shared);
