(function(theme)
{
// TODO: reevaluate the 'busy' bool mechanism
    
    theme.views.register('default-page', 'page',
    {
        _source: 'colombo/common/default-page',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);
                var self = this;

                self.keywords = undefined;
                self.searchFormToggle = undefined;
                self.keywordSearchToggle = undefined;

                self.collectionLabel = undefined;
                self.collections = undefined;

                self.tabbed = undefined;
                self.browser = undefined;
                self.viewer = undefined;
                self.currentView = 'browse';

                self.viewsIcons = undefined;
                self.viewsMenu = undefined;

                IMu.Events.bind('imu-show', function()
                {
                    self.header.transition({'opacity': '1.0'}, 1000, 'ease');
                    self.content.transition({'opacity': '1.0'}, 1000, 'ease');
                    self.footer.transition({'opacity': '1.0'}, 1000, 'ease');
                });
            },

            resize: function()
            {
                var self = this;

                self._super.apply(this, arguments);

//                if (self.searchForm.resize)
//                    self.searchForm.resize();
            },

            makeHeader: function(type)
            {
                var self = this;

                switch (type)
                {
                    case 'mobile':
                        self.makeTitleMobile();
                        break;
                    case 'desktop':
                    default:    
                        self.makeTitle();
                        break;
                }

                self.makeMyCollections();
            },

            makeSidebar: function()
            {
                var self = this;
/*
//TODO: replace #page-top with javascript scroll(0) code thing
                var topOfPageButton = self.sidebar.child('a', 
                    'button page-top-button deselected');
                topOfPageButton.attr('href', '#page-top');
                
                var img = topOfPageButton.child('img', 'deselected');
                var src = IMu.Request.getURL('Image') + '&name=up_lighter';
                img.attr('src', src);

                img = topOfPageButton.child('img', 'selected');
                src = IMu.Request.getURL('Image') + '&name=up_darker';
                img.attr('src', src);
*/                
            },

            makeContent: function()
            {
                var self = this;

                self.tabbed = self.content.IMu('tabbed-display',
                {
                    ownerHeight: 'fixed'
                });

                var item;

                self.browser = self.tabbed.addWidget('widget-browser');
/*
                self.viewer = self.content.IMu('combined-viewer');
                self.viewer.add('explore-viewer');
                var index = self.viewer.list.length -1;
                var explore = self.viewer.list[index].widget;
                explore.addColumns(3);
//                self.browser = self.viewer.list[index].widget;

                self.viewer.add('details-viewer');

                self.viewer.select(index);
*/



                item = self.tabbed.add('combined-viewer');
                self.viewer = item.widget;
                item.widget.setOptions
                ({
                    icons: self.viewsIcons
                });
                self.viewer.add('details-viewer');


/*
                self.tabbed = self.content.IMu('tabbed-display',
                    {
                        ownerHeight: 'fixed'
                    }
                );

                var item;
                
                item = self.tabbed.add('record-browser');
                self.browser = item.widget;
                self.browser.setOptions
                ({
                    showSelectionControl: true
                });

                item = self.tabbed.add('combined-viewer');
                self.viewer = item.widget;
                self.viewer.add('list-viewer');
                self.viewer.add('lightbox-viewer');
                self.viewer.add('details-viewer');
*/               
            },

            makeFooter: function()
            {
            },

            /* Header */
            makeTitle: function()
            {
                var self = this;

                var table, tr, td;
                var selectedColour = 'white';
                var deselectedColour = 'navy';

                table = self.header.child('table');
                table.css('width', '100%');
                table.attr('id', 'page-top');
                tr = table.child('tr');

                td = tr.child('td', 'logo');
                td.css('width', '1%');
                var a = td.child('a');
                //TODO
//                a.attr('href', IMu.URL.base);
                a.attr('href', "");
                var img = a.child('img', 'image');
                var src = IMu.Request.getURL('Image') + '&name=header/nm-logo';
                img.attr('title', IMu.string('imu-title'));
                img.attr('src', src);
                img.load(function()
                {
                    self.resize();
                });

                td = tr.child('td')
                td.css(
                {
                    'height': '100%',
                });

                table = td.child('table');
                table.css(
                {
                    'width': '100%'
                });
                tr = table.child('tr', 'controls');
                tr.css('height', '1%');
                
                td = tr.child('td', 'search bg-colour-3');
                td.css('width', '1%');
                var search = td.child('table').child('tr');
                
                td = search.child('td');
                td.css('width', '1%');
                var advSearch = td.child('div', 'advanced-search-button');
                advSearch.addClass('bg-colour-3');
                advSearch.css('top', '0');
                self.searchFormToggle = advSearch.IMu('button-control');
                self.searchFormToggle.addState(
                {
                    name: 'off',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + 
                            '&name=header/adv-search'
                    },
                    onClick: function()
                    {
                        self.searchForm.show(true);
                        this.setState('on');
                    }
                });
                self.searchFormToggle.addState(
                {
                    name: 'on',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + 
                            '&name=header/adv-search-selected'
                    },
                    onClick: function()
                    {
                        self.searchForm.show(false);
                        this.setState('off');
                    }
                });

                td = search.child('td');
                td.css('width', '1%');
                var kwSearch = td.child('div', 'keyword-search-button');
                kwSearch.addClass('bg-colour-3');
                kwSearch.css('top', '0');
                self.keywordSearchToggle = kwSearch.IMu('button-control');
                self.keywordSearchToggle.addState(
                {
                    name: 'off',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + 
                            '&name=header/quick-search'
                    },
                    onClick: function()
                    {
                        if (typeof(self.keywords.show) == 'function')
                            self.keywords.show(true);
                        this.setState('on');
                    }
                });
                self.keywordSearchToggle.addState(
                {
                    name: 'on',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + 
                            '&name=header/quick-search-selected'
                    },
                    onClick: function()
                    {
                        if (typeof(self.keywords.show) == 'function')
                            self.keywords.show(false);
                        this.setState('off');
                    }
                });
