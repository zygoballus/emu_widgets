(function(theme)
{
    theme.views.register('viewer',
    {
        _source: 'shared/common/viewer',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                var self = this;

                self.holder = undefined;
            },

            _create: function()
            {
                var self = this;

                self.holder = self.widget.owner.child('div', 'holder');
            },

            dropSearch: function()
            {
            },

            getOffset: function()
            {
            },

            resize: function()
            {
                var self = this;

                /* The holder should grow in size with the owner?
                */
//  			self.holder.fullWidth(self.owner.width());

                self.holder.fullHeight(self.widget.owner.height());
            },

            setOffset: function(offset)
            {
                var self = this;

                self.log('setOffset: offset {0}');
            },

            setSearch: function(search)
            {
                var self = this;

                self.log('setSearch');
            }
        }
    });
})(IMu.Themes.shared);
