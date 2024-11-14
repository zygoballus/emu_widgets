/* This is more of a default-app than page
*/
(function(theme)
{
    theme.views.register('default-page', 'page',
    {
        _source: 'darwin/common/pages/default-page',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.header = undefined;
                this.tabs = undefined;

            },

            _create: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.header = jQuery("<section class='header'></section>");
                
                var src = IMu.Request.getURL('Image') + '&name=' + 'client-logo';
                self.header.child('div', 'logo').css(
                {
                    'background-image': 'url(' + src + ')'
                });

                var kwSearch = self.header.child('div', 'keyword-search');
                kwSearch.child('div').IMu('keyword-search',
                {
                    onSubmit: function(text)
                    {
                        IMu.Events.trigger('clear-search-results');
                        IMu.Events.trigger('begin-search-delay');
                        IMu.Events.trigger('open-keyword-search');

                        var terms = new IMu.Terms();
                        terms.add('keywords', text);

                        self.widget.doSearch(terms, undefined, function(search)
                        {
                            IMu.Events.trigger('show-search', search);
                        });
                    },

                    showLabel: false,
                    showSubmit: true
                });



                this.header.prependTo(this.holder);

                this.tabs = this.content.child('div', 'app-pages');
            },

            onSearchError: function(response)
            {
                IMu.Events.trigger('end-search-delay');
                IMu.Events.trigger('show-search-error', response);
            }
        }
    });
})(IMu.Themes.get('darwin'));
