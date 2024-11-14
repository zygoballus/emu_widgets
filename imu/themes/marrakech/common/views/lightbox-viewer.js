(function(theme)
{
    theme.views.register('lightbox-viewer', 'vertical-viewer',
    {
        _source: 'marrakech/common/lightbox-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.columns = 'lightbox';
                self.pageSize = 20;
            },

            create_emultimedia: function(div, data)
            {
                var self = this;

                // TODO: other mime types with image previews (eg video)
                {
                    var image = new Object();

                    image.type = 'image';
                    image.format = data['mimeFormat'];
                    image.irn = data['irn'];

                    data['image'] = image;
                }
                
                self.create_other(div, data);
            },

            // called by page-viewer
            create_other: function(div, data)
            {
                var self = this;

                // image
                var frame = div.child('div', 'frame');
                if (data.image)
                {
                    var mm = new IMu.Request.Multimedia();
                    mm.setKey(data.image.irn);
                    mm.addFilter('kind', 'resolution');

                    var plugin = frame.IMuMultimedia();
                    plugin.addResource(mm);
                }

                // info
                var info = div.child('div', 'info');

                // title
                var title = info.child('div', 'title');
                title.text(data.title);

                /* The title doesn't get resized so we can add an ellipsis
                ** (if necessary) now rather than in a resize handler (as is
                ** done in list-viewer). Doing it here is much more efficient.
                ** 
                ** If the design changes so that the title changes on resize then
                ** the ellipsis should be added in a resize_*() method.
                */
                title.IMuEllipsis();

                title.bind('click', function()
                {
                    self.widget.recordSelected(data.rid, data.offset);
                });

                // checkbox
                var select = info.child('input type="checkbox"', 'select');
                select.bind('click', function()
                {
                    var rid = data.rid;
                    var on = jQuery(this).is(':checked');
                    self.widget.recordToggled(rid, on);
                });
            }
        }
    });
})(IMu.Themes.get('marrakech'));
