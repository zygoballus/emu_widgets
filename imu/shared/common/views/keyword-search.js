(function(theme)
{
    theme.views.register('keyword-search',
    {
        _source: 'shared/common/keyword-search',

        all:
        {
            _create: function()
            {
                var self = this;

                var widget = self.widget;

                var holder = widget.owner.child('div', 'holder');

                var div = holder.child('div');

                if (widget.options.showLabel)
                {
                    var label = div.child('label', 'label');
                    label.text(IMu.string('common-search') + ':');
                }
                
                self.input = div.child('input type="text"', 'input');
                self.input.val(widget.terms);
                self.input.bind('keyup', function(e)
                {
                    widget.terms = jQuery(this).val();
                    if (e.keyCode == 13)
                    {
                        widget.doSubmit();
                        return false;
                    }
                });

                if (self.getOption('showSubmit'))
                {
                    var submit = self.submit = div.child('button', 'submit');
                    submit.text(IMu.string('keyword-search-submit'));
                    submit.bind('click', function()
                    {
                        widget.doSubmit();
                    });
                }

                if (self.getOption('showClear'))
                {
                    var clear = div.child('button', 'clear');
                    clear.text(IMu.string('keyword-search-clear'));
                    clear.bind('click', function()
                    {
                        widget.doClear();
                    });
                }

				self.images = undefined;
                if (self.getOption('onlyItemsWithImages'))
                {
                    var div = holder.child('div', 'images-label');

                    var span = div.child('span');
                    span.text(IMu.string('only-items-with-images') + ':');

                    self.images = div.child('input type="checkbox"', 'images-checkbox');
                    self.images.bind('change', function()
                    {
                        widget.imagesOnly = $(this).attr('checked');
                    });
                }
            },

			clear: function()
			{
				this.input.val('');
				this.widget.terms = '';
				if (this.images)
					this.images.attr('checked', false);
			}
        }
    });
})(IMu.Themes.shared);
