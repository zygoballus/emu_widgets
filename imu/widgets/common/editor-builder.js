/*!
 ** This widget will be used to populate an initially empty EMu column (attachment  column).
 **
 ** This will be done by matching data from source column (left) to data in a
 ** DIFFERENT destination column (right).
 **
 ** @since 2.0
 */

IMu.Widgets.add('editor-builder', 'base',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-editor-builder');

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
            ** Called when the current set of is to be update.
            */
            onFetchSource: undefined,

            /*!
            ** Called when the current set of is to be update.
            */
            onFetchDestination: undefined

        });

        this.pid = undefined;
        this.eid = undefined;
        /*!
         ** Javascript object to store details on the destination (left side).
         */
        this.destination = undefined;

        /*!
         ** Javascript object to store the details on the source (right side).
         */
        this.source = undefined;

        /*!
         ** string - backend field name where update should happen.
         */
        this.attachmentColumn = undefined;

        this.field = {};
    },

    _ready: function()
    {
        var self = this;

        self._super.apply(self, arguments);

        if (!self.options.method)
            throw new IMu.Error('NonWidgetMethod');

        if (self.options.method == 'replace')
        {
            if (!self.options.replaceField)
                self.field.type = 'text';

            var replaceField = self.options.replaceField;
            switch (IMu.Type.get(replaceField))
            {
                case 'string':
                    self.field.type = replaceField
                    break;
                case 'object':
                    for (var name in replaceField)
                        self.field[name] = replaceField[name];
                    break;
            }
        }
    },

    /*!
     ** Initialise the widget to set the required options
     **
     */
    configure: function(config)
    {
        var self = this;
        self.source.moduleHandler = undefined;
        self.source.terms = undefined;

        if (!config.sourceTable)
            throw new IMu.Error('NonsourceTable');
        if (!config.sourceColumn)
            throw new IMu.Error('NonSourceColumn');
        if (!config.attachmentColumn)
            throw new IMu.Error('NonAttachmentColumn');

        self.source.table = config.sourceTable;
        self.source.column = config.sourceColumn;

        self.attachmentColumn = config.attachmentColumn;

        if (self.options.method == 'attach')
        {
            if (!config.destinationColumn)
                throw new IMu.Error('NonDestinationColumn');
            if (!config.destinationTable)
                throw new IMu.Error('NondestinationTable');

            self.destination.table = config.destinationTable;
            self.destination.column = config.destinationColumn;
        }

        if (config.sourceTerms)
            self.source.terms = config.sourceTerms;
        if (config.destinationTerms)
            self.destination.terms = config.destinationTerms;
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
        var value = undefined;

        if (self.options.method == 'attach')
        {
            var destinationSelection = self.destination.selection[0];
            var destinationSelected = jQuery(destinationSelection).find(":selected");

            if (destinationSelected.length > 0)
            {
               value = parseInt(destinationSelected[0].value);
            }
        }
        else
        {
            value = self.destination.inputField.value;
            value = self.destination.inputField.getValue();
        }

        var sourceSelection = self.source.selection[0];
        var sourceSelected = jQuery(sourceSelection).find(":selected");

        if(sourceSelected.length > 0)
        {
            //var selectedOptions = sourceSelection.selectedOptions;

            keys = [];

            for (var i = 0; i < sourceSelected.length; i++) 
            {
                var values = sourceSelected[i].value; 
                keys = keys.concat(values.split(','));
            }
        }

        if (self.options.onUpdate)
        {
            self.options.onUpdate.call(this, keys, value, callback); 
        }
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
