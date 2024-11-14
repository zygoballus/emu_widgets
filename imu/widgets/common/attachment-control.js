/*!
** Text input control.
**
** @since 2.0
*/
IMu.Widgets.add('attachment-control', 'box-control',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-attachment-control');

        this.registerOptions
        ({
            /*!
            ** Optional column to bring back to display (fall back to SummaryData).
            */
            column: undefined,

            /*!
            ** Optional columns to use for searching (fall back to SummaryData).
            */
            searchColumns: undefined,

            /*!
            ** The max limit to use in the findTerms call.
            */
            matchLimit: undefined,

            /*!
            ** The min number of letters before auto-complete starts.
            */
            minLength: 2,

            /*!
            ** The table attahcment control links to.
            */
            table: undefined,

            /*!
            ** Additional terms to use when getting list of suggested records.
            */
            terms: undefined,

            /*!
            ** Called when input box is double-clicked.
            ** Inserting mostly to pop-out secondary forms.
            */
            onPopout: undefined,

            /*!
            ** Called when an item from auto-complete is selected.
            */
            onSelect: undefined,

            /*!
            ** Data 'Ref' column. Used to link other attachment controls.
            */
            dataColumn: undefined

        });

        this.irn = undefined;
    },

    _ready: function()
    {
        var self = this;

        self._super.apply(self, arguments);

        if (! self.options.table)
            throw new IMu.Error('NonWidgetTable');
    },

    /*!
    ** Gets the current value of the control.
    **
    ** @returns mixed
    **   The control's current value.
    */
    getValue: function()
    {
        if (this.view)
            this.value = this.view.getValue();

        if (this.irn !== undefined)
            return this.irn;
        return undefined;
    },

    setValue: function(value, callback)
    {
        var self = this;
        
        if (value === null || value == '')
        {
            self.view.setValue(null);
            self.irn = null;
            return;
        }
        if (value === undefined)
        {
            self.view.setValue(undefined);
            self.irn = undefined;
            return;
        }
        var table = this.options.table;
        var matchLimit = this.options.matchLimit;

        var column = this.options.column;
        if (column === undefined)
            column = 'SummaryData';

        var terms = new IMu.Terms();
        terms.add('irn', value);
        var module = new IMu.Request.Module(table);
        if (IMu.Login.info)
        {
            module.port = IMu.Login.info.port;
            module.context = IMu.Login.info.context;
        }

        module.findTerms(terms, function(hits)
        {
            if (hits == 0)
            {
                if (callback)
                    callback([]);
                return;
            }
            module.fetch('start', 0, 1, ['irn', column], function(data)
            {
                self.irn = data.rows[0].irn
                if(self.view)
                    self.view.setValue(data.rows[0][column]);
            });
        });
    },

    //private

    getAttachmentAutoSuggest: function(prefix, callback)
    {
        var table = this.options.table;
        var matchLimit = this.options.matchLimit;

        var columns = this.options.searchColumns;
        if (columns === undefined)
        {
            /* Check column parameter for backwards compatibility
            */
            columns = [this.options.column];
            if (columns === undefined)
                columns = ['SummaryData'];
        }
        var column = this.options.column;
        if (! column)
            column = 'SummaryData';

        var term = prefix.replace(/^\s+/, '');
        if (term.match(/\s$/))
            term = term.replace(/\s+$/, '');
        else
            term = term + '\\*';
        if (term == '')
        {
            callback([]);
            return;
        }

        /* Do as phrase.
        */
        term = '\\"' + term + '\\"';

        var terms = new IMu.Terms();
        if (columns.length == 1)
        {
            terms.add(columns[0], term);
        }
        else
        {
            var orTerms = terms.addOr();
            for (var i = 0; i < columns.length; i++)
            {
                orTerms.add(columns[i], term);
            }
        }
        if (IMu.Type.isArray(this.options.terms))
        {
            var extra = this.options.terms;
            if (! IMu.Type.isArray(extra[0]))
                extra = [ extra ];
            for (var i = 0; i < extra.length; i++)
            {
                var triple = extra[i];
                terms.add(triple[0], triple[1], triple[2]);
            }
        }

        /* TODO
        ** Should use onSuccess/onError (or onComplete)
        ** to ensure that the callback gets called under
        ** all circumstances (success or failure).
        */
        var module = new IMu.Request.Module(table);
        if (IMu.Login.info)
        {
            module.port = IMu.Login.info.port;
            module.context = IMu.Login.info.context;
        }

        var options = {};
       	if(matchLimit)
            options.matchLimit = matchLimit;
        else
            options = undefined;

       
        module.findTerms(terms, options, function(hits)
        {
            if (hits == 0)
            {
                callback([]);
                return;
            }
            module.fetch('start', 0, -1, ['irn','SummaryData', column], function(data)
            {
                var list = [];

                for (var i = 0; i < data.rows.length; i++)
                {
                    var item =
                    {
                        label: data.rows[i][column],
                        irn: data.rows[i].irn
                    }
                    list.push(item);
                }
                list.sort(function(a, b)
                {
                    if (a.label < b.label)
                        return -1;
                    if (a.label > b.label)
                        return 1;
                    return 0;
                });

                callback(list);
            });
        });
    },
    
    //view
    doSelect: function(value)
    {
        if (this.options.onSelect)
            this.options.onSelect.call(this, value);
    },
    doPopout: function(value)
    {
        if (this.options.onPopout)
            this.options.onPopout.call(this, value);
    }
});
