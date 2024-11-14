/*!
** @since 2.0
*/
IMu.Widgets.add('tabbed-display', 'paged-display',
{
	_construct: function()
	{
		this._super.apply(this, arguments);
		this.classes.push('imu-tabbed-display');
	},

    add: function()
    {
        var page = this._super.apply(this, arguments);

        page.icon = undefined;

        page.img = undefined;
        page.p = undefined;

        return page;
    }
});
