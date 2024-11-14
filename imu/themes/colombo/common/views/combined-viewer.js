(function(theme)
{
    theme.views.register('combined-viewer', 'viewer',
    {
        _source: 'colombo/common/combined-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.header = undefined;
                self.navigate = undefined;
                self.modules = undefined;
                self.icons = undefined;

                self.list = undefined;
            },
            
            _create: function()
            {
                var self = this;

                self._super();

                var widget = self.widget;

                if (widget.options.icons)
                    self.icons = widget.options.icons;
                else
                {
                    if (self.header === undefined)
                        self.header = self.holder.child('div', 'header');
                    self.icons = self.header.child('div', 'icons');
                }

                for (var i = 0; i < widget.list.length; i++)
                {
                    (function(n)
                    {
                        var item = widget.list[n];
                        if (item.elem)
                            item.elem.remove;

                        self.createViewButton(item, n);

                        var item = widget.list[n];
                        self.holder.append(item.elem);
                        if (n == widget.selected)
                        {
                            item.elem.visible(true);
                            item.widget.resize();
                        }
                    })(i);
                }
            },

            createViewButton: function(item, index)
            {
                var self = this;
                
                var div = self.icons.child('div', 'bg-colour-3');
                item.button = div.IMu('button-control');
                item.button.addState(
                {
                    name: 'off',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') +
                            '&name=views/' + item.icon
                    },
                    onClick: function()
                    {
                        self.widget.select(index);
                        this.setState('on');
                    }
                });
                item.button.addState(
                {
                    name: 'on',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') +
                            '&name=views/' + item.icon + '-selected'
                    },
                    onClick: function()
                    {
                        self.widget.select(index);
                        this.setState('off');
                    }
                });
            },
            
            resize: function()
            {
                var self = this;

                self._super();


                var holderHeight = self.holder.height();
//                var headerHeight = self.header.fullHeight();
//                var itemHeight = holderHeight - headerHeight;
                var itemHeight = holderHeight;
                for (var i = 0; i < self.widget.list.length; i++)
                {
                    var item = self.widget.list[i];
                    item.elem.fullHeight(itemHeight);
                }
                
            },

            select: function(index, offset)
            {
                var self = this;

                self.resize();
                for (var i = 0; i < self.widget.list.length; i++)
                {
                    var item = self.widget.list[i];
/*                    var src = item.img.attr('src');
                    var pos = src.indexOf('-selected');
*/
                    if (i == index)
                    {
/*                    
                        if (pos < 0)
                        {
                            src += '-selected';
                            item.img.attr('src', src);
                        }
*/
                        item.elem.show();
                        item.widget.showSearch(self.widget.search, offset);
                    }
                    else
                    {
/*                    
                        if (pos >= 0)
                        {
                            src = src.substr(0, pos);
                            item.img.attr('src', src);
                        }
*/
                        item.elem.hide();
                    }
                }
            },

            drawResultCount: function()
            {
            },

            setOffset: function(offset)
            {
                var self = this;

                self.resize();
                for (var i = 0; i < self.widget.list.length; i++)
                {
                    var item = self.widget.list[i];
                    if (i == self.widget.selected)
                        item.widget.showSearch(self.widget.search, offset);
                }
            },

            setSearch: function(search)
            {
                var self = this;
/*                

self.navigate.attr('title', 'Back (' + self.widget.states.length + ')');

                self.drawResultCount();
*/                
            },

            updateResultCount: function()
            {
                var self = this;

                self.drawResultCount();
            }
        }
    });
})(IMu.Themes.get('colombo'));
