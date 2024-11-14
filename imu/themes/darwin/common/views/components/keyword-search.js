(function(theme)
{
    theme.views.register('keyword-search',
    {
        _source: 'darwin/common/components/keyword-search',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);
            },

            _create: function()
            {
                this._super.apply(this, arguments);

                var placeholder = IMu.string('keyword-search-placeholder');
                if (placeholder != 'keyword-search-placeholder')
                    this.input.attr('placeholder', placeholder);

                if (this.getOption('showSubmit'))
                {
                    this.submit.attr('title',
                    IMu.string('keyword-search-submit'));
                }
            }
        }
    });
})(IMu.Themes.get('darwin'));
