(function(theme)
{
    theme.views.register('artist-search',
    {
        _source: 'shared/common/artist-search',

        all:
        {
            _create: function()
            {
                var self = this;

                var widget = self.widget;

                var holder = widget.owner.child('div', 'holder');

                if (widget.options.showLabel)
                {
                    var label = holder.child('div', 'label');
                    label.text(IMu.string('common-artist'));
                }

                self.createAtoZ(holder);
            },

            /*!
            ** Creates the A to Z buttons.
            **
            ** @param holder
            **   The div container.
            */
            createAtoZ: function(holder)
            {
                var self = this;

                var atoz = ['A','B','C','D','E','F','G','H','I','J','K','L','M',
                    'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                var atozButtons = holder.child('div', 'artist-buttons');
                self.divResults = holder.child('div',
                    'artist-results');

                for (var i = 0; i < atoz.length; i++)
                {
                    (function(n)
                    {
                        var div = atozButtons.child('div', 'button');
                        div.text(atoz[i]);
                        div.attr('value', atoz[i]);

                        div.bind('click', function()
                        {  
                            $('.active-button').removeClass('active-button');
                            $(this).addClass('active-button');
                            self.beginDelay();

                            var columns = "NamFirst;NamLast;SummaryData;irn";
                            self.widget.artistSearch(this.textContent, columns,
                                function(hits)
                            {
                                self.endDelay();
                                self.divResults.empty();

                                if (hits.count <= 0)
                                {
                                    var div = self.divResults.child('div');
                                    div.text(IMu.string('common-no-results'));
                                    return;
                                }

                                var artistResults = hits.modules[0];
                                self.showArtistResults(artistResults);
                            });
                        });
                    })(i);
                }
            },

            /*!
            ** Displays list of artist results.
            **
            ** @param artistResults object
            **   The artist results hits object.
            */
            showArtistResults: function(artistResults)
            {
                var self = this;

                for (var i = 0; i < artistResults.rows.length; i++)
                {
                    (function(n)
                    {
                        var div = self.divResults.child(
                            'div', 'artist');

                        var text = '';

                        if (artistResults.rows[i].NamFirst)
                            text += artistResults.rows[i].NamFirst;

                        if (artistResults.rows[i].NamLast)
                        {
                            if (text)
                                text += ' ';
                            text += artistResults.rows[i].NamLast;
                        }

                        div.text(text); 
                        div.attr('creator', artistResults.rows[i].SummaryData);

                        div.bind('click', function()
                        {
                            $('.active-artist').removeClass('active-artist');
                            $(this).addClass('active-artist');
                            self.widget.terms = $(this)[0].textContent;
                            self.widget.doSubmit();
                            return;
                        });
                    })(i);
                }
            }
        }
    });
})(IMu.Themes.shared);
