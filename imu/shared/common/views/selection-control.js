(function(theme)
{
    theme.views.register('selection-control', 'control',
    {
        _source: 'shared/common/selection-control',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                var self = this;

                self.control = self.content.child('select');
                self.setup();

                self.setList([]);
                self.control.bind('change', function(e)
                {
                    self.widget.doChange();
                });
            },

            setList: function(list)
            {
                this.control.empty();
                if (this.widget.options.hint != undefined)
                {
                    var hint = this.widget.options.hint;

                    this.control.attr('title', this.hint);
                    var option = this.control.child('option');
                    option.val('');
                    option.text(IMu.string(hint));

                    option.addClass('hint');
                }
                for (var i = 0; i < list.length; i++)
                {
                    var item = list[i];
                    var type = IMu.Type.get(item);
                    var text = undefined;
                    var val = undefined;
                    if (type == 'string')
                        text = item;
                    else if (type == 'object') {
                        if ('text' in item)
                            text = item.text;
                        if ('val' in item)
                            val = item.val;
                    }
                    if (text === undefined)
                        continue;

                    var option = this.control.child('option');
                    option.text(text);
                    if (val !== undefined)
                        option.val(val);
                }
                this.setValue(this.widget.value);
            },

            getValue: function()
            {
                var value = this.control.val();
                if (value == '' || value === null)
                    value = undefined;
                return value;
            },

            setValue: function(value)
            {
                this.control.val(value);
            }
        }
    });
})(IMu.Themes.shared);
