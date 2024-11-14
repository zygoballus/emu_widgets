(function(theme)
{
    theme.views.register('details-viewer', 'record-details',
    {
        _source: 'marrakech/common/details-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                jQuery.extend(self.scrollerOptions,
                {
                    horizontalPager: true,
                    horizontalScrollbar: true,
                    horizontalSnap: '100%',
                    scrollType: 'horizontal'
                });
                self.scrollerOptions.mouseDrag = false;

                self.columns = 'details';
                self.pageSize = 5;

                // set by scrollerResize
                self.recordWidth = undefined;
                self.recordHeight = undefined;
            },

            setOffset: function(offset)
            {
                var self = this;

                var pos =
                {
                    left: offset * self.recordWidth,
                    top: 0
                };
                self.log('setOffset: offset {0} recordWidth {1} pos {2}',
                    offset, self.recordWidth, pos);
                self.scroller.scrollTo(pos);
            },

            // called from paged-viewer
            getFrameRange: function(width, height, frame)
            {
                var self = this;

                var range = {};
                range.first = Math.floor(frame.left / width);
                range.last = Math.floor((frame.left + width) / width);

                /* No range checking done here.
                ** It will be done by the caller (see paged-viewer).
                */
                return range;
            },

            locateRecord: function(offset, div)
            {
                var self = this;

                var left = offset * self.recordWidth;
                var top = 0;

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

                if (! self.widget.results)
                    return;

                self.content.fullHeight(info.height);
                var contentHeight = self.content.height();
                self.log('scrollerResize: contentHeight {0}', contentHeight);

                self.recordWidth = info.width;
                self.recordHeight = contentHeight;

                var contentWidth = self.recordWidth * self.widget.hits;
                self.log('scrollerResize: contentWidth {0}', contentWidth);
                self.content.width(contentWidth);
            },

            create_enarratives: function(div, data)
            {
                var self = this;

                if (! data)
                    return;

                var info = self.showNarrativesDetails(div, data);
            },

            create_eparties: function(div, data)
            {
                var self = this;

                if (! data)
                    return;

                var info = self.showPartyDetails(div, data);
            },

            create_emultimedia: function(div, data)
            {
                var self = this;

                if (! data)
                    return;

                var info = self.showMultimediaDetails(div, data);
            },

            create_other: function(div, data)
            {
                var self = this;

                var text = 'offset: ' + data.offset;
                text += ' rid: ' + data.rid;
                div.text(text);
            }
        }
    });
})(IMu.Themes.get('marrakech'));
