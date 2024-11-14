/*!
** @since 2.0
*/
IMu.Widgets.add('paged-display', 'base',
{
	_construct: function()
	{
		this._super.apply(this, arguments);
		this.classes.push('imu-paged-display');

		this.registerOptions
		({
			showHeader: false,

            onSelected: undefined
		});

		this.pages = [];
		this.selected = -1;
	},

	/*!
    ** Adds a widget to the set to be displayed.
    */
	addWidget: function(name, options)
	{
        var page = {};
        this.pages.push(page);
        if (this.selected < 0)
            this.selected = 0;

        var pageNumber = this.pages.length;
        page.owner = jQuery('<div/>');
        page.owner.addClass('page page-' + pageNumber); 
        page.owner.visible(false);

        page.widget = page.owner.IMu(name, options);
        page.widget.controller = this;
        page.widget.pageNumber = pageNumber;

        /* Override fixedHeight setting to use
        ** the value on the paged-display itself
        */
        page.widget.fixedHeight = this.fixedHeight;

        page.title = name;

        return page;
    },

    /*!
    ** Gets information about a page.
    **
    ** @param index int
    **   The number of the page.
    **
    ** @returns object 
    **   The information about the page.
    */
	get: function(index)
	{
		if (index === undefined)
			index = this.selected;
		if (index < 0)
			return undefined;
		if (index >= this.pages.length)
			return undefined;
		return this.pages[index];
	},

    /*!
    ** Selects a page.
    **
    ** @param index int
    **   The number of the page.
    **
    ** @returns boolean
    **   A flag indicating whether a new page was selected.
    */
	select: function(index)
	{
		if (index < 0)
			return false;
		if (index >= this.pages.length)
			return false;
		if (index == this.selected)
			return false;
		if (! this.view.select(index))
            return false;
        this.selected = index;
        if (this.options.onSelected)
            this.options.onSelected.call(this, this.selected);
        return true;
	},

    /*!
    ** Depricated.
    ** Adds a widget to the set to be displayed.
    */
    add: function(name, options)
    {
        return this.addWidget(name, options);
    }
});
