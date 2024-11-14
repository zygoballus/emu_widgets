/*!
 * Displays EMu records at random.
 *
 * @since 2.0
*/
(function()
{
    IMu.Widgets.add('explore', 'base',
    {
        _construct: function()
        {
            var self = this;
            
            self._super.apply(self, arguments);
            self.classes.push('imu-explore');

            self.registerOptions(
            {
                module: 'ecatalogue',

                loadOn: 'click',
                showHeader: false,
                showSidebar: false,

                /*!
                ** If **true** includes a control to allow the record to be selected.
                ** When selected the record is added to the user's current
                ** collection.
                */
                showSelectionControl: IMu.Config.showSelectionControls,

                onRecordToggled: undefined
            });

            self.busy = false;
            self.search = undefined;
            self.hits = undefined;
            self.terms = undefined;
            self.offset = 0;

            self.noColumns = 0;
            self.columns = [];

            self.maximumFetchCount = 10;
            self.currentlyFetching = 0;

            self.fetchSets = {};

            self.irnRequest = undefined;
            self.fetchedIrns = new Object();
            self.indexList = [];

            self.favorites = [];

            // TODO
            IMu.Events.bind('load-records', function()
            {
                self.loadBatch();
            });
            self.setModule(self.options.module);
        },

        _ready: function()
        {
            var self = this;
        },

        create: function()
        {
            var self = this;
        },

        /* TODO: i wasn't sure how to implement this part generically
        */
        addColumn: function(noColumns)
        {
            var self = this;
            self.addColumns(noColumns);
        },

        addColumns: function(noColumns)
        {
            var self = this;

            if (noColumns == undefined ||
                noColumns < 0)
                noColumns = 1;
            
            for (var i = 0; i < noColumns; i++)
            {
                var column = new Column(this, self.noColumns);
                self.columns[self.noColumns] = column;
                self.noColumns++;
            }
        },

        addFavorite: function(irn)
        {
            var self = this;
            self.favorites[irn] = true;
        },

        getIndexListLength: function()
        {
            return this.indexList.length;
        },

        removeFavorite: function(irn)
        {
            var self = this;
            delete self.favorites[irn];
        },

        setModule: function(moduleName)
        {
            var self = this;

            self.busy = true;
            self.deleteModule(); 
            self.options.module = moduleName;

            self.busy = false;
            self.setTerms();
            self.setFetchSets();
        },

        setFetchSets: function()
        {
            var self = this;
            
            self.fetchSets = [];
            var moduleName = self.options.module;

            // TODO: this is a hack. don't hard code values like this.
            self.fetchSets = 
            {
                ecatalogue:
                [
                    'title=TitMainTitle',
                    'category=TitObjectCategory',
                    'accNo=TitAccessionNo',
                    'type=ObjectType',
                    'image'
                ],
                'default':
                [
                    'SummaryData',
                    'image'
                ]
            }
        },

        // TODO this should only set terms, not modules
        setTerms: function(category)
        {
            var self = this;

            self.deleteModule();

            // TODO: this needs work
            if (category == 'my-collection')
            {
                self.terms = new IMu.Terms('OR');
                self.options.module = 'ecatalogue';

                for(var key in self.favorites)
                {
                    self.terms.add('irn', key);
                }

//                self.updateIrnList();
            }
            else
            {
                // TODO: get from config files
                self.terms = new IMu.Terms('OR');
                
                /* catalogue */
                var terms = self.terms.addTerms('AND');
                terms.add("TitMainTitle", "\\*");
                if (category !== undefined)
                    terms.add("TitObjectCategory", category);
                else
                    terms.add("TitObjectCategory", "");



                /* other modules */
                var terms = self.terms.addTerms('AND');
                terms.add("NamPartyType", "person");
            }
        },

        show: function()
        {
            var self = this;

            self.view.showLoadingAnimation();
            self.view.setLoadInterval(5000);
        },

        // private
        deleteModule: function()
        {
            var self = this;

            if (self.search)
            {
                self.hits = undefined;
                self.search.onComplete = undefined;
                self.search = undefined;
                self.busy = false;
            }
        },

        loadBatch: function(callback)
        {
            var self = this;

            //TODO: this is a hack
            if (self.hits == undefined)
                return;

            if (self.hits == 0 || self.indexList.length == 0)
            {
                self.view.clearLoadInterval();
                self.view.showToTopButton();
                return;
            }

            var max = self.maximumFetchCount;
            if (max > self.indexList.length)
                max = self.indexList.length;

            var generate = max - self.currentlyFetching;
            for (var i = 0; i < generate; i++)
            {
                var index = self.randArrayVal(self.indexList, true);
                self.loadRecord(index, function()
                {
                    if (self.currentlyFetching < 1 && i == generate)
                    {
                        if (callback && typeof(callback) == 'function')
                            callback();
                        return;
                    }
/*                        
                    if (self.currentlyFetching < 1 && 
                        self.options.loadOn == 'click')
                    {
                        if (self.indexList.length == 0)
                            self.view.showToTopButton();
                        else
                            self.view.showLoadMoreButton();
                    }
*/                    
                });
/*
                if (self.indexList.length == 0)
                {
                    self.view.clearLoadInterval();
                    self.view.showToTopButton();
                    return;
                }
*/                
            }
        },

        loadRecord: function(offset, callback)
        {
            var self = this;
            
            self.currentlyFetching++;


            var index = undefined;
            var modules = self.search.hits.modules;

            var moduleName = 'default';
            var tmp = 0;
            for (var i = 0; i < modules.length; i++)
            {
                tmp += modules[i].hits;
                if (offset < tmp)
                {
                    moduleName = modules[i].name;
                    break;
                }
            }

            var fetchSets = self.fetchSets['default'];
            if (self.fetchSets[moduleName] !== undefined)
                fetchSets = self.fetchSets[moduleName];


            self.search.fetch('start', offset, 1, fetchSets, 
                function(results, success)
            {
                if (! success)
                {
                    self.view.displayError();
                    self.currentlyFetching--;
                    
                    if (callback)
                        callback();

                    return;
                }
                
                var data = results.modules[0].rows[0];
                data.offset = offset;
                var fav = false;
                if (self.favorites[data.irn])
                    fav = true;

                data.module = moduleName;
                if (data.image)
                {
                    var mm = new IMu.Request.Multimedia();
                    mm.setKey(data.image.irn);
                    mm.addFilter('kind', 'resolution');
                    mm.addFilter('width', 'lt', '250');
                    mm.addFilter('width', 'gt', '100');
                    var url = mm.getURL();
                    
                    var image = new Image();
                    image.onload = function()
                    {
                        data.image = image;
                        var smallestColumns = self.findSmallestColumns();
                        var column = self.randArrayVal(smallestColumns);
                        column.addRecord(data, fav);
                        self.currentlyFetching--;

                        if (callback)
                            callback();
                    }
                    image.onerror = function()
                    {
                        data.image = undefined;
                        var smallestColumns = self.findSmallestColumns();
                        var column = self.randArrayVal(smallestColumns);
                        column.addRecord(data, fav);
                        self.currentlyFetching--;

                        if (callback)
                            callback();
                    }
                    image.src = url;
                }
                else
                {
                    data.image = undefined;
                    var smallestColumns = self.findSmallestColumns();
                    var column = self.randArrayVal(smallestColumns);
                    column.addRecord(data, fav);
                    self.currentlyFetching--;

                    if (callback)
                        callback();
                }
            });

        },


        /* TODO: this needs work (could miss a single column over and over again
        ** TODO: when choosing which column to size, pick at random to avoid
        ** always starting on the left, then remove from array.
        */
        findSmallestColumns: function()
        {
            var self = this;

            var noColumns = Math.ceil(self.columns.length / 4);
            if (noColumns == 0)
                return;

            var smallestHalf = [];
            var indexList = [];
            for (var i = 0; i < self.columns.length; i++)
                indexList[i] = i;

            while (indexList.length > 0)
            {
                var index = self.randArrayVal(indexList, true);
                var column = self.columns[index];
                var height = column.getHeight();

                for (var i = 0; i < noColumns; i++)
                {
                    if (smallestHalf[i] == undefined)
                    {
                        smallestHalf[i] = column;
                        break;
                    }
                    else if (height < smallestHalf[i].getHeight())
                    {
                        if (i != noColumns)
                            for (var j = noColumns -1; j > i; j--)
                                smallestHalf[j] = smallestHalf[j -1];
                        
                        smallestHalf[i] = column;
                        break;
                    }
                }
            }
            return smallestHalf;
        },

        randArrayVal: function(data, remove)
        {
            if (! data)
                return undefined;

            var index = Math.floor(Math.random() * data.length);
            var value = data[index];

            if (remove)
                data.splice(index, 1);

            return value;
        },
       
        doSearch:function()
        {
            this.updateIrnList();
        },
        updateIrnList: function()
        {
            var self = this;

            if (self.search || self.busy)
                return;

            self.busy = true;

            // TODO
            if (self.options.module === undefined)
                return;

            if (self.terms === undefined)
                return;










            self.search = new IMu.Request.Search();
            self.search.errorHandling = 'callback';


            // TODO
            var include = [self.options.module, 'eparties'];
            include = 'ecatalogue';
            if (typeof(include) == 'string')
                include = [ include ];

            
            var terms = self.terms;
            if (terms.list.length == 0)
            {
                self.indexList = [];
                self.hits = 0;
                self.busy = false;
                return;
            }

            self.search.search(terms, include);
            self.search.onComplete = function(reply)
            {
                self.search.onComplete = undefined;
                // TODO: better error handling
                if (! reply.success)
                {
                    self.view.displayError(reply.response);
                    return;
                }

                self.hits = reply.response.result.total;

                self.indexList = [];
                for (var i = 0; i < self.hits; i++)
                    self.indexList[i] = i;

                self.busy = false;

                // If load on click, do one initial load
                if (self.options.loadOn == 'click')
                {
                    if (self.view.footer.button !== undefined)
                    {
                        self.view.footer.button.setState('load more');
                        self.view.footer.button.onClick();
                    }
                    else
                        self.loadBatch();
                }
            };
        },


        clear: function()
        {
            var self = this;
            self.view.clear();
        }
    });



    // TODO: is this right?
    var Column = IMu.Class.create
    ({
        _construct: function(owner, index)
        {
            this.owner = owner;
            this.index = index;
            this.view = undefined;
        },

        configure: function(options)
        {
            for (var name in options)
                if (name in this)
                    this[name] = options[name];
        },

        addRecord: function(data, fav)
        {
            var self = this;
            self.owner.view.addRecord(self.view, data, fav);
        },

        getHeight: function()
        {
            var self = this;

            return self.view.holder.fullHeight();
        }
    });
})();    
