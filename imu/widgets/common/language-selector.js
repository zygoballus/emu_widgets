/*!
 * Simple widget to allow the user to switch languages.
 *
 * @since 2.0
 */
IMu.Widgets.add('language-selector', 'base',
{
	_construct: function()
	{
		this._super.apply(this, arguments);
		this.classes.push('imu-language-selector');

		this.registerOptions
		({
            /*!
             * Specifies that a label (prompt) should be added before any
             * selection elements.
             */
			showLabel: false
		});
	},

	// view methods
    /*!
    ** Get the available language options.
    **
    ** @returns string[]
    **   An array of ``string``\s representing the available languages.
    */
	getLanguages: function()
	{
		var list = [];
		for (var code in IMu.Languages.registered)
		{
			var lang = IMu.Languages.registered[code];
			var item =
			{
				code: code,
				name: lang.name,
				current: lang == IMu.Languages.current
			};
			list.push(item);
		}
		return list;
	},

	// view events
	languageSelected: function(code)
	{
		IMu.Languages.select(code);
	}
});
