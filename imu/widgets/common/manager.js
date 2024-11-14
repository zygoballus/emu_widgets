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

IMu.Widgets.add('manager', 'base',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-manager');

        this.registerOptions
        ({
            /*!
            ** The label used on the add button (if shown).
            */
            addLabel: 'manager-add',

            /*!
            ** The string displayed as a heading.
            */
            heading: undefined,

            /*!
            ** Should an add button be shown to allow a new entry to be added
            ** to the list.
            */
            showAdd: false,

            /*!
            ** Called when the user has asked to add to the list.
            */
            onAdd: undefined,

            /*!
            ** Called when an entry is selected for editing.
            */
            onEdit: undefined,

            /*!
            ** Called when an entry is selected for removal.
            */
            onRemove: undefined,

            /*!
            ** Called when an entry is selected for use.
            */
            onUse: undefined
        });

        this.list = [];
        this.selected = undefined;
    },

    setList: function(list)
    {
        this.list = [];
        for (var i in list)
        {
            var item = IMu.Object.copy(list[i]);
            this.list.push(item);
        }
        if (this.view)
            this.view.update();
    },

    // view
    doAdd: function()
    {
        if (this.options.onAdd)
            this.options.onAdd.call(this);
    },

    doEdit: function(item)
    {
        this.selected = item;
        if (this.options.onEdit)
            this.options.onEdit.call(this, item);
    },

    doRemove: function(item)
    {
        this.selected = item;
        if (this.options.onRemove)
            this.options.onRemove.call(this, item);
    },

    doUse: function(item)
    {
        this.selected = item;
        if (this.options.onUse)
            this.options.onUse.call(this, item);
    }
});
