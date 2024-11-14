(function(theme)
{
    theme.views.register('list-viewer',
    {
        _source: 'prague/common/list-viewer/emultimedia',

        all:
        {
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

//  				data['images'] = new Object();
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
            }
        }
    });
})(IMu.Themes.get('prague'));
