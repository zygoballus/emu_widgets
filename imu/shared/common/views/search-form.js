(function(theme)
{
    theme.views.register('search-form',
    {
        _source: 'shared/common/search-form',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.holder = undefined;
                self.table = undefined;
                self.submit = undefined;
            },

            _create: function()
            {
                var self = this;

                var widget = self.widget;

                self._super();
                self.holder = widget.owner.child('div', 'holder');
                var holder = self.table = self.holder.child('div', 'table');

                self.makeFields()

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

                    var span = div.child('span');
                    span.text(IMu.string('only-items-with-images') + ':');
                    if (self.widget.options.promptClass)
                        span.addClass(self.widget.options.promptClass);

                    var input = div.child('input type="checkbox"', 'images-checkbox');
                    input.bind('change', function()
                    {
                        widget.imagesOnly = $(this).prop('checked');
                    });
                }
            },

            clear: function()
            {
                for (var i = 0; i < this.widget.fields.length; i++)
                {
                    var field = this.widget.fields[i];
                    if (field.type == 'selection')
                        this.clearSelectionField(field);
                    else if (field.type == 'text')
                        this.clearTextField(field);
                    else if (field.type == 'date')
                        this.clearDateField(field);
                }
            },

            // private
            addSelectionField: function(field, td)
            {
                var self = this;

                field.type = 'selection';
                field.input = td.child('select');
                if (field.allowEmpty)
                {
                    var option = field.input.child('option');
                    option.val('');
                    if (field.hint)
                        option.text(IMu.string(field.hint));
                    else
                        option.text(IMu.string('common-selection-lookup-empty'));
                }
                if (field.lookup)
                {
                    self.addSelectionLookup(field);
                    var name = field.lookup;
                    field.input.bind('change', function()
                    {
                        var fields = self.widget.fields;
                        for (var i = 0; i < fields.length; i++)
                        {
                            if (fields[i] === field)
                                continue;
                            if (! fields[i].lookup)
                                continue;
                            if (fields[i].lookup != name)
                                continue;
                            self.addSelectionLookup(fields[i]);
                        }
                    });
                }
                if(field.list)
                {
                    var file = 'imu/shared/client/images/lists/' + field.list;
                    $.get(file, function(text){
                        var data = text.split("\n");
                        for( var i = 0; i < data.length; i++)
                        {
                            var option = field.input.child('option');
                            option.val(data[i]);
                            option.text(data[i]);
                        }
                    });
                }

            },

            addSelectionLookup: function(field)
            {
                var lookup = new IMu.Request.Lookup();
                var name = field.lookup;
                var level = field.level;
                if (level === undefined)
                    level = 0;
                var id = IMu.Format.format('name {0} level {1}', name, level);
                IMu.log('addSelectionLookup: {0}: getting values', id);
                var keys = this.getLookupKeys(name, level);
                lookup.lookup(name, level, keys, function(result)
                {
                    var prev = field.input.val();

                    var children = field.input.children('[value!=""]');
                    IMu.log('addSelectionLookup: {0}: removing {1} options',
                        id, children.length)
                    children.remove();

                    IMu.log('addSelectionLookup: {0}: adding {1} options',
                        id, result.length)
                    for (var i = 0; i < result.length; i++)
                    {
                        var value = result[i];
                        if (value != "")
                        {
                            var option = field.input.child('option');
                            option.val(value);
                            option.text(value);
                        }
                    }

                    /* If URL contains a value for the lookup field, we need
                    ** to set this and trigger a change event so the correct
                    ** search fields are displayed/hidden on the search form.
                    */
                    var hashValue = IMu.URL.Hash.get(field.column);
                    if (result.length == 1 && ! field.allowEmpty)
                        field.input.val(value);
                    else if (prev !== null)
                        field.input.val(prev);
                    else if (hashValue)
                        field.input.val(hashValue).change();
                });
            },

            clearSelectionField: function(field)
            {
                field.input.val('');
            },

            addDateField: function(field, td)
            {
                var self = this;

                field.type = 'date';
                var input = td.child('input type="text"');
                td.addClass('imu-search-date-picker');
                if (field.hint)
                {
                    input.attr('placeholder', IMu.string(field.hint));
                }
                input.datepicker(
                {
                    dateFormat: IMu.Config.defaultDateFormat
                });
                input.bind('keypress', function(e)
                {
                    if (e.keyCode == 13)
                    {
                        return false;
                    }
                    return true;
                });
                field.input = input;
            },

            clearDateField: function(field)
            {
                field.input.val('');
            },

            addTextField: function(field, td)
            {
                var self = this;

                field.type = 'text';
                var input = td.child('input type="text"');
                if (field.hint)
                {
                    input.attr('placeholder', IMu.string(field.hint));
                }
                if (field.autoSuggest && field.lookup)
                {
                    var lookup = new IMu.Request.Lookup();
                    input.autocomplete
                    ({
                        source: function(request, callback)
                        {
                            var name = field.lookup;
                            var level = field.level;
                            if (level === undefined)
                                level = 0;
                            var keys = [];
                            while (keys.length < level)
                                keys.push('');
                            keys.push(request.term);
                            lookup.lookup(name, level, keys, function(result)
                            {
                                if (callback)
                                    callback(result);
                            });
                        }
                    });
                }
                input.bind('keypress', function(e)
                {
                    if (e.keyCode == 13)
                    {
                        return false;
                    }
                    return true;
                });
                field.input = input;
            },

            clearTextField: function(field)
            {
                field.input.val('');
            },

            resize: function()
            {
                var self = this;
                var rowWidth= null;
                var largestPrompt =0;
                var promptMargin = null;
                var inputWidth = 0;
                var inputBorderWidth = null;
                var inputMarginWidth = 0;
                var inputPaddingWidth = 0;
                var minInputWidth = null;
                var freeSpace = 0;

                var holder = self.holder

                var toggleHidden = false;
                var page = jQuery(holder).parent();
                if (jQuery(page).css('display') == 'none')
                {
                    toggleHidden = true;
                    jQuery(page).css('display', 'block');
                }

                jQuery(holder).children(".table").children(".row").each(function()
                {
                    var row = this;

                    var prompt = jQuery(row).children(".prompt");
                    var promptWidth = jQuery(prompt).width();

                    if (promptWidth > largestPrompt)
                        largestPrompt = promptWidth;

                    if (rowWidth == null)
                        rowWidth = jQuery(row).width();

                    if (promptMargin == null)
                    {
                        var outerWidth = jQuery(prompt).outerWidth(true);
                        promptMargin = outerWidth - promptWidth;
                    }

                    var input = jQuery(row).children(".input");

                    if (inputBorderWidth == null &&
                        jQuery(input).attr('type') == 'text')
                    {
                        inputBorderWidth =
                            parseInt(input.css("border-left-width"), 10) +
                            parseInt(input.css("border-right-width"), 10);
                    }

                    if (minInputWidth == null)
                    {
                        inputMarginWidth =
                            parseInt(input.css("margin-left"), 10) +
                            parseInt(input.css("margin-right"), 10);

                        inputPaddingWidth=
                            parseInt(input.css("padding-left"), 10) +
                            parseInt(input.css("padding-right"), 10);

                        minInputWidth = parseInt(input.css('min-width'), 10);
                        if (minInputWidth)
                            minInputWidth += inputMarginWidth +
                            inputBorderWidth +inputPaddingWidth;
                    }

                });

                freeSpace = rowWidth -largestPrompt -promptMargin -2;

                jQuery(holder).children(".table").children(".row").each(function()
                {
                    var row = this;

                    jQuery(row).children(".prompt").outerWidth(largestPrompt);

                    var input = jQuery(row).children(".input");
                    var newWidth = null;

                    var type = jQuery(input).attr('type');
                    var curWidth = input.outerWidth(true);

                    if (freeSpace <= 0 ||
                        (minInputWidth && minInputWidth > freeSpace) ||
                        (! minInputWidth && type != 'text'
                        && curWidth > freeSpace))
                        newWidth = rowWidth;
                    else
                        newWidth = freeSpace;

                    input.outerWidth(newWidth);
                    newWidth = Math.floor(input.outerWidth() -inputMarginWidth
                        -inputBorderWidth -1);
                    input.outerWidth(newWidth);

                    input.css('margin-' + IMu.Languages.current.far, 
                        (inputMarginWidth/2) +1);
                });

                if (toggleHidden == true)
                {
                    jQuery(page).css('display', 'none');
                }
            },

            getLookupKeys: function(name, index)
            {
                var widget = this.widget;

                var keys = [];
                for (var i = 0; i < widget.fields.length; i++)
                {
                    var field = widget.fields[i];
                    if (! field.lookup)
                        continue;
                    if (field.lookup != name)
                        continue;
                    var level = field.level;
                    if (level === undefined)
                        level = 0;
                    var value = '';
                    if (level != index && field.input)
                        value = field.input.val();
                    while (keys.length < level -1)
                        keys.push('');
                    keys[level] = value;
                }
                IMu.log('getLookupKeys: name {0} keys {1}', name, keys);
                return keys;
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
                    
                    if (field.prompt !== undefined)
                    {
                        var td = row.child('div', 'prompt');
                        var prompt = IMu.string(field.prompt);
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
                    }

                    if (field.hover)
                        field.input.attr('title', field.hover);

                    if (IMu.Languages.current.dir == 'ltr')
                    {
                        jQuery(row).children(".prompt").attr(
                            'style', 'float: left; margin-right: 0.4em;');
                        jQuery(row).children(".input").attr(
                            'style', 'float: right;');
                    }
                    else
                    {
                        jQuery(row).children(".prompt").attr(
                            'style', 'float: right; margin-left: 0.4em;');
                        jQuery(row).children(".input").attr(
                            'style', 'float: left;');
                    }
                }
            }
        }
    });
})(IMu.Themes.shared);
