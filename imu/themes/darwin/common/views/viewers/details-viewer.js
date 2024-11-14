(function(theme)
{
    theme.views.register('details-viewer', 'record-details',
    {
        _source: 'darwin/common/viewers/details-viewer',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments)

                jQuery.extend(this.scrollerOptions,
                {
                    horizontalPager: true,
                    horizontalScrollbar: true,
                    horizontalSnap: '100%',
                    scrollType: 'horizontal'
                });
                this.scrollerOptions.mouseDrag = false;

                this.columns = 'details';
                this.pageSize = 5;

                // set by scrollerResize
                this.recordWidth = undefined;
                this.recordHeight = undefined;

                IMu.Events.bind('details-record-created',
                function(e, record)
                {
                    if (! record)
                        return;

                    record.trigger('imu-record-created');
                });
            },

            create_layout: function(owner)
            {
                var holder = jQuery('<div class="holder"></div>');
                var image = holder.child('div', 'image');

                return {
                    'image': image,
                    'imagePlaceholder': image.child('div', 'placeholder'),
                    'details': holder.child('div', 'details'),
                    'holder': holder,
                    'record': owner
                }
            },

            makeTitle: function(layout, titleTxt)
            {
                var record = layout.record;
                var details = layout.details;

                var title = details.child('h3', 'title');
                title.text(titleTxt || '');

                if (! record)
                    return;

                record.one('imu-record-created', function(e)
                {
                    var maxHeight = title.css('max-height');
                    if (maxHeight == 'none' || maxHeight == '')
                        return;

                    title.css('max-height', '100%');

                    var minHeight = title.css('min-height');
                    if (minHeight == '0px')
                        minHeight = '';

                    title.css('min-height', maxHeight);
                    title.IMuEllipsis();

                    title.css(
                    {
                        'min-height': '',
                        'max-height': ''
                    });
                });
            },

            /* Public
            */
            create_other: function(owner, data)
            {
                var layout = this.create_layout(owner);
                
                var titleTxt = data.title || data.SummaryData || '';
                this.makeTitle(layout, titleTxt);
                
                layout.holder.appendTo(owner);
                IMu.Events.trigger('details-record-created', owner);
            },

            collectionChanged: function()
            {
            },

            // called from paged-viewer
            getFrameRange: function(width, height, frame)
            {
                return {
                    'first': Math.round(frame.left / width),
                    'last': Math.floor((frame.left + width) / width)
                };
            },

            locateRecord: function(offset, div)
            {
                var left = offset * this.recordWidth;
                var top = 0;

                var width = this.recordWidth;
                var height = this.recordHeight;

                div.left(left);
                div.top(top);
                div.fullWidth(width);
                div.fullHeight(height);
                div.visible(true);
            },

            makeMedia: function(layout, data)
            {
                var self = this;

                if (! data.image)
                    return;

                var mm = new IMu.Request.Multimedia();
                mm.setKey(data.image.irn);
                mm.addFilter('kind', 'ne', 'supplementary');
                mm.addFilter('height', 'bf', '800');
                mm.addFilter('width', 'bf', '800');
                mm.addModifier('format', 'jpg');
                var src = mm.getURL();

                var image = layout.image.child('div');
                image.css('background-image', 'url(' + src + ')');
                image.click(function()
                {
                    self.showImage(data.image.irn);
                });

                layout.imagePlaceholder.detach();
            },

            resize: function()
            {
                this.scroller.resize();
            },

            scrollerResize: function(info)
            {
                if (! this.widget.results)
                    return;

                var currentContentOffset = this.content.offset();

                this.content.fullHeight(info.height);
                var contentHeight = this.content.height();
                this.log('scrollerResize: contentHeight {0}', contentHeight);

                this.recordWidth = info.width;
                this.recordHeight = contentHeight;

                var contentWidth = this.recordWidth * this.widget.hits;
                this.log('scrollerResize: contentWidth {0}', contentWidth);
                this.content.width(contentWidth);

                var offset = this.widget.offset;
                if (offset !== undefined)
                {
                    var left = info.width * offset * -1;
                    this.content.css('left', left);

                    /* There was an issue with records not being resized so 
                    ** explicitly resize thecurrent, next and previous records in 
                    ** the cache.
                    */
                    if (this.cache[offset - 1])
                        this.locateRecord(offset - 1, this.cache[offset - 1]);
                    if (this.cache[offset])
                        this.locateRecord(offset, this.cache[offset]);
                    if (this.cache[offset + 1])
                        this.locateRecord(offset + 1, this.cache[offset + 1]);
                }
            },

            setOffset: function(offset)
            {
                var pos =
                {
                    left: offset * this.recordWidth,
                    top: 0
                };

                this.log('setOffset: offset {0} recordWidth {1} pos {2}',
                    offset, this.recordWidth, pos);

                this.scroller.scrollTo(pos);
            },

            showImage: function(irn)
            {
                var mm = new IMu.Request.Multimedia();
                mm.setKey(irn);
                mm.addFilter('height', 'bf', '800');
                mm.addFilter('width', 'bf', '800');
                mm.addFilter('kind', 'ne', 'supplementary');
                mm.addModifier('format', 'jpg');
                
                var url = mm.getURL();
                jQuery.slimbox(url);
            }
        }
    });
})(IMu.Themes.get('darwin'));
