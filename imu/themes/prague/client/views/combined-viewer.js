(function(theme)
{
    theme.views.register('combined-viewer', 'viewer',
    {
        _source: 'prague/client/combined-viewer',

        all:
        {
            makeViewIcons: function()
            {
                var self = this;
                var widget = self.widget;

                for (var i = 0; i < widget.list.length; i++)
                {
                    (function(n)
                    {
                        var item = widget.list[n];
                        if (item.elem)
                            item.elem.remove();

                        var index = n + 1;

                        item.img = self.icons.child('img', 'icon icon-' + index);
                        var src = IMu.Request.getURL('Image');
                        src += '&name=' + item.icon;
                        if (n == widget.selected)
                        {
                            src += '-selected';
                            item.img.addClass('selected');
                        }
                        item.img.attr('src', src);
                        item.img.attr('title', IMu.string(item.title));
                        if (IMu.string(item.title) == 'Lightbox')
                        {
                                item.img.attr('alt', 'thumbnail view');
                        }
                        else if (IMu.string(item.title) == 'Details')
                        {
                                item.img.attr('alt', 'detail view');
                        }
                        item.img.click(function()
                        {
                            widget.select(n);
                        });

                        var item = widget.list[n];
                        self.holder.append(item.elem);
                        if (n == widget.selected)
                        {
                            item.elem.visible(true);
                            item.widget.resize();
                        }
                    })(i);
                }
            }
        }
    });
})(IMu.Themes.get('prague'));
