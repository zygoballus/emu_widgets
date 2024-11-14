(function(theme)
{
    theme.views.register('paged-viewer', 'viewer',
    {
        _source: 'shared/common/paged-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.columns = undefined;
                self.pageSize = 1;

                self.scroller = undefined;
                self.scrollerOptions =
                {
                    mouseDrag: true,

                    onResize: function(info)
                    {
                        self.scrollerResize(info);
                    },

                    onShow: function(info)
                    {
                        self.loadFrames(info);
                    }
                };
                self.content = undefined;

                self.recordsPerPage = undefined;
                self.recordWidth = undefined;
                self.recordHeight = undefined;

                self.cache = [];

                self.timer = undefined;
            },

            _create: function()
            {
                var self = this;

                self._super();

                self.scroller = self.holder.IMuScroller(self.scrollerOptions);

                self.content = jQuery('<div/>');
                self.content.addClass('content');
                self.scroller.setContent(self.content, false);
            },

            dropSearch: function()
            {
                var self = this;

                self.scroller.clear();
                self.cache = [];
            },

            resize: function()
            {
                var self = this;

                self._super();
                if (self.content)
                    self.content.children().hide();
                self.scroller.resize();
            },

            setOffset: function(offset)
            {
                var self = this;

                self._super.apply(self, arguments);
            },

            // protected
            createRecord: function()
            {
                var self = this;

                var div = self.content.child('div', 'record');
                div.css('position', 'absolute');
                return div;
            },

            emptyOwner: function()
            {
                var self = this;

                var owner = self.widget.owner.empty()
                $('body,html,document').scrollTop(0);

                return owner;
            },

            loadFrames: function(info)
            {
                var self = this;

                if (! self.widget.results)
                    return;

                var first = undefined;

                for (var i = 0; i < info.frames.length; i++)
                {
                    var frame = info.frames[i];
                    if (!frame)
                        continue;
                    if (frame.top < 0)
                        frame.top = 0;
                    var range = self.getFrameRange(info.width, info.height, frame);
                    if (range === undefined)
                        break;
                    if (isNaN(range.first))
                        break;
                    if (range.first < 0)
                        range.first = 0;
                    if (isNaN(range.last))
                        break;
                    if (range.last >= self.widget.search.hits.total)
                        range.last = self.widget.search.hits.total - 1;

                    if (range.first > range.last)
                        range.first = range.last - 1;
                    first = range.first;

                    for (var i = range.first; i <= range.last; i++)
                        self.loadRecord(i);
                }

                // wait until there have been no loadFrame calls for 1000mS
                // before updating offset
                if (first !== undefined)
                {
                    if (self.timer)
                        window.clearTimeout(self.timer);
                    self.timer = window.setTimeout(function()
                    {
                        self.timer = undefined;
                        self.widget.updateOffset(first);
                    }, 1000);
                }
            },

            loadRecord: function(offset,reload)
            {
                var self = this;

                var div;
                div = self.cache[offset];

                if (! reload)
                {
                    if (div)
                    {
                        if (! div.visible())
                        {
                            self.locateRecord(offset, div);
                            self.resizeRecord(div);
                        }
                        return;
                    }
                }
                else
                    div.empty();

                self.log('loadRecord: offset {0} not in cache', offset);

                div = self.createRecord(offset);
                self.cache[offset] = div;

                var img = div.child('img', 'loading');
                var src = IMu.Request.getURL('Image');
                src += '&name=spinner';
                img.attr('src', src);

                self.locateRecord(offset, div);
                self.widget.results.get(offset, reload, function(data)
                {
                    div.empty();
                    if (! data)
                    {
                        self.log('loadRecord: Bad record offset {0}', offset);
                        div.remove();
                        IMu.Events.trigger('false-match');

                        return;
                    }

                    div.attr('offset', offset);
                    div.attr('rid', data.rid);

                    var method = 'create_' + data.source;
                    if (! (method in self))
                        method = 'create_other';
                    self[method](div, data);

                    self.resizeRecord(div);
                });
            },

            locateRecord: function(offset, div)
            {
            },

            resizeRecord: function(div)
            {
                var self = this;
                
                var rid = div.attr('rid');
                if (! rid)
                    return;
                var source = rid.replace(/[.:].*$/, '');

                var method = 'resize_' + source;
                if (! (method in self))
                    method = 'resize_other';
                self[method](div);
            },

			showSelectionControl: function(owner, data)
			{
				var self = this;

				var select = owner.child('input type="checkbox"', 'select');
				select.attr('module', data.source);
				select.attr('key', data.irn);
				IMu.User.load(function()
				{
					select.attr('checked', IMu.User.hasEntry(data.source, data.irn));
					select.bind('click', function()
					{
						var rid = data.rid;
						var on = jQuery(this).is(':checked');
						self.widget.recordToggled(rid, on);
					});
				});

                return select;
			},

            create_other: function(div, data)
            {
IMu.log('create_other: {0}', div.attr('rid'));
            },

            resize_other: function(div)
            {
IMu.log('resize_other: {0}', div.attr('rid'));
            }
        }
    });
})(IMu.Themes.shared);
