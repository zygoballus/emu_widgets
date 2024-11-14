(function(theme)
{
    theme.views.register('control',
    {
        _source: 'shared/common/control',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.control = undefined;
                this.tagControl = undefined;
                this.hint = undefined;
                this.holder = undefined;
                this.content = undefined;
                this.icon = undefined;
            },

            _create: function()
            {
                this._super.apply(this, arguments);

                this.holder = this.widget.owner.child('div', 'holder table');
                var row = this.holderRow = this.holder.child('div', 'table-row');

                this.content = row.child('div', 'content table-cell');
                this.icon = row.child('div', 'icon table-cell');
                if (this.widget.options.icons.initial)
                    this.setIcon('initial');

                if (this.widget.options.hint)
                    this.hint = IMu.string(this.widget.options.hint);
            },

            /*!
            ** Called when an icon is clicked.
            **
            ** If a function has been declared in the options, this is called.
            ** If no function exists, a popup dialogue will be created. 
            **
            ** @param message
            **   The message to be shown by the popup dialogue.
            */
            onClickIcon: function(message)
            {
                if (this.widget.options.onClickIcon)
                {
                    this.widget.options.onClickIcon.call(this);
                    return;
                }
                if (! message)
                    return;
                var dialogue = new IMu.App.Dialogue();
                dialogue.setMessage(IMu.string(message));
                dialogue.addButton('dialogue-button-close');
                dialogue.show();
            },

            setup: function()
            {
                var self = this;

                if (self.widget.value !== undefined)
                    self.setValue(self.widget.value);
                self.setReadOnly();
                self.setRequirement();
                self.setTabIndex();
                self.control.on('focus', function()
                {
                    self.widget.doGainFocus();
                });
                self.control.on('blur', function()
                {
                    self.widget.doLoseFocus();
                });
            },

            /*!
            ** Sets the image to be displayed in the control and its tooltip.
            **
            ** @param name
            **   The name of the icon to be used.
            **   If this value is not defined in icons, no image will be
            **   displayed.
            **
            ** @param info
            **   The message to be displayed as a tooltip.
            **   Clicking on the image will also bring up a dialogue box
            **   displaying the message.
            */
            setIcon: function(name, message)
            {
                var self = this;
                if (! message)
                    message = '';
                var img = self.icon.children('img').first();
                var url = self.widget.getIconURL(name);
                if (! url)
                {
                    if (img)
                        img.remove();
                }
                else
                {
                    if (img.length == 0)
                        img = self.icon.child('img', 'table-cell');
                    img.attr('src', url);
                    img.attr('title', IMu.string(message));

                    jQuery(img).unbind().click(function()
                    {
                        self.onClickIcon(message)
                    });
                }
            },

            setReadOnly: function()
            {
                var disabled = false;
                if (this.widget.options.readonly)
                    disabled = true;
                this.control.attr('disabled', disabled);
            },

            setRequirement: function()
            {
                if (this.widget.options.requirement == "mandatory")
                    this.control.addClass('mandatory');
                if (this.widget.options.requirement == "suggested")
                    this.control.addClass('suggested');
            },

            setTabIndex: function()
            {
                var tabIndex = undefined;
                if (this.widget.options.tabIndex)
                    tabIndex = this.widget.options.tabIndex;
                if (tabIndex)
                    this.control.attr('tabindex', tabIndex);
                else
                    this.control.removeAttr('tabindex');
            }
        }
    });
})(IMu.Themes.shared);
