(function(theme)
{
    theme.views.register('record-details', 'paged-viewer',
    {
        _source: 'darwin/common/viewers/record-details',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.showSaveMultimedia = undefined;
            },

            _create: function()
            {
                this._super.apply(this, arguments);
            },

            resize: function()
            {
                this._super.apply(this, arguments);
            },

            collectionChanged: function()
            {
            },

            /* Public
            */
            addDetail: function(label, value)
            {
                if (this instanceof jQuery)
                    var d = this.child('div');
                else
                    var d = jQuery('<div></div>');

                if (IMu.Type.isArray(value))
                    value = value.join(', ');

                return {
                    'label': d.child('div', 'label').text(IMu.string(label || '')),
                    'value': d.child('div', 'value').append(value || '')
                };
            },

            addTable: function(label, values, keys)
            {
                if (this instanceof jQuery)
                    var d = this.child('div');
                else
                    var d = jQuery('<div></div>');

                if (! keys)
                {
                    keys = [];
                    if (values.length)
                    {
                        for (var key in values[0])
                            if (values[0].hasOwnProperty(key))
                                keys.push(key);
                    }
                }

                var table = jQuery('<table></table>');
                var tbody = table.child('tbody');

                for (var i = 0; i < values.length; i++)
                {
                    var tr = tbody.child('tr');
                    for (var j = 0; j < keys.length; j++)
                    {
                        var key = keys[j];
                        tr.child('td', key).text(values[i][key] || '');
                    }
                }
                
                return { 
                    'label': d.child('div', 'label').text(IMu.string(label || '')),
                    'value': d.child('div', 'value').append(table)
                }
            },

            addNestedTable: function(label, values, keys)
            {
                if (this instanceof jQuery)
                    var d = this.child('div');
                else
                    var d = jQuery('<div></div>');

                if (! keys)
                {
                    keys = [];
                    if (values.length)
                    {
                        for (var key in values[0])
                            if (values[0].hasOwnProperty(key))
                                keys.push(key);
                    }
                }

                var tables = [];

                for (var i = 0; i < values.length; i++)
                {
                    var tableValues = values[i];

                    var table = jQuery('<table></table>');
                    var tbody = table.child('tbody');
                    
                    // Find number of rows
                    var length = 0;
                    for (var j = 0; j < keys.length; j++)
                    {
                        var key = keys[j];
                        if (! tableValues.hasOwnProperty(key))
                            continue;

                        if (tableValues[key] == null)
                            tableValues[key] = [];
                        else if (tableValues[key].length > length)
                            length = tableValues[key].length;
                    }

                    // Create rows
                    for (var j = 0; j < length; j++)
                    {
                        var tr = tbody.child('tr');
                        for (var k = 0; k < keys.length; k++)
                        {
                            var key = keys[k];
                            tr.child('td', key).text(tableValues[key][j] || '');
                        }
                    }

                    tables.push(table);
                }

                return {
                    'label': d.child('div', 'label').text(IMu.string(label || '')),
                    'value': d.child('div', 'value').append(tables)
                };
            },

            addSection: function(title, owner)
            {
                title = title || '';

                var section = jQuery('<section></section>');
                section.addClass(title);
                
                if (title)
                    title = 'label-' + title + '-section';
            
                section.child('h4', 'section-title').text(IMu.string(title));

                section.addDetail = this.addDetail;
                section.addTable = this.addTable;
                section.addNestedTable = this.addNestedTable;

                if (owner)
                    section.appendTo(owner);

                return section;
            }
        }
    });
})(IMu.Themes.get('darwin'));
