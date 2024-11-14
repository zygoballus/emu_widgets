(function(theme)
{
    theme.views.register('text-control', 'box-control',
    {
        _source: 'shared/common/text-control',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                var self = this;

                var widget = self.widget;
                if (! widget.options.suggest)
                    return;
                var suggest = widget.getSuggest();

                var options =
                {
                    source: function(request, callback)
                    {
                        widget.getAutoSuggest(request.term, callback);
                    },
                    select: function(e, ui)
                    {
                        self.setValue(ui.item.label);
                        widget.doSelect(ui.item);
                    }
                };
                if ('minLength' in suggest)
                    options.minLength = suggest.minLength;

                self.control.autocomplete(options);
            }
        }
    });
})(IMu.Themes.shared);
