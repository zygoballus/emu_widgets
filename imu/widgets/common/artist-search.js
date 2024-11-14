/*!
** Simple widget for artist searching.
**
** Creates A to Z boxes which can be used for artist searching. When
** the user presses the box the **artistSearch** event handler is 
** called.
**
** Can be used to trigger simple artist search.
**
** @since 2.0
*/

/*!
** @example
**  Create a simple A to Z artist search boxes
**
** @code
**  var widget = $('#my-div').IMu('artist-search');
*/

/*!
** @example
**  Create A to Z artist search boxes with a label
**
** @code
**  var widget = $('#my-div').IMu('artist-search',
**      {
**          showLabel: true,
**      }
**  );
*/

/*!
** @example
**  Install a callback to handle when an individual artist is clicked
**
** @code
**  var widget = $('#my-div').IMu('artist-search',
**      {
**          onSubmit: function(text)
**          {
**              alert('search for ' + text);
**          }
**      }
**  );
*/
IMu.Widgets.add('artist-search', 'base',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-artist-search');

        this.registerOptions
        ({
            /*!
            ** Specifies that a label (prompt) should be added
            **
            ** @type boolean
            */
            showLabel: false,

            /*!
            ** The user has selected an artist name
            */
            onSubmit: undefined
        });

        this.terms = '';
    },

    /*!
    ** Searches for all artist with a last name beginning with the selected 
    ** letter.
    **
    ** @param value string
    **   The letter to search on.
    **
    ** @param columns string
    **   The columns to fetch from eparties.
    **
    ** @param callback function
    **   Returns control back to the previous function.
    */
    artistSearch: function(value, columns, callback)
    {
        var self = this;

        var terms = new IMu.Terms();
        terms.add('NamLast', '\\^' + value + '\\*');
        var search = new IMu.Request.Search();
        search.search(terms, ['eparties'], function(hits)
        {
            search.sort('+NamLast', '', function()
            {  
                search.fetch('start', 0, -1, columns, function(data)
                {  
                    if (callback)
                        callback(data);
                });
            });
        });
    },

    /*!
    ** Runs a search across modules on the selected artist name.
    */
    doSubmit: function()
    {
        if (this.options.onSubmit)
            this.options.onSubmit.call(this, this.terms, this.imagesOnly);
        else if (this.options.onSearch)
            this.options.onSearch.call(this, this.terms, this.imagesOnly);
        IMu.Events.trigger('imu-search', this.terms, this.imagesOnly);
    }
});
