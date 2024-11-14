(function(theme)
{
    theme.views.register('list-viewer',
    {
        _source: 'darwin/common/viewers/list-viewer/eparties',

        all:
        {
            create_eparties: function(owner, data)
            {
                var layout = this.create_layout(owner, data);

                layout.imagePlaceholder.addClass('party-placeholder');
                
                if (this.makePartiesMedia);
                    this.makePartiesMedia(layout, data);
                else
                    this.makeMedia(layout, data);

                var type = (data.partyType || '').toLowerCase();
                switch (type)
                {
                    case 'person':
                        this.makePartiesPersonDetails(layout, data);
                        break;
                       
                       //TODO: add more types

                    default:
                        this.makePartiesDetails(layout, data);
                        break;
                }
                
                owner.addClass('eparties-record');
                layout.holder.appendTo(owner);
                IMu.Events.trigger('list-record-created', owner);
            },

            makePartiesDetails: function(layout, data)
            {
                this.makeTitle(layout, data.SummaryData);
            },

            makePartiesPersonDetails: function(layout, data)
            {
                var titleTxt = '';
                if (data.firstName && data.lastName)
                    titleTxt = data.lastName + ', ' + data.firstName;
                else if (data.firstName || data.lastName)
                    titleTxt = (data.lastName || '') + (data.firstName || '');
                else
                    titleTxt = data.SummaryData;

                this.makeTitle(layout, titleTxt);
            },

            makePartiesMedia: function(layout, data)
            {
                if (! data.image)
                    return;

                var mm = new IMu.Request.Multimedia();
                mm.setKey(data.image.irn);
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
