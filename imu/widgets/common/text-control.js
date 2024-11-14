/*!
** Text input control.
**
** @since 2.0
*/
IMu.Widgets.add('text-control', 'box-control',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-text-control');

        this.registerOptions
        ({
            /*!
            ** The number of lines of input.
            */
            lines: 1,

            /*!
            ** The way to offer auto-complete suggestions.
            */
            suggest: undefined,

            /*!
            ** This indicates whether we need to fetch other languages 
            ** when we use autocomplete.
            */
            getAllLanguages: undefined
        });

        this.suggest = undefined;
    },

    // TODO: this works fine for English, though other languages have charaters
    // with values that do not play so nice!
    /*!
    ** Compares the value of this control against another `text-control` or 
    ** value.
    **
    ** Uses lowercase values to compare character value. If both lowercase 
    ** strings are identical, it then compares the non-converted values.
    **
    ** @returns result
    **   A value indicating the relationship between the strings.
    **   * < 0 - the first character that does not match has a lower value in this
    **   control than the comparison control/value.
    **   * = 0 - the contents of both strings are equal
    **   * > 0 - the first character that does not match has a greater value in 
    **   this control than the comparison control/value.
    **   * undefined - the values cannot be compared.
    */
    compare: function(otherValue)
    {
        this.getValue();
        if (otherValue.getValue)
            otherValue = otherValue.getValue();

        if (this.value == null && otherValue == null)
            return 0;
        else if (this.value == null || otherValue == null)
            // We do not know how to sort null/undefined.
            // Leave it to the caller (eg. a grid widget
            // where columns can specifiy how to sort these value)
            return undefined;

        if (this.value.toLowerCase() == otherValue.toLowerCase())
        {
            // lower case is identical, check with upper case
            if (this.value == otherValue)
                return 0;
            if (this.value < otherValue)
                return -1;
            if (this.value > otherValue)
                return 1;
        }
        else if (this.value.toLowerCase() < otherValue.toLowerCase())
            return -1;
        else if (this.value.toLowerCase() > otherValue.toLowerCase())
            return 1;
      
        // it shouldn't get to here
        return undefined;
    },

    getSuggest: function()
    {
        if (! this.suggest)
            this.suggest = this.getListInfo(this.options.suggest);
        return this.suggest;
    },

    getAutoSuggest: function(prefix, callback)
    {
        var suggest = this.getSuggest();
        switch (suggest.type)
        {
          case 'array':
            this.getArrayAutoSuggest(suggest, prefix, callback);
            break;

          case 'function':
            this.getFunctionAutoSuggest(suggest, prefix, callback);
            break;

          case 'lookup':
            this.getLookupAutoSuggest(suggest, prefix, callback);
            break;

          case 'records':
            this.getRecordsAutoSuggest(suggest, prefix, callback);
            break;

          default:
            callback([]);
            break;
        }
    },

    getArrayAutoSuggest: function(suggest, prefix, callback)
    {
        if (! IMu.Type.isArray(suggest.values))
        {
            callback([]);
            return;
        }
        var pattern = '^' + jQuery.ui.autocomplete.escapeRegex(prefix);
        var matcher = new RegExp(pattern, 'i');
        var list = [];
        for (var i in suggest.values)
        {
            var item = suggest.values[i];
            switch (IMu.Type.get(item))
            {
              case 'date':
              case 'number':
                var value = item.toString();
                if (matcher.test(value))
                    list.push(value);
                break;
              case 'object':
                if ('label' in item && matcher.test(item.label))
                    list.push(item);
                break;
              case 'string':
                if (matcher.test(item))
                    list.push(item);
                break;
            }
        }
        callback(list);
    },

    getFunctionAutoSuggest: function(suggest, prefix, callback)
    {
        var self = this;

        if (! IMu.Type.isFunction(suggest.code))
        {
            callback([]);
            return;
        }
        suggest.code.call(self, suggest, prefix, function(list)
        {
            callback(list);
        });
    },

    getLookupAutoSuggest: function(suggest, prefix, callback)
    {
        var self = this;

        if (! IMu.Type.isString(suggest.name))
        {
            callback([]);
            return;
        }
        var name = suggest.name;

        var level = suggest.level;
        if (level === undefined)
            level = 0;

        var keys = [];
        if (IMu.Type.isArray(suggest.keys))
            keys = suggest.keys.slice(0);
        while (keys.length < level)
            keys.push('');
        keys.push(prefix);

        var lookup = new IMu.Request.Lookup();
        /* TODO
        ** Should use onSuccess/onError (or onComplete)
        ** to ensure that the callback gets called under
        ** all circumstances (success or failure).
        */
        if (self.options.getAllLanguages &&
            self.options.getAllLanguages == 1)
        {
            lookup.lookupAll(name, level, keys, function(list)
            {
                callback(list);
            });
        }
        else
        {
            lookup.lookup(name, level, keys, function(list)
            {
                callback(list);
            });
        }
    },

    getRecordsAutoSuggest: function(suggest, prefix, callback)
    {
        if (! IMu.Type.isString(suggest.table))
        {
            callback([]);
            return;
        }
        var table = suggest.table;

        var column = suggest.column;
        if (column === undefined)
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
        terms.add(column, term);
        if (IMu.Type.isArray(suggest.terms))
        {
            var extra = suggest.terms;
            if (! IMu.Type.isArray(extra[0]))
                extra = [ extra ];
            for (var i = 0; i < extra.length; i++)
            {
                var triple = extra[i];
                terms.add(triple[0], triple[1], triple[2]);
            }
        }

        var maxValues = suggest.maxValues;
        if (maxValues === undefined)
            maxValues = -1;

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
        module.findTerms(terms, function(hits)
        {
            if (hits == 0)
            {
                callback([]);
                return;
            }
            module.fetch('start', 0, maxValues, ['irn', column], function(data)
            {
                var list = [];

                for (var i = 0; i < data.rows.length; i++)
                {
                    var item =
                    {
                        label: data.rows[i][column],
                        value: data.rows[i].irn
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

    doSelect: function(value)
    {
        var suggest = this.getSuggest();
        if (suggest.onSelect)
            suggest.onSelect.call(this, value);
    }
});
