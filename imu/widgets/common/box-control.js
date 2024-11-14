IMu.Widgets.add('box-control', 'control',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-box-control');

        this.registerOptions
        ({
            /*!
            ** If **true**, causes the **validate( )** function to be called 
            ** when the user presses the ``Enter`` key.
            */
            validateOnEnter: false,

            /*!
            ** Called when the user has pressed the ``Enter`` key.
            */
            onEnter: undefined
        });
    },
    // end interface

    doEnter: function()
    {
        if (this.options.onEnter)
            this.options.onEnter.call(this);
        else if (this.options.validateOnEnter)
            this.validate();
    },
       
    /*!
    ** Box-control level show validation.
    ** Called via the **validate( )** function.
    ** Uses information from validation to set an appropriate icon and tooltip.
    **
    ** @param info
    **   Information about the current state of the `box-control` after validation.
    **   ``info.state`` is used to set the type of validation icon to be
    **   displayed while ``info.details`` is used to set the tooltip and popup
    **   dialogue text.
    **
    ** @param callback function
    **   Returns control back to the previous function once icons have been set.
    */
    showValidationState: function(info, callback)
    {
        this.setIcon(info.state, info.details);
        callback();
    }
});
