(function(theme)
{
    theme.views.register('highlights-banner',
    {
        _source: 'shared/common/highlights-banner',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.stickyContent = undefined;
                this.dynamicContent = undefined;
                this.slides = [];
                this.currentSlide = null;
            },

            _create: function()
            {
                this._super.apply(this, arguments);

                var holder = jQuery("<div class='holder'></div>");
                
                /* Create elements in order of appearance.
                ** Ordering of elements rather than using css to position is 
                ** important for W3C accessibility.
                */
                var languageDir = undefined;
                if (IMu.Languages.current.dir == 'ltr')
                {
                    languageDir = 'ltr';
                    this.stickyContent = holder.child('div', 'stickyContent');
                    this.dynamicContent = holder.child('div', 'dynamicContent');
                }
                else
                {
                    languageDir = 'rtl';
                    this.dynamicContent = holder.child('div', 'dynamicContent');
                    this.stickyContent = holder.child('div', 'stickyContent');
                }
                
                /* The ltr/rtl css seems buggy.
                ** This is a hack.
                */
                this.widget.owner.removeClass('ltr rtl');
                this.widget.owner.addClass(languageDir);

                if (this.widget.options.loadNarrative)
                    this.beginDelay();

                this.widget.owner.append(holder);
            },

            /* Protected
            */
            addOtherSlide: function(slide, data, module)
            {
                module = module || '';

                var href = undefined;
                if (this.widget.options.linkFormat)
                {
                    /* NOTE: 
                    ** This logic allows for link formats
                    ** that expect the module and/or irn
                    ** or neither.
                    ** Additionally, this logic does not
                    ** protect against scenarios where
                    ** the developer has specified a link
                    ** format that requires this data but
                    ** it is not provided.
                    ** In such cases, the logic elsewhere
                    ** that handles interpreting the URL
                    ** will need to take care of this.
                    */
                    href = IMu.Format.formatParams(
                        this.widget.options.linkFormat,
                        [
                            data.module || '',
                            data.irn || ''
                        ]);
                }
                
                var image;
                var content;
                if (IMu.Languages.current.dir == 'ltr')
                {
                    image = slide.child('a', 'image');
                    content = slide.child('div', 'content');
                }
                else
                {
                    // TODO: the rtl styling for slides needs work.
                    content = slide.child('div', 'content');
                    image = slide.child('a', 'image');
                }

                if (href)
                    image.attr('href', href);


                if (data.image)
                {
                    var url;

                    if (data.image.SupUsage_nesttab &&
                        data.image.SupUsage_nesttab.length)
                    {
                        for (var i = 0; i < data.image.SupUsage_nesttab.length; i++)
                        {
                            var usage = data.image.SupUsage_nesttab[i];
                            var done = false;
                            
                            for (var j = 0; j < usage.length; j++)
                            {
                                if (usage[j] != 'imu-highlights-banner')
                                    continue;

                                var mm = new IMu.Request.Multimedia();
                                mm.setKey(data.image.irn);
                                mm.addFilter('kind', 'supplementary');
                                mm.addFilter('usage', 'imu-highlights-banner');
                                mm.addModifier('format', 'jpeg');
                                url = mm.getURL();

                                done = true;
                                break;
                            }

                            if (done)
                                break;
                        }
                    }
                    else if (data.image.src)
                        url = data.image.src;
                    
                    if (url)
                    {
                        image.child('img',
                        {
                            'src': url
                        });
                    }
                }

                if (data.title)
                    content.child('h3', 'title').text(data.title);

                if (href)
                {
                    var link = content.child('a', 'view-record');
                    var format = IMu.string('highlights-banner-view-module');
                    
                    link.text(IMu.Format.formatParams(format, [module]));

                    link.attr('href', href);
                }

                return slide;
            },

            addSlide: function(data)
            {
                var slide = jQuery('<div class="slide">');
                this.slides.push(slide);
                
                slide.addClass('slide-' + this.slides.length);
                this.hideSlide(this.slides.length - 1);

                if (data.module)
                {
                    var module = data.module.slice(1);
                    module = module.charAt(0).toUpperCase() + module.slice(1);

                    var method = 'add' + module + 'Slide';
                    if (typeof this[method] == 'function')
                        this[method](slide, data);
                    else
                        this.addOtherSlide(slide, data, module);
                }
                else
                    this.addOtherSlide(slide, data, module);

                slide.appendTo(this.dynamicContent);
                return slide;
            },

            beginDelay: function()
            {
                this.widget.owner.addClass('delay');
                this._super.apply(this, arguments);
            },

            endDelay: function()
            {
                this._super.apply(this, arguments);
                this.widget.owner.removeClass('delay');
            },

            hideSlide: function(index)
            {
                this.slides[index].visible(false);
            },

            makeDynamicContent: function(objects)
            {
                this.dynamicContent.empty();
                this.slides = [];
                
                this.setCurrentSlide(null);

                if (! objects.length)
                    return this.dynamicContent;

                for (var i = 0; i < objects.length; i++)
                    this.addSlide(objects[i]);

                this.setCurrentSlide(0);

                this.setupSlideNavigation();

                return this.dynamicContent;
            },

            makeStickyContent: function(title, narrative, attachedRecords)
            {
                var sticky = this.stickyContent;
                sticky.empty();

                if (! title && ! narrative)
                    return sticky;
                
                var holder = sticky.child('div', 'holder');

                if (title)
                    jQuery("<h1>" + title + "</h1>").appendTo(holder);

                if (narrative)
                    jQuery(narrative).appendTo(holder);
                
                var keys = [];
                for (var module in attachedRecords)
                {
                    var records = attachedRecords[module];
                    for (var i = 0; i < records.length; i++)
                        keys.push([module, records[i].irn]);
                }
                if (keys.length)
                {
                    var a = holder.child('a', 
                    {
                        'class': 'view-all',
                        'title': IMu.string('highlights-banner-view-all')
                    });
                    a.text(IMu.string('highlights-banner-view-all'));
                    
                    a.click(function()
                    {
                        var search = new IMu.Request.Search();
                        search.findKeys(keys, function(hits)
                        {
                            IMu.log('restore: hits {0}', hits);
                            IMu.Events.trigger('user-search-complete-success',
                            {
                                'search': search
                            });
                        });
                    });
                }

                return sticky;
            },

            setCurrentSlide: function(index)
            {
                if (this.currentSlide !== null)
                    this.hideSlide(this.currentSlide);
                
                if (index === null || index === undefined)
                    index = null;
                else
                    this.showSlide(index);

                this.currentSlide = index;
            },

            // Implement per theme/client.
            // This is where next/previous buttons are created as well
            // as slideshow timer functionality.
            setupSlideNavigation: function()
            {
            },

            showLoadError: function(errorType)
            {
                var dynamic = this.dynamicContent;
                dynamic.empty();
                
                var error = dynamic.child('div', 'error-message');

                var html = '';
                if (errorType)
                {
                    html = IMu.string('highlights-banner-error-' 
                        + errorType);

                    if (html == 'highlights-banner-error-' + errorType)
                    {
                        html = IMu.string('highlights-banner-unexpected-error');
                        html = IMu.Format.formatParams(html, [errorType]);
                    }

                }
                else
                    html = IMu.string('highlights-banner-error');

                error.html(html); 

                this.endDelay();
            },
            
            showSlide: function(index)
            {
                this.slides[index].visible(true);
                IMu.Events.trigger('highlights-banner-show-slide', 
                    this.slides[index]);
            }
        }
    });
})(IMu.Themes.shared);
