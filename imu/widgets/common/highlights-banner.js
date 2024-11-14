/*
 ** TODO: highlights-banner documentation
 ** TODO: allow stickyContent to have logo/image and use title as hover text
 ** TODO: onclick functionality option as alternative to linkFormat
 **
 ** @since 2.0
 */
IMu.Widgets.add('highlights-banner', 'base',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-highlights-banner');

        this.registerOptions
        ({
            /*! Setting this to false prevents the widget
            **  from loading data from the database.
            **  This allows the developer to instead
            **  set the values they want at the time of
            **  instantiation or other.
            */
            loadNarrative: true,

            /*! The format of the links that the widget is to create
            **  for each slide.
            **  When the highlights-banner creates the link it will
            **  use IMu.Format.formatParams to substitute in the
            **  appropriate values.
            **  The default order of values to be passed to the format
            **  function is module then irn.
            **  This allows the developer to set this value to something
            **  like: "[..]/#details={0}.{1}".
            */
            linkFormat: undefined
        });
        
        this.columns =
        [
            'irn',
            'narratives=HieChildNarrativesRef_tab',
            'NarNarrative',
            'title=NarTitle'
        ];

        this.relObjColumns =
        [
            'irn',
            'image.SupUsage_nesttab',
            'title=TitMainTitle',
            'date=CreDateCreated',
            'place=' +
            '[' +
            '   CreCreationPlace1_tab,' +
            '   CreCreationPlace2_tab,' +
            '   CreCreationPlace3_tab,' +
            '   CreCreationPlace4_tab,' +
            '   CreCreationPlace5_tab,' +
            ']'
        ];
    },

    _ready: function()
    {
        if (! this.options.loadNarrative)
            return;
        
        if (this.relObjColumns.length)
        {
            /* Format relatedObjects columns
            */
            var objects = 'objects=ObjObjectsRef_tab.('
                        + this.relObjColumns.join(', ') + ')';
            this.columns.push(objects);
        }

        delete this.objColumns;

        this.load();
    },

    load: function()
    {
        var self = this;
        var info = undefined;

        IMu.Events.bind('highlights-banner-view-created', function(e, widget)
        {
            if (widget === self && info !== undefined)
            {
                if (info === null)
                    self.view.showLoadError('no-narrative-found');
                else
                {
                    self.view.makeStickyContent(data.title, data.NarNarrative,
                    {
                        'ecatalogue': data.objects || [],
                        'enarratives': data.narratives || []
                    });
                    self.view.makeDynamicContent(data.objects);
                }
            }
        });

        var terms = new IMu.Terms();
        terms.add('DesPurpose', "imu-highlights-banner", '=');

        var request = new IMu.Request.Module('enarratives');
        request.findTerms(terms, function(result, success)
        {
            if (result == 0)
            {
                info = null;
                if (self.view)
                    self.view.showLoadError('no-narrative-found');
                // else wait for view-created event above.
                
                return;
            }
            else
            {
                request.fetch('end', 0, 1, self.columns, function(result)
                {
                    if (! result || !result.count)
                    {
                        info = null;
                        if (self.view)
                            self.view.showLoadError();
                        // else wait for view-created event above.
                        
                        return;
                    }
                    
                    var data = result.rows[0];
                    for (var i = 0; i < data.objects.length; i++)
                    {
                        if (! data.objects[i])
                        {
                            data.objects.splice(i, 1);
                            i--;
                        }
                        else
                            data.objects[i].module = 'ecatalogue';
                    }

                    self.view.makeStickyContent(data.title, data.NarNarrative,
                    {
                        'ecatalogue': data.objects || [],
                        'enarratives': data.narratives || []
                    });
                    self.view.makeDynamicContent(data.objects);
                    
                    self.view.endDelay();
                });
            }
        });
        request.onError = function(response, success)
        {
            self.view.showLoadError(response.id.toLowerCase());
        };
    },

    setValues: function(data)
    {
        var self = this;

        if (self.view)
        {
            self.view.beginDelay();

            if (data)
            {
                self.view.makeStickyContent(data.title, data.NarNarrative,
                {
                    'ecatalogue': data.objects || [],
                    'enarratives': data.narratives || []
                });
                self.view.makeDynamicContent(data.objects);
            }
            else
                self.view.showLoadError();
            
            self.view.endDelay();
            return;
        }

        IMu.Events.bind('highlights-banner-view-created', function(e, widget)
        {
            if (widget !== self)
                return;

            self.view.beginDelay();

            if (data)
            {
                self.view.makeStickyContent(data.title, data.NarNarrative,
                {
                    'ecatalogue': data.objects || [],
                    'enarratives': data.narratives || []
                });
                if(data.objects)
                    self.view.makeDynamicContent(data.objects);
            }
            else
                self.view.showLoadError();

            self.view.endDelay();
        });
    }
});
