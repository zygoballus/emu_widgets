/*!
** Allows the user to take a picture from the camera or use an exsiting image (phone/desktop)
** Once loaded the user can set zoom state, and add/edit polygons.
** Please look at the image-control help to see how to use the setValue method.
** @since 2.0
*/

/*!
** @example Create an image capture control which will in turn add the image-control
** widget too.
**
** @code
**     var imageControl = $('#image-capture-control').
**     IMu('image-capture-control',{
**     });
** @endcode
*/

/*!
** @example Create an image capture control which will in turn add the image-control
** widget too.
**
** By default the height of the image-control is set to 400px. setting the imageControlHeight will
** set a new height for the image-control.
**
** @code
**     var imageControl = $('#image-capture-control').
**     IMu('image-capture-control',{
**          imageControlHeight : 300
**     });
** @endcode
*/

IMu.Widgets.add('image-capture-control', 'control',
{

    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-image-capture-control');

        this.registerOptions(
        {
            allowMultiple: false,
            onChange: undefined,

            imageControlHeight: undefined,

            /*!
            ** If captureOnly is set to true, the control cannot be used to 
            ** display existing records.
            ** This conceptually separates the widget from its parent, allowing
            ** the possibility for displaying of saved records in the 
            ** image-control and images yet-to-be-saved in this control.
            */
            captureOnly: false
        });

        /*!
        ** The base64 encoded image string. this is set by the view when it reads the image file
        ** from the phone camera or exsisiting image.
        */
        this.encodedImage = undefined;

        /*!
        ** The file name of the image, this is used when creating a new multimedia record.
        */
        this.fileName = undefined;

        /*!
        ** The image control widget.
        */
        this.imageControl = undefined;

        this.images = [];

        /*!
        ** Called when the value of the control has changed.
        */
        onChange: undefined
    },

    _ready: function()
    {

        var self = this;

        self._super.apply(self, arguments);

    },

    /*
    ** Called by the view when the control's value has changed.
    */
    doChange: function()
    {
        this.value = this.getValue();
        if (this.options.onChange)
            this.options.onChange.call(this, this.value);
    },

    getSortableValue: function()
    {
        return null;
    },

    /*!
    ** Get the current state of the captured image.
    ** This is wrapper around the Image control getValue. 
    **
    ** @returns object       
    **      Will return the state (x,y and zoom)
    **      any polygon coordinates
    **      and encodedImage string
    */
    getValue: function()
    {
        var self = this;

        var values = {};

        if (self.imageControl)
            values = self.imageControl.getValue();

        //if (self.fileName)
        //    values.name = self.fileName;

        return values;
    },

    /*!
    ** Normalise the data passed in 
    ** and load an Image from URL or IRN deppending
    ** This is a wrapper around the image control setValue
    **
    ** @param data object       
    **
    */
    setValue: function(data)
    {
        if(! this.imageControl)
            return;

        if (this.options.captureOnly)
            this.imageControl.setValue([]);
        else
            this.imageControl.setValue(data);
    }
});
