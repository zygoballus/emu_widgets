(function(theme)
{
    theme.views.register('theme-selector',
    {
        _source: 'shared/common/theme-selector',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.label = undefined;
                self.combo = undefined;
            },

            _create: function()
            {
                var self = this;

                var elem;

                if (self.widget.options.label)
                {
                    self.label = elem = self.widget.owner.child('label', 'label');
                    elem.text(IMu.string('common-theme') + ':');
                }

                self.combo = elem = self.widget.owner.child('select', 'list');
                elem.bind('change', function(e)
                {
                    self.widget.themeSelected(self.combo.val());
                });

                var themes = self.widget.getThemes();
                var current = undefined;
                for (var i = 0; i < themes.length; i++)
                {
                    var theme = themes[i];

                    elem = self.combo.child('option', 'item');
                    elem.attr('value', theme.name);
                    elem.text(theme.title);

                    if (theme.current)
                        current = theme.name;
                }
                if (current !== undefined)
                    self.combo.val(current);
            }
        }
    });
})(IMu.Themes.shared);
