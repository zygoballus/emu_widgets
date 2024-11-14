(function(theme)
{
    theme.views.register('combined-viewer', 'viewer',
    {
        _source: 'darwin/common/components/combined-viewer',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.header = undefined;
                this.resultHits = undefined;
                this.spinner = undefined;
                this.icons = undefined;
                this.overlay = undefined;

                this.list = undefined;
            },

            _create: function()
            {
                var self = this; 
                self._super.apply(self, arguments);

                var widget = self.widget;

                self.header = self.holder.child('div', 'header');

                var results = self.header.child('span', 'results');//.child('span', 'hits');
                results.child('span').text(IMu.string('combined-viewer-results') + ': ');
                self.resultHits = results.child('span', 'hits');

                self.spinner = results.child('span', 'spinner').child('img');
                self.spinner.attr('src', IMu.Request.getURL('Image')
                    + '&name=spinner');
                self.spinner.hide();

                self.icons = self.header.child('span', 'icons');

                self.overlay = self.holder.child('div', 'overlay');

                self.makeViews();
            },

            makeViews: function()
            {
                var self = this;

                var widget = self.widget;

                for (var i = 0; i < widget.list.length; i++)
                {
                    (function(item, index)
                    {
                        if (item.elem)
                            item.elem.remove();

                        item.img = self.icons.child('div', 
                            'icon icon-' + (index + 1),
                            item.icon + '-icon'
                        );

                        // TODO: need to be able to remove class when deselected
                        if (index === widget.selected)
                            item.img.addClass('selected');

                        item.img.attr('title', IMu.string(item.title));
                        item.img.click(function()
                        {
                            widget.select(index);
                        });

                        self.holder.append(item.elem);

                        if (index == widget.selected)
                        {
                            item.elem.visible(true);
                            item.widget.resize();
                        }

                    })(widget.list[i], i);
                }
            },

            resize: function()
            {
            },

            select: function(index, offset)
            {
                this.overlay.empty();

               // this.resize();

                for (var i = 0; i < this.widget.list.length; i++)
                {
                    if (i == index)
                        continue;
                    
                    var item = this.widget.list[i];
                    item.img.removeClass('selected');
                    item.elem.hide();
                }

                var item = this.widget.list[index];
                item.img.addClass('selected');
                item.elem.show();
                item.widget.showSearch(this.widget.search, offset);
            },

            drawResultCount: function(count)
            {
                if (count === undefined)
                    count = '';
                this.resultHits.text(count);
            },

            setOffset: function(offset)
            {
                this.resize();
                for (var i = 0; i < this.widget.list.length; i++)
                {
                    var item = this.widget.list[i];
                    if (i == this.widget.selected)
                        item.widget.showSearch(this.widget.search, offset);
                }
            },

            setSearch: function(search)
            {
                this.overlay.empty();

                var count = 0;
                if (search.hits && search.hits.modules)
                {
                    for (var i = 0; i < search.hits.modules.length; i++)
                        count += search.hits.modules[i].hits;
                }
                this.drawResultCount(count);
                this.endDelay();
            },

            showError: function(error)
            {
                var message = IMu.string('search-error-message');
                message = IMu.Format.formatParams(message, [error.id]);

                this.overlay.child('div', 'error').text(message);

                IMu.log('Search Error', error.args);
            },

            updateResultCount: function()
            {
                this.overlay.empty();
                this.drawResultCount();
            },

            /* Public
            */
            beginDelay: function()
            {
                this.overlay.empty();
                this.resultHits.hide();
                this.spinner.show();
            },

            endDelay: function()
            {
                this.overlay.empty();
                this.spinner.hide();
                this.resultHits.show();
            }
        }
    });
})(IMu.Themes.get('darwin'));
