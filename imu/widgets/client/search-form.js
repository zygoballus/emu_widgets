/*!
** @since 2.0
*/
IMu.Widgets.add('search-form', 'search-form',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-search-form');

        this.registerOptions
        ({
            /*!
            ** Specifies if a search button should be added.
            */
            showSubmit: true,

            /*!
            ** Specifies that an "Only items with images" prompt
            ** should also be shown.
            */
            onlyItemsWithImages: true,
            onlyItemsOnDisplay: false,
            onSearch: undefined,

            buttonClass: undefined,
            promptClass: undefined,
            inputClass: undefined
        });
        
        this.imagesOnly = false;
        this.onDisplay = false;

        this.fields = [];

        this.museumLocationList;
    },

    hideGroups: function(groups)
    {
        var self = this;
        self.setGroupsVisibility('hide', groups);
    },

    showGroups: function(groups)
    {
        var self = this;
        self.setGroupsVisibility('show', groups);
    },
    
    /* Private
    */
    setGroupsVisibility: function(visibility, groups)
    {
        var self = this;

        if (! self.fields)
            return;

        if (typeof(groups) === 'string')
            groups = [groups];
        else if (typeof(groups) !== 'object')
            return;

        for (var i = 0; i < groups.length; i++)
        {
            var group = groups[i];

            for (var j = 0; j < self.fields.length; j++)
            {
                var field = self.fields[j];

                if (field.row.hasClass("group-" + group))
                {
                    if (visibility == 'show')
                        field.row.show();
                    else if (visibility == 'hide')
                    {
                        if (! IMu.URL.Hash.get(field.column) && field.input)
                            field.input.val('');
                        field.row.hide(); 
                    }
                }
            }
        }
    },

    /*!
    ** Gets the search terms from each of the fields.
    */
    getTerms: function()
    {
        var terms = new IMu.Terms();

        for (var i = 0; i < this.fields.length; i++)
        {
            var field = this.fields[i];

            if (! field.column)
                continue;
            if (! (field.input || field.control))
                continue;
            var value;
            if (field.input)
                value = field.input.val();
            else if (field.control)
                value = field.control.getValue();
            if (value == '')
                continue;

            if (field.type == 'selection')
                terms.add(field.column, value, '=');
            else
                terms.add(field.column, value);
        }

        if (this.options.onlyItemsOnDisplay)
        {
            if (this.onDisplay)
            {
                var displaySet = terms.addTerms('or');
                for( var i = 0; i < this.museumLocationList.length-1; i++)
                {
                    if(this.museumLocationList[i].indexOf("|") != -1)
                    {
                        var values = this.museumLocationList[i].toLowerCase().split("|");
                        if (!(values[1].indexOf('collection storage') != -1))
                        {
                            displaySet.add('CatStorageID', values[0]);
                        }
                    }
                }
            }
        }
        return terms;
    }
});

