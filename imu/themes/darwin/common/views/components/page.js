(function(theme)
{
    theme.views.register('page',
    {
        _source: 'darwin/common/components/page',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.content = undefined;
                this.holder = undefined;
            },

            _create: function()
            {
                this.holder = this.widget.owner.child('div', 'holder');
                this.content = this.holder.child('section', 'content');
            },

            resize: function()
            {
            }
        }
    });
})(IMu.Themes.get('darwin'));
