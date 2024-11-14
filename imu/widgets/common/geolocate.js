/*!
 ** This widget will be used to search for and select a lat/long point
 ** given a Verbatim location.
 **
 ** Initially, we will use the tulane web service for results.
 **
 ** @since 2.0
 */

IMu.Widgets.add('geolocate', 'base',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('geolocate');

        this.registerOptions(
        {
            onlyEmpty: true,
            method: undefined,
            replaceField: undefined,
            editorOptions: undefined,

            /*!
            ** If true, show a control to allow the user to update the current
            ** set of edits.
            */
            showUpdate: true,

            /*!
            ** Called when the current set of is to be update.
            */
            onUpdate: undefined,

            /*!
            ** Called when the ws is queried.
            */
            onFetchSource: undefined,
            /*!
            ** Called when the IMu records are fetched.
            */
            onFetchDestination: undefined

        });

        this.pid = undefined;
        this.eid = undefined;

        /*!
         ** Javascript object to store the details on the source (right side).
         */
        this.source = undefined;
        this.destination = undefined;

        this.field = {};

        this.mapper = {};
        this.table = undefined;
        this.column = undefined;

        /*!
        ** pointSelected - gets events from the map to indicate
        ** which point is selected.
        */
        this.pointSelected = undefined;
    },

    _ready: function()
    {
        var self = this;

        self._super.apply(self, arguments);

        if (!self.options.method)
            throw new IMu.Error('NonWidgetMethod');
    },

    /*!
     ** Initialise the widget to set the required options
     **
     */
    configure: function(config)
    {
        var self = this;

        if (self.options.method == 'external')
        {
            self.source.url = config.sourceUrl;
        }
        if (config.sourceTerms)
            self.source.terms = config.sourceTerms;
        if (config.table)
            self.destination.table = config.table;
        if (config.column)
            self.destination.column = config.column;
        if (config.latColumn)
            self.destination.latColumn = config.latColumn;
        if (config.longColumn)
            self.destination.longColumn = config.longColumn;
        if (config.uncertainty)
            self.destination.uncertainty = config.uncertainty;
        if (config.uncertaintyUnit)
            self.destination.uncertaintyUnit = config.uncertaintyUnit;
    },
    
    /*!
    ** 
    */
    doFetchDestination: function(term,callback)
    {
        var self = this;

        if (self.options.onFetchDestination)
            self.options.onFetchDestination.call(this,term,callback);
    },

    /*!
    ** 
    */
    doFetchSource: function(term,callback)
    {
        var self = this;

        if(self.options.onFetchSource)
            self.options.onFetchSource.call(this,term,callback);
    },

    /*!
    **
    */
    doUpdate: function (callback)
    {
        var self = this;
        var keys = undefined;
        var values = {};

        var destinationSelection = self.destination.selection[0];
        var destinationSelected = jQuery(destinationSelection).find(":selected");

        if (destinationSelected.length > 0)
        {
           keys = parseInt(destinationSelected[0].value);
        }

        var sourceSelection = self.pointSelected;
        if (self.destination.longColumn)
            values[self.destination.longColumn] = [[sourceSelection.x]];
        if (self.destination.latColumn)
            values[self.destination.latColumn] = [[sourceSelection.y]];
        if (self.destination.uncertainty)
        {
            values[self.destination.uncertainty] = sourceSelection.uncertainty;
            values[self.destination.uncertaintyUnit] = 'meters';
        }
        values.table = self.destination.table;

        if (self.options.onUpdate)
        {
            self.options.onUpdate.call(this, keys, values, callback); 
        }
    },

    /*!
    **
    */
    createNew: function(callback)
    {
        var self = this;
        var sourceSelection = self.pointSelected;
        var values = {};

        if (self.destination.longColumn)
            values[self.destination.longColumn] = [[sourceSelection.x]];
        if (self.destination.latColumn)
            values[self.destination.latColumn] = [[sourceSelection.y]];
        if (self.destination.uncertainty)
        {
            values[self.destination.uncertainty] = sourceSelection.uncertainty;
            values[self.destination.uncertaintyUnit] = 'meters';
        }
        if (self.destination.verbatim)
            values[self.destination.verbatim] = self.search;

        var module = new IMu.Request.Module(self.destination.table);
        module.insert(values,['irn','SummaryData'],callback);

    },

    /*!
    ** Editor-builder level validation.
    **
    ** Creates an ``info`` object containing ``state`` and ``details`` of the 
    ** `editor-builder`.
    **
    ** At this point there is no validation designed for this widget, so this
    ** is a place holder.
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
    // end interface

    /*!
    ** Editor-builder level built-in validation.
    ** Called via the **validate( )** function.
    **
    ** There is no validation for this widget yet.
    **
    ** @param info
    **   Information about the current state of the `editor-builder`.
    **   At this point ``info.state`` should be **ok** and ``info.details``
    **   should be an empty array.
    **
    ** @param callback function
    **   Returns control back to the previous function once validation has
    **   concluded.
    */
    doBuiltinValidation: function(info, callback)
    {
        // TODO
        callback();
    },
    
    /*!
    ** Editor-builder level custom validation.
    ** Called via the **validate( )** function.
    **
    ** This has not been developed yet. Further planning is needed.
    **
    ** @param info
    **   Information about the current state of the `editor-builder` after validation.
    ** 
    ** @param callback function
    **   Returns control back to the previous function once validation has
    **   concluded.
    */
    doCustomValidation: function(info, callback)
    {
        // TODO
        callback();
    },

    /*!
    ** Editor-builder level show validation.
    ** Called via the **validate( )** function.
    **
    ** This has not been developed yet. Further planning is needed.
    **
    ** @param info
    **   Information about the current state of the `editor-builder` after validation.
    ** 
    ** @param callback function
    **   Returns control back to the previous function.
    */
    showValidationState: function(info, callback)
    {
        // TODO
        callback();
    }
});