/*
                img = kwSearch.child('img', 'selected');
                src = IMu.Request.getURL('Image') + '&name=header/quick_' +
                    selectedColour;
                img.attr('src', src);
                img = kwSearch.child('img', 'deselected');
                src = IMu.Request.getURL('Image') + '&name=header/quick_' +
                    deselectedColour;
                img.attr('src', src);
*/
                td = search.child('td');
                td.css('width', '99%');
                var div = td.child('span');
                self.keywords = div.IMu('keyword-search',
                {
                    showLabel: false,
                    showSubmit: true,

                    onSearch: function()
                    {
                        // TODO:
                        var here;
                        
                    }
                });
                self.keywords.busy = false;
                self.keywords.show = function(show)
                {
                    var keywordSearch = this;
                    if (keywordSearch.busy)
                        return;
                    keywordSearch.busy = true;
/* TODO
                    self.toggleButtons(self.keywordSearchToggle, show);
                    var disableButtons = [];
                    if (self.searchFormToggle)
                        disableButtons.push(self.searchFormToggle);
                    self.toggleButtons(disableButtons, false);
*/


                    self.searchFormToggle.setState('off');


                    if (self.searchForm)
                        self.searchForm.showAnimation(false);
                    if (keywordSearch)
                        keywordSearch.showAnimation(show);
                };
                self.keywords.showAnimation = function(show)
                {
                    var keywordSearch = this;

                    var holder = jQuery(keywordSearch.owner).parent();

                    var opacity = 1 - holder.css('opacity');
                    if (show)
                        opacity = 1;
                    else if (show != undefined)
                        opacity = 0;

                    if (opacity)
                    {
                        keywordSearch.owner.transition(
                        {
                            'display': 'block'
                        });
                        holder.transition(
                        {
                            'max-width': '999em',
                            opacity: 1
                        },
                        function()
                        {
                            keywordSearch.busy = false;
                        });
                    }
                    else
                    {
                        holder.transition(
                        {
                            'max-width': 0,
                            opacity: 0
                        },
                        function()
                        {
                            keywordSearch.busy = false;
                        });
                    }
                }
