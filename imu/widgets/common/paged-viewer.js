/*!
 * Base viewer for all viewers which load their results a page at a time.
 *
 * @since 2.0
 */
IMu.Widgets.add('paged-viewer','viewer',
{
	_construct: function()
	{
		this._super.apply(this, arguments);
		this.classes.push('imu-paged-viewer');

        this.registerOptions
        ({
            /*!
            ** If **true** includes a control to allow the record to be selected.
            ** When selected the record is added to the user's current collection.
            */
            showSelectionControl: IMu.Config.showSelectionControls
        });

		this.results = undefined;
	},

	// public

	// view methods

	// protected
	destroySearch: function()
	{
		if (this.results)
		{
			this.results.destroy();
			this.results = undefined;
		}
		this._super();
	},

	setSearch: function(search)
	{
		this._super(search);

		var columns = this.view.columns;
		var pageSize = this.view.pageSize;
		this.results = this.search.newResultSet(columns, pageSize);
		this.view.resize();
	}
});
