(function(theme)
{
    theme.views.register('attachment-control', 'box-control',
    {
        _source: 'shared/common/attachment-control',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                var self = this;

                var widget = self.widget;

                var options =
                {
                    source: function(request, callback)
                    {
                        widget.getAttachmentAutoSuggest(request.term, callback)
                    },

                    select: function(e, ui)
                    {
                        widget.doSelect(ui.item);
                        widget.irn = ui.item.irn;
                    }
                };

                if (widget.options.minLength !== undefined)
                    options.minLength = widget.options.minLength;

                self.control.autocomplete(options);

                if (self.widget.options.onPopout)
                {
                    var table = self.content.parent();
                    var popout = table.child('span','popout');
                    var image = popout.child('img', 'image');
                    var url = IMu.Request.getURL('Image') + '&name=app/input';
                    image.attr('src',url);
                    image.attr('title',IMu.string('attach-new'));
                    popout.on('click', function()
                    {
                        if (self.widget.options.onPopout)
                        {
                            self.widget.doPopout();
                        }
                    });
                }

                self.control.on('textchange', function()
                {
                    self.widget.irn = undefined;
                });

                self.control.on('blur',function()
                {
                    if (! self.widget.irn)
                        self.widget.setValue('');
                });

                self.control.on('dblclick',function()
                {
                });
            }
        }
    });
})(IMu.Themes.shared);
