(function(theme)
{
    theme.views.register('vertical-viewer', 'paged-viewer',
    {
        _source: 'shared/common/vertical-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                jQuery.extend(self.scrollerOptions,
                {
                    scrollType: 'vertical',
                    verticalScrollbar: true
                });

                // set by getMinRecordSize
                self.minRecordWidth = undefined;
                self.recordHeight = undefined;

                // set by scrollerResize
                self.recordsPerRow = undefined;
                self.recordWidth = undefined;
            },

            _create: function()
            {
                var self = this;

                self._super();

                self.createRecord();
                self.getMinRecordSize();
            },

            setOffset: function(offset)
            {
                var self = this;

                /* Convert logical offset into physical offset
                */
                var row = Math.floor(offset / self.recordsPerRow);
                var pos =
                {
                    left: 0,
                    top: row * self.recordHeight
                };
                self.log('setOffset: offset {0} recordsPerRow {1} row {2} pos {3}',
                    offset, self.recordsPerRow, row, pos);
                self.scroller.scrollTo(pos);
            },

            // called from paged-viewer
            getFrameRange: function(width, height, frame)
            {
                var self = this;

                if (! self.minRecordWidth)
                    return undefined;

                var range = {};

                var firstRow = Math.floor(frame.top / self.recordHeight);
                range.first = firstRow * self.recordsPerRow;

                var lastRow = Math.floor((frame.top + height) / self.recordHeight);
                range.last = (lastRow + 1) * self.recordsPerRow - 1;

                /* No range checking done here.
                ** It will be done by the caller (see paged-viewer).
                */
                return range;
            },

            locateRecord: function(offset, div)
            {
                var self = this;

                var col = offset % self.recordsPerRow;
                var row = Math.floor(offset / self.recordsPerRow);

                var left = col * self.recordWidth;
                var top = row * self.recordHeight;

                var width = self.recordWidth;
                var height = self.recordHeight;

                div.left(left);
                div.top(top);
                div.fullWidth(width);
                div.fullHeight(height);
                div.visible(true);
            },

            scrollerResize: function(info)
            {
                var self = this;

                if (! self.widget || ! self.widget.results)
                    return;
                if (! self.minRecordWidth)
                    return;

                self.content.fullWidth(info.width);
                var contentWidth = self.content.width();
                self.log('scrollerResize: contentWidth {0}', contentWidth);

                if (self.widget.options.recordsPerRow)
                    self.recordsPerRow = self.widget.options.recordsPerRow;
                else
                    self.recordsPerRow = Math.floor(contentWidth / self.minRecordWidth);

                if (self.recordsPerRow < 1)
                    self.recordsPerRow = 1;
                self.log('scrollerResize: recordsPerRow {0}', self.recordsPerRow);

                self.recordWidth = Math.floor(contentWidth / self.recordsPerRow);
                self.log('scrollerResize: recordWidth {0}', self.recordWidth);

                var numberOfRows = Math.ceil(self.widget.hits / self.recordsPerRow);
                self.log('scrollerResize: numberOfRows {0}', numberOfRows);

                var contentHeight = self.recordHeight * numberOfRows;
                self.log('scrollerResize: contentHeight {0}', contentHeight);
                self.content.height(contentHeight);
            },

            // private
            getMinRecordSize: function()
            {
                var self = this;

                var children = self.content.children();
                if (children.length == 0)
                {
                    window.setTimeout(function()
                    {
                        self.getMinRecordSize();
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

                self.content.empty();

                self.minRecordWidth = width;
                self.log('getMinRecordSize: minRecordWidth {0}', self.minRecordWidth);
                self.recordHeight = height;
                self.log('getMinRecordSize: recordHeight {0}', self.recordHeight);

                self.scroller.setOptions
                ({
                    wheelMove: self.recordHeight,
                    verticalSnap: self.recordHeight
                });
            }
        }
    });
})(IMu.Themes.shared);
