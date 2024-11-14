(function(theme)
{
    theme.views.register('lightbox-viewer',
    {
        _source: 'prague/common/lightbox-viewer/emultimedia',

        all:
        {
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
            }
        }
    });
})(IMu.Themes.get('prague'));
