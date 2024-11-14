/*!
** The base for all IMu widgets.
**
** @since 2.0
*/
IMu.Widgets.add('base', 
{
    _construct: function(name)
    {
        var self = this;

        self.name = name;

        self.owner = undefined;
        self.classes =
        [
            'imu-widget',
            'imu-view'      // for backwards-compatibility
        ];

        self.registerOptions
        ({
            /*!
            ** If the widget creates a request this is the default context it
            ** should use.
            */
            defaultContext: undefined,

            /*!
            ** If the widget creates a request this is the default port it
            ** should use.
            */
            defaultPort: undefined,

            /*!
            ** A name for the widget.
            */
            name: undefined,

            /*!
            ** How should the owner's height be affected by the widget
            ** contents? Valid values are:
            **
            ** * dynamic
            **   The owner's height will be allowed to vary depending on the
            **   widget's content.
            **
            ** * fixed
            **   The owner's height will always be maintained.
            **
            ** * guessed
            **   The value will be guessed depending on the height of the
            **   owner element when the widget is first created.
            **
            ** Note: Not all widgets honour this setting!
            */
            ownerHeight: IMu.Config.widgetOwnerHeight,

            /*!
            ** Allow the widget to save its current state into the page's URL.
            */
            useURL: false
        });

        self.parent = undefined;
        self.children = [];

        self.id = undefined;

        self.view = undefined;

        self.sequence = false;

        /* Is this widget controlled by another?
        */
        self.controller = undefined;

        IMu.Events.bind('collection-changed', function()
        {
            self.collectionChanged();
        });
    },

    _ready: function()
    {
    },

    /*!
    ** Show that there is a delay in the widget.
    */
    beginDelay: function(maxHeight, maxWidth)
    {
        if (this.view)
            this.view.beginDelay();
    },

    /*!
    ** Creates a new widget and attaches it as a child of the current widget.
    **
    ** @param name string
    **   The type of the widget to be created.
    **
    ** @param options object
    **   Any options to pass to the newly created child widget.
    **
    ** @returns widget
    **   The newly created child widget.
    */
    createChild: function(name, options)
    {
        var object = IMu.Widgets.create(name, options);
        object.setParent(this);
        this.children.push(object);
        return object;
    },

    /*!
    ** Builds (or re-builds) the widget, appying the the current theme.
    */
    createView: function()
    {
        IMu.log('{0}: createView: applying sequence {1} - my sequence {2}',
            this.id, IMu.Widgets.sequence, this.sequence);
            
        if (this.sequence !== undefined && this.sequence >= IMu.Widgets.sequence)
            return false;
        this.sequence = IMu.Widgets.sequence;
        this.owner.setLang();

        if (this.view)
            this.view.destroy();

        IMu.log('createView: creating {0}', this.name);

        var requires = {base: true};
        this.getRequires(requires, this.name);
        IMu.log('createView: requires {0}', requires);

        var methods = [];
        this.getMethods(methods, requires, IMu.Themes.shared);
        this.getMethods(methods, requires, IMu.Themes.current);

        var klass = IMu.Class.create.apply(IMu.Class, methods);
        this.view = new klass(this);
        this.view._create();

        IMu.Events.trigger(this.name + '-view-created', this);
        return true;
    },

    /*!
    ** Removes any control showing there is a delay.
    */
    endDelay: function()
    {
        if (this.view)
            this.view.endDelay();
    },

    /*!
    ** Allows the widget to resize itself.
    */
    resize: function()
    {
        if (this.view)
            this.view.resize();
    },

    /*!
    */
    restyle: function()
    {
        if (this.view)
            this.view.restyle();
    },

    /*!
    */
    showView: function()
    {
        if (! this.view)
            return false;
        if (this.view)
            this.view.resize();
        return true;
    },
    
    // protected methods
    collectionChanged: function()
    {
        if (this.view)
            this.view.collectionChanged();
    },

    // view methods

    // private
    getMethods: function(methods, requires, theme)
    {
        for (var name in requires)
        {
            if (! (name in theme.views.set))
                continue;
            for (var i = 0; i < theme.views.set[name].methods.length; i++)
                methods.push(theme.views.set[name].methods[i]);
        }
    },

    getRequires: function(requires, name)
    {
        if (name in IMu.Themes.shared.views.set)
        {
            for (var base in IMu.Themes.shared.views.set[name].requires)
                this.getRequires(requires, base);
        }
        if (name in IMu.Themes.current.views.set)
        {
            for (var base in IMu.Themes.current.views.set[name].requires)
                this.getRequires(requires, base);
        }
        requires[name] = true;
    },

    setOwner: function(owner)
    {
        this.owner = owner;
        for (var i = 0; i < this.classes.length; i++)
            this.owner.addClass(this.classes[i]);
        this.owner.addClass('owner');

        /* Allocate an id.
        ** Use the HTML element id if there is one.
        */
        this.id = this.owner.attr('id');

        if (this.id)
            jQuery.registerId(this.id);
        else
            this.id =jQuery.allocateId(this.name);
    },

    setParent: function(parent)
    {
        this.parent = parent;
    }
});
