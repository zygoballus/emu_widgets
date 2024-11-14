(function(theme)
{
    theme.views.register('lightbox-viewer',
    {
        _source: 'prague/client/lightbox-viewer/ecatalogue',

        all:
        {
            create_ecatalogue: function(div, data)
            {
                var self = this;

                // image
                var frame = div.child('div', 'frame');
                if (data.image)
                {
                    var mm = new IMu.Request.Multimedia();
                    mm.setKey(data.image.irn);
                    mm.addFilter('kind', 'resolution');
					mm.addFilter('width', 'bf', '200');
                    if (data.CatSpecies)
                    {
                        mm.addParam('alt', data.CatSpecies);
                    }
                    var plugin = frame.IMuMultimedia();
                    plugin.addResource(mm);
                }
                else
                {
                    var img = frame.child('img', 'no-image', 'collection-image');
                    var src = IMu.Request.getURL('Image') + '&name=no-multimedia';
                    img.attr('src', src);
                    img.attr('alt', '');
                }
                frame.bind('click', function()
                {
                    self.widget.recordSelected(data.rid, data.offset);
                });

                // info
                var info = div.child('div', 'info');

                // title
                var title = info.child('div', 'title');
                var text = "";
                if (data.CatSpecies)
                {
                    text = data.CatSpecies;
                }
                if (data.CatVariety)
                {
                    if (text != "")
                    {
                        text += " ";
                    }
                    text += "VARIETY " + data.CatVariety;
                }
                if (data.PhmAssociatedSpecies1)
                {
                    if (text != "")
                    {
                        text += " AND ";
                    }
                    text += data.PhmAssociatedSpecies1;
                }
                if (text != "")
                    title.text(text);
                else if (data.SummaryData)
                    title.text(data.SummaryData);

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
            }
        }
    });
})(IMu.Themes.get('prague'));
