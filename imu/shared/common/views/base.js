(function(theme)
{
    theme.views.register('base',
    {
        _source: 'shared/common/base',

        all:
        {
            _construct: function(widget)
            {
                this.widget = widget;

                var ownerHeight = this.widget.getOption('ownerHeight');
                if (ownerHeight == 'dynamic')
                    this.fixedHeight = false;
                else if (ownerHeight == 'fixed')
                    this.fixedHeight = true;
                else
                    this.fixedHeight = this.widget.owner.height() > 0;

                this.spinner = undefined;
            },

            _create: function()
            {
                this.setId();
            },

            beginDelay: function(maxHeight, maxWidth, control)
            {
                var self = this;
                var widget = self.widget;
                
                var owner = control;
                if (!owner)
                    owner = widget.owner;
            
                function centreImage()
                {
                    var offset = owner.offset();

                    var ownerWidth = owner.fullWidth();
                    var imageWidth = self.spinner.fullWidth();
                    offset.left += (ownerWidth - imageWidth) / 2;

                    var ownerHeight = owner.fullHeight();
                    var imageHeight = self.spinner.fullHeight();
                    offset.top += (ownerHeight - imageHeight) / 2;

                    self.spinner.offset(offset);
                    self.spinner.show();
                }
                if (! self.spinner)
                {
                    self.spinner = jQuery('<img/>');
                    self.spinner.hide();
                    self.spinner.attr('src', IMu.Request.getURL('Image') + '&name=spinner');

                    centreImage();

                    var css = {
                        position: 'absolute'
                    };

                    /* This is a hack for resizing the gif.
                     */
                    if (maxHeight)
                        css['max-height'] = maxHeight;
                    if (maxWidth)
                        css['max-width'] = maxWidth;

                    self.spinner.css(css);

                    self.spinner.appendTo(jQuery('body'));
                    self.spinner.imagesLoaded(function()
                    {
                        centreImage();
                    });
                }
            },

            collectionChanged: function() {},

            destroy: function()
            {
                this.widget.owner.empty();

                /* Break reference to widget to allow clean-up
                 */
                this.widget = undefined;
            },

            endDelay: function()
            {
                if (this.spinner)
                {
                    this.spinner.remove();
                    this.spinner = undefined;
                }
            },

            initialise: function() {},

            resize: function() {},

            restyle: function() {},

            // protected
            getOption: function(name, defaultValue)
            {
                return this.widget.getOption(name, defaultValue);
            },

            log: function(format)
            {
                if (arguments.length == 0)
                    return;

                var widget = this.widget.name;
                var theme = IMu.Themes.current.name;
                var text = arguments[0];
                if (arguments.length > 1)
                {
                    var args = Array.prototype.slice.call(arguments, 1);
                    text = IMu.Format.vsprintf(text, args);
                }
                IMu.log('{0}[{1}]:{2}', widget, theme, text);
            },

            /*!
            ** Sets appropriate id attributes to the widget's HTML.
            **
            ** By default, the owner's id will be set, although
            ** more complex widgets might extend this function to
            ** set id attributes on other elements.
            */
            setId: function()
            {
                var id = this.widget.id;
                this.widget.owner.attr('id', id);
            }
        }
    });
})(IMu.Themes.shared);
