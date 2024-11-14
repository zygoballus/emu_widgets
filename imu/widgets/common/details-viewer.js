/*!
 * Displays the details of each record in a result set.
 *
 * @since 2.0
 */
IMu.Widgets.add('details-viewer', 'paged-viewer', 
{
	_construct: function()
	{
		this._super.apply(this, arguments);
		this.classes.push('imu-record-details');
        this.classes.push('imu-details-viewer');
	},

    updateOffset: function(offset)
    {
        this._super(offset);

        var div = this.view.cache[offset];
        if (div != undefined)
        {
            var rid = div.attr('rid');
            IMu.Events.trigger('details-viewer-load', rid);
        }
        else
        {
            IMu.log('WARNING could not update offset! {0}', offset);
        }

        /* Update left/right scroller visibility
        */
        // Being very cautious I don't break anything)
        if (! this.view || ! this.view.scroller || 
            ! this.view.scroller.left || ! this.view.scroller.right)
            return;

        if (this.offset > 0)
            this.view.scroller.left.css('visibility', 'visible');
        else
            this.view.scroller.left.css('visibility', 'hidden');
        if (this.offset +1 < this.hits)
            this.view.scroller.right.css('visibility', 'visible');
        else
            this.view.scroller.right.css('visibility', 'hidden');
    }
});
