/*!
 * Displays a lightbox view of each record in a result set.
 *
 * @since 2.0
 */
IMu.Widgets.add('lightbox-viewer', 'paged-viewer',
{
	_construct: function()
	{
		this._super.apply(this, arguments);
		this.classes.push('imu-lightbox-viewer');
	}
});
