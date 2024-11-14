(function(theme)
{
    theme.views.register('list-viewer',
    {
        _source: 'prague/common/list-viewer/enarratives',

        all:
        {
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
            }
        }
    });
})(IMu.Themes.get('prague'));
