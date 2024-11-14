/*!
** Simple widget for keyword searching.
**
** Creates a simple text box which can be used for keyword searching. When
** the user presses the **Enter** key (or the submit button if enabled) the
** **onSearch** event handler is called.
**
** Can be used to trigger simple database keyword search.
**
** @since 2.0
*/

/*!
** @example
**  Create a simple text box
**
** @code
**  var widget = $('#my-div').IMu('keyword-search');
*/

/*!
** @example
**  Create a text box with a label and a submit button
**
** @code
**  var widget = $('#my-div').IMu('keyword-search',
**      {
**          showLabel: true,
**          showSubmit: true
**      }
**  );
*/

/*!
** @example
**  Install a callback to handle when a search is requested
**
** @code
**  var widget = $('#my-div').IMu('keyword-search',
**      {
**          onSearch: function(terms)
**          {
**              alert('search for ' + terms);
**          }
**      }
**  );
*/
IMu.Widgets.add('keyword-search', 'base',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-keyword-search');

        this.registerOptions
        ({
            /*!
            ** Specifies that an "Only items with images" prompt
            ** should also be shown.
            **
            ** @type boolean
            */
            onlyItemsWithImages: IMu.Config.showOnlyItemsWithImages,

            /*!
            ** Specifies that a clear button should be added after the text
            ** box.
            **
            ** @type boolean
            */
            showClear: false,

            /*!
            ** Specifies that a label (prompt) should be added before the text
            ** box.
            **
            ** @type boolean
            */
            showLabel: false,

            /*!
            ** Specifies that a button should be added after the text box.
            **
            ** @type boolean
            */
            showSubmit: false,

            /*!
            ** The user has pressed the clear button.
            */
            onClear: undefined,

            /*!
            ** The user has pressed the **Enter** key or the submit button.
            **
            ** @param terms string
            **   The current search terms in the input box.
            */
            onSubmit: undefined,

            /*!
            ** Alias for onSubmit (for backwards-compatibility).
            */
            onSearch: undefined
        });

        this.terms = '';
        this.imagesOnly = false;
    },

    /*!
    ** Clears the search form.
    */
	clear: function()
	{
		if (this.view)
			this.view.clear();
	},

    /*!
    ** Get the contents of the search box.
    **
    ** @returns string
    **   The current search terms.
    */
    getTerms: function()
    {
        return this.terms;
    },

    /*!
    ** Set the terms displayed in the text box.
    **
    ** @param terms string
    **   The text to set in the text box.
    */
    setTerms: function(terms)
    {
        this.terms = terms;
        if (this.view)
            this.view.setTerms(terms);
    },

    // private
	doClear: function()
	{
		this.clear();
		if (this.options.onClear)
			this.options.onClear.call(this);
        IMu.Events.trigger('imu-clear');
	},

    doSubmit: function()
    {
        if (this.options.onSubmit)
            this.options.onSubmit.call(this, this.terms, this.imagesOnly);
        else if (this.options.onSearch)
            this.options.onSearch.call(this, this.terms, this.imagesOnly);
        IMu.Events.trigger('imu-search', this.terms, this.imagesOnly);
    }
});
