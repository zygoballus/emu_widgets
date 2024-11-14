/*!
**
**
** @since 2.0
*/

/*!
** @example
*/

/*!
** @example
*/

/*!
** @example
*/

IMu.Widgets.add('editor-designer', 'designer',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-editor-designer');

        this.registerOptions
        ({

        });
    },

    getDesigner: function()
    {
        return this.getEditor();
    },

    /*!
    ** Gets the object representing the current editor.
    **
    ** @returns object
    **   A simple object representing the editor.
    */
    getEditor: function()
    {
        if (this.view)
            return this.view.getEditor();
        return undefined;
    },

    /*!
    ** Creates a new (empty) editor
    */
    newEditor: function()
    {
        if (this.view)
            this.view.newEditor();
    },

    setDesigner: function(id,editor)
    {
        this.setEditor(id,editor)
    },

    /*!
    ** Sets the editor to be edited. The editor should be a simple
    ** object.
    **
    ** @param editor object
    **   The representation of the editor.
    */
    setEditor: function(id, editor)
    {
        this.id = id;
        if (this.view)
            this.view.setEditor(editor);
    },
    // end interface
    
    /*!
    ** Editor-designer level built-in validation.
    ** Called via the **validate( )** function.
    **
    ** The details, source and destination sections are all `form` widgets.
    ** The `editor-designer` progresses throug heach of these, validating them.
    ** After a section has been validated, its details are added to 
    ** ``info.details``.
    **
    ** ``info.state`` will be updated if a section's validation state is worse.
    ** The ranking of states from best to worst is as follows:
    ** 1) ok
    ** 2) empty
    ** 3) invalid
    **
    ** Once all sections have been validated, control is returned to the 
    ** **validate( )** function.
    **
    ** @param info
    **   Information about the current state of the ``editor-designer``.
    **   At this point is ``info.state`` should be **ok** and ``info.details``
    **   should be an empty array.
    **
    ** @param callback function
    **   Returns control back to the previous function once validation has
    **   concluded.
    */
    doBuiltinValidation: function(info, callback)
    {   
        var self = this;

        var numValidated = 0;
        var sections = 
            [ self.view.details, self.view.source, self.view.destination ];
        var length = sections.length;

        for (var i = 0; i < length; i++)
        {
            var section = sections[i];
            section.validate(function(result)
            {
                if (result.state != 'ok')
                {
                    self.updateValidationState(info, result.state);
                    info.details = info.details.concat(result.details);
                }
                if (++numValidated == length)
                    callback();
            });
        }
    }
});
