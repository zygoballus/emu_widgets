(function(theme)
{
    theme.views.register('static-control', 'control',
    {
        _source: 'shared/common/static-control',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                this.control = this.content.child('span');
                if (this.hint)
                    this.control.attr('title', this.hint);
            },

            getValue: function()
            {
                var value = this.control.text();
                if (value == '')
                    value = undefined;
                return value;
            },

            setValue: function(value)
            {
                if (value === undefined || value === null)
                    this.control.text("");
                else
                    this.control.text(value);
            }
        }
    });
})(IMu.Themes.shared);
