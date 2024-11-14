(function(theme)
{
    theme.views.register('form',
    {
        _source: 'shared/common/form',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.table = undefined;
            },

            _create: function()
            {
                this._super.apply(this, arguments);

                this.table = this.widget.owner.child('table');
                this.create();
            },

            create: function()
            {
                this.table.empty();

                var layout = this.widget.getLayout();
                for (var i = 0; i < layout.rows.length; i++)
                {
                    var row = layout.rows[i];

                    var tr = this.table.child('tr', 'row');
                    tr.addClass('row-' + (i + 1));

                    for (var j = 0; j < row.fields.length; j++)
                    {
                        var field = row.fields[j];
                        var column = layout.columns[j];

                        var label = undefined;
                        if (column.labels)
                        {
                            label = tr.child('td', 'label');
                            label.addClass('label-' + (j + 1));
                            if (field)
                            {
                                if (field.css)
                                    label.addClass('label-' + field.css);
                                if (field.label)
                                    label.text(IMu.string(field.label) + ':');
                            }
                        }

                        var input = tr.child('td', 'input');
                        input.addClass('input-' + (j + 1));
                        if (field)
                        {
                            if (field.css)
                                input.addClass('input-' + field.css);

                            if (field.columnSpan && field.columnSpan > 1)
                            {
                                /* Translate the field's high-level columnSpan
                                ** into a low-level table colspan. This is a
                                ** little tricky. A logical column
                                ** (potentially) includes both the label and
                                ** the input so the colspan must take both of
                                ** these into account.
                                */
                                var colspan = 1;
                                for (var k = j + 1; k < field.columnSpan; k++)
                                {
                                    if (k >= layout.columns.length)
                                        break;
                                    if (layout.columns[k].labels)
                                        colspan++;
                                    colspan++;
                                }
                                if (colspan > 1)
                                    input.attr('colspan', colspan);
                            }

                            if (field.rowSpan && field.rowSpan > 1)
                            {
                                /* Translate the field's high-level rowSpan
                                ** into a low-level table rowspan. This is a
                                ** not as tricky as for columnSpan.
                                */
                                var rowspan = 1;
                                for (var k = 1; k < field.rowSpan; k++)
                                {
                                    if (k + i >= layout.rows.length)
                                        break;
                                    rowspan++;
                                }
                                if (rowspan > 1)
                                    input.attr('rowspan', rowspan);
                            }
                            var wrapper = input.child('div', 'wrapper');
                            field.create(wrapper);
                        }
                    }
                }
            }
        }
    });
})(IMu.Themes.shared);
