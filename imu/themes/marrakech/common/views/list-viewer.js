(function(theme)
{
    theme.views.register('list-viewer', 'vertical-viewer',
    {
        _source: 'marrakech/common/list-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.columns = 'list';
                self.pageSize = 20;
            },

            // called by paged-viewer
            create_enarratives: function(div, data)
            {
                var self = this;

                var table = self.createTable(div, data);

                // content
                var td = table.find('td:nth-child(2)');

                var title = td.child('div', 'title');
                title.text(data.title);
                title.bind('click', function()
                {
                    self.widget.recordSelected(data.rid, data.offset);
                });

                var narrative = td.child('div', 'description');
                narrative.html(data.description);

                // use only the text, not any embedded HTML structure
                narrative.text(narrative.text());
            },

            resize_enarratives: function(div)
            {
                var self = this;

                var title = div.find('.title');
                title.IMuEllipsis();

                /* This would be nice but the ellipsis code is too slow
                ** to use on resize.
                */
                /*
                var description = div.find('.description');
                description.ellipsis();
                */
            },

            create_emultimedia: function(div, data)
            {
                var self = this;

                // TODO: other mime types with image previews (eg video)
                if (data.mimeType == 'image')
                {
                    var image = new Object();

                    image.type = 'image';
                    image.format = data['mimeFormat'];
                    image.irn = data['irn'];

    //				data['images'] = new Object();
                    data['image'] = image;
                }	

                var table = self.createTable(div, data);

                // content
                var td = table.find('td:nth-child(2)');

                var title = td.child('div', 'title');
                title.text(data.title);
                title.bind('click', function()
                {
                    self.widget.recordSelected(data.rid, data.offset);
                });

                var type = td.child('div', 'details');
                type.text(data.mimeType);

                var format = td.child('div', 'details');
                format.text(data.mimeFormat);
            },

            create_other: function(div, data)
            {
                var self = this;
                var table = self.createTable(div, data);

                // content
                var td = table.find('td:nth-child(2)');

                var title = td.child('div', 'title');
                title.text(data.title);
                var text = data.rid;
                if (data.title)
                    text = data.title;
                title.text(text);
                window.setTimeout(function()
                {
                    title.IMuEllipsis();
                }, 10);
                title.bind('click', function()
                {
                    var rid = data.rid;
                    self.widget.recordSelected(rid);
                });
            },

            collectionChanged: function()
            {
                var self = this;

                self.holder.find('.select').each(function()
                {
                    var select = jQuery(this);
                    var module = select.attr('module');
                    var key = select.attr('key');
                    select.attr('checked', IMu.User.hasEntry(module, key));
                });
            },

            // private
            createTable: function(div, data)
            {
                var self = this;

                var items = {};

                var table = div.child('table', 'table');

                var tr = table.child('tr', 'row');

                // image
                var td = tr.child('td', 'image-cell')
                td.css('width', '1%');

                var frame = td.child('div', 'image-frame');
                if (data.image)
                {
                    var mm = new IMu.Request.Multimedia();
                    mm.setKey(data.image.irn);
                    mm.addFilter('kind', 'thumbnail');

                    var plugin = frame.IMuMultimedia();
                    plugin.addResource(mm);
                }

                // content
                td = tr.child('td', 'content-cell');
                td.css('width', '98%');

                // checkbox
                td = tr.child('td', 'select-cell');
                td.css('width', '1%');

                var select = td.child('input type="checkbox"', 'select');
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

                return table;
            }
        }
    });
})(IMu.Themes.get('marrakech'));
