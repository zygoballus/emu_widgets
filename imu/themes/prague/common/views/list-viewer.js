(function(theme)
{
    /* NOTE:
    **
    ** Module-specific code for the list-viewer view should go in the
    ** appropriate file in the list-viewer directory. For example,
    ** specific code for the Parties module should go in
    ** list-viewer/eparties.js.
    **
    ** Common code belongs in this file.
    **
    ** AB - 11 April 2013
    */
    theme.views.register('list-viewer', 'vertical-viewer',
    {
        _source: 'prague/common/list-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.columns = 'list';
                self.pageSize = 20;
            },

            /* Fall through code called only if there is no module-specific
            ** version.
            */
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
                    self.widget.recordSelected(data.rid, data.offset);
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
                    select.attr(
                        'checked',
                        IMu.User.hasEntry(module, key, IMu.string('common-my-collection')));
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

                    var browser = IMu.Platform.browser.name;
                    var version = IMu.Platform.browser.version;
                    var useAutoMargin = true;
                    
                    var plugin = frame.IMuMultimedia();
                    plugin.addResource(mm);
                }
				else
				{
					var img = frame.child('img', 'no-image');
					var src = IMu.Request.getURL('Image') + '&name=no-multimedia';
					img.attr('src', src);
				}

                // content
                td = tr.child('td', 'content-cell');
                td.css('width', '98%');

                // checkbox
                if (self.widget.options.showSelectionControl)
                {
                    td = tr.child('td', 'select-cell');
                    td.css('width', '1%');

                    self.showSelectionControl(td, data);
                }

                return table;
            }
        }
    });
})(IMu.Themes.get('prague'));
