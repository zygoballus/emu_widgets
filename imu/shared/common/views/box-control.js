(function(theme)
{
    theme.views.register('box-control', 'control',
    {
        _source: 'shared/common/box-control',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                var self = this;

                var options = self.widget.options;
                if (options.lines && options.lines > 1)
                {
                    self.control = this.content.child('textarea');
                    self.control.attr('rows', options.lines)
                    self.control.on('input propertychange', function()
                    {
                        self.widget.doChange();
                    });
                }
                else
                {
                    self.control = self.content.child('input type="text"');
                    self.control.on('textchange', function()
                    {
                        self.widget.doChange();
                    });
                }
                self.setup();

                self.contentHint = '';
                if (self.hint)
                {
                    self.control.attr('title', self.hint);
                    self.contentHint = '(' + self.hint + ')';
                    self.control.on('focus', function()
                    {
                        if (self.control.val() == self.contentHint)
                        {
                            self.control.val('');
                            self.control.removeClass('hint');
                        }
                    });
                    self.control.on('blur', function()
                    {
                        if (self.control.val() == '')
                        {
                            self.control.val(self.contentHint);
                            self.control.addClass('hint');
                        }
                    });
                    self.control.blur();
                }
                self.control.on('keypress', function(e)
                {
                    if (e.keyCode == 13)
                        self.widget.doEnter();
                });
                self.control.on('barcode-scanned', function(e, info)
                {
                    self.setValue(info.value);
                    self.widget.doChange();
                });
            },

            /*!
            ** Gets the current value from the control.
            **
            ** @returns value
            **   The current value of the control.
            */
            getValue: function()
            {
                var value = this.control.val();
                if (value == this.contentHint)
                    value = undefined;
                return value;
            },
            
            /*!
            ** Sets a value of the control.
            **
            ** @param value
            **   The value to set.
            */
            setValue: function(value)
            {
                this.control.val(value);
                if (this.contentHint)
                {
                    if (this.control.val() != '')
                        this.control.removeClass('hint');
                    else
                    {
                        this.control.val(this.contentHint);
                        this.control.addClass('hint');
                    }
                }
            }
        }
    });
})(IMu.Themes.shared);
