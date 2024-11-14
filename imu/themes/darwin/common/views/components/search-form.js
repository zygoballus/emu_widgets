(function(theme)
{
    theme.views.register('search-form',
    {
        _source: 'darwin/common/components/search-form',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);
                
                this.groups = {};
            },

            _create: function()
            {
                var self = this;

                self.holder = self.widget.owner.child('div', 'holder');
                var form = self.form = self.holder.child('form');

                var fields = self.widget.fields;
                for (var i = 0; i < fields.length; i++)
                {
                    (function(field)
                    {
                        var row = self.form.child('div', 'input');

                        var label = row.child('label', 'prompt');
                        
                        if (field.prompt !== undefined)
                            label.text(IMu.string(field.prompt));

                        if (self.widget.options.promptClass)
                            label.addClass(self.widget.options.promptClass);

                        field.input = undefined;
                        
                        if (! field.type)
                            self.addTextField(field, row);
                        else if (field.type == 'selection')
                            self.addSelectionField(field, row);
                        else if (field.type == 'date')
                            self.addDateField(field, row);
                        else
                            self.addTextField(field, row);

                        var group = field.searchGroup || '';
                        if (self.groups[group] === undefined)
                            self.groups[group] = [];

                        if (field.input)
                        {
                            field.input.bind('keypress', function(e)
                            {
                                if (e.keyCode == 13)
                                {
                                    self.widget.search();
                                    e.preventDefault();
                                }
                            });
                            field.input.attr('class', 'input');

                            if (field.onChange)
                                field.input.bind('change', function(e)
                                {
                                    field.onChange();
                                });

                            if (field.hover)
                                field.input.attr('title', field.hover);
                        }

                        self.groups[group].push(
                        {
                            'label': label,
                            'field': field,
                            'row': row
                        });
                    })(fields[i]);
                }

                if (self.getOption('onlyItemsWithImages'))
                {
                    var row = form.child('div', 'input records-with-images');
                    
                    var label = row.child('label');
                    label.text(IMu.string('only-items-with-images'));

                    if (self.widget.options.promptClass)
                        label.addClass(self.widget.options.promptClass);

                    var input = row.child('input type="checkbox"', 'images-checkbox');
                    input.bind('change', function()
                    {
                        self.widget.imagesOnly = $(this).attr('checked');
                    });
                }

                var buttons = self.holder.child('div', 'buttons');

                if (self.getOption('showSubmit'))
                {
                    self.submit = buttons.child('button', 'search');
                    self.submit.text(IMu.string('common-search'));

                    if (self.widget.options.buttonClass)
                        self.submit.addClass(self.widget.options.buttonClass);

                    self.submit.click(function()
                    {
                        self.widget.search();
                    });
                }

                if (self.getOption('showClear'))
                {
                    self.clearButton = buttons.child('button', 'clear');
                    self.clearButton.text(IMu.string('common-search-clear'));

                    if (self.widget.options.buttonClass)
                        self.clearButton.addClass(self.widget.options.buttonClass);

                    self.clearButton.click(function()
                    {
                        self.widget.doClear();
                    });
                }

            },

            clearField: function(field)
            {
                if (field.type == 'selection')
                    this.clearSelectionField(field);
                else if (field.type == 'text')
                    this.clearTextField(field);
                else if (field.type == 'date')
                    this.clearDateField(field);
            },

            resize: function()
            {
            },

            setSearchGroup: function(value)
            {
                for (var key in this.groups)
                {
                    var group = this.groups[key];

                    if (key == 'persistent' || key === value)
                    {
                        for (var i = 0; i < group.length; i++)
                        {
                            group[i].row.show();
                        }
                    }
                    else
                    {
                        for (var i = 0; i < group.length; i++)
                        {
                            this.clearField(group[i].field);
                            group[i].row.hide();
                        }
                    }
                }
            }
        }
    });
})(IMu.Themes.get('darwin'));
