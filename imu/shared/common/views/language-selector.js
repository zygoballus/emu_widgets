(function(theme)
{
    theme.views.register('language-selector',
    {
        _source: 'shared/common/language-selector',

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
                    elem.text(IMu.string('common-language') + ':');
                }

                self.combo = elem = self.widget.owner.child('select', 'list');
                elem.bind('change', function(e)
                {
                    self.widget.languageSelected(self.combo.val());
                });

                var langs = self.widget.getLanguages();
                var current = undefined;
                for (var i = 0; i < langs.length; i++)
                {
                    var lang = langs[i];

                    elem = self.combo.child('option', 'item');
                    elem.attr('value', lang.code);
                    elem.text(lang.name);

                    if (lang.current)
                        current = lang.code;
                }
                if (current !== undefined)
                    self.combo.val(current);
            }
        }
    });
})(IMu.Themes.shared);
