/* THIS FILE IS BUILT AUTOMATICALLY.
** DO NOT CHANGE IT DIRECTLY.
**
** Built at: 2024-11-14 17:52:27 UTC (2024-11-14 17:52:27 UTC)
*/
"use strict";

/* Source: ./themes/darwin/common/strings.js
*/
(function(theme)
{
    theme.strings.register
    ({
        'keyword-search-placeholder':
        {
            en: 'Quick Search'
        },
        'keyword-search-submit':
        {
            en: 'Search'
        },

        /* Departments
        */
        'department-rock-art':
        {
            en: 'Rock Art'
        },

        'combined-viewer-results':
        {
            en: 'Results'
        },

        'ecatalogue-module':
        {
            en: 'Catalogue'
        },
        'eparties-module':
        {
            en: 'Parties'
        },
        'emultimedia-module':
        {
            en: 'Multimedia'
        },
        'my-collection-module':
        {
            en: 'My Collection'
        },

        /* Labels
        */
        'label-audience':
        {
            en: 'Audience'
        },

        'label-bits-per-sample':
        {
            en: 'Bits per Sample'
        },

        'label-check-sum':
        {
            en: 'Check Sum'
        },

        'label-colour-depth':
        {
            en: 'Colour Depth'
        },

        'label-colour-space':
        {
            en: 'Colour Space'
        },

        'label-contributor':
        {
            en: 'Contributor'
        },

        'label-creators':
        {
            en: 'Creator(s)'
        },

        'label-duration':
        {
            en: 'Duration'
        },

        'label-dimensions':
        {
            en: 'Dimensions'
        },

        'label-exif-ifd':
        {
            en: 'IFD'
        },

        'label-exif-name':
        {
            en: 'Name'
        },

        'label-exif-section':
        {
            en: 'EXIF'
        },
        
        'label-exif-tag':
        {
            en: 'Tag'
        },

        'label-exif-value':
        {
            en: 'Value'
        },

        'label-film-length':
        {
            en: 'Film Length'
        },

        'label-file-size':
        {
            en: 'File Size'
        },

        'label-identifier':
        {
            en: 'Identifier'
        },

        'label-image-type':
        {
            en: 'Type'
        },

        'label-iptc-name':
        {
            en: 'Name'
        },

        'label-iptc-record':
        {
            en: 'Record'
        },

        'label-iptc-section':
        {
            en: 'IPTC'
        },

        'label-iptc-tag':
        {
            en: 'Tag'
        },

        'label-iptc-value':
        {
            en: 'Value'
        },

        'label-language':
        {
            en: 'Language'
        },

        'label-media-form':
        {
            en: 'Media Form'
        },

        'label-media-type':
        {
            en: 'Media Type'
        },

        'label-number-channels':
        {
            en: 'Num. Channels'
        },

        'label-number-colours':
        {
            en: 'Num. Colours'
        },

        'label-publisher':
        {
            en: 'Publisher'
        },

        'label-resource-type':
        {
            en: 'Resource Type'
        },

        'label-resolution':
        {
            en: 'Resolution'
        },

        'label-resolutions-section':
        {
            en: 'Resolutions'
        },

        'label-restore':
        {
            en: 'Restore'
        },

        'label-samples-per-second':
        {
            en: 'Samples Per Second'
        },

        'label-supplementary-section':
        {
            en: 'Supplementary'
        },

        'label-rights':
        {
            en: 'Rights'
        },

        'label-source':
        {
            en: 'Source'
        },

        'label-usage':
        {
            en: 'Usage'
        },

        'label-xmp-section':
        {
            en: 'XMP'
        },

        /* search-page
        */
        'back-button':
        {
            en: 'Home'
        },

        'keyword':
        {
            en: 'Keyword'
        },

        'only-items-with-images':
        {
            en: 'Only items with images'
        },

        'search-error-message':
        {
            en: 'Error: {0}'
        },

        'search-title':
        {
            en: '{0} Search'
        },

        /* welcome-page
        */
        'select-a-category':
        {
            en: 'Select a category to begin your search'
        },
        'welcome-page-message':
        {
            en: 'Welcome to the Collection'
        },
        'welcome-page-department-message':
        {
            en: 'Welcome to the {0} Collection'
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/components/page.js
*/
(function(theme)
{
    theme.views.register('page',
    {
        _source: 'darwin/common/components/page',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.content = undefined;
                this.holder = undefined;
            },

            _create: function()
            {
                this.holder = this.widget.owner.child('div', 'holder');
                this.content = this.holder.child('section', 'content');
            },

            resize: function()
            {
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/components/paged-display.js
*/
(function(theme)
{
    theme.views.register('paged-display',
    {
        _source: 'darwin/common/components/paged-display',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);
            },

            resize: function()
            {
                // Do not use resize logic in shared code
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/components/search-form.js
*/
(function(theme)
{
    theme.views.register('search-form',
    {
        _source: 'darwin/common/components/search-form',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);
                
                this.groups = {};
            },

            _create: function()
            {
                var self = this;

                self.holder = self.widget.owner.child('div', 'holder');
                var form = self.form = self.holder.child('form');

                var fields = self.widget.fields;
                for (var i = 0; i < fields.length; i++)
                {
                    (function(field)
                    {
                        var row = self.form.child('div', 'input');

                        var label = row.child('label', 'prompt');
                        
                        if (field.prompt !== undefined)
                            label.text(IMu.string(field.prompt));

                        if (self.widget.options.promptClass)
                            label.addClass(self.widget.options.promptClass);

                        field.input = undefined;
                        
                        if (! field.type)
                            self.addTextField(field, row);
                        else if (field.type == 'selection')
                            self.addSelectionField(field, row);
                        else if (field.type == 'date')
                            self.addDateField(field, row);
                        else
                            self.addTextField(field, row);

                        var group = field.searchGroup || '';
                        if (self.groups[group] === undefined)
                            self.groups[group] = [];

                        if (field.input)
                        {
                            field.input.bind('keypress', function(e)
                            {
                                if (e.keyCode == 13)
                                {
                                    self.widget.search();
                                    e.preventDefault();
                                }
                            });
                            field.input.attr('class', 'input');

                            if (field.onChange)
                                field.input.bind('change', function(e)
                                {
                                    field.onChange();
                                });

                            if (field.hover)
                                field.input.attr('title', field.hover);
                        }

                        self.groups[group].push(
                        {
                            'label': label,
                            'field': field,
                            'row': row
                        });
                    })(fields[i]);
                }

                if (self.getOption('onlyItemsWithImages'))
                {
                    var row = form.child('div', 'input records-with-images');
                    
                    var label = row.child('label');
                    label.text(IMu.string('only-items-with-images'));

                    if (self.widget.options.promptClass)
                        label.addClass(self.widget.options.promptClass);

                    var input = row.child('input type="checkbox"', 'images-checkbox');
                    input.bind('change', function()
                    {
                        self.widget.imagesOnly = $(this).attr('checked');
                    });
                }

                var buttons = self.holder.child('div', 'buttons');

                if (self.getOption('showSubmit'))
                {
                    self.submit = buttons.child('button', 'search');
                    self.submit.text(IMu.string('common-search'));

                    if (self.widget.options.buttonClass)
                        self.submit.addClass(self.widget.options.buttonClass);

                    self.submit.click(function()
                    {
                        self.widget.search();
                    });
                }

                if (self.getOption('showClear'))
                {
                    self.clearButton = buttons.child('button', 'clear');
                    self.clearButton.text(IMu.string('common-search-clear'));

                    if (self.widget.options.buttonClass)
                        self.clearButton.addClass(self.widget.options.buttonClass);

                    self.clearButton.click(function()
                    {
                        self.widget.doClear();
                    });
                }

            },

            clearField: function(field)
            {
                if (field.type == 'selection')
                    this.clearSelectionField(field);
                else if (field.type == 'text')
                    this.clearTextField(field);
                else if (field.type == 'date')
                    this.clearDateField(field);
            },

            resize: function()
            {
            },

            setSearchGroup: function(value)
            {
                for (var key in this.groups)
                {
                    var group = this.groups[key];

                    if (key == 'persistent' || key === value)
                    {
                        for (var i = 0; i < group.length; i++)
                        {
                            group[i].row.show();
                        }
                    }
                    else
                    {
                        for (var i = 0; i < group.length; i++)
                        {
                            this.clearField(group[i].field);
                            group[i].row.hide();
                        }
                    }
                }
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/components/my-collections.js
*/
(function(theme)
{
    theme.views.register('my-collections',
    {
        _source: 'darwin/common/components/my-collections',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.holder = undefined;
                this.header = undefined;
                this.submit = undefined; 

                this.widget.search = undefined;
            },

            _create: function()
            {
                var self = this;

                self.holder = self.widget.owner.child('div', 'holder');

                self.header = self.holder.child('div', 'header');
                self.name = self.header.child('input type="text"', 'name');
                self.name.on('blur', function()
                {
                    self.widget.renameGroup(self.name.val());
                });

                var controls = self.header.child('div', 'controls');

                self.prev = controls.child('button', 'prev');
                self.prev.child('div', 'icon prev-icon');
                self.prev.click(function(e)
                {
                    self.widget.previousGroup();
                    e.preventDefault();
                });

                self.next = controls.child('button', 'next');
                self.next.child('div', 'icon next-icon');
                self.next.click(function(e)
                {
                    self.widget.nextGroup();
                    e.preventDefault();
                });

                self.remove = controls.child('button', 'remove');
                self.remove.child('div', 'icon remove-icon');
                self.remove.click(function(e)
                {
                    self.widget.removeGroup();
                    e.preventDefault();
                });

                self.add = controls.child('button', 'add');
                self.add.child('div', 'icon add-icon');
                self.add.click(function(e)
                {
                    self.widget.addGroup();
                    e.preventDefault();
                });

                self.restore = controls.child('button', 'restore');
                self.restore.text(IMu.string('label-restore'));
                self.restore.click(function(e)
                {
                    self.widget.restoreGroup();
                });

                self.content = self.holder.child('div', 'content');
                self.viewer = self.content.IMu('collection-viewer',
                {
                    onRecordSelected: function(rid, offset)
                    {
                        if (! this.search)
                            return;

                        var group = IMu.User.group;
                        IMu.log('restore: group {0}', group);

                        IMu.Events.trigger('clear-search-results');
                        IMu.Events.trigger('begin-search-delay');
                        IMu.Events.trigger('open-keyword-search', 'closed');

                        IMu.Events.trigger('show-search', this.search,
                        {
                            'view': 'details-viewer',
                            'offset': offset
                        });
                    }
                });

                /* This functionality should be migrated into the widget
                */
                IMu.User.load();
                self.widget.owner.resize();
            },

            collectionChanged: function()
            {
                this.update();
            },

            resize: function()
            {
                /* Do nothing by default
                */
            },

            update: function()
            {
                var self = this;

                var onlyGroup = IMu.User.groups.length == 1;
                self.prev.attr('disabled', onlyGroup);
                self.name.val(IMu.User.group.name);
                self.name.attr('disabled', onlyGroup);
                self.remove.attr('disabled', onlyGroup);
                self.restore.attr('disabled', IMu.User.group.entries.length == 0);

                if (! self.viewer)
                    return;

                self.viewer.dropSearch();

                if (IMu.User.group.entries.length > 0)
                {
                    var keys = [];
                    for (var i = 0; i < IMu.User.group.entries.length; i++)
                    {
                        var entry = IMu.User.group.entries[i];
                        keys.push([ entry.module, entry.key ]);
                    }

                    var search = new IMu.Request.Search();
                    search.findKeys(keys, function()
                    {
                        self.widget.search = search;
                        self.viewer.showSearch(search);
                    });
                }
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/components/keyword-search.js
*/
(function(theme)
{
    theme.views.register('keyword-search',
    {
        _source: 'darwin/common/components/keyword-search',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);
            },

            _create: function()
            {
                this._super.apply(this, arguments);

                var placeholder = IMu.string('keyword-search-placeholder');
                if (placeholder != 'keyword-search-placeholder')
                    this.input.attr('placeholder', placeholder);

                if (this.getOption('showSubmit'))
                {
                    this.submit.attr('title',
                    IMu.string('keyword-search-submit'));
                }
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/viewers/combined-viewer.js
*/
(function(theme)
{
    theme.views.register('combined-viewer', 'viewer',
    {
        _source: 'darwin/common/components/combined-viewer',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.header = undefined;
                this.resultHits = undefined;
                this.spinner = undefined;
                this.icons = undefined;
                this.overlay = undefined;

                this.list = undefined;
            },

            _create: function()
            {
                var self = this; 
                self._super.apply(self, arguments);

                var widget = self.widget;

                self.header = self.holder.child('div', 'header');

                var results = self.header.child('span', 'results');//.child('span', 'hits');
                results.child('span').text(IMu.string('combined-viewer-results') + ': ');
                self.resultHits = results.child('span', 'hits');

                self.spinner = results.child('span', 'spinner').child('img');
                self.spinner.attr('src', IMu.Request.getURL('Image')
                    + '&name=spinner');
                self.spinner.hide();

                self.icons = self.header.child('span', 'icons');

                self.overlay = self.holder.child('div', 'overlay');

                self.makeViews();
            },

            makeViews: function()
            {
                var self = this;

                var widget = self.widget;

                for (var i = 0; i < widget.list.length; i++)
                {
                    (function(item, index)
                    {
                        if (item.elem)
                            item.elem.remove();

                        item.img = self.icons.child('div', 
                            'icon icon-' + (index + 1),
                            item.icon + '-icon'
                        );

                        // TODO: need to be able to remove class when deselected
                        if (index === widget.selected)
                            item.img.addClass('selected');

                        item.img.attr('title', IMu.string(item.title));
                        item.img.click(function()
                        {
                            widget.select(index);
                        });

                        self.holder.append(item.elem);

                        if (index == widget.selected)
                        {
                            item.elem.visible(true);
                            item.widget.resize();
                        }

                    })(widget.list[i], i);
                }
            },

            resize: function()
            {
            },

            select: function(index, offset)
            {
                this.overlay.empty();

               // this.resize();

                for (var i = 0; i < this.widget.list.length; i++)
                {
                    if (i == index)
                        continue;
                    
                    var item = this.widget.list[i];
                    item.img.removeClass('selected');
                    item.elem.hide();
                }

                var item = this.widget.list[index];
                item.img.addClass('selected');
                item.elem.show();
                item.widget.showSearch(this.widget.search, offset);
            },

            drawResultCount: function(count)
            {
                if (count === undefined)
                    count = '';
                this.resultHits.text(count);
            },

            setOffset: function(offset)
            {
                this.resize();
                for (var i = 0; i < this.widget.list.length; i++)
                {
                    var item = this.widget.list[i];
                    if (i == this.widget.selected)
                        item.widget.showSearch(this.widget.search, offset);
                }
            },

            setSearch: function(search)
            {
                this.overlay.empty();

                var count = 0;
                if (search.hits && search.hits.modules)
                {
                    for (var i = 0; i < search.hits.modules.length; i++)
                        count += search.hits.modules[i].hits;
                }
                this.drawResultCount(count);
                this.endDelay();
            },

            showError: function(error)
            {
                var message = IMu.string('search-error-message');
                message = IMu.Format.formatParams(message, [error.id]);

                this.overlay.child('div', 'error').text(message);

                IMu.log('Search Error', error.args);
            },

            updateResultCount: function()
            {
                this.overlay.empty();
                this.drawResultCount();
            },

            /* Public
            */
            beginDelay: function()
            {
                this.overlay.empty();
                this.resultHits.hide();
                this.spinner.show();
            },

            endDelay: function()
            {
                this.overlay.empty();
                this.spinner.hide();
                this.resultHits.show();
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/viewers/vertical-viewer.js
*/
(function(theme)
{
    theme.views.register('vertical-viewer',
    {
        _source: 'darwin/common/viewers/vertical-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;
                
                self._super.apply(self, arguments);
                self.widget.owner.addClass('imu-vertical-viewer');
/*
                self.scrollerOptions.onResize = function(info)
                {
                    self.getMinRecordSize(
                    {
                        empty: false,
                        callback: function()
                        {
                            self.scrollerResize(info);
                        }
                    });
                    
                    self.scrollerResize(info);
                };
*/                
            },

            _create: function()
            {
                this._super.apply(this, arguments);
            },

            getMinRecordSize: function(options)
            {
                var self = this;

                options = options || {};

                var children = self.content.children();
                if (children.length == 0)
                {
                    window.setTimeout(function()
                    {
                        self.getMinRecordSize(options);
                    }, 5);
                    return;
                }

                var contentWidth = self.content.css('width');
                if (contentWidth == '0px')
                {
                    window.setTimeout(function()
                    {
                        self.getMinRecordSize(options);
                    }, 5);
                    return;
                }

                var child = jQuery(children[0]);
                var width = child.fullWidth();
                var height = child.fullHeight();
                if (width <= 0 || height <= 0)
                {
                    window.setTimeout(function()
                    {
                        self.getMinRecordSize();
                    }, 5);
                    return;
                }

                var margin = parseInt(child.css('margin-left'), 10)
                           + parseInt(child.css('margin-right'), 10);

                width -= margin;
                
                if (options.empty !== false)
                    self.content.empty();

                var changed = false;

                if (self.minRecordWidth != width)
                {
                    self.minRecordWidth = width;
                    changed = true;
                }

                self.log('getMinRecordSize: minRecordWidth {0}', self.minRecordWidth);
                
                if (self.minRecordHeight != height)
                {
                    self.recordHeight = height;
                    changed = true;
                }

                self.log('getMinRecordSize: recordHeight {0}', self.recordHeight);

                self.scroller.setOptions
                ({
                    wheelMove: self.recordHeight,
                    verticalSnap: self.recordHeight
                });

                if(options.callback)
                    options.callback(changed);
            },

            locateRecord: function(offset, div)
            {
                this._super.apply(this, arguments);
                div.css(
                {
                    'height': '',
                    'width': ''
                });
            },

            createRecord: function(offset)
            {
                var record = jQuery('<div class="record"></div>');

                if (offset === undefined)
                    return record.appendTo(this.content);

                // If this is the largest offset value, append to the end
                // of the list
                if (offset >= this.cache.length)
                    return record.appendTo(this.content);

                // ...otherwise insert before appropriate element
                for (var i = offset; i < this.cache.length; i++)
                {
                    if (! this.cache.hasOwnProperty(i))
                        continue;

                    return record.insertBefore(this.cache[i]);
                }

                return record.appendTo(this.content);
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/viewers/list-viewer.js
*/
(function(theme)
{
    theme.views.register('list-viewer', 'vertical-viewer',
    {
        _source: 'darwin/common/viewers/list-viewer',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments)

                this.columns = 'list';
                this.pageSize = 20;

                IMu.Events.bind('list-record-created',
                function(e, record)
                {
                    if (! record)
                        return;

                    record.trigger('imu-record-created');
                });
            },

            create_layout: function(owner, data)
            {
                var self = this;

                var holder = jQuery('<button class="holder"></button>');
                holder.click(function()
                {
                    self.widget.recordSelected(data.rid, data.offset);
                });

                var image = holder.child('div', 'image');
                var imagePlaceholder = image.child('div', 'placeholder');
                var details = holder.child('div', 'details');

                if (this.widget.options.showSelectionControl)
                {
                    var fav = jQuery('<div class="favorite"></div>');
                    this.showSelectionControl(fav, data);
                    holder.after(fav);
                }

                return {
                    'image': image,
                    'imagePlaceholder': imagePlaceholder,
                    'details': details,
                    'holder': holder,
                    'record': owner
                }
            },
            
            makeMedia: function(layout, data)
            {
                if (! data.image)
                    return;

                layout.imagePlaceholder.detach();
                layout.imagePlaceholder = undefined;

                var mm = new IMu.Request.Multimedia();
                mm.setKey(data.image.irn);
                mm.addFilter('kind', 'ne', 'supplementary');
                mm.addFilter('height', 'bf', '400');
                mm.addFilter('width', 'bf', '400');
                mm.addModifier('format', 'jpg');
                var src = mm.getURL();

                layout.image.child('div').css(
                {
                    'background-image': 'url(' + src + ')'
                });
            },

            makeTitle: function(layout, titleTxt)
            {
                var record = layout.record;
                var details = layout.details;

                var title = details.child('h3', 'title');
                title.text(titleTxt);

                if (! record)
                    return;

                record.one('imu-record-created', function(e)
                {
                    var maxHeight = title.css('max-height');
                    if (maxHeight == 'none' || maxHeight == '')
                        return;

                    title.css('max-height', '100%');

                    var minHeight = title.css('min-height');
                    if (minHeight == '0px')
                        minHeight = '';

                    title.css('min-height', maxHeight);
                    title.IMuEllipsis();

                    title.css(
                    {
                        'min-height': '',
                        'max-height': ''
                    });
                });
            },

            /* Public
            */
            create_other: function(owner, data)
            {
                var layout = this.create_layout(owner, data);
                
                var titleTxt = data.title || data.SummaryData || '';
                this.makeTitle(layout, titleTxt);

                layout.holder.appendTo(owner);
                IMu.Events.trigger('list-record-created', owner);
            },

            collectionChanged: function()
            {
            },

            resize: function()
            {
                var css =
                {
                    'height': '',
                    'position': '',
                    'width': ''
                };

                this.holder.css(css);
                
                this.scroller.resize();

                this.scroller.holder.css(css);
                this.scroller.view.css(css);
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/viewers/list-viewer/emultimedia.js
*/
(function(theme)
{
    theme.views.register('list-viewer',
    {
        _source: 'darwin/common/viewers/list-viewer/emultimedia',

        all:
        {
            create_emultimedia: function(owner, data)
            {
                var layout = this.create_layout(owner, data);

                this.makeMultimediaMedia(layout, data);

                this.makeMultimediaDetails(layout, data);                

                owner.addClass('emultimedia-record');
                layout.holder.appendTo(owner);
                IMu.Events.trigger('list-record-created', owner);
            },

            makeMultimediaDetails: function(layout, data)
            {
                var titleTxt = data.title || data.SummaryData || '';
                this.makeTitle(layout, titleTxt);
            },

            makeMultimediaMedia: function(layout, data)
            {
                var type = (data.type || 'unknown').toLowerCase();
                if (type == 'application')
                    type = 'document';

                if (type != 'image')
                {
                    layout.imagePlaceholder.addClass(type + '-placeholder');
                    return;
                }

                layout.imagePlaceholder.detach();
                layout.imagePlaceholder = undefined;

                var mm = new IMu.Request.Multimedia();
                mm.setKey(data.irn);
                mm.addFilter('kind', 'ne', 'supplementary');
                mm.addFilter('height', 'bf', '400');
                mm.addFilter('width', 'bf', '400');
                mm.addModifier('format', 'jpg');
                var src = mm.getURL();

                layout.image.child('div').css(
                {
                    'background-image': 'url(' + src + ')'
                });
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/viewers/lightbox-viewer.js
*/
(function(theme)
{
    theme.views.register('lightbox-viewer', 'vertical-viewer',
    {
        _source: 'darwin/common/viewers/lightbox-viewer',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.columns = 'lightbox';
                this.pageSize = 20;

                IMu.Events.bind('lightbox-record-created',
                function(e, record)
                {
                    if (! record)
                        return;

                    record.trigger('imu-record-created');
                });
            },

            create_layout: function(owner, data)
            {
                var self = this;

                var holder = jQuery('<button class="holder"></button>');
                holder.click(function()
                {
                    self.widget.recordSelected(data.rid, data.offset);
                });

                var image = holder.child('div', 'image');
                var imagePlaceholder = image.child('div', 'placeholder');
                var details = holder.child('div', 'details');

                if (this.widget.options.showSelectionControl)
                {
                    var fav = jQuery('<div class="favorite"></div>');
                    this.showSelectionControl(fav, data);
                    holder.after(fav);
                }

                return {
                    'image': image,
                    'imagePlaceholder': imagePlaceholder,
                    'details': details,
                    'holder': holder,
                    'record': owner
                }
            },

            makeMedia: function(layout, data)
            {
                if (! data.image)
                    return;

                layout.imagePlaceholder.detach();
                layout.imagePlaceholder = undefined;

                var mm = new IMu.Request.Multimedia();
                mm.setKey(data.image.irn);
                mm.addFilter('kind', 'ne', 'supplementary');
                mm.addFilter('height', 'bf', '400');
                mm.addFilter('width', 'bf', '400');
                mm.addModifier('format', 'jpg');
                var src = mm.getURL();

                layout.image.child('div').css(
                {
                    'background-image': 'url(' + src + ')'
                });
            },

            makeTitle: function(layout, titleTxt)
            {
                var record = layout.record;
                var details = layout.details;

                var title = details.child('h3', 'title');
                title.text(titleTxt);

                if (! record)
                    return;

                record.one('imu-record-created', function(e)
                {
                    var maxHeight = title.css('max-height');
                    if (maxHeight == 'none' || maxHeight == '')
                        return;

                    title.css('max-height', '100%');

                    var minHeight = title.css('min-height');
                    if (minHeight == '0px')
                        minHeight = '';

                    title.css('min-height', maxHeight);
                    title.IMuEllipsis();

                    title.css(
                    {
                        'min-height': '',
                        'max-height': ''
                    });
                });
            },

            /* Public
            */
            create_other: function(owner, data)
            {
                var layout = this.create_layout(owner);
                
                layout.image.addClass('unknown-placeholder');

                var titleTxt = data.title || data.SummaryData || '';
                this.makeTitle(layout, titleTxt);
                
                layout.holder.appendTo(owner);
                IMu.Events.trigger('lightbox-record-created', owner);
            },
            
            resize: function()
            {
                var self = this;

                var tmpRecord = this.createRecord();

                this.getMinRecordSize(
                {
                    empty: false,
                    callback: function(changed)
                    {
                        tmpRecord.detach();

                        // Not terribly efficient or accurate
                        if (changed)
                        {
                            self.scroller.content.hide();
                            for (var index in self.cache)
                            {
                                if (! self.cache.hasOwnProperty(index))
                                    continue;

                                self.loadRecord(index - 0, false);
                            }
                            self.scroller.content.show();
                        }
                    }
                });

                var css =
                {
                    'height': '',
                    'position': '',
                    'width': ''
                };
                
                this.holder.css(css);

                this.scroller.resize();

                this.scroller.holder.css(css);
                this.scroller.view.css(css);
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/viewers/lightbox-viewer/eparties.js
*/
(function(theme)
{
    theme.views.register('lightbox-viewer',
    {
        _source: 'darwin/common/viewers/lightbox-viewer/eparties',

        all:
        {
            create_eparties: function(owner, data)
            {
                var layout = this.create_layout(owner, data);

                layout.imagePlaceholder.addClass('party-placeholder');

                if (this.makePartiesMedia)
                    this.makePartiesMedia(layout, data);
                else
                    this.makeMedia(layout, data);

                var type = (data.partyType || '').toLowerCase();
                switch (type)
                {
                    //TODO: add types

                    default:
                        this.makePartiesDetails(layout, data);
                        break;
                }

                owner.addClass('eparties-record');
                layout.holder.appendTo(owner);
                IMu.Events.trigger('lightbox-record-created', owner);
            },

            makePartiesDetails: function(layout, data)
            {
                this.makeTitle(layout, data.SummaryData);
            },
            
            makePartiesPersonDetails: function(layout, data)
            {
                var titleTxt = '';
                if (data.firstName && data.lastName)
                    titleTxt = data.lastName + ', ' + data.firstName;
                else if (data.firstName || data.lastName)
                    titleTxt = (data.lastName || '') + (data.firstName || '');
                else
                    titleTxt = data.SummaryData;

                this.makeTitle(layout, titleTxt);
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/viewers/lightbox-viewer/emultimedia.js
*/
(function(theme)
{
    theme.views.register('lightbox-viewer',
    {
        _source: 'darwin/common/viewers/lightbox-viewer/emultimedia',

        all:
        {
            create_emultimedia: function(owner, data)
            {
                var layout = this.create_layout(owner, data);

                this.makeMultimediaMedia(layout, data);

                this.makeMultimediaDetails(layout, data);

                owner.addClass('emultimedia-record');
                layout.holder.appendTo(owner);
                IMu.Events.trigger('lightbox-record-created', owner);
            },

            makeMultimediaDetails: function(layout, data)
            {
                var titleTxt = data.title || data.SummaryData || '';
                this.makeTitle(layout, titleTxt);
            },

            makeMultimediaMedia: function(layout, data)
            {
                var type = (data.type || 'unknown').toLowerCase();
                if (type == 'application')
                    type = 'document';

                if (type != 'image')
                {
                    layout.imagePlaceholder.addClass(type + '-placeholder');
                    return;
                }

                layout.imagePlaceholder.detach();
                layout.imagePlaceholder = undefined;

                var mm = new IMu.Request.Multimedia();
                mm.setKey(data.irn);
                mm.addFilter('kind', 'ne', 'supplementary');
                mm.addFilter('height', 'bf', '400');
                mm.addFilter('width', 'bf', '400');
                mm.addModifier('format', 'jpg');
                var src = mm.getURL();

                layout.image.child('div').css(
                {
                    'background-image': 'url(' + src + ')'
                });
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/viewers/record-details.js
*/
(function(theme)
{
    theme.views.register('record-details', 'paged-viewer',
    {
        _source: 'darwin/common/viewers/record-details',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.showSaveMultimedia = undefined;
            },

            _create: function()
            {
                this._super.apply(this, arguments);
            },

            resize: function()
            {
                this._super.apply(this, arguments);
            },

            collectionChanged: function()
            {
            },

            /* Public
            */
            addDetail: function(label, value)
            {
                if (this instanceof jQuery)
                    var d = this.child('div');
                else
                    var d = jQuery('<div></div>');

                if (IMu.Type.isArray(value))
                    value = value.join(', ');

                return {
                    'label': d.child('div', 'label').text(IMu.string(label || '')),
                    'value': d.child('div', 'value').append(value || '')
                };
            },

            addTable: function(label, values, keys)
            {
                if (this instanceof jQuery)
                    var d = this.child('div');
                else
                    var d = jQuery('<div></div>');

                if (! keys)
                {
                    keys = [];
                    if (values.length)
                    {
                        for (var key in values[0])
                            if (values[0].hasOwnProperty(key))
                                keys.push(key);
                    }
                }

                var table = jQuery('<table></table>');
                var tbody = table.child('tbody');

                for (var i = 0; i < values.length; i++)
                {
                    var tr = tbody.child('tr');
                    for (var j = 0; j < keys.length; j++)
                    {
                        var key = keys[j];
                        tr.child('td', key).text(values[i][key] || '');
                    }
                }
                
                return { 
                    'label': d.child('div', 'label').text(IMu.string(label || '')),
                    'value': d.child('div', 'value').append(table)
                }
            },

            addNestedTable: function(label, values, keys)
            {
                if (this instanceof jQuery)
                    var d = this.child('div');
                else
                    var d = jQuery('<div></div>');

                if (! keys)
                {
                    keys = [];
                    if (values.length)
                    {
                        for (var key in values[0])
                            if (values[0].hasOwnProperty(key))
                                keys.push(key);
                    }
                }

                var tables = [];

                for (var i = 0; i < values.length; i++)
                {
                    var tableValues = values[i];

                    var table = jQuery('<table></table>');
                    var tbody = table.child('tbody');
                    
                    // Find number of rows
                    var length = 0;
                    for (var j = 0; j < keys.length; j++)
                    {
                        var key = keys[j];
                        if (! tableValues.hasOwnProperty(key))
                            continue;

                        if (tableValues[key] == null)
                            tableValues[key] = [];
                        else if (tableValues[key].length > length)
                            length = tableValues[key].length;
                    }

                    // Create rows
                    for (var j = 0; j < length; j++)
                    {
                        var tr = tbody.child('tr');
                        for (var k = 0; k < keys.length; k++)
                        {
                            var key = keys[k];
                            tr.child('td', key).text(tableValues[key][j] || '');
                        }
                    }

                    tables.push(table);
                }

                return {
                    'label': d.child('div', 'label').text(IMu.string(label || '')),
                    'value': d.child('div', 'value').append(tables)
                };
            },

            addSection: function(title, owner)
            {
                title = title || '';

                var section = jQuery('<section></section>');
                section.addClass(title);
                
                if (title)
                    title = 'label-' + title + '-section';
            
                section.child('h4', 'section-title').text(IMu.string(title));

                section.addDetail = this.addDetail;
                section.addTable = this.addTable;
                section.addNestedTable = this.addNestedTable;

                if (owner)
                    section.appendTo(owner);

                return section;
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/viewers/details-viewer.js
*/
(function(theme)
{
    theme.views.register('details-viewer', 'record-details',
    {
        _source: 'darwin/common/viewers/details-viewer',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments)

                jQuery.extend(this.scrollerOptions,
                {
                    horizontalPager: true,
                    horizontalScrollbar: true,
                    horizontalSnap: '100%',
                    scrollType: 'horizontal'
                });
                this.scrollerOptions.mouseDrag = false;

                this.columns = 'details';
                this.pageSize = 5;

                // set by scrollerResize
                this.recordWidth = undefined;
                this.recordHeight = undefined;

                IMu.Events.bind('details-record-created',
                function(e, record)
                {
                    if (! record)
                        return;

                    record.trigger('imu-record-created');
                });
            },

            create_layout: function(owner)
            {
                var holder = jQuery('<div class="holder"></div>');
                var image = holder.child('div', 'image');

                return {
                    'image': image,
                    'imagePlaceholder': image.child('div', 'placeholder'),
                    'details': holder.child('div', 'details'),
                    'holder': holder,
                    'record': owner
                }
            },

            makeTitle: function(layout, titleTxt)
            {
                var record = layout.record;
                var details = layout.details;

                var title = details.child('h3', 'title');
                title.text(titleTxt || '');

                if (! record)
                    return;

                record.one('imu-record-created', function(e)
                {
                    var maxHeight = title.css('max-height');
                    if (maxHeight == 'none' || maxHeight == '')
                        return;

                    title.css('max-height', '100%');

                    var minHeight = title.css('min-height');
                    if (minHeight == '0px')
                        minHeight = '';

                    title.css('min-height', maxHeight);
                    title.IMuEllipsis();

                    title.css(
                    {
                        'min-height': '',
                        'max-height': ''
                    });
                });
            },

            /* Public
            */
            create_other: function(owner, data)
            {
                var layout = this.create_layout(owner);
                
                var titleTxt = data.title || data.SummaryData || '';
                this.makeTitle(layout, titleTxt);
                
                layout.holder.appendTo(owner);
                IMu.Events.trigger('details-record-created', owner);
            },

            collectionChanged: function()
            {
            },

            // called from paged-viewer
            getFrameRange: function(width, height, frame)
            {
                return {
                    'first': Math.round(frame.left / width),
                    'last': Math.floor((frame.left + width) / width)
                };
            },

            locateRecord: function(offset, div)
            {
                var left = offset * this.recordWidth;
                var top = 0;

                var width = this.recordWidth;
                var height = this.recordHeight;

                div.left(left);
                div.top(top);
                div.fullWidth(width);
                div.fullHeight(height);
                div.visible(true);
            },

            makeMedia: function(layout, data)
            {
                var self = this;

                if (! data.image)
                    return;

                var mm = new IMu.Request.Multimedia();
                mm.setKey(data.image.irn);
                mm.addFilter('kind', 'ne', 'supplementary');
                mm.addFilter('height', 'bf', '800');
                mm.addFilter('width', 'bf', '800');
                mm.addModifier('format', 'jpg');
                var src = mm.getURL();

                var image = layout.image.child('div');
                image.css('background-image', 'url(' + src + ')');
                image.click(function()
                {
                    self.showImage(data.image.irn);
                });

                layout.imagePlaceholder.detach();
            },

            resize: function()
            {
                this.scroller.resize();
            },

            scrollerResize: function(info)
            {
                if (! this.widget.results)
                    return;

                var currentContentOffset = this.content.offset();

                this.content.fullHeight(info.height);
                var contentHeight = this.content.height();
                this.log('scrollerResize: contentHeight {0}', contentHeight);

                this.recordWidth = info.width;
                this.recordHeight = contentHeight;

                var contentWidth = this.recordWidth * this.widget.hits;
                this.log('scrollerResize: contentWidth {0}', contentWidth);
                this.content.width(contentWidth);

                var offset = this.widget.offset;
                if (offset !== undefined)
                {
                    var left = info.width * offset * -1;
                    this.content.css('left', left);

                    /* There was an issue with records not being resized so 
                    ** explicitly resize thecurrent, next and previous records in 
                    ** the cache.
                    */
                    if (this.cache[offset - 1])
                        this.locateRecord(offset - 1, this.cache[offset - 1]);
                    if (this.cache[offset])
                        this.locateRecord(offset, this.cache[offset]);
                    if (this.cache[offset + 1])
                        this.locateRecord(offset + 1, this.cache[offset + 1]);
                }
            },

            setOffset: function(offset)
            {
                var pos =
                {
                    left: offset * this.recordWidth,
                    top: 0
                };

                this.log('setOffset: offset {0} recordWidth {1} pos {2}',
                    offset, this.recordWidth, pos);

                this.scroller.scrollTo(pos);
            },

            showImage: function(irn)
            {
                var mm = new IMu.Request.Multimedia();
                mm.setKey(irn);
                mm.addFilter('height', 'bf', '800');
                mm.addFilter('width', 'bf', '800');
                mm.addFilter('kind', 'ne', 'supplementary');
                mm.addModifier('format', 'jpg');
                
                var url = mm.getURL();
                jQuery.slimbox(url);
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/viewers/details-viewer/emultimedia.js
*/
(function(theme)
{
    theme.views.register('details-viewer',
    {
        _source: 'darwin/common/viewers/details-viewer/emultimedia',

        all:
        {
            create_emultimedia: function(owner, data)
            {
                var layout = this.create_layout(owner, data);

                this.makeMultimediaMedia(layout, data);

                this.makeMultimediaDetails(layout, data);

                this.makeMultimediaResolutions(layout, data);
                
                this.makeMultimediaSupplementaries(layout, data);

                this.makeMultimediaExif(layout, data);
                this.makeMultimediaIptc(layout, data);
                this.makeMultimediaXMP(layout, data);

                owner.addClass('emultimedia-record');
                layout.holder.appendTo(owner);
                IMu.Events.trigger('details-record-created', owner);
            },
            
            makeMultimediaExif: function(layout, data)
            {
                if (! data.exif || ! data.exif.length)
                    return;
                
                var exifSection = this.addSection('exif');
                
                // Table content
                //
                var colOrder =
                [
                    'ifd', 
                    'tag',
                    'name',
                    'value'
                ];

                var table = exifSection.addTable('', data.exif, colOrder)
                .value.children('table')[0];

                // Table title
                //
                jQuery(
                    '<thead><tr>' +
                        '<th>' + IMu.string('label-exif-ifd') + '</th>' +
                        '<th>' + IMu.string('label-exif-tag') + '</th>' +
                        '<th>' + IMu.string('label-exif-name') + '</th>' +
                        '<th>' + IMu.string('label-exif-value') + '</th>' +
                    '</tr></thead>'
                ).prependTo(table);

                layout.holder.append(exifSection);
            },

            makeMultimediaDetails: function(layout, data)
            {
                var titleTxt = data.title || data.SummaryData || '';
                this.makeTitle(layout, titleTxt);

                var sections = [];

                var descriptionSection = this.addSection('');

                sections.push(descriptionSection);

                descriptionSection.addDetail('label-creators',
                    data.creators);

                descriptionSection.addDetail('label-media-type',
                    (function(type, format)
                    {
                        if (type && format)
                            return type + '/' + format;
                        return type + format;
                    })(data.mimeType || '', data.mimeFormat || ''));

                descriptionSection.addDetail('label-description',
                    data.description);

                descriptionSection.addDetail('label-resource-type',
                    data.resourceType);

                descriptionSection.addDetail('label-language',
                    data.language);

                descriptionSection.addDetail('label-publisher',
                    data.publisher);

                descriptionSection.addDetail('label-contributor',
                    data.contributors);

                descriptionSection.addDetail('label-source',
                    data.source);

                descriptionSection.addDetail('label-rights',
                    data.rights);

                descriptionSection.addDetail('label-audience',
                    data.audience);

                
                var mediaAttributesSection = this.addSection();

                sections.push(mediaAttributesSection);

                mediaAttributesSection.addDetail('label-media-form',
                    data.mediaForm);

                mediaAttributesSection.addDetail('label-file-size',
                    data.fileSize);

                mediaAttributesSection.addDetail('label-check-sum',
                    data.checkSum);


                if (data.mimeType == 'image' || data.mimeType == 'video')
                {
                    var image_videoSection = this.addSection();

                    sections.push(image_videoSection);

                    image_videoSection.addDetail('label-resolution',
                        data.resolution);

                    image_videoSection.addDetail('label-dimensions',
                        (function(w, h)
                        {
                            if (w && h)
                                return w + ' x ' + h;
                            else
                                return w + h;
                        })(data.width || '', data.height || ''));

                    image_videoSection.addDetail('label-colour-depth',
                        data.colourDepth);

                    image_videoSection.addDetail('label-film-length',
                        data.filmLength);
                }


                if (data.mimeType == 'audio' || data.mimeType == 'video')
                {
                    var audioAttributesSection = this.addSection();
                    
                    sections.push(audioAttributesSection);

                    audioAttributesSection.addDetail('label-samples-per-second',
                        data.samplesPerSecond);
                    
                    audioAttributesSection.addDetail('label-bits-per-sample',
                        data.bitsPerRow);

                    audioAttributesSection.addDetail('label-number-of-channels',
                        data.numChannels);

                    audioAttributesSection.addDetail('label-duration',
                        data.audioDuration);
                }


                layout.details.append(sections);
            },

            makeMultimediaIptc: function(layout, data)
            {
                if (! data.iptc || ! data.iptc.length)
                    return;
                
                var iptcSection = this.addSection('iptc');
                
                // Table content
                //
                var colOrder =
                [
                    'record', 
                    'tag',
                    'name',
                    'value'
                ];

                var table = iptcSection.addTable('', data.iptc, colOrder)
                .value.children('table')[0];

                // Table title
                //
                jQuery(
                    '<thead><tr>' +
                        '<th>' + IMu.string('label-iptc-record') + '</th>' +
                        '<th>' + IMu.string('label-iptc-tag') + '</th>' +
                        '<th>' + IMu.string('label-iptc-name') + '</th>' +
                        '<th>' + IMu.string('label-iptc-value') + '</th>' +
                    '</tr></thead>'
                ).prependTo(table);

                layout.holder.append(iptcSection);
            },

            makeMultimediaMedia: function(layout, data)
            {
                var self = this;

                var type = (data.mimeType || 'unknown').toLowerCase();

                if (type == 'application')
                    type = 'document';
                
                layout.imagePlaceholder.addClass(type + '-placeholder');

                if (! data.Multimedia)
                    return;

                if (type == 'image')
                {
                    var mm = new IMu.Request.Multimedia();
                    mm.setKey(data.irn);
                    mm.addFilter('kind', 'resolution');
                    mm.addFilter('height', 'bf', '800');
                    mm.addFilter('width', 'bf', '800');
                    mm.addModifier('format', 'jpg');
                    var src = mm.getURL();

                    var image = layout.image.child('div');
                    image.css('background-image', 'url(' + src + ')');
                    image.click(function()
                    {
                        self.showImage(data.irn);
                    });

                    layout.imagePlaceholder.detach();
                    layout.imagePlaceholder == undefined;
                }
                else
                {

                    if (type == 'video' || type == 'audio')
                    {
                        //layout.image = layout.imagePlaceholder.child('div', 'placeholder');
                        
                        var mm = layout.imagePlaceholder.IMuMultimedia();
//                        var mm = layout.imagePlaceholder.child('div').IMuMultimedia();
                        mm.addResourceByKey(data.irn);
                    }
                    else
                    {
                        layout.imagePlaceholder.detach();

                        var href = IMu.Request.getURL('Multimedia') 
                            + '&method=fetch&key=' + data.irn;

                        layout.imagePlaceholder = layout.image.child('a',
                        {
                            'class': 'placeholder ' + type + '-placeholder',
                            'href': href
                        });
                    }
                }

            },

            makeMultimediaResolutions: function(layout, data)
            {
                if (! data.resolutions || ! data.resolutions.length)
                    return;

                var resolutionsSection = this.addSection('resolutions');

                // Table content
                //
                var colOrder =
                [
                    'identifier',
                    'mime',
                    'colourSpace',
                    'imageType', 
                    'bitsPerPixel',
                    'numberColours',
                    'resolution',
                    'dimensions',
                    'fileSize'
                ];

                var values = (function(resolutions)
                {
                    for (var i = 0; i < resolutions.length; i++)
                    {
                        var res = resolutions[i];

                        if (res.mimeType && res.mimeFormat)
                            res.mime = res.mimeType + '/' +res.mimeFormat;
                        else 
                            res.mime = (res.mimeType || '') + (res.mimeFormat || '');

                        res.dimensions = (res.width || '') 
                            + 'x' + (res.height || '')
                    }

                    return resolutions;
                })(data.resolutions);
                
                var table = resolutionsSection.addTable('', values, colOrder)
                .value.children('table')[0];

                // Table title
                //
                jQuery(
                    '<thead><tr>' +
                        '<th>' + IMu.string('label-identifier') + '</th>' +
                        '<th>' + IMu.string('label-media-type') + '</th>' +
                        '<th>' + IMu.string('label-colour-space') + '</th>' +
                        '<th>' + IMu.string('label-image-type') + '</th>' +
                        '<th>' + IMu.string('label-colour-depth') + '</th>' +
                        '<th>' + IMu.string('label-number-colours') + '</th>' +
                        '<th>' + IMu.string('label-resolution') + '</th>' +
                        '<th>' + IMu.string('label-dimensions') + '</th>' +
                        '<th>' + IMu.string('label-file-size') + '</th>' +
                    '</tr></thead>'
                ).prependTo(table);

                layout.holder.append(resolutionsSection);
            },

            makeMultimediaSupplementaries: function(layout, data)
            {
                if (! data.supplementary || ! data.supplementary.length)
                    return;

                var supplementarySection = this.addSection('supplementary');

                // Table content
                //
                var table = supplementarySection.addTable('',
                    (function(supplementaries)
                    {
                        for (var i = 0; i < supplementaries.length; i++)
                        {
                            var sup = supplementaries[i];

                            if (sup.mimeType && sup.mimeFormat)
                                sup.mime = sup.mimeType + '/' +sup.mimeFormat;
                            else 
                                sup.mime = (sup.mimeType || '') + (sup.mimeFormat || '');

                            sup.dimensions = (sup.width || '') 
                                + 'x' + (sup.height || '')

                            sup.usage = sup.usage || [];
                            sup.usage = sup.usage.join(', ');
                        }

                        return supplementaries;
                    })(data.supplementary),
                    [
                        'identifier', 'mime', 'usage',
                        'dimensions', 'fileSize'
                    ]).value.children('table')[0];

                // Table title
                //
                jQuery(
                    '<thead><tr>' +
                        '<th>' + IMu.string('label-identifier') + '</th>' +
                        '<th>' + IMu.string('label-media-type') + '</th>' +
                        '<th>' + IMu.string('label-usage') + '</th>' +
                        '<th>' + IMu.string('label-dimensions') + '</th>' +
                        '<th>' + IMu.string('label-file-size') + '</th>' +
                    '</tr></thead>'
                ).prependTo(table);

                layout.holder.append(supplementarySection);
            },

            makeMultimediaXMP: function(layout, data)
            {
                if (! data.XmpMetadata)
                    return;

                /* Strip out control (DATA LINK ESCAPE) characters.
                */
                var xmp = data.XmpMetadata.replace(/&#0010;/g, '');
                
                var items = this.parseXmp(xmp);
                if (! items)
                    return;

                var xmpSection = this.addSection('xmp');
                var div = xmpSection.child('div', 'items');

                for (var i = 0; i < items.length; i++)
                {
                    var item = items[i];

                    /* We only need to know about the children of 
                    ** 'Descripton' nodes.
                    */
                    if (! item.children)
                        continue;

                    var children = item.children;
                    var nameSpaces = item.nameSpaces;
                    var ns = children.nameSpaces;
                    var title = this.getXmpItemTitle(nameSpaces, ns);

                    var sub = div.child('div').text(title);
                    this.showXmpItem(sub, nameSpaces, ns, children);
                }

                layout.holder.append(xmpSection);
            },

            showXmpItem: function(owner, nameSpaces, baseNameSpace, items)
            {
                var ul = owner.child('ul');

                var ns = items.nameSpace;
                if (ns != baseNameSpace)
                {
                    var title = this.getXmpItemTitle(nameSpaces, ns);
                    if (title)
                    {
                        var li = ul.child('li');
                        li.text(title);
                        ul = li.child('ul');
                    }
                }

                for (var i = 0; i < items.list.length; i++)
                {
                    var item = items.list[i];

                    var li = ul.child('li');
                    li.child('span', 'element').text(item.name);

                    if (item.children)
                    {
                        if (this.isXmpContainer(item))
                            this.showXmpContainer(li, item);
                        else
                            this.showXmpItem(li, nameSpaces, baseNameSpace,
                                item.children);
                        continue;
                    }
                    if (item.value)
                    {
                        li.child('span').text(': ');
                        li.child('span', 'value').text(item.value);
                    }
                }
            },

            getXmpItemTitle: function(nameSpaces, ns)
            {
                var uri = nameSpaces[ns];
                var title;
                if (uri)
                {
                    var string;
                    var stringId = 'emultimedia-xmp-ns-' + ns;
                    if (IMu.string(stringId) != stringId)
                        string = IMu.string(stringId);

                    title = string || '';
                    title += ' (' + ns;
                    if (uri)
                        title += ', ' + uri;
                    title += ')';
                }
                return title;
            },

            isXmpContainer: function(item)
            {
                return (item.localName == 'Seq' || item.localName == 'Alt' ||
                        item.localName == 'Bag');
            },

            showXmpContainer: function(owner, item)
            {
                var name;
                var stringId = 'emultimedia-xmp-ns-' +
                    item.localName.toLowerCase();
                if (IMu.string(stringId) != stringId)
                    name = IMu.string(stringId);
                else
                    name = item.name;
                owner.child('span').text(' ');
                owner.child('span').text(name);

                var ul = owner.child('ul', 'value');
                var contents = item.children.list;
                for (var i = 0; i < contents.length; i++)
                {
                    if (! contents[i].value)
                        continue;
                    owner = ul.child('li');
                    owner.text('[' + (i + 1) + ']: ' + contents[i].value);
                }
            },

            /* Rudimentary XMP (RDF) parsing to JSON object.
            */
            parseXmp: function(xmp)
            {
                var self = this;

                var items = [];
                try
                {
                    var doc = jQuery.parseXML(xmp);

                    /* Cross-browser shenanigans.
                    */
                    var descriptions =
                        doc.getElementsByTagName('rdf:Description');
                    if (descriptions.length < 1)
                        descriptions = doc.getElementsByTagName('Description');
                    if (descriptions.length < 1)
                        return;

                    for (var i = 0; i < descriptions.length; i++)
                    {
                        var item = self.parseXmpNode(descriptions[i]);
                        if (item)
                            items.push(item);
                    }
                }
                catch (e)
                {
                    IMu.log('XMP parsing error: {0}', e);
                    return;
                }
                return items;
            },

            parseXmpNode: function(node)
            {
                var self = this;

                if (node.nodeType != 1) // 1: ELEMENT_NODE
                    return;

                var item = {};
                /* IE7 doesn't know about localName
                */
                item['localName'] = node.localName || node.baseName;
                item['name'] = node.nodeName;

                for (var i = 0; i < node.attributes.length; i++)
                {
                    var attribute = node.attributes[i];
                    if (! attribute.prefix || attribute.prefix != 'xmlns')
                        continue;

                    if (! item['nameSpaces'])
                        item['nameSpaces'] = {};

                    /* IE7 doesn't know about localName
                    */
                    var name = attribute.localName || attribute.baseName;
                    item['nameSpaces'][name] = attribute.nodeValue;
                }

                var children = [];
                var nameSpace;

                for (var i = 0; i < node.childNodes.length; i++)
                {
                    var childNode = node.childNodes[i];
                    if (childNode.nodeType == 8) // 8: COMMENT_NODE
                        continue;

                    if (childNode.nodeType == 3) // 3: TEXT_NODE
                    {
                        var value = jQuery.trim(childNode.nodeValue);
                        if (value != '')
                            item['value'] = value;
                        continue;
                    }

                    /* All elements on the same level should have the same
                    ** namespace.
                    */
                    var ns = childNode.prefix || childNode.nodeName;
                    if (nameSpace && ns != nameSpace)
                        throw new IMu.Error('BadXmpNamespace', ns);
                    nameSpace = ns;

                    var child = self.parseXmpNode(childNode);
                    children.push(child);
                }
                if (children.length > 0)
                {
                    item['children'] =
                    {
                        nameSpace: nameSpace,
                        list: children
                    };
                }
                return item;
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/viewers/collection-viewer.js
*/
(function(theme)
{
    theme.views.register('collection-viewer', 'lightbox-viewer',
    {
        _source: 'darwin/common/viewers/collection-viewer',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.columns = 'collection';
                this.pageSize = 50;
            },

            resize: function()
            {
            },

            setSearch: function(search)
            {
                var self = this;

                self.holder.empty();

                search.fetch('start', 0, -1, 'collection',
                function(result, success)
                {
                    if (! success || ! result.count)
                        return;

                    self.holder.empty();
                    var index = 0;

                    for (var i = 0; i < result.modules.length; i++)
                    {
                        var module = result.modules[i];
                        
                        var method = 'create_' + module.name;
                        if (! self[method])
                            method = 'create_other';

                        for (var j = 0; j < module.rows.length; j++)
                        {
                            var row = module.rows[j];

                            row.offset = index;
                            index++;

                            var record = self.holder.child('div', 
                                'record', module.name);
                            self[method](record, row);
                        }
                    }
                });
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/pages/welcome-page.js
*/
(function(theme)
{
    theme.views.register('welcome-page', 'page',
    {
        _source: 'darwin/common/pages/welcome-page',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);
                this.widget.owner.addClass('imu-welcome-page');

                this.titleText = undefined;
                this.subtitleText = undefined;

                this.categorySelection = undefined;
                this.categoryButtons = undefined;

                this.myCollection = undefined;
            },

            _create: function()
            {
                this._super.apply(this, arguments);
                
                this.createCategorySelection(
                    ['ecatalogue', 'ecollectionevents', 'eparties', 'emultimedia']);

                this.createMyCollectionSection();
            },

            createCategorySelection: function(categories)
            {
                var self = this;
                categories = categories || [];

                this.categorySelection = jQuery(
                    "<section class='category-selection'></section>");

                var holder = this.categorySelection.child('div', 'holder');
                
                this.titleText = holder.child('h1');
                this.subtitleText = holder.child('h2');

                
                this.categoryButtons = holder.child('div', 'categories');
                for(var i = 0; i < categories.length; i++)
                {
                    (function(owner, category)
                    {
                        var button = owner.child('button');

                        var src = IMu.Request.getURL('Image') 
                            + '&name=' + category + '-icon';

                        button.child('div', 'icon', category + '-icon');

                        button.child('a').text(IMu.string(category + '-module'));

                        button.click(function(e)
                        {
                            IMu.Events.trigger('open-' + category + '-search');
                            
                            var module = IMu.string(category + '-module');
                            module = module.toLowerCase();

                            IMu.URL.Hash.values = {};
                            IMu.URL.Hash.values[module + '-search'] = '';
                            IMu.URL.Hash.update();

                            e.preventDefault();
                        });
                    })(this.categoryButtons, categories[i]);
                };

                
                this.setTitleText();
                this.setSubtitleText();

                this.categorySelection.appendTo(this.content);
            },


            createMyCollectionSection: function()
            {
                this.myCollectionSection = jQuery(
                    "<section class='my-collection'></section>");

                var holder = this.myCollectionSection.child('div', 'holder');

                var toggleBtn = holder.child('div', 'header')
                    .child('button', 'toggle closed');

                var src = IMu.Request.getURL('Image') 
                    + '&name=my-collection-icon';

                toggleBtn.child('img', 'icon my-collection-icon').attr('src', src);

                toggleBtn.child('a', 'title').text(IMu.string('my-collection-module'));

                toggleBtn.child('div', 'icon toggle-icon');

                var myCollection = this.myCollection = 
                    holder.child('div', 'content hidden');

                toggleBtn.click(function()
                {
                    toggleBtn.toggleClass('closed open');
                    myCollection.toggleClass('hidden shown');
                });

                //TODO
                this.widget.collections = myCollection.IMu('my-collections',
                {
                    onRestoreGroup: function(group)
                    {
                        IMu.log('restore: group {0}', group);
                        
                        if (! this.search)
                            return;

                        IMu.Events.trigger('clear-search-results');
                        IMu.Events.trigger('begin-search-delay');
                        IMu.Events.trigger('open-keyword-search', 'closed');
                        
                        IMu.Events.trigger('show-search', this.search);
                    }
                });

                this.myCollectionSection.appendTo(this.content);
            },

            /* PUBLIC
            */

            setSubtitleText: function()
            {
                this.subtitleText.text(IMu.string('select-a-category'));
            },
            
            setTitleText: function()
            {
                this.titleText.text(IMu.string('welcome-page-message'));
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/pages/search-page.js
*/
(function(theme)
{
    theme.views.register('search-page', 'page',
    {
        _source: 'darwin/common/pages/search-page',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);
                self.widget.owner.addClass('imu-search-page');

                self.navigationSection = undefined;
                self.searchToggleBtn = undefined;
                self.searchSection = undefined;
                
                this.wrapper = undefined;

                IMu.Events.bind('begin-search-delay',
                function()
                {
                    self.widget.combinedViewer.view.beginDelay();
                });

                IMu.Events.bind('end-search-delay',
                function()
                {
                    self.widget.combinedViewer.view.endDelay();
                });

                IMu.Events.bind('clear-search-results',
                function()
                {
                    self.widget.combinedViewer.dropSearch();
                    self.widget.combinedViewer.updateResultCount();
                });

                IMu.Events.bind('clear-search-forms',
                function()
                {
                    var forms = self.searchTabs.widget.pages;
                    for (var i = 0; i < forms.length; i++)
                        forms[i].widget.clear();
                });

                IMu.Events.bind('show-search',
                function(e, search, options)
                {
                    self.toggleSearch('closed');
                    options = options || {};

                    var index = 0;
                    if (options.view)
                    {
                        var list = self.widget.combinedViewer.list;
                        for (var i = 0; i < list.length; i++)
                        {
                            if (options.view == list[i].type)
                            {
                                index = i;
                                break;
                            }
                        }
                    }
                    
                    self.widget.combinedViewer.select(index);

                    self.widget.combinedViewer.addState(search, options.offset);
                });

                IMu.Events.bind('show-search-error',
                function(e, response)
                {
                    self.widget.combinedViewer.view.showError(response);
                });
            },

            _create: function()
            {
                this._super.apply(this, arguments);

                this.wrapper = this.content.child('div', 'wrapper');

                this.navigationSection = this.wrapper.child('div', 'navigation');
                
                var backButton = this.navigationSection.child('button', 'back');
                backButton.text(IMu.string('back-button'));
                
                backButton.click(function(e)
                {
                    IMu.Events.trigger('open-welcome-page');
                    IMu.Events.trigger('clear-search-forms');
                    e.preventDefault();
                });

                this.createSearches();
                this.createResults();
            },

            createResults: function()
            {
                var results = this.resultsSection =
                    jQuery("<section class='results'></section>");
                
                var holder = results.child('div', 'holder');

                var combinedViewer = this.widget.combinedViewer = 
                    holder.child('div').IMu('combined-viewer');

                combinedViewer.add(
                {
                    'type': 'list-viewer', 
                    'options':
                    {
                        'recordsPerRow': 1
                    }
                });
                combinedViewer.add('lightbox-viewer');
                combinedViewer.add('details-viewer');

                results.appendTo(this.wrapper);
            },

            createSearches: function()
            {
                var self = this;

                var searches = self.searchSection = jQuery(
                    "<section class='searches closed'></section");

                var holder = searches.child('div', 'holder');

                var toggleBtn = self.searchToggleBtn = 
                    holder.child('div', 'header').child('button', 'toggle closed');

                toggleBtn.child('div', 'icon no-icon');

                self.searchTitleText = toggleBtn.child('a', 'title');
                self.setSearchTitleModule();

                toggleBtn.child('div', 'icon toggle-icon');

                var searchForms = self.searchForms =
                    holder.child('div', 'content hidden');

                toggleBtn.click(function()
                {
                    self.toggleSearch();
                });

                var tabbedDisplay = searchForms.child('div')
                .IMu('tabbed-display',
                {
                    showHeader: false
                });

                self.widget.searchTabs = tabbedDisplay;

                IMu.Events.bind('tabbed-display-view-created',
                function(e, widget)
                {
                    self.searchTabs = tabbedDisplay.view;
                });

                searches.appendTo(this.wrapper);
            },
            
            makeKeywordSearchForm: function()
            {
                var form = this.makeSearchForm();
                form.title = IMu.string('keywords');

                form.widget.add(
                [
                    {
                        column: 'keywords',
                        prompt: 'keywords',
                        type: 'text'
                    }
                ]);
            },

            makeSearchForm: function(module, options)
            {
                var self = this;

                options = options || {};
                
                var formOptions = 
                {
                    showSubmit: true,
                    onlyItemsWithImages: true
                };

                for (var key in options)
                {
                    formOptions[key] = options[key];
                }

                var form = self.widget.searchTabs.add('search-form', formOptions);

                if (module)
                    form.title = 'module-' + module;
               
                form.widget.setOptions(
                {
                    onSearch: function(terms, imagesOnly)
                    {
                        IMu.Events.trigger('begin-search-delay');
                        IMu.Events.trigger('clear-search-results');

                        self.toggleSearch('closed');

                        if (imagesOnly)
                            terms.add('MulHasMultiMedia', 'Y');

                        self.widget.parent.doSearch(terms, module, function(search)
                        {
                            IMu.Events.trigger('show-search', search);
                        });
                    }
                });

                return form;
            },

            resize: function()
            {
                var contentHeight = this.content.fullHeight();
                var wrapperPadding = 
                    parseInt(this.wrapper.css('padding-bottom'), 10) +
                    parseInt(this.wrapper.css('padding-top'), 10);
                var navHeight = this.navigationSection.fullHeight();
                
                var toggled = false;
                if (! this.searchForms.hasClass('hidden'))
                {
                    toggled = true;
                    this.searchForms.addClass('hidden');
                }

                var searchHeight = this.searchSection.fullHeight();
                
                if (toggled)
                    this.searchForms.removeClass('hidden');

                var height = contentHeight - navHeight 
                    - searchHeight - wrapperPadding;

                this.resultsSection.css('height', height);
            },

            /* PUBLIC
            */
            selectSearchTab: function(index)
            {
               this.searchTabs.widget.select(index);
            },

            setSearchTitleModule: function(moduleName)
            {
                var text = IMu.string('search-title');
                if (moduleName)
                {
                    moduleName = IMu.string(moduleName + '-module');
                    text = IMu.Format.formatParams(text, [moduleName]);
                }
                else
                    text = IMu.Format.formatParams(text, 
                        [IMu.string('keyword')]);
                
                this.searchTitleText.text(text);
            },

            toggleSearch: function(state)
            {
                var toggleBtn = this.searchToggleBtn;
                var searches = this.searchSection;
                var searchForms = this.searchForms;

                if (state == 'closed')
                {
                    toggleBtn.removeClass('open').addClass('closed');
                    searches.removeClass('open').addClass('closed');
                    searchForms.removeClass('show').addClass('hidden');
                }
                else if (state == 'open')
                {
                    toggleBtn.removeClass('closed').addClass('open');
                    searches.removeClass('closed').addClass('open');
                    searchForms.removeClass('hidden').addClass('show');
                }
                else if (state === undefined)
                {
                    toggleBtn.toggleClass('closed open');
                    searches.toggleClass('closed open');
                    searchForms.toggleClass('hidden show');
                }
                // else do nothing
            }
        }
    });
})(IMu.Themes.get('darwin'));

/* Source: ./themes/darwin/common/views/default-page.js
*/
/* This is more of a default-app than page
*/
(function(theme)
{
    theme.views.register('default-page', 'page',
    {
        _source: 'darwin/common/pages/default-page',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.header = undefined;
                this.tabs = undefined;

            },

            _create: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.header = jQuery("<section class='header'></section>");
                
                var src = IMu.Request.getURL('Image') + '&name=' + 'client-logo';
                self.header.child('div', 'logo').css(
                {
                    'background-image': 'url(' + src + ')'
                });

                var kwSearch = self.header.child('div', 'keyword-search');
                kwSearch.child('div').IMu('keyword-search',
                {
                    onSubmit: function(text)
                    {
                        IMu.Events.trigger('clear-search-results');
                        IMu.Events.trigger('begin-search-delay');
                        IMu.Events.trigger('open-keyword-search');

                        var terms = new IMu.Terms();
                        terms.add('keywords', text);

                        self.widget.doSearch(terms, undefined, function(search)
                        {
                            IMu.Events.trigger('show-search', search);
                        });
                    },

                    showLabel: false,
                    showSubmit: true
                });



                this.header.prependTo(this.holder);

                this.tabs = this.content.child('div', 'app-pages');
            },

            onSearchError: function(response)
            {
                IMu.Events.trigger('end-search-delay');
                IMu.Events.trigger('show-search-error', response);
            }
        }
    });
})(IMu.Themes.get('darwin'));
