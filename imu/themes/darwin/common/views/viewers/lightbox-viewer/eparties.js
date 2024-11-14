(function(theme)
{
    theme.views.register('lightbox-viewer',
    {
        _source: 'darwin/common/viewers/lightbox-viewer/eparties',

        all:
        {
            create_eparties: function(owner, data)
            {
                var layout = this.create_layout(owner, data);

                layout.imagePlaceholder.addClass('party-placeholder');

                if (this.makePartiesMedia)
                    this.makePartiesMedia(layout, data);
                else
                    this.makeMedia(layout, data);

                var type = (data.partyType || '').toLowerCase();
                switch (type)
                {
                    //TODO: add types

                    default:
                        this.makePartiesDetails(layout, data);
                        break;
                }

                owner.addClass('eparties-record');
                layout.holder.appendTo(owner);
                IMu.Events.trigger('lightbox-record-created', owner);
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
            }
        }
    });
})(IMu.Themes.get('darwin'));
