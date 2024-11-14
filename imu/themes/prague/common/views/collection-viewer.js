(function(theme)
{
    theme.views.register('collection-viewer', 'vertical-viewer',
    {
        _source: 'prague/common/collection-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.columns = 'collection';
                self.pageSize = 50;
            },

            create_other: function(div, data)
            {
                var self = this;

                var table = div.child('table');
                var tr = table.child('tr');

                // image
                var image = tr.child('td', 'image');
                image.css('width', '1%');
                var frame = image.child('div', 'frame');
                if (data.image)
                {
                    var img = frame.child('img');

                    var mm = new IMu.Request.Multimedia();
                    mm.setKey(data.image.irn);
                    mm.addFilter('index', 1);
                    var url = mm.getURL();

                    img.attr('src', url);
                }

                var title = tr.child('td', 'title');
                title.css('width', '98%');
                var box = title.child('div');
                var text = data.rid;
                if (data.title)
                    text = data.title;
                box.text(text);
                window.setTimeout(function()
                {
                    box.IMuEllipsis();
                }, 10);

                var remove = tr.child('td', 'remove');
                remove.css('width', '1%');
                var button = remove.child('button','remove-entry');
                button.html('&times;');
                button.bind('click', function()
                {
                    IMu.User.removeEntry(data.source, data.irn);
                });
            },

            resize: function()
            {
                this._super.apply(this, arguments);
            }
        }
    });
})(IMu.Themes.get('prague'));
