(function(theme)
{
    theme.views.register('vertical-viewer',
    {
        _source: 'darwin/common/viewers/vertical-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;
                
                self._super.apply(self, arguments);
                self.widget.owner.addClass('imu-vertical-viewer');
/*
                self.scrollerOptions.onResize = function(info)
                {
                    self.getMinRecordSize(
                    {
                        empty: false,
                        callback: function()
                        {
                            self.scrollerResize(info);
                        }
                    });
                    
                    self.scrollerResize(info);
                };
*/                
            },

            _create: function()
            {
                this._super.apply(this, arguments);
            },

            getMinRecordSize: function(options)
            {
                var self = this;

                options = options || {};

                var children = self.content.children();
                if (children.length == 0)
                {
                    window.setTimeout(function()
                    {
                        self.getMinRecordSize(options);
                    }, 5);
                    return;
                }

                var contentWidth = self.content.css('width');
                if (contentWidth == '0px')
                {
                    window.setTimeout(function()
                    {
                        self.getMinRecordSize(options);
                    }, 5);
                    return;
                }

                var child = jQuery(children[0]);
                var width = child.fullWidth();
                var height = child.fullHeight();
                if (width <= 0 || height <= 0)
                {
                    window.setTimeout(function()
                    {
                        self.getMinRecordSize();
                    }, 5);
                    return;
                }

                var margin = parseInt(child.css('margin-left'), 10)
                           + parseInt(child.css('margin-right'), 10);

                width -= margin;
                
                if (options.empty !== false)
                    self.content.empty();

                var changed = false;

                if (self.minRecordWidth != width)
                {
                    self.minRecordWidth = width;
                    changed = true;
                }

                self.log('getMinRecordSize: minRecordWidth {0}', self.minRecordWidth);
                
                if (self.minRecordHeight != height)
                {
                    self.recordHeight = height;
                    changed = true;
                }

                self.log('getMinRecordSize: recordHeight {0}', self.recordHeight);

                self.scroller.setOptions
                ({
                    wheelMove: self.recordHeight,
                    verticalSnap: self.recordHeight
                });

                if(options.callback)
                    options.callback(changed);
            },

            locateRecord: function(offset, div)
            {
                this._super.apply(this, arguments);
                div.css(
                {
                    'height': '',
                    'width': ''
                });
            },

            createRecord: function(offset)
            {
                var record = jQuery('<div class="record"></div>');

                if (offset === undefined)
                    return record.appendTo(this.content);

                // If this is the largest offset value, append to the end
                // of the list
                if (offset >= this.cache.length)
                    return record.appendTo(this.content);

                // ...otherwise insert before appropriate element
                for (var i = offset; i < this.cache.length; i++)
                {
                    if (! this.cache.hasOwnProperty(i))
                        continue;

                    return record.insertBefore(this.cache[i]);
                }

                return record.appendTo(this.content);
            }
        }
    });
})(IMu.Themes.get('darwin'));
