/*!
** A widget for searching.
**
** @since 2.0
*/
IMu.Widgets.add('search-form', 'base',
{
	_construct: function()
	{
		this._super.apply(this, arguments);
		this.classes.push('imu-search-form');

		this.registerOptions
		({
            /*!
            ** Text to display as a tooltip when hovered
            */
            hover: undefined,

           /*!
            ** Specifies if a clear button should be added.
            **
            ** @type boolean
            */
            showClear: false,

            /*!
            ** Specifies if a search button should be added.
            **
            ** @type boolean
            */
			showSubmit: true,

			/*!
            ** Specifies that an "Only items with images" prompt
            ** should also be shown.
            **
            ** @type boolean
            */
            onlyItemsWithImages: true,

            /*!
            ** The user has pressed the clear button.
            */
            onClear: undefined,

            /*!
            ** The user has pressed the search button.
            */
            onSearch: undefined,

            buttonClass: undefined,
            promptClass: undefined,
            inputClass: undefined
		});
		
		this.imagesOnly = false;

		this.fields = [];
	},

	// Public methods
    /*!
    ** Adds fields to the search form.
    */
	add: function()
	{
		for (var i = 0; i < arguments.length; i++)
		{
			var fields = arguments[i];
			if (IMu.Type.get(fields) == 'object')
				fields = [fields];
			for (var j = 0; j < fields.length; j++)
			{
				var field = fields[j];
				this.fields.push(field);
			}
		}
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
    ** Gets the search terms from each of the fields.
    */
	getTerms: function()
	{
		var terms = new IMu.Terms();
		for (var i = 0; i < this.fields.length; i++)
		{
			var field = this.fields[i];

			if (! field.column)
				continue;
			if (! (field.input || field.control))
				continue;
			var value;
            if (field.input)
                value = field.input.val();
            else if (field.control)
                value = field.control.getValue();
			if (value == '')
				continue;

            if (field.type == 'selection')
			    terms.add(field.column, value, '=');
            else
			    terms.add(field.column, value);
		}
		return terms;
		
	},

	// view methods
    doClear: function()
    {
        this.clear();
        if (this.options.onClear)
            this.options.onClear.call(this);
        IMu.Events.trigger('imu-clear');
    },

    /*!
    ** Initialises a search.
    */
	search: function()
	{
		var terms = this.getTerms();
		IMu.log('terms {0}', terms);
		if (this.options.onSearch)
			this.options.onSearch.call(this, terms,this.imagesOnly);
		IMu.Events.trigger('imu-search', terms,this.imagesOnly);
	}
});
