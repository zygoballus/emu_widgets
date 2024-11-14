(function(theme)
{
    theme.views.register('combined-viewer', 'viewer',
    {
        _source: 'prague/common/combined-viewer',

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

                self.header = self.holder.child('div', 'header');

                //var table = self.header.child('table');
                var tr = self.header.child('div','header-table');

                self.navigate = tr.child('span', 'navigate');
self.navigate.attr('title', 'Back');
                var prev;
                if (IMu.Languages.current.dir == 'ltr')
                    prev = '<';
                else
                    prev = '>';
                self.navigate.text(prev);
                self.navigate.bind('click', function()
                {
                    self.widget.prevState();
                });

                self.modules = tr.child('span', 'modules');

                self.icons = tr.child('span', 'icons');
                self.makeViewIcons();

                var clear = tr.child('div', 'clear');
                clear.css('clear','both');

                self.makeOther(tr);
            },

            makeOther: function(owner)
            {
                /* Do nothing by default
                */
            },

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
            },

            resize: function()
            {
                var self = this;

                self._super();

                var holderHeight = self.holder.height();
                var headerHeight = self.header.fullHeight();
                var itemHeight = holderHeight - headerHeight;
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
                    var src = item.img.attr('src');
                    var pos = src.indexOf('-selected');

                    if (i == index)
                    {
                        if (pos < 0)
                        {
                            src += '-selected';
                            item.img.attr('src', src);
                            item.img.addClass('selected');
                        }
                        continue;
                        
                        /* Hold off showing the item, as all other items need 
                        ** hiding first, otherwise we end up with sizing issues.
                        ** -phil
                        */
                    }
                    else
                    {
                        if (pos >= 0)
                        {
                            src = src.substr(0, pos);
                            item.img.attr('src', src);
                            item.img.removeClass('selected');
                        }

                        item.elem.hide();
                    }
                }

                var item = self.widget.list[index];
                item.elem.show();
                item.widget.showSearch(self.widget.search, offset);
            },

            drawResultCount: function()
            {
                var self = this;

                if (! self.widget.search)
                {
                    self.modules.empty();
                    return;
                }

                self.widget.search.getAllHits(function(hits)
                {
                    var inc = 0;
                    var pos = 0;
                    self.modules.empty();

                    for (var i = 0; i < hits.modules.length; i++)
                    {
                        (function(n)
                        {
                            var module = hits.modules[n];
                            if (module.hits < 0)
                                return;

                            if (inc > 0)
                            {
                                var span = self.modules.child('span');
                                span.text(' | ');
                            }

                            var span = self.modules.child('span', 'module');
                            var text = IMu.string('module-' + module.name);
                            text += ' ';
                            //text += module.hits;
                            span.text(text);

                            var resultSpan = span.child('span','result-count');
                            resultSpan.text(module.hits);
                            
                            var offset = pos;
                            span.bind('click', function()
                            {
                                var item = self.widget.list[self.widget.selected];
                                item.widget.setOffset(offset);
                            });
                            inc++;
                            pos += module.hits;
                        })(i);
                    }    
                });
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

self.navigate.attr('title', 'Back (' + self.widget.states.length + ')');

				self.drawResultCount();
            },

            updateResultCount: function()
            {
                var self = this;
                
                self.drawResultCount();
            }
        },

        phone:
        {
            drawResultCount: function()
            {
                var self = this;

                if (! self.widget.search)
                {
                    self.modules.empty();
                    return;
                }

                self.widget.search.getAllHits(function(results)
                {
                    var inc = 0;
                    var pos = 0;
                    self.modules.empty();

                    var total = 0;
                    if (results && results.modules)
                    {
                        for (var i = 0; i < results.modules.length; i++)
                            total += results.modules[i].hits;
                    }

                    var span = self.modules.child('span');
                    var text = IMu.string('common-results');
                    text = IMu.Format.formatParams(text, [total]);

                    span.text(text);
                });
            }
        }
    });
})(IMu.Themes.get('prague'));
