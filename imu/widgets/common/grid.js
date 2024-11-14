/*!
 ** A widget for managing data tables.
 **
 ** Creates a table with numerous helper functions.
 **
 ** @since 2.0
 */
(function()
{
    IMu.Widgets.add('grid', 'base',
    {
        _construct: function()
        {
            this._super.apply(this, arguments);
            this.classes.push('imu-grid');

            this.registerOptions
            ({
                /*!
                */
                dataColumn: undefined,
                /*!
                */
                newRow: false,

                /*!
                */
                rowNumbers: false,

                /*!
                ** Specifies whether the grid should be sorted when a column
                ** header is clicked.
                */
                sortColumns: false,

                /*!
                ** The function to be called when the user clicks the column.
                */
                onColumnClicked: undefined,

                /*!
                ** Called when the value of the control has changed.
                */
                onChange: undefined,

                /*!
                ** Called when any cell gets focus.
                **
                ** @param cell Cell
                **   The cell which now has focus.
                */
                onGainFocus: undefined,
                
                /*!
                ** Called when any cell loses focus.
                **
                ** @param cell Cell
                **   The cell which has lost focus.
                */
                onLoseFocus: undefined,

                /*!
                ** Called as a part of the **validate( )** function chain.
                ** This occurs after the `grid`'s built-in validation and
                ** gives a `grid` instance the chance to review the validation.
                */
                onValidate: undefined,

                /*!
                ** The function to be called when the user clicks the row.
                */
                onRowClicked: undefined,

                /*!
                ** Adds interface buttons that allow you to manually add/remove rows.
                */
                showAddRemove: false,

                /*!
                ** If set to **true**, a dialogue will be generated on
                ** validation if there are issues.
                */
                showErrors: false,

                /*!
                ** If **true**, causes the **validate( )** method to be called
                ** when any of the `grid`'s values change.
                */
                validateOnChange: false,

                /*!
                ** If **true**, causes the **validate( )** method to be called
                ** when any of the `grid`'s controls gain focus.
                */
                validateOnGainFocus: false,

                /*!
                ** If **true**, causes the **validate( )** method to be called
                ** when any of the `grid`'s controls lose focus.
                */
                validateOnLoseFocus: false
            });

            this.columns = [];
            this.columnMap = {};
            this.rows = [];

            this.hiddenRows = [];
            this.sortKeys = [];

            this.focused = false;
        },

        /*!
        ** Adds a column to the grid.
        **
        ** @param type string
        **   The type of column to add.
        **   Can be either:
        **   * "checkbox"
        **   * "date"
        **   * "icon"
        **   * "selection"
        **   * "static"
        **   * "text'
        **
        ** @param options object
        **   Any options used to configure the column.
        **
        ** @returns object
        **   The new column object.
        */
        addColumn: function(type, options)
        {
            var self = this;
            var column;

            switch (type)
            {
              case 'attachment':
                column = new AttachmentColumn(this)
                break;
              case 'checkbox':
                column = new CheckboxColumn(this);
                break;
              case 'date':
                column = new DateColumn(this);
                break;
              case 'icon':
                column = new IconColumn(this);
                break;
              case 'integer':
                column = new IntegerColumn(this);
                break;
              case 'number':
                column = new NumberColumn(this);
                break;
              case 'selection':
                column = new SelectionColumn(this);
                break;
              case 'static':
                column = new StaticColumn(this);
                break;
              case 'text':
                column = new TextColumn(this);
                break;
              case 'time':
                column = new TimeColumn(this);
                break;
              default:
                throw new IMu.Error('BadColumnType', type);
            }
            if (options)
                column.configure(options);

            if (column.name)
                self.columnMap[column.name] = self.columns.length;

            this.columns.push(column);

            return column;
        },

        /*!
        ** Append a row of values to the end of the grid.
        **
        ** @param values mixed
        **   An object containing the set of values to be added to the new row.
        */
        appendRow: function(values)
        {
            var row = new Row(this);
            this.view.create(-1, row);
            if (values)
                row.setValues(values);
            this.rows.push(row);
            return row;
        },

        /*!
        ** Append multiple rows of values to the end of the grid.
        **
        ** @param values mixed
        **   An array of objects containing the set of values to be added to the
        **   new rows.
        */
        appendRows: function(values)
        {
            if (values.length < 1)
                return;

            var tbody = this.view.tbody.detach();

            for (var i = 0; i < values.length; i++)
                this.appendRow(values[i]);

            jQuery(this.view.table).append(tbody);
        },

        /*!
        ** Clears all values in the grid.
        */
        clearGrid: function()
        {
            var tbody = this.view.tbody.detach();

            var values = this.getValues();
            for (var i = 0; i < values.length; i++)
                this.removeRow(0);

            jQuery(this.view.table).append(tbody);
        },

        /*!
        ** Get the index of column within a grid
        **
        ** @param name
        **   The name of the column to check for
        **
        ** @returns integer
        **   This index of the column (or -1 if not found)
        */
        getColumnIndex: function(name)
        {
            for (var i in this.columns)
            {
                if (! this.columns[i])
                    continue;
                if (this.columns[i].name == name)
                    return i;
            }
            return -1;
        },

        /*!
        ** Returns a single row of values from the grid.
        **
        ** @param index int
        **   The row index to return.
        **
        ** @returns object
        **   The the row of values.
        */
        getRow: function(index)
        {
            return this.rows[index];
        },

        /*!
        ** Gets the number of rows in the grid.
        */
        getRowCount: function()
        {
            return this.rows.length;
        },

        /*!
        ** Gets the values of the rows in a format which each cell can be 
        ** directly compared against corresponding cells in other rows.
        */
        getSortableValues: function()
        {
            var values = [];
            for (var i in this.rows)
            {
                var row = this.rows[i];
                var newRow = {};
                newRow = row.getSortableValues();
                values.push(
                {
                    index: parseInt(i, 10),
                    row: row,
                    value: newRow
                });
            }
            return values;
        },

        /*!
        ** An alias for getValues.
        **
        ** This method is provided so that a grid can be used as a control
        ** within a form.
        **
        ** @returns object[]
        **   An array of objects, one object for each row.
        */
        getValue: function()
        {
            return this.getValues();
        },
        getAsyncValue: function(callback)
        {
           if (! callback)
                return;
            var value = this.getValue();
            callback(value);
        },
        /*!
        ** Gets all the values in the grid.
        **
        ** This is a convenience function to save having to
        ** iterate over all the rows in the grid.
        **
        ** @returns object[]
        **   An array of objects, one object for each row.
        */
        getValues: function()
        {
            var values = [];
            for (var i in this.rows)
            {
                var rowValues = this.rows[i].getValues();
                values.push(this.rows[i].getValues());
            }

            // trim trailing empty rows
            for (var i = values.length -1; i >= 0; i--)
            {
                if (! jQuery.isEmptyObject(values[i]))
                    return values;
                values.pop();
            }
            return values;
        },

        /*!
        ** Checks whether any columns have a heading property.
        **
        ** @returns boolean
        **   Returns **true** if at least one heading property set.
        */
        hasHeadings: function()
        {
            for (var i in this.columns)
                if (this.columns[i].heading)
                    return true;
            return false;
        },

        /*!
        ** Inserts a set of values into a set position in the grid.
        **
        ** @param index int
        **   The row number to insert the values.
        **   Defaults to 0 if undefined.
        **
        ** @param values mixed
        **   An object containing the values to be added to the inserted row.
        */
        insertRow: function(index, values)
        {
            if (index === undefined)
                index = 0;

            var row = new Row(this);
            this.view.create(index, row);
            if (values)
                row.setValues(values);
            this.rows.splice(index, 0, row);
            return row;
        },

        /*!
        ** Deletes a row from the grid.
        **
        ** @param index int
        **   The row number to be deleted.
        */
        removeRow: function(index)
        {
            var row = this.rows[index];
            this.view.remove(index);
            this.rows.splice(index, 1);
            return row;
        },

        /*!
        ** An alias for setValues.
        **
        ** This method is provided so that a grid can be used as a control
        ** within a form.
        **
        ** @param values object[]
        **   An array of objects, one object for each row.
        */
        setValue: function(value)
        {
            this.setValues(value);
        },

        /*!
        ** Sets all the values in the grid.
        **
        ** This is a convenience function to save having to
        ** iterate over all the rows in the grid.
        **
        ** @param values object[]
        **   An array of objects, one object for each row.
        */
        setValues: function(values)
        {
            var self = this;
            if (values === undefined)
                return;
           
            // This is used by form widget's clearForm function
            if (values === null)
            {
                while (this.rows.length)
                    this.removeRow(0);
                this.appendRow();
                return;
            }
            if (this.rows.length == 0)
                this.appendRow();
            if (IMu.Type.isArray(values))
            {
                for (var j = 0; j < values.length; j++)
                {
                    for (var column in values[j])
                    {
                        var singleRow = values[j][column];
                        if (IMu.Type.isArray(singleRow))
                        {
                            if (j >= this.rows.length)
                                this.appendRow();
                            if (this.rows[0].cells[0].column.displayColumn)
                            {
                                    this.rows[j].cells[0].widget.setValue(singleRow[0]);
                            }
                            else
                            {
                                var printValue = "";
                                for (var k = 0; k < singleRow.length; k++)
                                    printValue += singleRow[k] + ',';
                                printValue = printValue.substring(0,printValue.length-1);
                                this.rows[j].cells[0].widget.setValue(printValue);
                            }
                        }
                        else
                        {
                            if (typeof(singleRow) !== 'object' || singleRow === null)
                            {
                                //This is a single value. Happens for attachment fields
                                if (j >= this.rows.length)
                                    this.appendRow();
                                this.rows[j].cells[0].widget.setValue(singleRow);
                            }
                            else
                            {
                                for (var i in singleRow)
                                {
                                    if (i < this.rows.length)
                                        this.rows[i].setValues(singleRow[i]);
                                    else
                                        this.appendRow(singleRow[i]);
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                if (typeof(values) !== 'object')
                {
                    //This is a single value. Happens for attachment fields
                    while (this.rows.length)
                        this.removeRow(0);
                    this.appendRow();
                    this.rows[0].cells[0].widget.setValue(values);
                    return;
                }
                for (var i in values)
                {
                    if (i < this.rows.length)
                        this.rows[i].setValues(values[i]);
                    else
                        this.appendRow(values[i]);
                }
            }
        },

        /*!
        ** Sorts the grid by columns.
        **
        ** @param keys array
        **   The list of columns to sort by.
        */
        sort: function(keys)
        {
            var self = this;

            if (keys)
                self.setSortKeys(keys);
            if (self.sortKeys.length == 0)
                return;

            var sortableValues = self.getSortableValues();
            sortableValues.sort(function(a, b)
            {
                return self.compareSortableRows(a, b);
            });

            var tbody = self.view.tbody.detach();
            self.view.updateColumns();
            self.view.clear();
            for(var i in sortableValues)
            {
                var sortedRow = sortableValues[i];
                var oldIndex = sortedRow.index;
                self.view.create(-1, sortedRow.row);
                sortedRow.row.updateCells();
            }
            jQuery(self.view.table).append(tbody);
        },

        /*!
        ** Updates the values of a given row.
        **
        ** @param index int
        **   The row number to be updated.
        */
        updateRow: function(index, values)
        {
            var row = this.rows[index];
            if (values)
                row.setValues(values);
            return row;
        },
        // end interface


        /*!
        ** Compares two rows, comparing columns in order of priority.
        **
        ** Rows ``a`` and ``b`` are strictly those created from the
        ** **getSortableValues( )** function.
        ** These rows have been parsed and values replaced by ones which can be
        ** directly compared to one another without further manipulation.
        **
        ** @returns result
        **   The result of the comparison.
        **   Takes into consideration if sort is ascending or desending.
        */
        compareSortableRows: function(a, b)
        {
            var self = this;

            var keys = this.sortKeys;
            for (var i in keys) 
            { 
                var result = undefined
                var key = keys[i];
                var column = key.column;
                var valueA = a.value[column];
                var valueB = b.value[column];

                // Look for equal values.
                // Do not include null == undefined
                if (valueA === valueB)
                    continue;
                if (valueA != null && valueB != null)
                {
                    result = valueA < valueB ? -1 : 1;
                    return key.descending ? -result : result;
                }

                /* One of the cells is undefined/null
                ** Look at sortKey for how to sort undefined/null
                */

                // Figure out if undefined/null is greater or less than
                // a legitimate value...
                if (key.emptySorted == 'high')
                    result = key.descending ? -1 : 1;
                else if (key.emptySorted == 'low')
                    result = key.descending ? 1 : -1;
                else if (key.emptySorted == 'top')
                    result = -1;
                else
                    result = 1;   // default value is 'bottom'
                
                // Prioritize invalid values over null values
                if (valueA === undefined)
                    return result;
                if (valueB === undefined)
                    return -result;
                    
                // If we're here then one value is null
                return valueA == null ? result : -result;
            }
            return 0;
        },

        // TODO: 'check if sorted' functionality
        findIndex: function(row)
        {
            var self = this;

            // Force all row values to be up to date
            self.getValues();

            // Just append if no sort order given, or no items in grid
            if (self.sortKeys.length == 0 || self.rows.length == 0)
                return self.rows.length;

            var lowerIndex = 0;
            var upperIndex = self.rows.length - 1;

            var lowerRow = self.rows[lowerIndex].values;
            var upperRow = self.rows[upperIndex].values;

            /* Check if row belongs outside current set
            */
            comparison = self.compareRows(row, upperRow);
            if (comparison >= 0)
                return (upperIndex + 1);

            var comparison = self.compareRows(row, lowerRow);
            if (comparison < 0)
                return lowerIndex;
            else if (comparison == 0)
            {
                var index = lowerIndex;
                while (index < self.rows.length)
                {
                    if (self.compareRows(row, rows[index].values) < 0)
                        return index;
                    else
                        index++;
                }
                // Something went wrong
                throw new IMu.Error('UnexpectedEndOfArray');
            }

            //else it's somewhere in between

            while (lowerIndex < upperIndex)
            {
                var midIndex = Math.floor((lowerIndex + upperIndex) / 2);

                var comparison = self.compareRows(row, self.rows[midIndex].values);

                if (comparison == 0)
                {
                    var index = midIndex;
                    while (index < self.rows.length)
                    {
                        if (self.compareRows(row, rows[index].values))
                            return index;
                        else
                            index++;
                    }
                    throw new IMu.Error('UnexpectedEndOfArray');
                }
                else if (comparison > 0)
                    lowerIndex = midIndex + 1;
                else
                    upperIndex = midIndex;
            }
            return upperIndex;
        },

        /*
        ** Private function
        **
        ** Hides rows that are not to be displayed.
        **
        ** To avoid nasty css problems with rows being hidden, we remove the
        ** element from the DOM tree temporarily.
        */
        hideRows: function(displayed)
        {
            var self = this;

            if (self.rows.length == 0)
                return;

            var type = IMu.Type.get(displayed);
            if (type != 'object')
                return;

            for (var column in displayed)
            {
                if (self.rows[0] === undefined ||
                    self.rows[0].values[column] === undefined)
                    continue;

                var numRows = self.rows.length;
                for (var i = numRows - 1; i >= 0; i--)
                {
                    var row = self.rows[i];
                    var rowValue = row.values[column];

                    if (rowValue === undefined)
                        continue;

                    if (typeof(rowValue) == 'string')
                        rowValue = rowValue.toLowerCase();
                    if (typeof(filterValue) == 'string')
                        filterValue = filterValue.toLowerCase();

                    if (displayed[column][rowValue] === false)
                    {
                        self.hiddenRows.push(row);
                        self.removeRow(i);
                    }
                }
            }
        },

        /*
        ** Inspect row elements from a hidden grid and places them back in the
        ** DOM tree if none of the filters match.
        */
        showRows: function(displayed)
        {
            var self = this;

            if (self.hiddenRows.length == 0)
                return;

            var type = IMu.Type.get(displayed);
            if (type != 'object')
                return;

            var numRows = self.hiddenRows.length;
            for (var i = numRows - 1; i >= 0; i--)
            {
                var row = self.hiddenRows[i];

                var show = true;
                for (var column in displayed)
                {
                    if (row.values[column] === undefined)
                        continue;

                    var rowValue = row.values[column];
                    if (rowValue !== undefined)
                    {
                        if (typeof(rowValue) == 'string')
                            rowValue = rowValue.toLowerCase();
                    }
                    else
                        rowValue = '';

                    if (displayed[column][rowValue] !== undefined &&
                        displayed[column][rowValue] == false)
                    {
                        show = false;
                        break;
                    }
                }

                if (show)
                {
                    var values = row.getValues();
                    self.appendRow(values);

                    self.hiddenRows.splice(i, 1);
                }
            }
        },

        /*
        ** Build a list of keys.
        **
        ** This is complicated becasue we allow a variety of types of
        ** arguments to be passed to specify the keys.
        **
        ** We want to end up with an array of objects, each of which
        ** includes:
        **
        ** * column - the name of the column
        ** * descending -true for descending / false for ascending
        ** * type - the type of sort to apply
        */
        setSortKeys: function()
        {
            var self = this;

            var keys = [];
            for (var i = 0; i < arguments.length; i++)
            {
                var list;

                var type = IMu.Type.get(arguments[i]);
                if (type == 'array')
                    list = arguments[i];
                else if (type == 'object')
                    list = [arguments[i]];
                else if (type == 'string')
                    list = arguments[i].split(/[;,]/);
                else
                    throw new IMu.Error('GridSortBadKeyType', i, type);

                for (var j = 0; j < list.length; j++)
                {
                    var key = {
                        column: undefined,
                        descending: undefined,
                        emptySorted: 'bottom',
                        type: undefined
                    };

                    var item = list[j];
                    var type = IMu.Type.get(item);
                    if (type == 'object')
                    {
                        if (!item.column)
                            throw new IMu.Error('GridSortNoKeyItemColumn', i, j);
                        key.column = item.column;

                        if (item.descending !== undefined)
                            key.descending = item.descending ? true : false;
                        else if (item.order)
                        {
                            var pattern = new RegExp('^' + item.order, 'i');
                            if ('ascending'.match(pattern))
                                key.descending = false;
                            else if ('descending'.match(pattern))
                                key.descending = true;
                            else if (item.order == '+')
                                key.descending = false;
                            else if (item.order == '-')
                                key.descending = true;
                        }
                        if (item.type)
                        {
                            var pattern = new RegExp('^' + item.type, 'i');
                            if ('date'.match(pattern))
                                key.type = 'date';
                            else if ('numeric'.match(pattern))
                                key.type = 'numeric';
                            else if ('text'.match(pattern))
                                key.type = 'text';
                        }
                        if (item.emptySorted)
                            key.emptySorted = item.emptySorted;
                    }
                    else if (type == 'string')
                    {
                        var matches = item.match(/^([-+])(.*$)/);
                        if (!matches)
                            key.column = item;
                        else
                        {
                            key.column = matches[2];
                            key.descending = matches[1] != '-';

                            var columns = this.columns;
                            for (var i = 0; i < columns.length; i++)
                            {
                                if (columns[i].name == key.column &&
                                    columns[i].type)
                                {
                                    key.type = columns[i].type;
                                    break;
                                }
                            }
                        }
                    }
                    else
                        throw new IMu.Error('GridSortBadKeyItemType', i, j, type);

                    if (!key.column)
                        throw new IMu.Error('GridSortNoKeyItemColumn', i, j);
                    if (key.descending === undefined)
                        key.descending = true;
                    if (key.type === undefined)
                        key.type = 'text';

                    keys.push(key);
                }
            }
            if (keys.length >= 1)
                self.sortKeys = keys;
        },

        // TODO: names need some attention. eg 'filters', 'displayed'
        /*!
        ** Updates the rules defining which rows should be shown or not.
        **
        ** The use of the term "Filters" in the name is ambiguous.
        ** Should rows that match the filter be shown or hidden?
        ** For this reason we use 'displayed' as a parameter.
        **
        ** @param displayed mixed
        **   An object containing values to show/hide.
        **
        **   Each object value should be of the format:
        **      column_name:{value: bool}
        **   where value is the actual value to look for in the column column_name
        **   and bool defines whether it should be shown or hidden.
        **
        ** @example
        **   Show any already hidden rows with a First Name of "Phil" then
        **   hide rows that contain a First Name of "Andrew" or a Last Name of
        **   "Smith".
        **
        ** @code
        **   var display =
        **   {
        **        'First Name':
        **        {
        **            'Phil': true,
        **            'Andrew': false
        **        },
        **        'Last Name':
        **        {
        **            'Smith': false
        **        }
        **   };
        ** widget.updateFilters(display);
        */
        updateFilters: function(displayed)
        {
            var self = this;

            self.showRows(displayed);
            self.hideRows(displayed);
        },

        /*
        ** Used in forms where it checks to see if cells have been filled in or empty
        ** deppending on outcome this function will either 
        **
        ** * remove the last cell 
        ** * append a cell
        **
        ** TODO - MO
        ** If a cell is cleared from the middle of the column the last cell is removed, 
        ** this is wrong and the cell cleared should be removed, which in turn will shift everything up. 
        */
        updateGrid: function(cell)
        {
            var self = this;
            /* This auto-append code is not necessary if we're using manual add/remove.
            */
            if (self.options.showAddRemove)
                return;

            var rowCount = self.getRowCount();
            var lastRow = self.getRow(rowCount - 1);
            var lastRowCell = lastRow.getCell(self.getColumnIndex(cell.column.name));
            var lastCellValue = lastRowCell.getValue();
            var numEmpty = 0;

            for (var i in this.rows)
            {
                var r = this.rows[i];
                var c = r.getCell(self.getColumnIndex(cell.column.name));
                var value = c.getValue();
                if (! value)
                    numEmpty++;
            }

            if ((!cell.getValue() && !cell.widget.view.getValue()) &&
                (!lastCellValue || !lastRowCell.widget.view.getValue())  &&
            rowCount > 2)
            {
                    lastCellValue = lastRowCell.widget.view.getValue();
                    if(!lastCellValue)
                    {
                        self.removeRow(rowCount - 1);
                        return
                    }
            }
            if (!lastCellValue)
            {
                // double check becuase attachment control works abit different
                lastCellValue = lastRowCell.widget.view.getValue();
                if(!lastCellValue)
                    return
            }
            if (cell === lastRowCell)
            {
                self.appendRow();
                return
            }
            if (lastCellValue && numEmpty == 0)
            {
                self.appendRow();
                return;
            }
        },

        /*!
        ** Grid level validation.
        **
        ** Creates an ``info`` object containing ``state`` and ``details`` of 
        ** the `grid`.
        ** Unlike in `control` widget validation, ``info.details`` is an array
        ** comprising of validation information from each `Cell` in the `grid`
        ** widget, ``info.state`` is the 'worst' state of those `Cell`s.
        **
        ** Once the built-in validation process has concluded, the `grid`
        ** displays the results and then fires a callback event, if one exists.
        **
        ** Each subsequent function in the validation chain occurs as a callback
        ** of the previous function. This guards against potential unexpected
        ** asynchronous events.
        **
        ** @param callback function
        **   The function to be called at the end of the validation chain.
        **   Takes ``info`` as an argument.
        */
        validate: function(callback)
        {
            var self = this;
            var info =
            {
                state: 'ok',
                details: []
            };
            self.getValues(); //force update values
            self.doBuiltinValidation(info, function()
            {
                self.doCustomValidation(info, function()
                {
                    self.showValidationState(info, function()
                    {
                        if (callback)
                            callback.call(self, info);
                    });
                });
            });
        },

        /* Events from views
        */
        changed: function(cell, value)
        {
            if (this.options.onChange)
                this.options.onChange.call(this, cell, value);

            if (this.getOption('validateOnChange'))
                this.validate();
        },

        columnClicked: function(column)
        {
            if (this.options.onColumnClicked)
                this.options.onColumnClicked.call(this, column);
            else if (this.options.sortColumns)
                this.sortByColumn(column);
        },

        /*!
        ** Grid level built-in validation.
        ** Called when the `grid` needs to be validated.
        **
        ** Each of the `Row`s within the `grid` widget are validated and the
        ** validation info is added to ``info.details``.
        **
        ** ``info.state`` will be updated if a `Cell`'s validation state is 
        ** 'worse'.
        ** The ranking of states from best to worst is as follows:
        ** 1) ok
        ** 2) empty
        ** 3) invalid
        **
        ** @param info
        **   Information about the current state of the `grid`.
        **   At this point ``info.state`` should be **ok** and ``info.details``
        **   should be an empty array.
        **
        ** @param callback function
        **   Returns control back to the previous function once validation has
        **   concluded.
        */
        doBuiltinValidation: function(info, callback)
        {
            var self = this;
        
            var length = self.rows.length;
            var numValidated = 0;
            for (var r in self.rows)
            {
                var row = self.rows[r];
                row.validate(function(result)
                {
                    if (result.state != 'ok')
                    {
                        if (! info.firstIssue && result.firstIssue)
                            info.firstIssue = result.firstIssue;
                        info.details.push(result);

                        if (result.state == 'invalid' &&
                            info.state != 'invalid')
                            info.state = 'invalid';
                        else if (result.state == 'empty' &&
                            info.state != 'invalid' &&
                            info.state != 'empty')
                            info.state = 'empty';
                    }
                    if (++numValidated == length)
                        callback();
                });
            }
            
            if (length == 0)
                callback();
        },

        /*!
        ** Grid level custom validation.
        ** Called via the **validate( )** function.
        **
        ** Checks to see if there is an ``onValidate`` function in the options.
        ** If one exists, it is called before control is passed back to
        ** **validate( )**.
        **
        ** @param info
        **   Information about the current state of the `grid` before any
        **   custom validation.
        **
        ** @param callback function
        **   Returns control back to the previous function once the custom
        **   validation has concluded.
        */
        doCustomValidation: function(info, callback)
        {
            if (! this.options.onValidate)
            {
                callback();
                return;
            }
            this.options.onValidate.call(this, info, function()
            {
                callback();
            });
        },

        /*
        ** Called by a field when its control has gained focus.
        */
        doGainFocus: function(field)
        {
            if (this.focused)
                return;

            this.focused = true;

            if (this.options.onGainFocus)
                this.options.onGainFocus.call(this, field);

            if (this.options.validateOnGainFocus)
                this.validate();
        },

        /*
        ** Called by a field when its control has lost focus.
        */
        doLoseFocus: function(field)
        {
            var self = this;

            setTimeout(function()
            {
                var focusedElem = jQuery(document.activeElement);

                if (jQuery.contains(self.owner[0], focusedElem[0]))
                    return;

                self.focused = false;

                if (self.options.onLoseFocus)
                    self.options.onLoseFocus.call(self, field);

                if (self.options.validateOnLoseFocus)
                    self.validate();
            }, 0);
        },

        /*!
        ** Grid level show validation.
        ** Called via the **validate( )** function.
        ** Summarises information from validation and displays in a dialogue box.
        **
        ** If the ``showErrors`` option is **false** or ``info.state`` is **ok**
        ** a callback will be fired (if one exists) and the function will 
        ** return, otherwise, ``info.details`` is inspected.
        **
        ** Each detail within ``info.details`` represents a row in the `grid` 
        ** widget, each containing information about its cells.
        ** Each cell with a validation state that matches ``info.state`` is
        ** included in the summary.
        ** The cell's validation details are used to identify the kind of
        ** issue/warning to be incremented.
        ** The result of this process will be a hash table of issues/warnings
        ** and the number of occurences.
        **
        ** A dialogue box is then created advising the user that there are
        ** issues/warnings and lists them.
        **
        ** If ``info.state`` is **empty**, the user is merely warned that there
        ** may be areas that need attention.
        ** They will then be allowed to either:
        ** * continue - this will fire the callback, if any; or
        ** * cancel - this will allow the user to modify any values before
        **          trying again.
        **
        ** In the event of either an invalid state or a warning where the user
        ** chooses to cancel, the browser will focus on the first element in
        ** the grid which needs attention.
        **
        ** @param info
        **   Information about the current state of the `grid` afer validation.
        **   As the `grid` is a collection of `Row`s with their own Cells/widgets,
        **   ``info.details`` is an array representing the validation state of
        **   each of these controls.
        **   ``info.state`` is the 'worst' state of the above mentioned controls.
        **
        ** @param callback function
        **   Returns control back to the previous function.
        */
        showValidationState: function(info, callback)
        {
            if (! this.options.showErrors || info.state == 'ok')
            {
                callback(info);
                return;
            }

            var dialogue = new IMu.App.Dialogue();
            dialogue.addButton(IMu.string('ok'));
            var issues = {};
            var firstIssue = undefined;

            if (IMu.Type.isString(info.details))
            {
                if (! firstIssue && info.field)
                    firstIssue = info.field;
                dialogue.addDetail(IMu.string(info.details));
            }
            else if (IMu.Type.isArray(info.details))
            {
                // Summarise information from each row
                for (var i in info.details)
                {
                    var rowDetails = info.details[i];
                    if (rowDetails.state != info.state)
                        continue;
                    if (! firstIssue && rowDetails.firstIssue)
                        firstIssue = rowDetails.firstIssue;

                    // Summarise information from each column
                    for (var j in rowDetails.details)
                    {
                        var detail = rowDetails.details[j];
                        if (detail.info.state != info.state)
                            continue;
                        if (! issues[detail.info.details])
                            issues[detail.info.details] = 1;
                        else
                            issues[detail.info.details]++;
                    }
                }
                for (var key in issues)
                {
                    var message = issues[key] + ' ';
                    if (issues[key] == 1)
                        message += IMu.string('show-' + key);
                    else
                        message += IMu.string('show-multiple-' + key);

                    dialogue.addDetail(message);
                }
            }
            else
            {
                // I'm not sure what to do here
            }

            if (info.state == 'invalid')
            {
                dialogue.setMessage(IMu.string('show-validation-invalid'));
                dialogue.show({showDetails: true}, function()
                {
                    if (firstIssue)
                        firstIssue.focus();
                    // No need to run callback if there are errors.
                    return;
                });
            }
            else
            {
                dialogue.setMessage(IMu.string('show-validation-waring'));
                dialogue.addButton(IMu.string('cancel'));
                dialogue.show({showDetails: true}, function(code)
                {
                    if (code != 'ok')
                    {
                        if (firstIssue)
                            firstIssue.focus();
                        return;
                    }
                    callback(info);
                });
            }
        },

        rowClicked: function(row)
        {
            if (this.options.onRowClicked)
                this.options.onRowClicked.call(this, row);
        },

        sortByColumn: function(column)
        {
            var sort = {
                column: column.name,
                descending: undefined,
                type: column.type
            };
            if (!column.sorted)
                sort.descending = false;
            else
                sort.descending = column.sorted == 'ascending';

            if (column.emptySorted &&
                (column.emptySorted == 'high' ||
                    column.emptySorted == 'low' ||
                    column.emptySorted == 'top' ||
                    column.emptySorted == 'bottom'))
                sort.emptySorted = column.emptySorted;
            else
                sort.emptySorted = 'bottom';

            this.sort(sort);
            for (var i = 0; i < this.columns.length; i++)
                this.columns[i].sorted = undefined;
            column.sorted = sort.descending ? 'descending' : 'ascending';
            this.view.updateColumns();
        }
    });

    /*!
    ** A column in the grid.
    */
    var Column = IMu.Class.create
    ({
        _construct: function(controller)
        {
            this.controller = controller;

            this.heading = undefined;
            this.name = undefined;

            /*!
            ** Called when the value of the control has changed.
            */
            this.onChange = undefined;

            // used by views
            /*!
            */
            this.element = undefined;

            /*!
            ** Defines whether a column is sorted.
            ** Accepted values include "ascending" and "decending".
            */
            this.sorted = undefined;

            /*!
            ** Defines how to sort empty cells.
            ** Accepted values include:
            **
            ** * high
            **   In an ascending sort, empty cells will be positioned at the
            **   bottom.
            **   In a descending sort, empty cells will be positioned at the
            **   top.
            **
            ** * low
            **   In an ascending sort, empty cells will be positioned at the
            **   top.
            **   In a descending sort, empty cells will be positioned at the
            **   bottom.
            **
            ** * top
            **   Empty cells will always be positioned at the top.
            **
            ** * bottom
            **   Empty cells will always be positioned at the bottom.
            */
            this.emptySorted = undefined;

            /*!
            ** The icons to be used to compliment the `grid` widget.
            **
            ** In general these are used for control validation, though they
            ** can also be used for other purposes.
            */
            this.icons =
            {
                /*!
                ** The initial icon to be displayed by a `cell` when it is 
                ** first created.
                */
                initial: undefined,

                /* The next three are associated with validation.
                */
                /*!
                ** The icon to be displayed when validation succeeds.
                */
                ok: undefined,

                /*!
                ** The icon to be displayed if a `Cell` is left empty yet has
                ** a ``requirement`` of ``suggested``.
                */
                empty: 'lightbulb',

                /*!
                ** The icon to be displayed if validation fails.
                */
                invalid: 'exclam',

                /* Used to indicate a delay.
                **
                ** There is no current functionality to support this.
                */
                spinner: undefined

                /* Others can be added and then set using setIcon().
                */
            };

            /*!
            ** Called when the value of the control has changed.
            */
            this.onChange = undefined;

            /*!
            ** Called when the control has gained keyboard focus.
            */
            this.onGainFocus = undefined;

            /*!
            ** Called when the control has lost keyboard focus.
            */
            this.onLoseFocus = undefined;

            /*!
            ** Called as part of the **validate( )** function chain.
            ** This value is passed to the `Cell`'s `control`, which will
            ** execute this function after its own built-in validation.
            ** This gives the `Column`/`Cell`/`control` the chance to review the
            ** validation before the parent `grid` moves onto the next `Cell`.
            */
            this.onValidate = undefined;

            /*!
            ** Used to determine how a control should be styled.
            ** Two possible options : **mandatory** or **suggested**
            */
            this.requirement = undefined;

            /*!
            ** The type of data in the cell.
            ** For example "text", "numeric", "date"
            */
            this.type = undefined;

            /*!
            ** If **true**, causes the **validate( )** function to be called
            ** when a `Cell`'s value in the `Column` is changed.
            */
            this.validateOnChange = false;

            /*!
            ** If **true**, causes the **validate( )** function to be called
            ** when a `Cell` in the `Column` gains focus.
            */
            this.validateOnGainFocus = false;

            /*!
            ** If **true**, causes the **validate( )** function to be called
            ** when a `Cell` in the `Column` loses focus.
            */
            this.validateOnLoseFocus = false;
        },

        configure: function(options)
        {
            for (var name in options)
                if (name in this)
                    this[name] = options[name];
        },

        createCell: function(row)
        {
            var cell = this.newCell();
            cell.column = this;
            cell.row = row;
            return cell;
        },

        changed: function(cell, value)
        {
            if (this.onChange)
                this.onChange.call(this, cell, value);
            if (this.validateOnChange)
                cell.widget.validate();

            this.controller.changed(cell, value);
        },
        
        doGainFocus: function(cell)
        {
            if (this.onGainFocus)
                this.onGainFocus.call(this, cell);
            if (this.validateOnGainFocus)
                cell.widget.validate();

            this.controller.doGainFocus(cell);
        },

        doLoseFocus: function(cell)
        {
            if (this.onLoseFocus)
                this.onLoseFocus.call(this, cell);
            if (this.validateOnLoseFocus)
                cell.widget.validate();

            this.controller.doLoseFocus(cell);
        }
    });

    /*!
    ** An attachment column.
    **
    ** Each cell in the column will contain an $<attachment-control>.
     */
    var AttachmentColumn = Column.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);

            this.suggest = undefined;
            this.readonly = undefined;
            this.hint = undefined;
            this.table = undefined;
            this.displayColumn = undefined;
            this.terms = undefined;
            this.maxValues = undefined;
            this.matchLimit = undefined;
            this.minLength = undefined;
            this.onSelect = undefined;
            this.searchColumns = undefined;
            this.zoomForm = undefined;
        },

        newCell: function()
        {
            return new AttachmentCell(this.controller);
        }
    });

    /*!
    ** A check box column.
    **
    ** Each cell in the column will contain a $<checkbox-control>.
    */
    var CheckboxColumn = Column.extend(
    {
        newCell: function()
        {
            return new CheckboxCell(this.controller);
        }
    });

    /*!
    ** A date column.
    **
    ** Each cell in the column will contain a $<date-control>.
    */
    var DateColumn = Column.extend(
    {
        _construct: function()
        {
            this._super.apply(this, arguments);

            this.picker = false;
        },

        newCell: function()
        {
            return new DateCell(this.controller);
        }
    });

    /*!
    ** An icon column.
    **
    ** Each cell in the column will contain an $<icon-control>.
    */
    var IconColumn = Column.extend(
    {
        _construct: function()
        {
            this._super.apply(this, arguments);

            this.icons = undefined;
            this.onClickIcon = undefined;
        },

        newCell: function()
        {
            return new IconCell(this.controller)
        }
    });

    /*!
    ** An integer column.
    **
    ** Each cell in the column will contain an $<integer-control>.
    */
    var IntegerColumn = Column.extend(
    {
        newCell: function()
        {
            return new IntegerCell(this.controller);
        }
    });

    /*!
    ** A number column.
    **
    ** Each cell in the column will contain a $<number-control>.
    */
    var NumberColumn = Column.extend(
    {
        newCell: function()
        {
            return new NumberCell(this.controller);
        }
    });

    /*!
    ** A selection column.
    **
    ** Each cell in the column will contain a $<selection-control>.
    */
    var SelectionColumn = Column.extend(
    {
        _construct: function()
        {
            this._super.apply(this, arguments);

            this.list = undefined;
            this.hint = undefined;
        },

        newCell: function()
        {
            return new SelectionCell(this.controller);
        }
    });

    /*!
    ** A static column.
    **
    ** Each cell in the column will contain a $<static-control>.
    */
    var StaticColumn = Column.extend
    ({
        newCell: function()
        {
            return new StaticCell(this.controller);
        }
    });

    /*!
    ** A text column.
    **
    ** Each cell in the column will contain a $<text-control>.
     */
    var TextColumn = Column.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);

            this.suggest = undefined;
            this.readonly = undefined;
            this.hint = undefined;
            this.lines = undefined;
        },

        newCell: function()
        {
            return new TextCell(this.controller);
        }
    });

    /*!
    ** A time column.
    **
    ** Each cell in the column will contain a $<time-control>.
    */
    var TimeColumn = Column.extend
    ({
        newCell: function()
        {
            return new TimeCell(this.controller);
        }
    });

    /*!
    ** A row in the grid.
    */
    var Row = IMu.Class.create
    ({
        _construct: function(controller)
        {
            this.controller = controller;

            this.cells = [];
            for (var i = 0; i < this.controller.columns.length; i++)
            {
                var column = this.controller.columns[i];
                var cell = column.createCell(this);
                this.cells.push(cell);
            }

            /*!
            ** The values associciated with the row.
            */
            this.values = {};

            /*!
            */
            this.classes = [];
        },

        /*!
        ** Compares the values of this row against another row or set of values.
        **
        ** Looks at each sort key specified by the parent `grid` widget and
        ** compares the value of each in both rows.
        ** If the parent `grid` does not contain at least one sort key or the
        ** algorithm progresses to the end of the sort keys without finding a
        ** larger value, the function will return 0.
        **
        **
        ** @returns result
        **   < 0 if this row value is less than the comparison row value
        **   0 if both rows are of equal value
        **   > 0 if this row value is greater than the comparison row value
        */
        compare: function(otherRow)
        {
            var self = this;

            var result = 0;
            var keys = this.controller.sortKeys;
            for (var i in keys) 
            { 
                var key = keys[i];
                var column = key.column;

                var cell = self.getCellByName(column);
                var otherCell = otherRow.getCellByName(column);
                if (! cell || ! otherCell)
                    continue;

                var columnResult = undefined;
                if (! cell.valid || ! otherCell.valid)
                {
                    // Two invalid columns are equal, so move to next column
                    if (! cell.valid && ! otherCell.valid)
                        continue;
                }
                else
                    columnResult = cell.compare(otherCell);
                
                if (columnResult)
                {
                    result = key.descending ? columnResult * -1 : columnResult;
                    break;
                }
                if (columnResult == undefined && 
                    key.emptySorted != undefined)
                {
                    if (key.emptySorted == 'high')
                        result = key.descending ? -1 : 1;
                    else if (key.emptySorted == 'low')
                        result = key.descending ? 1 : -1;
                    else if (key.emptySorted == 'top')
                        result = -1;
                    else if (key.emptySorted == 'bottom')
                        result = 1;
                    else
                        continue;
                    if (cell.widget.value != null)
                        result *= -1;
                    break;
                }
                // else columns are equivalent/equal, so move to next column
            }
            return result;
        },

        /*!
        ** Adds one or more classes.
        */
        addClasses: function()
        {
            for (var i = 0; i < arguments.length; i++)
                this.classes.push(arguments[i]);
        },

/*
        append: function()
        {
            this.controller.view.create(-1, this);
        },
*/

        getCell: function(index)
        {
            return this.cells[index];
        },

        /*!
        ** Looks up a cell name in a hash table to find the appropriate column
        ** index instead of being forced to progress through each cell in the
        ** row inspecting the name.
        **
        ** @returns object
        **   The expected cell.
        */
        getCellByName: function(name)
        {
            var self = this;

            var columnMap = self.controller.columnMap;
            if (columnMap[name] === undefined)
                return undefined;

            var index = columnMap[name];
            return self.cells[index];
        },

        /*!
        ** Gets the classes associated with the row.
        **
        ** @returns string[]
        **   The an array of ``string``\s representing the row's classes.
        */
        getClasses: function()
        {
            return this.classes;
        },

        /*!
        ** Gets the values of the cells in a format which can be directly
        ** compared with each other.
        */
        getSortableValues: function()
        {
            var values = {};
            for (var i in this.cells)
            {
                var cell = this.cells[i];
                values[cell.column.name] = cell.widget.getSortableValue();
            }
            return values;
        },

        /*!
        ** Gets the values associated with the row.
        **
        ** @returns object
        **   An associative array containing the values in the row.
        */
        getValues: function()
        {
            /* First update the values from the cells.
            */
            for (var i = 0; i < this.cells.length; i++)
            {
                var cell = this.cells[i];
                var name = cell.column.name;
                this.values[name] = cell.widget.getValue();
            }

            /* Then copy the values.
            */
            var values = {};
            for (var name in this.values)
            {
                if (this.values[name])
                    values[name] = this.values[name];
            }

            return values;
        },

        remove: function()
        {
            var index = undefined;
            for (var i in this.controller.rows)
            {
                if (this.controller.rows[i] == this)
                {
                    index = i;
                    break;
                }
            }
            if (index === undefined)
            {
                /* Yuk! Can't find this row!
                ** Shouldn't happen.
                */
                return;
            }
            this.controller.removeRow(index);
        },

        /*!
        ** Sets the classes associated with the row.
        */
        setClasses: function()
        {
            this.classes = [];
            for (var i = 0; i < arguments.length; i++)
                this.classes.push(arguments[i]);
        },

        /*!
        ** Sets the values associated with the row.
        **
        ** @param values mixed
        **   The values associated with the row.
        */
        setValues: function(values)
        {
            /* First copy the values.
             */
            this.values = {};
            for (var name in values)
                this.values[name] = values[name];

            /* Then update the cells with the new values.
             */
            this.updateCells();
        },

        /*!
        ** Updates the view to display the data.
        */
        updateCells: function()
        {
            for (var i = 0; i < this.cells.length; i++)
            {
                var cell = this.cells[i];
                var name = cell.column.name;
                var value = this.values[name];
        
                if (typeof(value) === 'object')
                {
                    var st = '';
                    for (var prop in value)
                    {
                        st += value[prop] + ",";
                    }
                    st = st.substring(0, st.length - 1);
                    value = st;
                }

                cell.widget.setValue(value);
            }
        },

        /*!
        ** Row level validation.
        ** 
        ** Creates an ``info`` object containing ``state`` and ``details`` of
        ** each cell in the row.
        ** Unlike in `control` widget validation, ``info.details`` is an array
        ** comprising of validation information from each `Cell` in the `Row`, 
        ** ``info.state`` is the 'worst' state of those `Cell`s.
        **
        ** Once the validation process has concluded, a callback event is fired.
        ** If `Row` validation was called via `Grid` level validation, control
        ** will be passed back to the `Grid` and the next row will be evaluated.
        **
        ** Each subsequent function in the validation chain occurs as a callback
        ** of the previous function. This guards against potential unexpected
        ** asynchronous events.
        **
        ** @param callback function
        **   The function to be called at the end of the validation chain.
        **   Takes ``info`` as an argument.
        */
        validate: function(callback)
        {
            var self = this; 
            var info =
            {
                state: 'ok',
                details: []
            };
            self.doBuiltinValidation(info, function()
            {
                if (callback)
                    callback.call(self, info);
            });
        },
        // end interface

        /*!
        ** Row level built-in validation.
        ** Called when the row needs to be validated.
        **
        ** Each of the `Cell`s within the `Row` are validated and the
        ** validation info is added to ``info.details``.
        **
        ** ``info.state`` will be updated if a `Cell`'s validation state is
        ** 'worse'.
        ** The ranking of states from best to worst is as follows:
        ** 1) ok
        ** 2) empty
        ** 3) invalid
        **
        ** Once all `Cell`s have been validated, control is returned to the 
        ** **validate( )** function.
        **
        ** @param info
        **   Information about the current state of the `Row`.
        **   At this point ``info.state`` should be **ok** and ``info.details``
        **   should be an empty array.
        **
        ** @param callback function
        **   Returns control back to the previous function once validation has
        **   concluded.
        */
        doBuiltinValidation: function(info, callback)
        {
            var self = this;
            //TODO
            //for each cell, validate
            var length = self.cells.length;
            var numValidated = 0;
            for (var c in this.cells)
            {
                var cell = this.cells[c];
                cell.validate(function(result)
                {
                    if (result.state != 'ok')
                    {
                        if (! info.firstIssue && cell.widget.view.control)
                            info.firstIssue = cell.widget.view.control;
                        info.details.push(
                        {
                            cell: cell.widget.view.control,
                            info: result
                        });
                        if (result.state == 'invalid')
                            info.state = 'invalid';
                        else if (result.state == 'empty' && 
                            info.state != 'invalid')
                            info.state = 'empty';
                    }
                        
                    if (++numValidated == length)
                        callback();
                });
            }
            if (length == 0)
                callback();
        }
    });

    /*! 
    ** A cell in the grid.
    */
    var Cell = IMu.Class.create
    ({
        _construct: function(controller)
        {
            this.controller = controller;

            this.column = undefined;
            this.row = undefined;

            this.owner = undefined;
            this.widget = undefined;

            /*!
            ** Called when the value of the control has changed.
            */
            this.onChange = undefined;
        },

        compare: function(otherCell)
        {
            return this.widget.compare(otherCell);
        },

        create: function(owner)
        {
            this.owner = owner;
        },

        /*!
        ** Gets the value of a cell.
        **
        ** @returns mixed
        **   The value of the cell.
        */
        getValue: function()
        {
            if (this.widget)
                return this.widget.getValue();
            return undefined;
        },

        /*!
        ** Sets the value of a cell.
        **
        ** @param value mixed
        **   The new value to set.
        */
        setValue: function(value)
        {
            if (this.widget)
                this.widget.setValue(value);

            if (this.row !== undefined && this.row.values !== undefined)
            {
                var name = this.column.name;
                this.row.values[name] = value;
            }

        },

        /*!
        ** Cell level validation.
        **
        ** A two step validation process occurs:
        ** 1) Built-in rules that always apply to the type of `Cell` are
        **  checked.
        ** 2) Custom rules for associated `Column` set at instantiation are run.
        **
        ** Once the validation process has concluded, a callback event is fired.
        ** If `Cell` validation was called via `Row` level validation, control
        ** will be passed back to the `Row` and the next cell will be evaluated.
        **
        ** Each subsequent function in the validation chain occurs as a callback
        ** of the previous function. This guards against potential unexpected
        ** asynchronous events.
        **
        ** ``info`` is created in the `Cell` widget validate function rather
        ** than this validate function.
        **
        ** @param callback function
        **   The function to be called at the end of the validation chain.
        **   Takes ``info`` as an argument.
        */
        validate: function(callback)
        {
            // do builtin (ie control) validation
            // do column validation
            var self = this;
            self.getValue();
            self.doBuiltinValidation(function(info)
            {
                self.doCustomValidation(info, function()
                {
                    if (info.state == 'invalid')
                        self.valid = false;
                    else
                        self.valid = true;
                    if (callback)
                        callback.call(self, info);
                });
            });
        },
        // end interface

        /*!
        ** Executes a callback after the ``onChange`` event occurs.
        */
        changed: function(value)
        {
            this.column.changed(this, value);
        },
    
        /*!
        ** Cell level built-in validation.
        ** Called via the **Validate( )** function.
        **
        ** This triggers the **validate( )** function of the `Cell`'s widget,
        ** if one exists.
        ** If no such function exists it is assumed the validation succeded and
        ** the callback is fired.
        ** 
        ** @param callback function
        **   Returns control back to the previous function once validation has
        **   concluded.
        **   Takes ``info`` as an argument.
        */
        doBuiltinValidation: function(callback)
        {
            if (! this.widget.validate)
            {
                callback({ state: 'ok' });
                return;
            }
            this.widget.validate(function(info)
            {
                callback(info);
            });
        },

        /*!
        ** Cell level custom validation.
        ** Called via the **validate( )** function.
        **
        ** Checks to see if there is an ``onValidate`` function for the cell's 
        ** corresponding `Column`.
        ** If one exists, it is called before control is passed back to
        ** **validate( )**.
        **
        ** @param info
        **   Information about the current state of the `Cell` before any
        **   custom validation.
        **
        ** @param value
        **   The current value of the `Cell`'s widget.
        **
        ** @param callback function
        **   Returns control back to the previous function once validation has
        **   concluded.
        */
        doCustomValidation: function(info, callback)
        {
            if (! this.column.onValidate)
            {
                callback();
                return;
            }
            this.column.onValidate.call(this, info, function()
            {
                callback(info);
            });
        },
        
        doGainFocus: function()
        {
            this.column.doGainFocus(this);
        },

        doLoseFocus: function()
        {
            this.column.doLoseFocus(this);
        }
    });

    /*!
    ** A attachment cell.
    **
    ** A cell containing a $<attachment-control>.
    */
    var AttachmentCell = Cell.extend
    ({
        create: function()
        {
            var self = this;
            self._super.apply(this, arguments);

            var popoutFn;
            if (self.column.zoomForm !== undefined)
            {
                popoutFn = function()
                {
                    var base = IMu.URL.base;
                    base = base.replace(/#.*$/,'');
                    IMu.URL.Hash.complete = true;
                    IMu.URL.Hash.load();
                    IMu.URL.Hash.setValue('form',self.column.zoomForm);
                    var child = window.open(base + '#' + IMu.URL.Hash.getUrl());
                    child.openctl = self.widget;
                    self.widget.doChange();
                };
            }
            else
                popoutFn = undefined;

            self.widget = self.owner.IMu('attachment-control',
            {
                hint: self.column.hint,
                readonly: self.column.readonly,
                table: self.column.table,
                column: self.column.displayColumn,
                terms: self.column.terms,
                maxValues: self.column.maxValues,
                matchLimit: self.column.matchLimit,
                minLength: self.column.minLength,
                searchColumns: self.column.searchColumns,
                zoomForm: self.column.zoomForm,

                onChange: function(value)
                {
                    self.changed(value);
                },

                onClickIcon: self.column.onClickIcon,
                
                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                },

                onSelect: function(value)
                {
                    if (!self.column.onSelect)
                        return;
                    self.column.onSelect.call(self, value);
                },
                onPopout: popoutFn,
                requirement: self.column.requirement
            });
            self.widget.cell = self;

            // if (self.widget.options.suggest)
            // {
            //     var suggest = self.widget.options.suggest;
            //     suggest.onSelect = function(value)
            //     {
            //         if (! self.column.onSelect)
            //             return;
            //         self.column.onSelect.call(self, value);
            //     }
            // }
            self.widget.createView();
        }
    });

    /*!
    ** A check box cell.
    **
    ** A cell containing a $<checkbox-control>.
    */
    var CheckboxCell = Cell.extend
    ({
        create: function()
        {
            var self = this;
            self._super.apply(this, arguments);

            self.widget = self.owner.IMu('checkbox-control',
            {
                onChange: function(value)
                {
                    self.changed(value);
                },
                
                onClickIcon: self.column.onClickIcon,

                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                },

                requirement: self.column.requirement
            });
            self.widget.cell = self;
            self.widget.createView();
        }
    });

    /*!
    ** A date cell.
    **
    ** A cell containing a $<date-control>.
    */
    var DateCell = Cell.extend
    ({
        create: function()
        {
            var self = this;
            self._super.apply(this, arguments);

            self.widget = self.owner.IMu('date-control',
            {
                picker: self.column.picker,

                onChange: function(value)
                {
                    self.changed(value);
                },

                onClickIcon: self.column.onClickIcon,

                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                },

                requirement: self.column.requirement
            });
            self.widget.cell = self;
            self.widget.createView();
        }
    })

    /*!
    ** An icon cell.
    **
    ** A cell containing an $<icon-control>.
    */
    var IconCell = Cell.extend
    ({
        create: function()
        {
            var self = this;
            self._super.apply(this, arguments);

            self.widget = self.owner.IMu('icon-control',
            {
                icons: self.column.icons,

                onClickIcon: this.column.onClickIcon,
                
                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                },

                requirement: self.column.requirement
            });
            self.widget.cell = self;
            self.widget.createView();
        }
    });

    /*!
    ** An integer cell.
    **
    ** A cell containing an $<integer-control>.
    */
    var IntegerCell = Cell.extend
    ({
        create: function()
        {
            var self = this;
            self._super.apply(this, arguments);
            
            self.widget = self.owner.IMu('integer-control',
            {
                onChange: function(value)
                {
                    self.changed(value);
                },

                onClickIcon: self.column.onClickIcon,
                
                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                },

                requirement: self.column.requirement,
            });
            self.widget.cell = self;
            self.widget.createView();
        }
    });

    /*!
    ** A number cell.
    **
    ** A cell containing a $<number-control>.
    */
    var NumberCell = Cell.extend
    ({
        create: function()
        {
            var self = this;
            self._super.apply(this, arguments);

            self.widget = self.owner.IMu('number-control',
            {
                onChange: function(value)
                {
                    self.changed(value);
                },

                onClickIcon: self.column.onClickIcon,
                
                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                },

                requirement: self.column.requirement
            });
            self.widget.cell = self;
            self.widget.createView();
        }
    });

    /*!
    ** A selection cell.
    **
    ** A cell containing a $<selection-control>.
    */
    var SelectionCell = Cell.extend
    ({
        create: function()
        {
            var self = this;
            self._super.apply(this, arguments);

            self.widget = self.owner.IMu('selection-control',
            {
                hint: self.column.hint,
                list: self.column.list,
                getAllLanguages: IMu.Config.getAllLanguages,

                onChange: function(value)
                {
                    self.changed(value);
                },

                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                },

                requirement: self.column.requirement
            });
            self.widget.cell = self;
            self.widget.createView();
        }
    });

    /*!
    ** A static cell.
    **
    ** A cell containing a $<static-control>.
    */
    var StaticCell = Cell.extend
    ({
        create: function()
        {
            var self = this;
            self._super.apply(this, arguments);

            self.widget = self.owner.IMu('static-control');
            self.widget.cell = self;
            self.widget.createView();
        }
    });

    /*!
    ** A text cell.
    **
    ** A cell containing a $<text-control>.
    */
    var TextCell = Cell.extend
    ({
        create: function()
        {
            var self = this;
            self._super.apply(this, arguments);


            self.widget = self.owner.IMu('text-control',
            {
                hint: self.column.hint,
                readonly: self.column.readonly,
                lines: self.column.lines,
                suggest: IMu.Object.copy(self.column.suggest),
                getAllLanguages: IMu.Config.getAllLanguages,
                
                onClickIcon: self.column.onClickIcon,
                
                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                },

                onChange: function(value)
                {
                    self.changed(value);
                },

                requirement: self.column.requirement
            });
            self.widget.cell = self;

            if (self.widget.options.suggest)
            {
                var suggest = self.widget.options.suggest;
                suggest.onSelect = function(value)
                {
                    if (! self.column.suggest ||
                    ! self.column.suggest.onSelect)
                        return;
                    self.column.suggest.onSelect.call(self, value);
                }
            }
            self.widget.createView();
        }
    });

    /*!
    ** A time cell.
    **
    ** A cell containing a $<time-control>.
    */
    var TimeCell = Cell.extend
    ({
        create: function()
        {
            var self = this;
            self._super.apply(this, arguments);

            self.widget = self.owner.IMu('time-control',
            {
                onClickIcon: self.column.onClickIcon,

                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                },

                requirement: self.column.requirement
            });
            self.widget.cell = self;

            self.widget.createView();
        }
    });
})();
