(function(theme)
{
    theme.views.register('grid',
    {
        _source: 'shared/common/grid',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.table = undefined;
                this.thead = undefined;
                this.tbody = undefined;
                this.items = [];
            },

            _create: function()
            {
                this._super.apply(this, arguments);

                var self = this;

                var widget = self.widget;
                self.table = widget.owner.child('table');

                if (widget.hasHeadings())
                {
                    var thead = self.table.child('thead');
                    var tr = thead.child('tr', 'headings');

                    if (self.widget.options.rowNumbers)
                        tr.child('th');

                    for (var i = 0; i < widget.columns.length; i++)
                    {
                        (function(n)
                        {
                            var column = widget.columns[n];
                            column.element = tr.child('th');
                            column.element.addClass('heading');
                            column.element.addClass('heading-' + (n + 1));
                            if (column.name)
                                column.element.addClass('heading-' + column.name);
                            column.element.bind('click', function()
                            {
                                self.widget.columnClicked(column);
                            });
                        })(i);
                    }
                    self.updateColumns();
                }

                self.tbody = this.table.child('tbody');

                // Catch enter key here
                this.table.bind('keydown', function(e)
                {
                    if (e.keyCode == 13)
                    {
                        return false;
                    }
                });
            },

            clear: function()
            {
                this.tbody.empty();
                this.items = [];
            },

            create: function(index, row)
            {
                var self = this;

                var tr = jQuery('<tr/>');
                tr.addClass('row');
                for (var i = 0; i < row.classes.length; i++)
                    tr.addClass(row.classes[i]);
                tr.bind('click', function()
                {
                    self.widget.rowClicked(row);
                });

                if (index >= 0 && index < self.items.length)
                    self.items[index].tr.before(tr);
                else
                {
                    self.tbody.append(tr);
                    index = self.items.length;
                }

                var item =
                {
                    tr: tr,
                    row: row
                };
                self.items.splice(index, 0, item);

                if (self.widget.options.rowNumbers)
                    item.tr.child('td', 'row-number');
                for (var i = 0; i < item.row.cells.length; i++)
                {
                    var cell = item.row.cells[i];
                    var column = cell.column;

                    var td = item.tr.child('td');
                    td.addClass('column');
                    td.addClass('column-' + (i + 1));
                    if (column.name)
                        td.addClass('column-' + column.name);
                    cell.create(td);
                }
                if (self.widget.options.showAddRemove)
                {
                    var add = item.tr.child('td', 'add');
                    add.bind('click', function()
                    {
                        self.widget.insertRow(index + 1);
                    });
                    var image = add.child('img', 'image');
                    var url = IMu.Request.getURL('Image') + '&name=app/add';
                    image.attr('src', url);
                    image.attr('title', IMu.string('add-row-below'));

                    var text = add.child('div', 'text')
                    
                    var remove = item.tr.child('td', 'cross');
                    remove.bind('click', function()
                    {
                        if (index == 0 && self.widget.rows.length == 1)
                        {
                            return;
                        }
                        self.widget.removeRow(index);
                    });
                    var img = remove.child('img');
                    var url = IMu.Request.getURL('Image') + '&name=cross';
                    img.attr('src', url);
                    img.attr('title', IMu.string('remove-row'));
                }
                self.updateRowNumbers(index);
            },

            remove: function(index)
            {
                if (index < 0 || index >= this.items.length)
                    return;
                var item = this.items[index];
                item.tr.remove();
                this.items.splice(index, 1);
                this.updateRowNumbers(index);
            },

            updateColumns: function()
            {
                for (var i = 0; i < this.widget.columns.length; i++)
                {
                    var column = this.widget.columns[i];

                    var text = '';
                    if (column.heading)
                        text += column.heading;
                    if (column.sorted)
                    {
                        if (text != '')
                            text += ' ';
                        if (column.sorted == 'descending')
                            text += '&uarr;';
                        else
                            text += '&darr;';
                    }
                    column.element.html(text);
                }
            },

            updateRowNumbers: function(from)
            {
                if (! this.widget.options.rowNumbers)
                    return;

                for (var i = from; i < this.items.length; i++)
                {
                    var item = this.items[i];
                    var tr = item.tr;
                    var td = tr.children('.row-number');
                    td.text(i + 1);
                }
            }
        }
    });
})(IMu.Themes.shared);
