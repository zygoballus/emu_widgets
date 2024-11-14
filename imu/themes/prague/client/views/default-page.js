(function(theme)
{
    theme.views.register('default-page',
    {
        _source: 'prague/client/default-page',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                var self = this;

                self.keywords = undefined;

                self.searchFormsLabel = undefined;
                self.searchForms = undefined;
                self.collectionLabel = undefined;
                self.collections = undefined;

                self.tabbed = undefined;
                self.browser = undefined;
                self.viewer = undefined;

                self.combinedViewer = undefined;

                /* Get list of Museum Location and Case Name fields.
                 */
                self.museumLocationsList = "";
                self.caseNamesList = "";
                var file = 'imu/shared/client/images/lists/museum-location.txt';
                $.get(file, function(data)
                {
                    self.museumLocationsList = data.split("\n");
                });
                file = 'imu/shared/client/images/lists/case-name.txt';
                $.get(file, function(data)
                {
                    self.caseNamesList = data.split("\n");
                });
            },

            makeContent: function()
            {
                var self = this;

                self.tabbed = self.content.IMu('tabbed-display',
                    {
                        ownerHeight: 'fixed'
                    }
                );

                var item;

                //item = self.tabbed.add('record-browser');
                //self.browser = item.widget;
                //self.browser.setOptions
                //({
                //    showSelectionControl: true
                //});

                item = self.tabbed.add('combined-viewer');
                self.viewer = item.widget;
                self.viewer.add('lightbox-viewer');
                self.viewer.add('details-viewer');
            },

            makeTitle: function()
            {
                var self = this;

                var table = self.header.child('table');
                table.css('width', '100%');
                var tr = table.child('tr');

                var td;

                td = tr.child('td', 'logo');
                td.css('width', '1%');
                var a = td.child('a');
                a.attr('href', window.location.pathname);
                var img = a.child('img', 'image');
                var src = IMu.Request.getURL('Image') + 'CMNH_TWO_LINE_HORIZ_RELATIONSHIP.PNG';
                img.attr('title', IMu.string('imu-title'));
                img.attr('src', src);

                td = tr.child('td', 'title');
                td.css('width', '98%');
                td.text(IMu.string('imu-title'));

                td = tr.child('td', 'search');
                td.css('width', '1%');
                td.css('white-space', 'nowrap');
            },

            isDecimal: function(s)
            {
                    var isDecimal_re = /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/;

                    return(String(s).search (isDecimal_re) != -1);
            },

            /* Sidebar
            */
            makeSidebar: function()
            {
                var self = this;
                self._super();
            },

            makeSearchForms: function()
            {
                 var self = this;

                 var searches = self.sidebar.child('div', 'searches');
                 self.searchFormsLabel = searches.child('div', 'searches-label');
                 self.searchFormsLabel.text(IMu.string('search-this-collection-label'));

                 var searchForms = searches.child('div', 'search-forms');
                 self.searchForms = searchForms.IMu('tabbed-display',
                 {
                     showHeader: false
                 });
                 self.addSearchForms();
            },
            
            addSearchForms: function()
            {
                var self = this;

                self.makeAdvancedSearchForm();
                //self.makeNarrativesSearchForm();
            },

            makeAdvancedSearchForm: function()
            {
                var self = this;

                var item = self.searchForms.add('search-form');
                item.title = 'Advanced';
                item.icon = 'search-advanced';
                item.widget.add
                ([
                    {
                        column: 'keywords',
                        prompt: 'advanced-keywords',
                        type: 'text'
                    },
                    {
                        label: 'Enter catalog number, color, etc.',
                        type: 'label'
                    },
                    {
                        column: 'CatSpecies',
                        prompt: 'advanced-species',
                        type: 'text'
                    },
                    {
                        allowEmpty: true,
                        column: 'ColHisCurrentCountryLocal',
                        lookup: 'Current Locality',
                        level: 0,
                        prompt: 'advanced-country',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'ColHisCurrentStateLocal',
                        lookup: 'Current Locality',
                        level: 2,
                        prompt: 'advanced-state',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'ColHisCurrentCityLocal',
                        lookup: 'Current Locality',
                        level: 5,
                        prompt: 'advanced-city',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'ColHisCurrentMineDistrictLocal',
                        lookup: 'Current Locality',
                        level: 8,
                        prompt: 'advanced-district',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'ColHisCurrentMineLocal',
                        lookup: 'Current Locality',
                        level: 7,
                        prompt: 'advanced-mine',
                        type: 'selection'
                    }
                ]);
                item.widget.setOptions
                ({
   /*                 onlyItemsWithImages: true,
                    onlyItemsOnDisplay: true, */
                    onSearch: function(terms,imagesOnly)
                    {
                        if (imagesOnly)
                        {
                            terms.add('MulHasMultiMedia', 'Y');
                        }
                        terms.add('CatDepartment', 'Mineralogy');

                        if (terms.list[0][0] == 'keywords')
                        {
                            var text = terms.list[0][1];
                            var termsOr = new IMu.Terms("Or");
                            termsOr.add('keywords',text);

                            var str = text;
                            var pattern = /^CM(.*)/g;
                            if (str.match(pattern))
                            {
                                str = str.replace(pattern, "$1");
                                termsOr.add('CatCatalogNumber', str);
                            }
                            
                            if (self.isDecimal(text))
                            {
                                termsOr.add('CatCatalogNumber', text);
                                termsOr.add('CatWeight', text);
                            }
                            
                            /* Check if the Stroage ID exists in the Museum Location List
                             */
                            var storageID = "";
                            for( var i = 0; i < self.museumLocationsList.length-1; i++)
                            {
                                if (storageID == '')
                                {
                                    if(self.museumLocationsList[i].indexOf("|") != -1)
                                    {
                                        var values = self.museumLocationsList[i].toLowerCase().split("|");
                                        if (text != "" && values[1].indexOf(text) != -1)
                                        {
                                            storageID = values[0];
                                        }
                                    }
                                }
                            }
                            if (storageID != '')
                            {
                                termsOr.add('CatStorageID', storageID);
                            }

                            /* Check if the Stroage Name exists in the Case Name List
                             */
                            var storageName= "";
                            for( var i = 0; i < self.caseNamesList.length-1; i++)
                            {
                                if (storageName == '')
                                {
                                    if(self.caseNamesList[i].indexOf("|") != -1)
                                    {
                                        var values = self.caseNamesList[i].toLowerCase().split("|");
                                        if (text != "" && values[2].indexOf(text) != -1)
                                        {
                                            storageName = values[1];
                                        }
                                    }
                                }
                            }
                            if (storageName != '')
                            {
                                termsOr.add('CatStorageName', storageName);
                            }
                
                            terms.list[0] = termsOr;
                        }
                        
                        self.doSearch(terms, 'ecatalogue');
                    }
                });
            },

            makeMyCollections: function()
            {
            },


            resizeSidebar: function()
            {
                this._super.apply(this, arguments);
            }
        }
    });
})(IMu.Themes.get('prague'));
