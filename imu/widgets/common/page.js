/*!
** @since 2.0
*/
IMu.Widgets.add('page', 'base',
{
	_construct: function()
	{
		this._super.apply(this, arguments);
		this.classes.push('imu-page');

		this.registerOptions
		({
            /*!
            */
			showToggle: true
		});
	}
});
