/*!
 * The @name widget provides a mechansim for selecting different IMu themes so
 * that the look and feel of the page may be changed dynamically by the user.
 *
 * @since 2.0
 */
IMu.Widgets.add('theme-selector', 'base',
{
	_construct: function()
	{
		this._super.apply(this, arguments);
		this.classes.push('imu-theme-selector');

		this.registerOptions
		({
            /*!
            ** Specifies that a label (prompt) should be added before any
            ** selection elements.
            */
			label: false
		});
	},

	// view methods
    /*!
    ** Get the available theme options.
    **
    ** @returns string[]
    **   An array of ``string``\s representing the available themes.
    */
	getThemes: function()
	{
		var list = [];
		for (var name in IMu.Themes.registered)
		{
			var theme = IMu.Themes.registered[name];
			var item =
			{
				name: name,
				title: IMu.string('theme-' + theme.name),
				current: theme == IMu.Themes.current
			};
			list.push(item);
		}
		return list;
	},

	// view events
	themeSelected: function(name)
	{
		IMu.Themes.select(name);
	}
});
