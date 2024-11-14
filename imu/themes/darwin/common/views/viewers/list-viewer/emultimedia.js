(function(theme)
{
    theme.views.register('list-viewer',
    {
        _source: 'darwin/common/viewers/list-viewer/emultimedia',

        all:
        {
            create_emultimedia: function(owner, data)
            {
                var layout = this.create_layout(owner, data);

                this.makeMultimediaMedia(layout, data);

                this.makeMultimediaDetails(layout, data);                

                owner.addClass('emultimedia-record');
                layout.holder.appendTo(owner);
                IMu.Events.trigger('list-record-created', owner);
            },

            makeMultimediaDetails: function(layout, data)
            {
                var titleTxt = data.title || data.SummaryData || '';
                this.makeTitle(layout, titleTxt);
            },

            makeMultimediaMedia: function(layout, data)
            {
                var type = (data.type || 'unknown').toLowerCase();
                if (type == 'application')
                    type = 'document';

                if (type != 'image')
                {
                    layout.imagePlaceholder.addClass(type + '-placeholder');
                    return;
                }

                layout.imagePlaceholder.detach();
                layout.imagePlaceholder = undefined;

                var mm = new IMu.Request.Multimedia();
                mm.setKey(data.irn);
                mm.addFilter('kind', 'ne', 'supplementary');
                mm.addFilter('height', 'bf', '400');
                mm.addFilter('width', 'bf', '400');
                mm.addModifier('format', 'jpg');
                var src = mm.getURL();

                layout.image.child('div').css(
                {
                    'background-image': 'url(' + src + ')'
                });
            }
        }
    });
})(IMu.Themes.get('darwin'));
