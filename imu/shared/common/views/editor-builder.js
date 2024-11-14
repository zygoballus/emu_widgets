(function(theme)
{
    theme.views.register('editor-builder', 'base',
    {
        _source: 'shared/common/editor-builder',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                this.sourceInput = undefined;
            },

            _create: function()
            {
                var self = this;

                self._super();

                // var owner = self.widget.owner;
                var owner = self.widget.owner.child('div', 'owner', 'bg-colour-2');

                if (!self.widget.destination)
                    self.widget.destination = {};

                if (!self.widget.source)
                    self.widget.source = {};

                self.widget.source.holder = owner.child('div', 'imu-source-owner section');;
                var source = self.widget.source.holder;

                self.widget.destination.holder = owner.child('div', 'imu-destination-owner section');

                var sourceInput = self.sourceInput = source.child('div', 'input');
                var field  = sourceInput.IMu('text-control',
                {
                    hint: 'Source',
                    onEnter: function()
                    {
                        self.clearSource();
                        
                        self.widget.doFetchSource(this.value,function(result)
                        {
                            self.updateSelect(result, self.widget.source.selection);
                        });

                    }
                });

                if (! field.view)
                    field.createView();
                field.view.control.blur();

                var sourceSelection = source.child('div', 'selection')
                var selection = sourceSelection.child('select', 'select');
                selection.attr('size', 10);
                selection.attr('multiple', 'multiple');

                self.widget.source.selection = selection;

                if (self.widget.options.method == 'attach')
                    self.createAttachmentDestination();
                else if (self.widget.options.method == 'replace')
                {
                    var field = self.widget.field;

                    if (field.type == 'text')
                        self.createTextDestination(field);
                    else if (field.type == 'date')
                        self.createDateDestination();
                }

                var options = self.widget.getOption('editorOptions')
                if (options)
                    self.widget.configure(options);

                // Cancel and Save
                //
                var update = self.widget.getOption('showUpdate', 'true');
                if (update)
                {
                    var buttons = self.widget.owner.child('div');
                    buttons.addClass('buttons');
                    var holder = buttons.child('div', 'holder');

                    if (update)
                    {
                        var button = self.update = holder.child('div',
                            'update').IMu('button-control');
                        button.addState(
                        {
                            layout:
                            {
                                type: 'text',
                                value: IMu.string('editor-builder-update')
                            },
                            onClick: function()
                            {
                                self.widget.validate(function(info)
                                {
                                    self.widget.doUpdate(function(result)
                                    {
                                        if (self.widget.options.onlyEmpty == true)
                                        {                                    
                                            self.clearSource();

                                            var val = self.sourceInput.IMu().value;
                            
                                            self.widget.doFetchSource(val,function(result)
                                            {
                                                self.updateSelect(result, self.widget.source.selection);
                                            });
                                        }
                                    });
                                });
                            },
                            classes: 'bg-colour-3 txt-colour-1'
                        });
                        button.createView();
                    }
                }
            },

            createAttachmentDestination: function()
            {
                var self = this;
                var destination = self.widget.destination.holder;

                var destinationInput = destination.child('div', 'input');
                var field = destinationInput.IMu('text-control',
                {
                    hint: 'Target',
                    onEnter: function()
                    {
                        self.clearDestination();
                        
                        self.widget.doFetchDestination(this.value, function(result)
                        {
                            self.updateSelect(result, self.widget.destination.selection);
                        }); 
                        
                    }
                });
                if (!field.view)
                    field.createView();
                field.view.control.blur();

                var destinationSelection = destination.child('div', 'selection');
                var selection = destinationSelection.child('select', 'select');
                selection.attr('size', 10);

                self.widget.destination.selection = selection;
            },

            createDateDestination: function()
            {
                var destination = this.widget.destination.holder;
                var destinationInput = destination.child('div', 'input');

                var field = this.widget.destination.inputField = 
                    destinationInput.IMu('date-control',
                {
                    hint: 'Target',
                    picker: true
                });

                if (!field.view)
                    field.createView();
                field.view.control.blur();
            },

            clearDestination: function()
            {
                if (this.widget.destination.selection)
                    this.widget.destination.selection.empty();
            },

            clearSource: function()
            {
                if (this.widget.source.selection)
                    this.widget.source.selection.empty();
            },

            createTextDestination: function(field)
            {
                var destination = this.widget.destination.holder;
                var destinationInput = destination.child('div', 'input');

                var field = this.widget.destination.inputField = destinationInput.IMu('text-control',
                {
                    hint: 'Target',
                    suggest: field.suggest
                });

                if (!field.view)
                    field.createView();
                field.view.control.blur();
            },

            updateSelect: function(data, selector)
            {
                if (selector)
                    selector.empty();

                for (var i = 0; i < data.length; i++)
                {
                    var option = selector.child('option');
                    var text = data[i].value;
                    var string = "";

                    if (text)
                        string = text;
                    else if (text == "")
                        string = "NULL";
                    if (data[i].irns)
                    {
                        string += ' (' + data[i].irns.length + ')';
                        //option.val(data[i].count);
                    }
                    if (data[i].irns)
                        option.val(data[i].irns);
                    else if (data[i].val)
                        option.val(data[i].val);

                    option.text(string);
                }
            }
        }
    });
})(IMu.Themes.shared);
