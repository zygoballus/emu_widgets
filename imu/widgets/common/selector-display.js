/*!
** @since 2.0
*/
IMu.Widgets.add('selector-display', 'paged-display',
{
	_construct: function()
	{
		this._super.apply(this, arguments);
		this.classes.push('imu-selector-display');

		this.registerOptions
		({
			showLabel: false
		});
	}
});
