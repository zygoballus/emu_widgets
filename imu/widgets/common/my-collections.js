/*!
** Allows a user to manage separate collections.
**
** @since 2.0
*/
IMu.Widgets.add('my-collections', 'base',
{
	_construct: function()
	{
		this._super.apply(this, arguments);
		this.classes.push('imu-my-collections');

		this.registerOptions
		({
            /*!
            ** Specifies whether an export button should be displayed.
            */
			showExport: false,

            /*!
            ** Specifies whether an image export button should be displayed.
            */
			showImageExport: false,

            /*!
            ** Specifies whether a label should be displayed.
            */
			showLabel: false,

            /*!
            ** The user has selected a different group.
            */
			onChangeGroup: undefined,

            /*!
            ** The user has requested the current group is to be exported.
            */
            onExportGroup: undefined,

            /*!
            ** The user has requested the images in the current group is 
            ** to be exported.
            */
            onExportImageGroup: undefined,

            /*!
            ** The user has requested that the current group is to be restored.
            **
            ** The ``group`` parameter is a simple JavaScript object which
            ** includes the following elements:
            **
            ** * ``name`` (*string*) The name of the group.
            ** * ``irn`` (*number*) The group's irn in the webgroups table.
            ** * ``entries`` (*array*) The set of records in the group.
            **       
            ** Each element in the ``entries`` array is a simple
            ** JavaScript object.
            **
            ** @param group object
            **   The group to be restored.
            */
			onRestoreGroup: undefined
		});
	},

	// public

	// view methods
    /*!
    ** Creates a new collection group.
    */
	addGroup: function()
	{
		IMu.User.addGroup();
	},

    /*!
    ** Exports columns in a collection group.
    */
	exportGroup: function()
	{
		if (this.options.onExportGroup)
			this.options.onExportGroup.call(this, IMu.User.group);
	},

    /*!
    ** Exports images in a collection group.
    */
    exportImageGroup: function()
    {
        if (this.options.onExportImageGroup)
            this.options.onExportImageGroup.call(this, IMu.User.group);
    },

    /*!
    ** Switch to the next collection group.
    */
	nextGroup: function()
	{
		IMu.User.nextGroup();
	},

    /*!
    ** Switch to the previous collection group.
    */
	previousGroup: function()
	{
		IMu.User.previousGroup();
	},

    /*!
    ** Removes a collection group.
    */
	removeGroup: function()
	{
		IMu.User.removeGroup();
	},

    /*!
    ** Changes the name of a collection group.
    */
	renameGroup: function(name)
	{
		if (name != IMu.User.group.name)
			IMu.User.renameGroup(name);
	},

    /*!
    ** Restores a collection group.
    */
	restoreGroup: function()
	{
		if (this.options.onRestoreGroup)
			this.options.onRestoreGroup.call(this, IMu.User.group);
	}

	// protected
});
