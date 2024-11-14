(function(theme)
{
    theme.views.register('checkbox-control', 'control',
    {
        _source: 'shared/common/checkbox-control',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                var self = this;

                var widget = self.widget;

                self.control = self.content.child('input type="checkbox"', 'input');
                self.setup();

                if (self.hint)
                    self.control.attr('title', self.hint);

                if (widget.options.onChange)
                {
                    self.control.bind('change', function(e)
                    {
                        widget.options.onChange.call(widget, self.getValue());
                    });
                }
            },

            /*!
            ** Gets the value from the control.
            **
            ** @returns
            **   Returns **true** if checkbox is selected, **false** otherwise.
            */
            getValue: function()
            {
                return this.control.prop('checked');
            },

            /*!
            ** Sets the value of the control.
            **
            ** @param value
            **   A boolean value.
            */
            setValue: function(value)
            {
                this.control.prop('checked', value);
            }
        }
    });
})(IMu.Themes.shared);
