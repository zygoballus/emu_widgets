/* NOTE: TODO this is just here to get things going. none of the code here has
** ** been specifically set up for colombo.
*/

(function(theme)
{
    /* NOTE:
    **
    ** Module-specific code for the lightbox-viewer view should go in the
    ** appropriate file in the lightbox-viewer directory. For example,
    ** specific code for the Parties module should go in
    ** lightbox-viewer/eparties.js.
    **
    ** Common code belongs in this file.
    **
    ** AB - 11 April 2013
    */
    theme.views.register('lightbox-viewer', 'vertical-viewer',
    {
        _source: 'colombo/common/lightbox-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.columns = 'lightbox';
                self.pageSize = 20;
            },

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
                else
                {
                    var img = frame.child('img', 'no-image');
                    var src = IMu.Request.getURL('Image') + '&name=no-multimedia';
                    img.attr('src', src);
                }

                // info
                var info = div.child('div', 'info');

                // title
                var title = info.child('div', 'title');
                if (data.title)
                    title.text(data.title);
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

                // checkbox
                if (self.widget.options.showSelectionControl)
                    self.showSelectionControl(info, data);
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
            }
        }
    });
})(IMu.Themes.get('colombo'));
