(function(theme)
{
    theme.views.register('list-viewer', 'vertical-viewer',
    {
        _source: 'darwin/common/viewers/list-viewer',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments)

                this.columns = 'list';
                this.pageSize = 20;

                IMu.Events.bind('list-record-created',
                function(e, record)
                {
                    if (! record)
                        return;

                    record.trigger('imu-record-created');
                });
            },

            create_layout: function(owner, data)
            {
                var self = this;

                var holder = jQuery('<button class="holder"></button>');
                holder.click(function()
                {
                    self.widget.recordSelected(data.rid, data.offset);
                });

                var image = holder.child('div', 'image');
                var imagePlaceholder = image.child('div', 'placeholder');
                var details = holder.child('div', 'details');

                if (this.widget.options.showSelectionControl)
                {
                    var fav = jQuery('<div class="favorite"></div>');
                    this.showSelectionControl(fav, data);
                    holder.after(fav);
                }

                return {
                    'image': image,
                    'imagePlaceholder': imagePlaceholder,
                    'details': details,
                    'holder': holder,
                    'record': owner
                }
            },
            
            makeMedia: function(layout, data)
            {
                if (! data.image)
                    return;

                layout.imagePlaceholder.detach();
                layout.imagePlaceholder = undefined;

                var mm = new IMu.Request.Multimedia();
                mm.setKey(data.image.irn);
                mm.addFilter('kind', 'ne', 'supplementary');
                mm.addFilter('height', 'bf', '400');
                mm.addFilter('width', 'bf', '400');
                mm.addModifier('format', 'jpg');
                var src = mm.getURL();

                layout.image.child('div').css(
                {
                    'background-image': 'url(' + src + ')'
                });
            },

            makeTitle: function(layout, titleTxt)
            {
                var record = layout.record;
                var details = layout.details;

                var title = details.child('h3', 'title');
                title.text(titleTxt);

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
                var layout = this.create_layout(owner, data);
                
                var titleTxt = data.title || data.SummaryData || '';
                this.makeTitle(layout, titleTxt);

                layout.holder.appendTo(owner);
                IMu.Events.trigger('list-record-created', owner);
            },

            collectionChanged: function()
            {
            },

            resize: function()
            {
                var css =
                {
                    'height': '',
                    'position': '',
                    'width': ''
                };

                this.holder.css(css);
                
                this.scroller.resize();

                this.scroller.holder.css(css);
                this.scroller.view.css(css);
            }
        }
    });
})(IMu.Themes.get('darwin'));
