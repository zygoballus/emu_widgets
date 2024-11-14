(function(theme)
{
    theme.views.register('paged-display',
    {
        _source: 'darwin/common/components/paged-display',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);
            },

            resize: function()
            {
                // Do not use resize logic in shared code
            }
        }
    });
})(IMu.Themes.get('darwin'));