// TODO
                self.keywords.showAnimation(false);

                td = tr.child('td', 'padding');
                td.css('width', '99%');




                /* TODO: this is a terrible hack to simply display icons
                */
                td = tr.child('td', 'views bg-colour-3');
                td.css('width', '1%');

                self.viewsIcons = td.child('div');

                // TODO
/*
                var views = td.child('table').child('tr');


                td = views.child('td');
                var button = td.child('div', 'details-view-button');
                button.IMu('button-control',
                {
                    onClick: function()
                    {
                    },
                    onImg: IMu.Request.getURL('Image') +
                        '&name=views/details-viewer-selected',
                    offImg: IMu.Request.getURL('Image') +
                        '&name=views/details-viewer'
                });

                td = views.child('td');
                var button = td.child('div', 'thumbnail-view-button');
                button.IMu('button-control',
                {
                    onClick: function()
                    {
                    },
                    onImg: IMu.Request.getURL('Image') +
                        '&name=views/thumb-viewer-selected',
                    offImg: IMu.Request.getURL('Image') +
                        '&name=views/thumb-viewer'
                });
                
                td = views.child('td');
                var button = td.child('div', 'list-view-button');
                button.IMu('button-control',
                {
                    onClick: function()
                    {
                    },
                    onImg: IMu.Request.getURL('Image') +
                        '&name=views/list-viewer-selected',
                    offImg: IMu.Request.getURL('Image') +
                        '&name=views/list-viewer'
                });

                td = views.child('td');
                var button = td.child('div', 'map-view-button');
                button.IMu('button-control',
                {
                    onClick: function()
                    {
                    },
                    onImg: IMu.Request.getURL('Image') +
                        '&name=views/map-viewer-selected',
                    offImg: IMu.Request.getURL('Image') +
                        '&name=views/map-viewer'
                });
                
                td = views.child('td');
                var button = td.child('div', 'museum-view-button');
                button.IMu('button-control',
                {
                    onClick: function()
                    {
                    },
                    onImg: IMu.Request.getURL('Image') +
                        '&name=views/museum-viewer-selected',
                    offImg: IMu.Request.getURL('Image') +
                        '&name=views/museum-viewer'
                });
*/


                // TODO
                tr = table.child('tr', 'categories');
                td = tr.child('td');
                td.addClass('colour-2 font-1');
                td.attr('colspan', '3');

                var categories = td.child('ul');
                var li = categories.child('li');
                var a = li.child('a');
                a.text("ALL ");
                a.val("");
                a.addClass('colour-1');
                jQuery(a).click(function(){
                    self.changeCategory(this, "");
                    window.location.href = '#imu[explore]';
                });

                var li = categories.child('li');
                var a = li.child('a', 'collections');
                var favButton = a.child('div', 'button deselected');
                favButton.css('display', 'inline-block');
                var favImg = favButton.child('img', 'deselected');
                var src = IMu.Request.getURL('Image') + "&name=share/fav_fill";
                favImg.attr('src', src);
                favImg = favButton.child('img', 'selected');
                favImg.attr('src', src);
                
                jQuery(a).click(function(){
                    self.changeCategory(this, "my-collection");
                    window.location.href = '#imu[explore=my-collection]';
                });

                var objectTypes = [];
                var luts = new IMu.Request.Lookup();
                luts.lookup("Object Type", 1, function(results, success)
                {
                    if (success)
                    {
                        for (var i = 0; i < results.length; i++)
                        {
                            var text = results[i].toUpperCase(); 
                            var li = categories.child('li');
                            var a = li.child('a');
                            a.text(text);
                            li.css('opacity', '0');
                            li.transition(
                            {
                                opacity: 1
                            }, 2500, 'ease');

                            text = text.toLowerCase().replace(" ", "_");
                            a.val(text);

                            jQuery(a).click(function(){
                                self.changeCategory(this, results[i]);
                                
                                var val = jQuery(this).val();
                                window.location.href = '#imu[' +
                                    "explore=ecatalogue." + val + ']';
                            });
                        }
                    }
                });
            },

            makeTitleMobile: function()
            {
                var self = this;

                var table, tr, td;

                self.header.addClass('bg-colour-3');
                table = self.header.child('table');
                table.css
                ({
                    position: 'relative',
                    width: '100%'
                });
                tr = table.child('tr', 'controls')

                td = tr.child('td');
                td.css('width', '1%');
                var search = td.child('div', 'search');
                self.searchFormToggle = search.IMu('button-control',
                {
                    onClick: function()
                    {
                        self.searchForm.show();
                    },
                    onImg: IMu.Request.getURL('Image') + 
                        '&name=header/search-phone-selected',
                    offImg: IMu.Request.getURL('Image') + 
                        '&name=header/search-phone'
                });


                td = tr.child('td', 'logo');
//                var a = td.child('a');
                var div = td.child('div');
                var img = div.child('img', 'image');
                var src = IMu.Request.getURL('Image') + '&name=header/nm-logo-phone';
                img.attr('title', IMu.string('imu-title'));
                img.attr('src', src);

                td = tr.child('td');
                td.css('width', '1%');
                var view = td.child('div', 'views');
                self.menuToggle = view.IMu('button-control',
                {
                    onClick: function()
                    {
                        var show = self.menuToggle.getState();
                        switch (self.currentView)
                        {
                            case 'browse':
                                if (self.browseMenu)
                                    self.browseMenu.show(show);
                                break;

                            case 'results':
                                if (self.viewsMenu)
                                    self.viewsMenu.show(show);
                                break;

                            default:
                                break;
                        };
                    },
                    image: IMu.Request.getURL('Image') + '&name=header/menu-phone'
                });

            },

            changeCategory: function(element, value)
            {
                var self = this;

                if (!element)
                    return;

                var categories = jQuery('.header .categories ul');
                categories.find('a').each(function()
                {
                    jQuery(this).removeClass('colour-1');
                    jQuery(this).addClass('colour-2');
                });
                jQuery(element).removeClass('colour-2');
                jQuery(element).addClass('colour-1');
            },

            makeButtonIcon: function(owner, name)
            {
                var selectedColour = 'white';
                var deselectedColour = 'navy';

                var icon = owner.child('div', 'button deselected');
                icon.css('top', '0');
                var img = icon.child('img', 'selected');
                var src = IMu.Request.getURL('Image') + '&name=' + 
                    name + selectedColour;
                img.attr('src', src);
                img = icon.child('img', 'deselected');
                src = IMu.Request.getURL('Image') + '&name=' +
                    name + deselectedColour;
                img.attr('src', src);

            },

            showOverlay: function(show, callback)
            {
                var self = this;

                if (typeof(show) == 'function')
                {
                    callback = show;
                    show = undefined;
                }

                if (show)
                {
                    self.overlay.css('display', 'block');
                    self.overlay.transition(
                    {
                        opacity: 1
                    }, 500, 'ease',
                    function()
                    {
                        if (callback)
                            callback();
                    });
                }
                else
                {
                    self.overlay.transition(
                    {
                        opacity: 0
                    }, 500, 'ease',
                    function()
                    {
                        self.overlay.css('display', 'none');

                        if (callback)
                            callback();
                    });
                }
            },

            toggleButtons: function(buttons, show)
            {
                var self = this;
           
                if (! buttons)
                    return;

                for (var i = 0; i < buttons.length; i++)
                {
                    if (show == undefined)
                        jQuery(buttons[i]).toggleClass('deselected selected');
                    else if (show)
                    {
                        jQuery(buttons[i]).removeClass('deselected');
                        jQuery(buttons[i]).addClass('selected');
                    }
                    else
                    {
                        jQuery(buttons[i]).removeClass('selected');
                        jQuery(buttons[i]).addClass('deselected');
                    }
                }
            },

            /* Search forms */
            makeSearchForms: function(type)
            {
                var self = this;
                self.searchForm.busy = false;

                var holder = self.searchForm.child('div', 'holder');
                holder.addClass('bg-colour-1 ' +
                                'colour-4');

                self.searchForm.show = function(show)
                {
                    var searchForm = this;
                    if (searchForm.busy)
                        return;
                    searchForm.busy = true;


                    if (show)
                        self.searchFormToggle.setState('on');
                    else if (show !== undefined)
                        self.searchFormToggle.setState('off');


                    if (self.keywordSearchToggle)
                        self.keywordSearchToggle.setState('off');
                        
                    if (self.keywords && self.keywords.showAnimation)
                        self.keywords.showAnimation(false);
                    if (searchForm)
                        searchForm.showAnimation(show);
                };

                /* In anticipation of alternate layouts
                ** Various animations
                */
                if (typeof(type) == 'string')
                    type = type.toLowerCase();
                switch(type)
                {
                    case "popup":
                    case 1:
                        self.searchForm.addClass('popup');
                        self.searchForm.resize = self.makeSearchPopupResize();
                        self.searchForm.showAnimation = 
                            self.makeSearchPopupShowAnimation();
                        break;

                    case "slide":
                    case 2:
                        self.searchForm.addClass('slide');
                        self.searchForm.resize = function() {};
                        self.searchForm.showAnimation = 
                            self.makeSearchSlideShowAnimation();

                        var kwSearch = holder.child('div');
                        kwSearch.addClass('bg-colour-3');
                        self.keywords = kwSearch.IMu('keyword-search',
                        {
                            showLabel: false,
                            showSubmit: true,
                            onSearch: function()
                            {
                                // TODO
                            }
                        });

                        var img = kwSearch.child('img');
                        var src = IMu.Request.getURL('Image') + 
                            '&name=header/search-phone';
                        img.attr('src', src);

                        self.keywords.busy = false;

                        holder = holder.child('div', 'advanced-search');
                        holder.css('position', 'absolute');
                        break

                    default:
                        self.searchForm.addClass('none');
                        self.searchForm.resize = undefined;
                        self.searchForm.showAnimation = undefined;
                        break;
                }

                var table = holder.child('table');
                var tr = table.child('tr');

                var td = tr.child('td', 'searches-label');
                td.addClass('font-1');
                td.text(IMu.string('common-search'));
                
                td = tr.child('td', 'close-search');
                td.css('width', '1%');
                var button = td.child('div', 'button deselected close-search-button');
                button.click(function()
                {
                    IMu.Events.trigger('close-overlay');    
                });


                var img = button.child('img', 'deselected');
                var src = IMu.Request.getURL('Image') + '&name=close';
                img.attr('src', src);
                
                var img = button.child('img', 'selected');
                img.attr('src', src);

                var searches = holder.child('div', 'searches');
                var widget = searches.IMu('tabbed-display',
                {
                    showHeader: true,
                    showSubmit: true
                });
                self.addSearchForms(widget);
            },

            makeSearchPopupResize: function()
            {
                var self = this;
                
                return function()
                {
                    var headerHeight = self.header.fullHeight();
                    var headerWidth = self.header.innerWidth();

                    this.css('top', headerHeight);
                    this.css('width', headerWidth);
                };
            },
            makeSearchPopupShowAnimation: function()
            {
                var self = this;

                return function(show)
                {
                    var searchForm = this;

                    var opacity = 1 - searchForm.css('opacity');
                    if (show)
                        opacity = 1;
                    else if (show != undefined)
                        opacity = 0;

                    if (opacity)
                    {
                        self.showOverlay(true);
                        searchForm.transition(
                        {
                            display: 'block'
                        })
                        .transition(
                        {
                            'opacity': opacity
                        },
                        function()
                        {
                            searchForm.busy = false;
                        });
                    }
                    else
                    {
                        searchForm.transition(
                        {
                            'opacity': opacity
                        })
                        .transition(
                        {
                            display: 'none'
                        },
                        function()
                        {
                            searchForm.busy = false;
                        });
                        self.showOverlay(false);
                    }

                };
            },

            makeSearchSlideShowAnimation: function()
            {
                var self = this;
                
                return function(show)
                {
                    //TODO: the order of panels should not be hard coded
                    if (show == undefined)
                    {   
                        if (self.searchFormToggle.getSelected())
                            show = true;
                        else 
                            show = false;
                    }

                    /* This might seem strange setting the class again here,
                    ** though changing to the search menu using a swipe motion
                    ** might make some of the search buttons go out of sync.
                    */
//                    self.toggleButtons(self.searchFormToggle, false);
                    if (show)
                    {
                        self.searchForm.transition
                        ({
                            x: '100%'
                        });
                    }
                    else
                    {
                        self.searchForm.transition
                        ({
                            x: '0%'
                        });
                    }
                        
                    var searchForm = this;
                    searchForm.busy = false;
/*                
                    var searchForm = this;
                    var position = searchForm.css('left');
                    
                    if (show == undefined)
                    {
                        if (self.searchFormToggle.hasClass('selected'))
                            show = true;
                        else
                            show = false;
                    }

                    if (show)
                    {  
                        self.holder.transition(
                        {
                            x: '100%'
                        }, 1000, 'ease',
                        function()
                        {
                            searchForm.busy = false;
                        });
                    }
                    else
                    {
                        self.holder.transition(
                        {
                            x: '0'
                        }, 1000, 'ease',
                        function()
                        {
                            searchForm.busy = false;
                        });
                    }
*/                    
                };
            },

            makeViewsMenu: function()
            {
                var self = this;

                self.viewsMenu = self.makeMenu('views');

                var name = 'thumb-viewer';
                self.viewsMenu.addRow(name);

                var name = 'list-viewer';
                self.viewsMenu.addRow(name);
                
                var name = 'details-viewer';
                self.viewsMenu.addRow(name);

                var name = 'map-viewer';
                self.viewsMenu.addRow(name);

                var name = 'museum-viewer';
                self.viewsMenu.addRow(name);
            },

            makeMenu: function(title)
            {
                var self = this;

                var menu = self.holder.child('div', 'menu');
                menu.addClass('bg-colour-1 ' + 
                    title + '-menu');
                menu.shift = '-80%';
                menu.css('right', '-80%');

                menu.show = function(show)
                {
                    if (show === undefined)
                        return;
                    if (show)
                    {
                        this.transition
                        ({ 
                            x: '-100%'
                        });
                        self.header.transition
                        ({ 
                            x: this.shift
                        });
                        self.content.transition
                        ({ 
                            x: this.shift
                        });
                    }
                    else
                    {
                        this.transition
                        ({
                            x: '0%'
                        });
                        self.header.transition
                        ({
                            x: '0%'
                        });
                        self.content.transition
                        ({
                            x: '0%'
                        });
                    }
                };

                menu.body = menu.child('table').child('tbody');
                menu.addRow = function(name, supplementary)
                {
                    if (! name)
                        return;

                    var tr = menu.body.child('tr', 'menu-option');

                    var td = tr.child('td', 'icon');
                    var src = IMu.Request.getURL('Image') + 
                        '&name=views/' + name + '-phone';
                    var img = td.child('img');
                    img.attr('src', src);

                    var src = IMu.Request.getURL('Image') + 
                        '&name=views/' + name + '-phone-selected';
                    var img = td.child('img', 'selected');
                    img.attr('src', src);

                    var td = tr.child('td', 'label');
                    td.text(IMu.string(name));
                    td.addClass
                    (
                        'colour-4 ' +
                        'font-2 ' +
                        name
                    );

                    var td = tr.child('td', 'sup');
                    var img = td.child('img');
                    if (supplementary)
                        img.attr('src', supplementary);

                    return tr;
                };

                return menu;
            },

            addSearchForms: function(owner)
            {
                var self = this;

                self.makeAdvancedSearchForm(owner);
                self.makeNarrativesSearchForm(owner);
                self.makeObjectsSearchForm(owner);
                self.makePartiesSearchForm(owner);
                self.makeMultimediaSearchForm(owner);
            },

            makeAdvancedSearchForm: function(owner)
            {
                var self = this;

                var item = owner.add('search-form');
                item.title = 'Advanced';
                item.icon = 'search-advanced';
                item.widget.add
                ([
                    {
                        column: 'title',
                        prompt: 'common-title',
                        type: 'text'
                    },
                    {
                        autoSuggest: true,
                        column: 'subjects',
                        lookup: 'Subjects',
                        prompt: 'common-subjects',
                        type: 'text'
                    },
                    {
                        column: 'AdmDateInserted',
                        prompt: 'common-date-inserted',
                        type: 'text'
                    }
                ]);
                item.widget.setOptions
                ({
                    onSearch: function(terms, imagesOnly)
                    {
                        if (imagesOnly)
                        {
                            terms.add('MulHasMultiMedia', 'Y');
                        }
                        self.doSearch(terms);
                    },
                    buttonClass: "colour-4 font-1 bg-colour-2",
                    promptClass: "colour-3 font-1"
                });
            },

            makeNarrativesSearchForm: function(owner)
            {
                var self = this;

                var item = owner.add('search-form');
                item.title = 'module-enarratives';
                item.icon = 'search-narratives';
                item.widget.add
                ([
                    {
                        column: 'title',
                        prompt: 'common-title',
                        type: 'text'
                    },
                    {
                        column: 'NarNarrative',
                        prompt: 'enarratives-text',
                        type: 'text'
                    },
                    {
                        column: 'DesIntendedAudience_tab',
                        prompt: 'enarratives-audience',
                        type: 'text'
                    },
                    {
                        column: 'subjects',
                        prompt: 'common-subjects',
                        type: 'text'
                    },
                    {
                        column: 'NarAuthorsLocal',
                        prompt: 'enarratives-authors',
                        type: 'text'
                    }
                ]);
                item.widget.setOptions
                ({
                    onSearch: function(terms, imagesOnly)
                    {
                        if (imagesOnly)
                        {
                            terms.add('MulHasMultiMedia', 'Y');
                        }
                        self.doSearch(terms, 'enarratives');
                    },
                    buttonClass: "colour-4 font-1 bg-colour-2",
                    promptClass: "colour-3 font-1"
                });
            },

            makeObjectsSearchForm: function(owner)
            {
                var self = this;

                var item = owner.add('search-form');
                item.title = 'module-ecatalogue';
                item.icon = 'search-catalogue';
                item.widget.add
                ([
                    {
                        column: 'title',
                        prompt: 'common-title',
                        type: 'text'
                    },
                    {
                        column: 'accessionNumber',
                        prompt: 'ecatalogue-accession-number',
                        type: 'text'
                    },
                    {
                        column: 'objectStatus',
                        prompt: 'common-status',
                        type: 'text'
                    },
                    {
                        allowEmpty: true,
                        column: 'objectRating',
                        lookup: 'Object Rating',
                        prompt: 'ecatalogue-rating',
                        type: 'selection'
                    }
                ]);
                item.widget.setOptions
                ({
                    onSearch: function(terms, imagesOnly)
                    {
                        if (imagesOnly)
                        {
                            terms.add('MulHasMultiMedia', 'Y');
                        }
                        self.doSearch(terms, 'ecatalogue');
                    },
                    buttonClass: "colour-4 font-1 bg-colour-2",
                    promptClass: "colour-3 font-1"
                });
            },

            makePartiesSearchForm: function(owner)
            {
                var self = this;

                var item = owner.add('search-form');
                item.title = 'module-eparties';
                item.icon = 'search-parties';
                item.widget.add
                ([
                    {
                        autoSuggest: true,
                        column: 'NamLast',
                        lookup: 'Surname',
                        prompt: 'eparties-last-name',
                        type: 'text'
                    },
                    {
                        column: 'NamFirst',
                        prompt: 'eparties-first-name',
                        type: 'text'
                    }
                ]);
                item.widget.setOptions
                ({
                    onSearch: function(terms, imagesOnly)
                    {
                        if (imagesOnly)
                        {
                            terms.add('MulHasMultiMedia', 'Y');
                        }
                        self.doSearch(terms, 'eparties');
                    },
                    buttonClass: "colour-4 font-1 bg-colour-2",
                    promptClass: "colour-3 font-1"
                });
            },

            makeMultimediaSearchForm: function(owner)
            {
                var self = this;

                var item = owner.add('search-form');
                item.title = 'module-emultimedia';
                item.icon = 'search-multimedia';
                item.widget.add
                ([
                    {
                        column: 'MulTitle',
                        prompt: 'common-title',
                        type: 'text'
                    },
                    {
                        column: 'media-type',
                        prompt: 'emultimedia-media-type',
                        type: 'text'
                    },
                    {
                        column: 'MulMimeFormat',
                        prompt: 'emultimedia-mime-format',
                        type: 'text'
                    }
                ]);
                item.widget.setOptions
                ({
                    onSearch: function(terms, imagesOnly)
                    {
                        if (imagesOnly)
                        {
                            terms.add('MulHasMultiMedia', 'Y');
                        }
                        self.doSearch(terms, 'emultimedia');
                    },
                    buttonClass: "colour-4 font-1 bg-colour-2",
                    promptClass: "colour-3 font-1"
                });
            },	

            makeMyCollections: function(owner)
            {
                var self = this;

                var collections = self.header.find('collections');
/*                
                self.collections = collections.IMu('my-collections',
                {
                
                    onRestoreGroup: function(group)
                    {
                        IMu.log('restore: group {0}', group);
                        var keys = [];
                        
                        for (var i = 0; i < group.entries.length; i++)
                        {
                            var entry = group.entries[i];

                        }
                    
                    }
                });
*/                
            },

            /* Convenience */
            doSearch: function(terms, include)
            {
                var self = this;

                if (typeof(include) == 'string')
                    include = [ include ];
            
                //TODO beginDelay

                var search = new IMu.Request.Search();
                search.search(terms, include, function(hits)
                {
                    //TODO: end delay
                    
                    //TODO figure out which view
                    self.viewer.addState(search);
                });
            },

            hideSidebar: function()
            {
            },

            resizeSidebar: function()
            {
            }
        },

        desktop:
        {
            createHeader: function()
            {
                this.makeHeader('desktop');
            },

            createSidebar: function()
            {
                this.makeSidebar();
            },

            createSearchForms: function()
            {
                var self = this;

                // TODO: make sure this is "popup" when done
                self.makeSearchForms('popup');
                IMu.Events.bind('close-overlay', function()
                {
                    self.searchForm.show(false);
                });
            },

            createContent: function()
            {
                this.makeContent();
                this.browser.widget.device = 'desktop';
            },

            createFooter: function()
            {
            }
        },

        phone:
        {
            createHeader: function()
            {
                this.makeHeader('mobile');
            },

            createSidebar: function()
            {
            },

            createSearchForms: function()
            {
                var self = this;
                
                //TODO: make slide
                self.makeSearchForms('slide');
                IMu.Events.bind('close-overlay', function()
                {
                    self.searchForm.show(false);
                });
            },

            createContent: function()
            {
                this.makeContent(2);
            },

            createFooter: function()
            {
            },
            
            createMenus: function()
            {
                this.makeViewsMenu();
            }
        },

        tablet:
        {
            createHeader: function()
            {
                this.makeHeader('mobile');
            },

            createSidebar: function()
            {
            },

            createSearchForms: function()
            {
                var self = this;

                self.makeSearchForms('slide');
                IMu.Events.bind('close-overlay', function()
                {
                    self.searchForm.show(false);
                });
            },

            createContent: function()
            {
                this.makeContent(2);
            },

            createFooter: function()
            {
            }
        }
    });
})(IMu.Themes.get('colombo'));
