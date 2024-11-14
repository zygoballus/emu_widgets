(function(theme)
{
    theme.views.register('search-form',
    {
        _source: 'shared/client/search-form',

        all:
        {
            _create: function()
            {
                var self = this;

                var widget = self.widget;

                self.holder = widget.owner.child('div', 'holder');
                var holder = self.table = self.holder.child('div', 'table');

                self.makeFields()

                if (self.getOption('showClear'))
                {
                    td = tr.child('div', 'clear');
                    self.clearButton = td.child('button', 'clear');
                    self.clearButton.text(IMu.string('common-search-clear'));
                    if (self.widget.options.buttonClass)
                        self.clearButton.addClass(self.widget.options.buttonClass);
                    self.clearButton.bind('click', function()
                    {
                        widget.doClear();
                    });
                }
                if (self.getOption('onlyItemsWithImages'))
                {
                    var div = holder.child('div', 'images-label-advanced');

                    var span = div.child('label');
                    var fieldLabel = IMu.string('only-items-with-images');
                    span.text(fieldLabel + ':');
		    span.attr('for', fieldLabel.toLowerCase());
                    if (self.widget.options.promptClass)
                        span.addClass(self.widget.options.promptClass);

                    var input = div.child('input type="checkbox" id="' + fieldLabel.toLowerCase() + '"', 'images-checkbox');
                    input.bind('change', function()
                    {
                        widget.imagesOnly = $(this).prop('checked');
                    });
                }

                if (self.getOption('onlyItemsOnDisplay'))
                {
                    var div = holder.child('div', 'on-display-label-advanced');

                    var span = div.child('label');
                    var fieldLabel = IMu.string('on-display');
                    span.text(fieldLabel + ':');
		    span.attr('for', fieldLabel.toLowerCase());
                    if (self.widget.options.promptClass)
                        span.addClass(self.widget.options.promptClass);

                    var input = div.child('input type="checkbox" id="' + fieldLabel.toLowerCase() + '"', 'on-display-checkbox');
                    input.bind('change', function()
                    {
                        widget.onDisplay = $(this).prop('checked');
                        
                        var file = 'imu/shared/client/images/lists/museum-location.txt';
                        $.get(file, function(data)
                        {
                            widget.museumLocationList = data.split("\n");
                        });
                    });
                }
                if (self.getOption('showSubmit'))
                {
                    var tr = self.table.child('div', 'row');
                    tr.css('clear', 'both');
                    var td = tr.child('div', 'submit');
                    self.submit = td.child('button', 'search');
                    self.submit.text(IMu.string('common-search'));
                    if (self.widget.options.buttonClass)
                        self.submit.addClass(self.widget.options.buttonClass);
                    self.submit.bind('click', function()
                    {
                        widget.search();
                    });
                }
            },
            
            makeFields: function()
            {
                var self = this;
               
                var widget = self.widget;

                var fields = widget.fields;
                for (var i = 0; i < fields.length; i++)
                {
                    var field = fields[i];

                    var row = self.table.child('div', 'row');
                    row.css('clear', 'both');
                    field.row = row;
                    
		    var fieldLabel = "";
                    if (field.prompt !== undefined)
                    {
                        var td = row.child('label', 'prompt');
                        var prompt = IMu.string(field.prompt);
                        fieldLabel = prompt.toLowerCase();
                        
			td.attr('for', fieldLabel);

                        prompt += ':';
                        td.text(prompt);
                        if (self.widget.options.promptClass)
                            td.addClass(self.widget.options.promptClass);
                    }

                    field.input = undefined;
                    if (! field.type)
                        self.addTextField(field, row);
                    else if (field.type == 'selection')
                        self.addSelectionField(field, row);
                    else if (field.type == 'date')
                        self.addDateField(field, row);
                    else if (field.type == 'label')
                        self.addLabelField(field, row);
                    else
                        self.addTextField(field, row);

                    if (field.input)
                    {
                        field.input.bind('keypress', function(e)
                        {
                            if (e.keyCode == 13)
                            {
                                widget.search();
                            }
                        });
                        field.input.attr('class', 'input');
                        field.input.attr('id', fieldLabel);
                    }

                    if (field.hover)
                        field.input.attr('title', field.hover);

                    if (IMu.Languages.current.dir == 'ltr')
                    {
                        jQuery(row).children(".prompt").attr(
                            'style', 'margin-right: 0.4em;');
                    }
                    else
                    {
                        jQuery(row).children(".prompt").attr(
                            'style', 'margin-left: 0.4em;');
                    }
                }
            },

            addLabelField: function(field, row)
            {
                var self = this;

                if (field.label !== undefined)
                {
                    var td = row.child('div', 'label');
                    var label = IMu.string(field.label);
                    td.text(label);
                    var br = row.child('br');
                }
            },

        }
    });
})(IMu.Themes.shared);
