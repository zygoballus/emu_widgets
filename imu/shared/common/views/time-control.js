(function(theme)
{
    theme.views.register('time-control', 'box-control',
    {
        _source: 'shared/common/time-control',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                if (this.widget.options.picker)
                {
                    this.control.timepicker
                    ({
                    });
                }
            }
        }
    });
})(IMu.Themes.shared);
