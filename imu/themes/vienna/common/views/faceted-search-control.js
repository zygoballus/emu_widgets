(function(theme)
{
    theme.views.register('faceted-search-control',
    {
        _source: 'vienna/common/faceted-search-control',

        all:
        {

            _create: function()
            {
                var self = this;
                var widget = self.widget;

                // var widgetTitle = self.widget.owner.child('h2','widget-title');
                // widgetTitle.text(IMu.string('refine-search'));

                var widgetTitle = self.widget.owner.child('div','searches-label');
                widgetTitle.addClass('client-search-label');
                widgetTitle.text(IMu.string('refine-search'));


                self.holder = widget.owner.child('div','holder');
                self.holder.attr('id','faceted-search-holder');

            },

            printFacets: function(summary)
            {
                var self = this;
                var holder = self.holder;

                holder.children().remove();

                if (self.widget.searchIsFiltered())
                {
                    var clearTerms = holder.child('button','btn-link clear-all');
                    clearTerms.text('clear all');
                    clearTerms.click(function()
                    {
                        self.widget.clearFilters();
                    });
                }

                for (var i = 0; i < summary.length; i++) 
                {
                    var facet = summary[i];
                    var div = holder.child('div','facet-holder');
                    var facetTitle = div.child('h3','facet-title');
                    facetTitle.text(IMu.string(facet.key));                     

                    var table = div.child('table');

                    for (var key in facet.counts) 
                    {
                       var obj = facet.counts[key];
                       var tr = table.child('tr');
                       var facetSpan = tr.child('span','facet-text');
                       facetSpan.text(key);
                       facetSpan.attr('facet',facet.key);

                       // tr.text(key);
                       var span = facetSpan.child('span','facet-count');
                       span.text(' ' + obj);


                       facetSpan.click(function()
                       {

                            var text = this.firstChild.data;
                            if (text == 'Empty') 
                            {
                                text = '\\!\\*';
                            }             
                            var facet = this.getAttribute('facet');
                            self.widget.buildNewTerms(facet, text);
                       })
                    }

                };
            },

            printMessage: function()
            {
                var self = this;
                var holder = self.holder;

                holder.children().remove();

                var overload = holder.child('h4','facet-overload');
                overload.text('Too many results were found to perform facets.');
            }
        }
    });
})(IMu.Themes.get('vienna'));
