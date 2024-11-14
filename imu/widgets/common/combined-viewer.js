/*!
** Allows a single result set to be displayed by more than one viewer.
**
** Different viewers are added using the $<add> method.
**
** @since 2.0
*/

/*!
** @example Create a combined-viewer widget which contains a list-viewer and
**  a details-viewer
**
** @code
**  var widget = $('#my-div').IMu('combined-viewer');
**  widget.add('list-viewer');
**  widget.add('details-viewer');
** @endcode
*/

/*!
** @example Create a widget as before and then switch to displaying the
**  details-viewer.
**
** @code
**  var widget = $('#my-div').IMu('combined-viewer');
**  widget.add('list-viewer');
**  widget.add('details-viewer');
**  widget.select(1); // index 1 is the second viewer
** @endcode
*/
IMu.Widgets.add('combined-viewer', 'viewer',
{
    _construct: function()
    {
        var self = this;

        this._super.apply(this, arguments);
        this.classes.push('imu-combined-viewer');

        this.list = [];
        this.selected = -1;

        IMu.Events.bind('false-match', function(name)
        {
            if (self.search)
                self.updateResultCount();
        });
    },

    /*!
    ** Adds one or more viewer sub-widgets to the combined-viewer widget.
    **
    ** The **what** parameter can be a:
    **
    ** * *string* the name of a viewer widget (e.g. 'list-viewer').
    ** * *object* a simple JavaScript object. The object can include:
    **
    **   * ``type`` (*string*) - the name of viewer widget
    **     (e.g. 'list-viewer')
    **   * ``icon`` (*string*) - the name of a file containing an icon to
    **     display
    **   * ``title`` (*string*) - the name of a multi-lingual string to
    **     display
    **
    ** * *array* an array. Each element of the array must be a simple
    **   JavaScript object as described above
    **
    ** @param what mixed
    **   Information describing the kind of viewer to be added.
    */
    add: function(what)
    {
        var self = this;

        var list;

        var type = IMu.Type.get(what);
        if (type == 'string')
            list = [ { type: what } ];
        else if (type == 'object')
            list = [ what ];
        else if (type == 'array')
            list = what;
        else
            throw new IMu.Error('CombinedViewerBadType', type);

        for (var i = 0; i < list.length; i++)
        {
            if (! list[i].type)
                throw new IMu.Error('CombinedViewerNoType', i);

            var item = {};
            item.type = list[i].type;

            item.icon = item.type;
            if (list[i].icon)
                item.icon = list[i].icon;

            item.title = item.type;
            if (list[i].title)
                item.title = list[i].title;

            item.elem = jQuery('<div/>');
            item.elem.addClass('item item-' + i); 
            item.elem.visible(false);

            var options = list[i].options || {};
            options.onRecordSelected = function(rid, offset)
            {
                self.recordSelected(rid, offset);
            };

            item.widget = item.elem.IMu(item.type, options);
            item.widget.controller = self;

            /* Override fixedHeight seeting to use
            ** the value on the combined-viewer itself
            */
            item.widget.fixedHeight = this.fixedHeight;

            this.list.push(item);
            if (this.selected < 0)
                this.selected = 0;
        }
    },

    /*!
    ** Selects the viewer to be displayed.
    **
    ** @param index integer
    **   The index of the view to be displayed. 
    **   The index is the order in which the viewers were added using ``add``.
    **
    ** @returns object
    **   The selected viewer widget.
    */
    select: function(index)
    {
        if (index < 0)
            return;
        if (index >= this.list.length)
            return;
        if (index == this.selected)
            return;

        var old = this.list[this.selected];
        var offset = old.widget.offset;
        IMu.log('going to offset {0}', offset);

        this.selected = index;
        this.view.select(index, offset);
        IMu.Events.trigger('imu-combined-viewer-view-selected', this.list[index]);

        return this.list[index];
    },

    // view methods
    recordSelected: function(rid, offset)
    {
        /* This is a bit of a hack. If the type of viewer is not
        ** a details-viewer then find a details-viewer and display
        ** record using it.
        */
        var item = this.list[this.selected];
        if (! item || ! item.type)
            return;
        if (item.type == 'details-viewer')
            return;
        var select = -1;
        for (var i = 0; i < this.list.length; i++)
        {
            var item = this.list[i];
            if (item.type == 'details-viewer')
            {
                select = i;
                break;
            }
        }
        if (select < 0)
            return;
        item = this.select(select);
        item.widget.setOffset(offset);
    },

    // protected
    destroySearch: function()
    {
        this._super();
    },

    dropSearch: function()
    {
        // Destroy search in all owned views
        for (var i = 0; i < this.list.length; i++)
        {
            this.list[i].widget.dropSearch();
        }

        // Destroy search in self
        this.destroySearch();

        // Clear the result count
        this.view.drawResultCount();
    },

    getOffset: function()
    {
        if (this.selected < 0 || this.selected >= this.list.length)
            return undefined;
        var item = this.list[this.selected];
        if (! item.widget)
            return undefined;
        return item.widget.getOffset();
    },

    setSearch: function(search)
    {
        this._super(search);
    },

    /*!
    ** Updates the module result count.
    */
    updateResultCount: function()
    {
        if (this.view.updateResultCount)
            this.view.updateResultCount();
    },

    updateSortSet: function(sortSet, flags, callback)
    {
        var self = this;
        
        if (typeof(flags) == 'function')
        {
            callback = flags;
            flags = [ ];
        }
        if (flags === undefined)
            flags = [ ];

        var offset = self.list[self.selected].widget.offset;
        self._super(sortSet, flags, function(result)
        {
            // This is quite magical in that we assume list index 0 is a list
            //   viewer.
            //
            // TODO: This behaviour needs reconsidering as resorting should
            //   not ALWAYS result in returning to the list/lightbox views.
            //
            self.view.select(0);
            self.selected = 0;

            if (callback && typeof(callback) == 'function')
                callback(result);
        });
    }
});
