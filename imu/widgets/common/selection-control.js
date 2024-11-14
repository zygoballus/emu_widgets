/*!
** Selection (typically a drop-down list) control.
**
** @since 2.0
*/
IMu.Widgets.add('selection-control', 'control',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-selection-control');

        this.registerOptions
        ({
            /*!
            ** The source of the selection list to be displayed. 
            ** See the $<setList> method below for more information.
            */
            list: undefined,

            /*!
            ** This indicates whether we need to fetch other languages
            ** when we use autocomplete.
            */
            getAllLanguages: undefined

        });
    },

    createView: function()
    {
        if (! this._super.apply(this, arguments))
            return false;

        if (this.options.list)
            this.setList(this.options.list);

        return true;
    },

    /*!
    ** Set the list of values to be displayed.
    **
    ** The type of the ``data`` argument can be:
    **
    ** * *object*
    **
    **   This is the most flexible type of information. The *object*
    **   can contain the following properties:
    **
    **   * ``type`` (*string*)
    **
    **     The type of list being specified. Can be:
    **
    **     * **array**
    **     * **function**
    **     * **lookup**
    **
    ** * *array*
    ** 
    ** * *function*
    **
    ** * *string*
    */
    setList: function(data)
    {
        var info = this.getListInfo(data);
        switch (info.type)
        {
          case 'array':
            this.setArrayList(info);
            break;

          case 'function':
            this.setFunctionList(info);
            break;

          case 'lookup':
            this.setLookupList(info);
            break;

          default:
            this.setViewList([]);
            break;
        }
    },

    setArrayList: function(info)
    {
        var self = this;

        if (! IMu.Type.isArray(info.values))
        {
            self.setViewList([]);
            return;
        }
        self.setViewList(info.values);
    },

    setFunctionList: function(info)
    {
        var self = this;

        if (! IMu.Type.isFunction(info.code))
        {
            self.setViewList([]);
            return;
        }
        info.code.call(self, info, function(list)
        {
            self.setViewList(list);
        });
    },

    setLookupList: function(info)
    {
        var self = this;

        if (! IMu.Type.isString(info.name))
        {
            self.setViewList([]);
            return;
        }
        var name = info.name;

        var level = info.level;
        if (level === undefined)
            level = 0;

        var keys = undefined;
        if (IMu.Type.isArray(info.keys))
            keys = info.keys;

        var lookup = new IMu.Request.Lookup();
        if (self.options.getAllLanguages &&
            self.options.getAllLanguages == 1)
        {
            lookup.lookupAll(name, level, keys, function(list)
            {
                self.setViewList(list);
            });
        }
        else
        {
            lookup.lookup(name, level, keys, function(list)
            {
                self.setViewList(list);
            });
        }
    },

    setViewList: function(list)
    {
        if (this.view)
            this.view.setList(list);
    },

    /*!
    ** Selection-control level show validation.
    ** Called via the **validate( )** function.
    ** Uses information from validation to set an appropriate icon and tooltip.
    **
    ** @param info
    **   Information about the current state of the `selection-control` after
    **   validation.
    **   ``info.state`` is used to set the type of validation icon to be 
    **   displayed while ``info.details`` is used to set the tooltip and popup
    **   dialogue text.
    **
    ** @param callback function
    **   Returns control back to the previous function once validation has 
    **   concluded.
    */
    showValidationState: function(info, callback)
    {
        this.setIcon(info.state, info.details);
        callback();
    }
});
