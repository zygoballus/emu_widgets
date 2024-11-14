(function(theme)
{
    theme.views.register('icon-control', 'control',
    {
        _source: 'shared/common/icon-control',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                this.control = undefined;
            },

            getValue: function()
            {
                return this.widget.value;
            },

            // convenience function
            setValue: function(value)
            {
                this.setIcon(value);
            }
        }
    });
})(IMu.Themes.shared);
