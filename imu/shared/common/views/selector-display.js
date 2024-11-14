(function(theme)
{
    theme.views.register('selector-display', 'paged-display',
    {
        _source: 'shared/common/selector-display',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.combo = undefined;
            },

            createHeader: function()
            {
                this._super();

                var self = this;

                var widget = self.widget;

                if (self.getOption('showLabel'))
                {
                    // TODO
                }
                self.combo = self.header.child('select', 'combo');
                for (var i = 0; i < widget.pages.length; i++)
                {
                    var page = widget.pages[i];

                    var option = self.combo.child('option');
                    option.attr('value', i);
                    option.text(IMu.string(page.title));
                }
                self.combo.bind('change', function()
                {
                    widget.select(self.combo.val());
                });
            },

            selectHeader: function(index)
            {
                var self = this;

                if (self.combo)
                    self.combo.val(index);
            }
        }
    });
})(IMu.Themes.shared);
