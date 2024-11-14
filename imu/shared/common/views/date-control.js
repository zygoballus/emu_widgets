(function(theme)
{
    theme.views.register('date-control', 'box-control',
    {
        _source: 'shared/common/date-control',

        all:
        {
            _create: function()
            {
                var self = this;

                self._super.apply(this, arguments);

                if (self.widget.options.picker)
                {
                    self.control.datepicker
                    ({
                        onSelect: function(dateText)
                        {
                            var language = self.widget.language;
                            self.widget.language = "en";

                            self.widget.doChange();
                            self.widget.changeLanguage(language);
                        },
                        dateFormat: IMu.Config.defaultDateFormat
                    });
                }
            }
        }
    });
})(IMu.Themes.shared);
