(function(theme)
{
    theme.views.register('record-details', 'paged-viewer',
    {
        _source: 'marrakech/common/record-details',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);
            },

            _create: function()
            {
                var self = this;

                self._super();
            },

            resize: function()
            {
                var self = this;

                self._super();
            },

            showNarrativesDetails: function(owner, data)
            {
                var self = this;

                var div;

                // trails
                if (data.trails)
                {
                    var gap = IMu.Languages.current.dir == 'ltr' ? '>' : '<';
                    for (var i = 0; i < data.trails.length; i++)
                    {
                        var trail = data.trails[i];
                        
                        div = owner.child('div', 'trail');
                        for (var j = 0; j < trail.length; j++)
                        {
                            (function(n)
                            {
                                if (n > 0)
                                {
                                    var span = div.child('span');
                                    span.text(' ' + gap + ' ');
                                }

                                var item = trail[n];
                                var span = div.child('span', 'item');
                                span.text(item.title);
                                span.bind('click', function()
                                {
                                    self.widget.showRecord('enarratives', item.irn);
                                });
                            })(j);
                        }
                    }
                }

                // main multimedia & narrative
                var info = self.showMultimedia(owner, data);

                div = info.child('div', 'description');
                div.css('clear', 'both');
                div.html(data.description);

                // objects
                if (data.objects && data.objects.length > 0)
                {
                    var heading = owner.child('div', 'section-heading');
                    div = heading.child('div', 'section-heading-text');
                    div.text(IMu.string('section-objects-label'));

                    div = heading.child('div', 'section-buttons');
                    var hideButton = div.child('button', 'hide');
                    hideButton.text(IMu.string('section-hide-label'));
                    hideButton.bind('click', function()
                    {
                        $('.objects').hide('slow');
                    });

                    var showButton = div.child('button', 'show');
                    showButton.text(IMu.string('section-show-label'));
                    showButton.bind('click', function()
                    {
                        $('.objects').show('slow');
                    });
                    div = heading.child('div');
                    div.css('clear', 'both');

                    var objects = data.objects;
                    div = owner.child('div', 'objects');
                    for (var i = 0; i < objects.length; i++)
                    {
                        (function(n)
                        {
                            var object = objects[n];

                            var elem = div.child('div', 'object');
                            elem.bind('click', function()
                            {
                                self.widget.showRecord('ecatalogue', object.irn);
                            });

                            var table = elem.child('table');
                            table.css('width', '100%');
                            var tr = table.child('tr');

                            var td;
                            
                            td = tr.child('td');
                            td.css('width', '1%');
                            var frame = td.child('div', 'frame');
                            var img = frame.child('img', 'image');

                            // TODO: else, display "no picture" image
                            if (object.image)
                            {
                                var mm = new IMu.Request.Multimedia();
                                mm.setKey(object.image.irn);
                                mm.addFilter('index', 1);
                                var url = mm.getURL();

                                img.attr('src', url);
                                img.imagesLoaded(function()
                                {
                                    var frameHeight = frame.height();
                                    var imageHeight = img.height();
                                    if (frameHeight < imageHeight)
                                    {
                                        img.fullHeight(frameHeight);
                                        return;
                                    }
                                    var margin = Math.floor((frameHeight - imageHeight) / 2);
                                    if (margin > 0)
                                        img.css('margin-top', margin + 'px');
                                });
                            }

                            td = tr.child('td');
                            td.css('width', '99%');
                            var title = td.child('div');
                            title.IMuEllipsis(object.title);
                        })(i);
                    }
                    div = div.child('div');
                    div.css('clear', 'both');
                }

                // child narratives
                if (data.children && data.children.length > 0)
                {
                    var heading = owner.child('div', 'section-heading');
                    div = heading.child('div', 'section-heading-text');
                    div.text(IMu.string('section-subnarratives-label'));

                    div = heading.child('div', 'section-buttons');
                    var hideButton = div.child('button', 'hide');
                    hideButton.text(IMu.string('section-hide-label'));
                    hideButton.bind('click', function()
                    {
                        $('.children').hide('slow');
                    });

                    var showButton = div.child('button', 'show');
                    showButton.text(IMu.string('section-show-label'));
                    showButton.bind('click', function()
                    {
                        $('.children').show('slow');
                    });
                    div = heading.child('div');
                    div.css('clear', 'both');

                    var children = data.children;
                    div = owner.child('div', 'children');
                    for (var i = 0; i < children.length; i++)
                    {
                        (function(n)
                        {
                            var child = children[n];

                            var elem = div.child('div', 'child');
                            elem.bind('click', function()
                            {
                                self.widget.showRecord('enarratives', child.irn);
                            });

                            var table = elem.child('table');
                            table.css('width', '100%');
                            var tr = table.child('tr');

                            var td;
                            
                            td = tr.child('td');
                            td.css('width', '1%');
                            var frame = td.child('div', 'frame');
                            var img = frame.child('img', 'image');

                            // TODO: else, display "no picture" image
                            if (child.image)
                            {
                                var mm = new IMu.Request.Multimedia();
                                mm.setKey(child.image.irn);
                                mm.addFilter('index', 1);
                                var url = mm.getURL();

                                img.attr('src', url);
                                img.imagesLoaded(function()
                                {
                                    var frameHeight = frame.height();
                                    var imageHeight = img.height();
                                    if (frameHeight < imageHeight)
                                    {
                                        img.fullHeight(frameHeight);
                                        return;
                                    }
                                    var margin = Math.floor((frameHeight - imageHeight) / 2);
                                    if (margin > 0)
                                        img.css('margin-top', margin + 'px');
                                });
                            }

                            td = tr.child('td');
                            td.css('width', '99%');
                            var title = td.child('div');
                            title.IMuEllipsis(child.title);
                        })(i);
                    }

                    div = div.child('div');
                    div.css('clear', 'both');
                }

                // related narratives
                if (data.associations && data.associations.length > 0)
                {
                    var heading = owner.child('div', 'section-heading');
                    div = heading.child('div', 'section-heading-text');
                    div.text(IMu.string('section-related-narratives-label'));

                    div = heading.child('div', 'section-buttons');
                    var hideButton = div.child('button', 'hide');
                    hideButton.text(IMu.string('section-hide-label'));
                    hideButton.bind('click', function()
                    {
                        $('.associations').hide('slow');
                    });

                    var showButton = div.child('button', 'show');
                    showButton.text(IMu.string('section-show-label'));
                    showButton.bind('click', function()
                    {
                        $('.associations').show('slow');
                    });
                    div = heading.child('div');
                    div.css('clear', 'both');

                    var associations = data.associations;
                    div = owner.child('div', 'associations');
                    for (var i = 0; i < associations.length; i++)
                    {
                        (function(n)
                        {
                            var association = associations[n];

                            var elem = div.child('div', 'association');
                            elem.bind('click', function()
                            {
                                self.widget.showRecord('enarratives', association.irn);
                            });

                            var table = elem.child('table');
                            table.css('width', '100%');
                            var tr = table.child('tr');

                            var td;
                            
                            td = tr.child('td');
                            td.css('width', '1%');
                            var frame = td.child('div', 'frame');
                            var img = frame.child('img', 'image');

                            // TODO: else, display "no picture" image
                            if (association.image)
                            {
                                var mm = new IMu.Request.Multimedia();
                                mm.setKey(association.image.irn);
                                mm.addFilter('index', 1);
                                var url = mm.getURL();

                                img.attr('src', url);
                                img.imagesLoaded(function()
                                {
                                    var frameHeight = frame.height();
                                    var imageHeight = img.height();
                                    if (frameHeight < imageHeight)
                                    {
                                        img.fullHeight(frameHeight);
                                        return;
                                    }
                                    var margin = Math.floor((frameHeight - imageHeight) / 2);
                                    if (margin > 0)
                                        img.css('margin-top', margin + 'px');
                                });
                            }

                            td = tr.child('td');
                            td.css('width', '99%');
                            var title = td.child('div');
                            title.IMuEllipsis(association.title);
                        })(i);
                    }

                    div = div.child('div');
                    div.css('clear', 'both');
                }
            },

            showPartyDetails: function(owner, data)
            {
                var self = this;

                // multimedia
                var info = self.showMultimedia(owner, data);

                var table = info.child('table', 'details');
                table.css('clear', 'both');

                if (data.partyType && data.partyType.toLowerCase() == 'person')
                {
                    if (data.lastName || data.firstName)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-name') + ':');

                        td = tr.child('td', 'value');
                        var name = '';
                        if (data.lastName)
                            name += data.lastName;
                        if (data.firstName && data.lastName)
                            name += ', ' + data.firstName;
                        else if (data.firstName)
                            name += data.firstName;

                        td.text(name);
                    }

                    if (data.role)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-role') + ':');

                        td = tr.child('td', 'value');
                        var roleTable = td.child('table');
                        
                        for (var i = 0; i < data.role.length; i++)
                        {
                            var roleTr = roleTable.child('tr');
                            var roleTd = roleTr.child('td');
                            roleTd.text(data.role[i]);
                        }
                    }

                    if (data.birthPlace)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-birth-place') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.birthPlace);
                    }

                    if (data.birthDate)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-birth-date') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.birthDate);
                    }

                    if (data.deathDate)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-death-date') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.deathDate);
                    }
                }
                else if (data.partyType && data.partyType.toLowerCase() == 'organisation')
                {
                    if (data.organisation)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-organisation') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.organisation);
                    }

                    if (data.street)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-street') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.street);
                    }

                    if (data.city)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-city') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.city);
                    }

                    if (data.state)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-state') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.state);
                    }

                    if (data.postcode)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-postcode') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.postcode);
                    }

                    if (data.country)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-country') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.country);
                    }

                    if (data.email)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-email') + ':');

                        td = tr.child('td', 'value');
                        var a = td.child('a');
                        a.attr('href', 'http://' + data.email);
                        a.text(data.email);
                    }
                }
            },

            showMultimediaDetails: function(owner, data)
            {
                var self = this;
                var table;

                data.multimedia = new Array();

                var mul = new Object();
                mul.type = data.mimeType;
                mul.format = data.mimeFormat;
                mul.irn = data.irn;

                data.multimedia[0] = mul;


                // main image 
                try
                {
                    var info = self.showMultimedia(owner, data);
                }
                catch (e)
                {
                    return;
                }	

                table = info.child('table', 'description');
                table.css('clear', 'both');

                // main information
                if (data.creators && data.creators.length > 0)
                {
                    var tr = table.child('tr');

                    var td = tr.child('td', 'prompt');
                    if (data.creators.length < 2)                                   
                        td.text(IMu.string('emultimedia-creator') + ':');           
                    else                                                            
                        td.text(IMu.string('emultimedia-creators') + ':');          
                    
                    td = tr.child('td', 'value');                                   
                    var creators = td.child('table', 'creators');                   
                    
                    for (var i = 0; i < data.creators.length; i++)                  
                    {                                                               
                        (function(n)                                                
                        {                                                           
                            var creator = data.creators[n];                         

                            tr = creators.child('tr');                              

                            td = tr.child('td', 'creator');                         
                            td.text(creator);                                       
                        })(i);                                                      
                    }                                                               
                }

                if (data.mimeType || data.mimeFormat)                               
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-media-type') + ':');             

                    td = tr.child('td', 'value');                                   
                    if (data.mimeType && data.mimeFormat)                           
                        td.text(data.mimeType + '/' + data.mimeFormat);             
                    else                                                            
                        td.text(data.mimeType + data.mimeFormat);                   
                }                                                                   

                if (data.description)                                               
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-description') + ':');           

                    td = tr.child('td', 'value');                                   
                    td.text(data.description);                                      
                }                                                                   

                if (data.resourceType)                                              
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-resource-type') + ':');         

                    td = tr.child('td', 'value');                                   
                    td.text(data.resourceType);                                     
                }                                                                   

                if (data.language && data.language.length > 0)                                       
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    if (data.language.length < 2)                                   
                        td.text(IMu.string('emultimedia-language') + ':');          
                    else                                                            
                        td.text(IMu.string('emultimedia-languages') + ':');         

                    td = tr.child('td', 'value');                                   

                    for (var i = 0; i < data.language.length; i++)                  
                    {                                                               
                        (function(n)                                                
                        {                                                           
                            var language = data.language[n];                        

                            var row = td.child('tr');

                            td = row.child('td', 'language');                        
                            td.text(language);                                      
                        })(i);                                                      
                    }                                                               
                }


                if (data.publisher)                                                 
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-publisher') + ':');             

                    td = tr.child('td', 'value');                                   
                    td.text(data.publisher);                                        
                }                                                                   

                if (data.contributors && data.contributors.length > 0)                                   
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    if (data.contributors.length < 2)                               
                        td.text(IMu.string('emultimedia-contributor') + ':');       
                    else                                                            
                        td.text(IMu.string('emultimedia-contributors') + ':');      

                    td = tr.child('td', 'value');                                   

                    for (var i = 0; i < data.contributors.length; i++)              
                    {                                                               
                        (function(n)                                                
                        {                                                           
                            var contributor = data.contributors[n];                 

                            tr = contributor.child('tr');                           

                            td = tr.child('td', 'contributor');                     
                            td.text(contributor);                                   
                        })(i);                                                      
                    }                                                               
                }                                                                   

                if (data.source)                                                    
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-source') + ':');                

                    td = tr.child('td', 'value');                                   
                    td.text(data.source);                                           
                }                                                                   

                if (data.rights)                                                    
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-rights') + ':');                

                    td = tr.child('td', 'value');                                   
                    td.text(data.rights);                                           
                }

                if (data.audience && data.audience.length > 0)                                       
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-audience') + ':');              

                    td = tr.child('td', 'value');
                    var audienceTable = td.child('table', 'audience');

                    for (var i = 0; i < data.audience.length; i++)                  
                    {                                                               
                        (function(n)                                                
                        {                                                           
                            var audience = data.audience[n];                        

                            tr = audienceTable.child('tr');                              

                            td = tr.child('td', 'audience');                        
                            td.text(audience);                                      
                        })(i);                                                      
                    }                                                               
                }                                                                   

                if (data.mediaForm)                                                 
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-media-form') + ':');            

                    td = tr.child('td', 'value');                                   
                    td.text(data.mediaForm);                                        
                }                                                                   

                if (data.fileSize)                                                  
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-file-size') + ':');             

                    td = tr.child('td', 'value');                                   
                    td.text(data.fileSize);                                         
                }                                                                   

                if (data.checkSum)                                                  
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-check-sum') + ':');             

                    td = tr.child('td', 'value');                                   
                    td.text(data.checkSum);                                         
                }



                if (data.resolution)                                                
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-resolution') + ':');            

                    td = tr.child('td', 'value');                                   
                    td.text(data.resolution);                                       
                }                                                                   

                if (data.width && data.height)                                      
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-dimensions') + ':');            

                    td = tr.child('td', 'value');                                   
                    td.text(data.width + 'x' + data.height);                        
                }                                                                   
                else                                                                
                {                                                                   
                    if (data.width)                                                 
                    {                                                               
                        var tr = table.child('tr');                                 

                        var td = tr.child('td', 'prompt');                          
                        td.text(IMu.string('emultimedia-width') + ':');             

                        td = tr.child('td', 'value');                               
                        td.text(data.width);                                        
                    }                                                               
                    if (data.height)                                                
                    {                                                               
                        var tr = table.child('tr');                                 

                        var td = tr.child('td', 'prompt');                          
                        td.text(IMu.string('emultimedia-height') + ':');            

                        td = tr.child('td', 'value');                               
                        td.text(data.height);                                       
                    }                                                               
                }                                                                   

                if (data.colourDepth)                                               
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-colour-depth') + ':');          

                    td = tr.child('td', 'value');                                   
                    td.text(data.colourDepth);                                      
                }

                if (data.filmLength)                                                
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-film-length') + ':');           

                    td = tr.child('td', 'value');                                   
                    td.text(data.filmLength);                                       
                }                                                                   

                if (data.samplesPerSecond)                                          
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-samples-per-second') + ':');    

                    td = tr.child('td', 'value');                                   
                    td.text(data.samplesPerSecond);                                 
                }                                                                   

                if (data.bitsPerSample)                                             
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-bits-per-sample') + ':');       

                    td = tr.child('td', 'value');                                   
                    td.text(data.bitsPerSample);                                    
                }                                                                   

                if (data.numChannels)                                               
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-number-of-channels') + ':');    

                    td = tr.child('td', 'value');                                   
                    td.text(data.numChannels);                                      
                }                                                                   

                if (data.audioDuration)                                             
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-duration') + ':');              

                    td = tr.child('td', 'value');                                   
                    td.text(data.audioDuration);                                    
                }

                /* Supplementary data
                */

                var supplementary = owner.child('div', 'supplementary');

                var exifLength = 0;
                if (data.ExiIfd_tab && data.ExiTag_tab && data.ExiName_tab && data.ExiValue_tab)
                {
                    exifLength = Math.max(data.ExiIfd_tab.length, data.ExiTag_tab.length,
                    data.ExiName_tab.length, data.ExiValue_tab.length);
                }	

                if (exifLength > 0)                                                 
                {                                                                   
    //				var heading = owner.child('div');                               
    //				var span = heading.child('span');                               
    //				span.text(IMu.string('emultimedia-exif'));                                      

    //				var div = owner.child('div', 'exif');                           

    //				var table = div.child('table');                                 
    //				table.css('width', '100%');                                     

                    table = self.addSection(supplementary, 'emultimedia-exif');

                    var tr = table.child('tr');                                     

                    var th = tr.child('th', 'prompt');                              
                    th.text(IMu.string('emultimedia-exif-ifd'));                    

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-exif-tag'));                    

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-exif-name'));                   

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-exif-value'));                  

                    for (var i = 0; i < exifLength; i++)                            
                    {                                                               
                        (function(n)                                                
                        {                                                           
                            tr = table.child('tr', 'table-row');                    

                            var td = tr.child('td');                                
                            td.text(data.ExiIfd_tab[n]);                            

                            var td = tr.child('td');                                
                            td.text(data.ExiTag_tab[n]);                            

                            var td = tr.child('td');                                
                            td.text(data.ExiName_tab[n]);                           

                            var td = tr.child('td');                                
                            td.text(data.ExiValue_tab[n]);                          
                        })(i);                                                      
                    }                                                               
                }                                                                   

                
                var iptcLength = 0
                if (data.IptRecord_tab && data.IptTag_tab && data.IptName_tab && data.IptValue_tab)
                {
                    iptcLength = Math.max(data.IptRecord_tab.length, data.IptTag_tab.length,
                    data.IptName_tab.length, data.IptValue_tab.length);
                }	

                if (iptcLength > 0)                                                 
                {                                                                   
    //				var heading = owner.child('div');                               
    //				var span = heading.child('span');                               
    //				span.text(IMu.string('iptc'));                                                  

    //				var div = owner.child('div', 'iptc');                           

    //				var table = div.child('table');                                 
    //				table.css('width', '100%');                                     

                    table = self.addSection(supplementary, 'emultimedia-resolutions');

                    var tr = table.child('tr');                                     

                    var th = tr.child('th', 'prompt');                              
                    th.text(IMu.string('emultimedia-iptc-record'));                

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-iptc-tag'));                    

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-iptc-name'));                   

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-iptc-value'));                  

                    for (var i = 0; i < iptcLength; i++)                            
                    {                                                               
                        (function(n)                                                
                        {                                                           
                            tr = table.child('tr', 'table-row');                    

                            var td = tr.child('td');                                
                            td.text(data.IptRecord_tab[n]);                         

                            td = tr.child('td');                                    
                            td.text(data.IptTag_tab[n]);                            

                            td = tr.child('td');                                    
                            td.text(data.IptName_tab[n]);                           

                            td = tr.child('td');                                    
                            td.text(data.IptValue_tab[n]);                          
                        })(i);                                                      
                    }                                                               
                }

                if (data.XmpMetadata != null)                                       
                { 
                    // Not supported on Opera

                    var nsURI = {};     // namespace URI                            
                    nsURI['http://purl.org/dc/elements/1.1/'] = ['XMP_dc'];         
                    nsURI['http://ns.adobe.com/xap/1.0/'] = ['XMP_xmp'];            
                    nsURI['http://ns.adobe.com/xap/1.0/rights/'] = ['XMP_xmpRights'];
                    nsURI['http://ns.adobe.com/xap/1.0/mm/'] = ['XMP_xmpMM'];       
                    nsURI['http://ns.adobe.com/xap/1.0/bj'] = ['XMP_xmpBJ'];        
                    nsURI['http://ns.adobe.com/xap/1.0/t/pg/'] = ['XMP_xmpTPg'];    
                    nsURI['http://ns.adobe.com/xap/1.0/DynamicMedia/'] = ['XMP_xmpDM'];
                    nsURI['http://ns.adobe.com/pdf/1.3/'] = ['XMP_pdf'];            
                    nsURI['http://ns.adobe.com/photoshop/1.0/'] = ['XMP_photoshop'];
                    nsURI['http://ns.adobe.com/camera-rawsettings/1.0/'] = ['XMP_crs'];
                    nsURI['http://ns.adobe.com/tiff/1.0/'] = ['XMP_tiff'];          
                    nsURI['http://ns.adobe.com/exif/1.0/'] = ['XMP_exif'];          
                    nsURI['http://ns.adobe.com/exif/1.0/aux'] = ['XMP_aux'];        
                    nsURI['http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/'] = ['XMP_iptc'];
                    nsURI['http://iptc.org/std/Iptc4xmpExt/2008-02-29/'] = ['XMP_iptc_ext'];

    //				var heading = owner.child('div');                               
    //				var span = heading.child('span');                               
    //				span.text(IMu.string('emultimedia-xmp'));                                       

    //				var div = owner.child('div', 'xmp');                            

    //				var table = div.child('table');                                 
    //				table.css('width', '100%');                                     

                    table = self.addSection(supplementary, 'emultimedia-xmp');

                    var xmp = data.XmpMetadata.replace(/&#0010;/g, '');
                    try
                    {
                        var xml = $(jQuery.parseXML(xmp));
                    
                        // Hack: Some browsers do not like the string 'rdf\\:Description'
                        var descriptions = $(xml).find('rdf\\:Description');
                        if (descriptions.length > 0)
                        {
                            $(descriptions).each(function()
                            {
                                var desc = $(this);
                                self.show_xmp(table, desc, 0, nsURI);
                            });	
                        }
                        else
                        {
                            $(xml).find('Description').each(function()
                            {
                                var desc = $(this);
                                self.show_xmp(table,desc, 0, nsURI);
                            });	
                        }	
                    }
                    catch (e)
                    {
                        return;
                    }
                }

                // Additional resolutions                                           
                if (data.resolutions && data.resolutions.length > 0)                                    
                {                                                                   
    //				var heading = owner.child('div');                               
    //				var span = heading.child('span');                               
    //				span.text(IMu.string('emultimedia-resolutions'));                               

                    var resolutions = data.resolutions;                             
    //				var div = owner.child('div', 'resolutions');                    

    //				var table = div.child('table');                                 
    //				table.css('width', '100%');                                     

                    table = self.addSection(supplementary, 'emultimedia-resolutions');

                    var tr = table.child('tr');                                     

                    var th = tr.child('th', 'prompt');                              
                    th.text(IMu.string('emultimedia-resolutions-identifier'));      

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-mime'));            

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-colour-space'));    

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-type'));            

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-colour-depth'));    

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-num-colours'));     

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-resolution'));      

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-dimensions'));      

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-file-size'));       

                    for (var i = 0; i < resolutions.length; i++)                    
                    {                                                               
                        (function(n)                                                
                        {                                                           
                            tr = table.child('tr', 'resolution');                   

                            var td = tr.child('td');                                
                            td.text(resolutions[n].identifier);                     

                            td = tr.child('td');                                    
                            td.text(resolutions[n].mimeFormat);                     

                            td = tr.child('td');                                    
                            td.text(resolutions[n].colourSpace);                    

                            td = tr.child('td');                                    
                            td.text(resolutions[n].imageType);                      

                            td = tr.child('td');                                    
                            td.text(resolutions[n].bitsPerPixel);

                            td = tr.child('td');                                    
                            td.text(resolutions[n].numberColours);                  

                            td = tr.child('td');                                    
                            td.text(resolutions[n].resolution);                     

                            td = tr.child('td');                                    
                            td.text(resolutions[n].width + 'x' + resolutions[i].height);

                            td = tr.child('td');                                    
                            td.text(resolutions[n].fileSize);                       
                        })(i);                                                      
                    }                                                               
                }	

                // Supplementary multimedia
                if (data.supplementary && data.supplementary.length > 0)
                {                                                               
    //				var heading = owner.child('div');                           
    //				var span = heading.child('span');                           
    //				span.text(IMu.string('emultimedia-supplementary'));                             

    //				var div = owner.child('div', 'supplementary');              

    //				var table = div.child('table');                             
    //				table.css('width', '100%');                                 

                    table = self.addSection(supplementary, 'emultimedia-supplementary');

                    var tr = table.child('tr')                                  
                    var th = tr.child('th', 'table-head');                      


                    th = tr.child('th', 'table-head');                          
                    th.text(IMu.string('emultimedia-supplementary-identifier'));

                    th = tr.child('th', 'table-head');                          
                    th.text(IMu.string('emultimedia-supplementary-mime'));      

                    th = tr.child('th', 'table-head');                          
                    th.text(IMu.string('emultimedia-supplementary-usage'));     

                    th = tr.child('th', 'table-head');                          
                    th.text(IMu.string('emultimedia-supplementary-dimensions'));

                    th = tr.child('th', 'table-head');                          
                    th.text(IMu.string('emultimedia-supplementary-file-size'));

                    for (var i = 0; i < data.supplementary.length; i++)         
                    {                                                           
                        (function(n)                                            
                        {                                                       
                            var supplementary = data.supplementary[n];          

                            var mm = new IMu.Request.Multimedia();              
                            mm.setKey(data.irn);                                   
                            mm.addFilter('index', supplementary.index);            
                            var url = mm.getURL();                              

                            tr = table.child('tr', 'table-row');                
                            tr.click(function()                                 
                            {                                                   
                                jQuery.slimbox(url, supplementary.identifier,   
                                {                                               
                                    imageFadeDuration: 100,                     
                                    initialWidth: 500,                          
                                    initialHeight: 500,                         
                                    overlayFadeDuration: 100                    
                                });                                             
                            });                                               

                            var td = tr.child('td');                            
                            var img = td.child('img', 'image');                 
                            img.attr('src', url);                               

                            td = tr.child('td');                                
                            td.text(supplementary.identifier);                  

                            td = tr.child('td');                                
                            td.text(supplementary.mimeFormat);                  

                            td = tr.child('td');                                

                            for (var j = 0; j < supplementary.usage.length; j++)
                            {                                                   
                                (function(k)                                    
                                {                                               
                                    var usage = td.child('tr');                 
                                    var val = usage.child('td');                
                                    val.text(supplementary.usage[k]);           
                                })(j);                                          
                            }                                                   

                            var td = tr.child('td');                            
                            td.text(supplementary.width + 'x' + supplementary.height);

                            var td = tr.child('td');                            
                                td.text(supplementary.fileSize);                    
                        })(i);                                                  
                    }
                }

                /* Remove empty sections
                */
                supplementary.children('fieldset.info').each(function()
                {
                    jQuery(this).find('.details').each(function()
                    {
                        var size = jQuery(this).children('tbody').children().length;

                        if (size == 0)
                        {
                            // TODO: possibly place a trace here
                            jQuery(this).parent().remove();
                        }
                    });
                });	
            },

            showMultimedia: function(div, data)
            {
                var self = this;

                // main
                var table = div.child('table', 'main');
                var tr = table.child('tr');

                // main multimedia
                if (data.multimedia && data.multimedia[0])
                {
                    var td = tr.child('td', 'multimedia-cell');
                    var multimediaTable = td.child('table');
                    var multimediaTr = multimediaTable.child('tr');
                    var multimediaTd = multimediaTr.child('td');
                    var frame = multimediaTd.child('div', 'frame');

                    // using IMuMultimedia plugin
                    var mul = frame.IMuMultimedia();
                    mul.addResourceByKey(data.multimedia[0].irn);
                
                    // multimedia thumbnails
                    if (data.multimedia.length > 1)
                    {
                        var multimediaTr = multimediaTable.child('tr');
                        var multimediaTd = multimediaTr.child('td');
                        var multimediaDiv = multimediaTd.child('div', 'multimedia-thumbnail-scroll');
                        var multimediaTable = multimediaDiv.child('table');
                        var multimediaTr = multimediaTable.child('tr');

                        var mm = new IMu.Request.Multimedia();
                        mm.addModifier('format', 'jpeg');

                        for (var i = 0; i < data.multimedia.length; i++)
                        {
                            (function(n)
                            {
                                if (n > 0)
                                    mul.addResourceByKey(data.multimedia[n].irn);

                                var mimeType = data.multimedia[n].type;
                                var multimediaTd = multimediaTr.child('td');

                                var frame = multimediaTd.child('div', 'thumbnail-frame');
                                mm.setKey(data.multimedia[n].irn);
                                var img = frame.child('img', 'image multimedia-thumbnail');

                                if (mimeType == 'image')
                                {
                                    mm.addFilter('height', 'bg', 100);
                                    mm.addFilter('width', 'bg', 100);
                                    mm.addModifier('height', 100);
                                    mm.addModifier('width', 100);
                                    var url = mm.getURL();
                                }

                                if (mimeType == 'video')
                                {
                                    var url = IMu.Request.getURL('Image') + '&name=imu-video';
                                }

                                if (mimeType == 'audio')
                                {
                                    var url = IMu.Request.getURL('Image') + '&name=imu-audio';
                                }

                                img.attr('src', url);

                                img.click(function()
                                {
                                    mul.show(n);
                                });
                            })(i);
                        }

                        var scroller = multimediaDiv.IMuScroller
                        ({
                            scrollType: 'horizontal',
                            horizontalPager: true
                        });

                        var content = scroller.getContent();
                        var tds = content.find('td');
                        var off0 = $(tds[0]).offset();
                        var off1 = $(tds[1]).offset();
                        IMu.log('off0 {0} off1 {1}', off0, off1);
                        scroller.setOptions
                        ({
                            horizontalSnap: off1.left - off0.left
                        });
                    }
                }

                // info
                var td = tr.child('td', 'info-cell');
                var info = td.child('div', 'info');

                var table = info.child('table', 'head');
                table.css('width', '100%');
                var tr = table.child('tr');

                td = tr.child('td');
                td.css('width', '99%');

                var title = td.child('span', 'title');
                title.IMuEllipsis(data.title);

                if (self.widget.options.showSelectionControl)
                {
                    td = tr.child('td');
                    td.css('width', '1%');

					self.showSelectionControl(td, data);
                }

                return info;
            },

            // Functions provided as a workaround for browser incompatibility
            firstElementChild: function(node)
            {
                var self = this;

                var child = node.firstChild;
                var firstElementChild = null;

                for ( ; child; child = child.nextSibling)
                {
                    if (child.nodeType === 1)
                    {
                        firstElementChild = child;
                        break;
                    }
                }

                return firstElementChild;
            },

            nextElementSibling: function(node)
            {
                var self = this;

                var nextNode = node.nextSibling;
                var nextElementSibling = null;

                for ( ; nextNode; nextNode = nextNode.nextSibling)
                {
                    if (nextNode.nodeType === 1)
                    {
                        nextElementSibling = nextNode;
                        break;
                    }	
                }

                return nextElementSibling;
            },

            // Traverse the dom object containing xmp data
            //   note: contains some workarounds for compatability with IE8
            show_xmp: function(owner, node, depth, myTable)
            {
                var self = this;

                var tr = owner.child('tr');
                tr.css('width', '100%');
                var td = tr.child('td');
                td.css('text-indent', depth *2 + 'em');
                
                if (node.children().length > 0)
                {
                    if (depth == 0)
                    {
                        var headings = {};

                        // Reconstruct table with useful namespace headers
                        for (var i = 0; i < node[0].attributes.length; i++)
                        {
                            var attribute = node[0].attributes[i];
                            if (attribute.prefix == 'xmlns')
                            {
                                var myKey;
                                if (attribute.localName)
                                {
                                    var myKey = attribute.localName;
                                }
                                else
                                {
                                    var myKey = attribute.baseName;
                                }	
                                var myVal = '';

                                if (myTable[attribute.nodeValue])
                                {
                                    myVal = myTable[attribute.nodeValue];
                                }

                                headings[myKey] = {};
                                headings[myKey]['value'] = myVal;
                                headings[myKey]['URI'] = attribute.nodeValue;
                            }
                        }
                        myTable = headings;
                    }

                    var firstElementChild = self.firstElementChild(node[0]);
                    if (firstElementChild.nodeName == 'rdf:Seq' || 
                        firstElementChild.nodeName == 'rdf:Alt')
                    {
                        /* Ordered and unordered lists */
                        /*
                          This section makes assumptions that
                          1) the dom objects are sequentially ordered
                          2) the list items contain no children
                        */
                        
                        var lable;
                        if (firstElementChild.nodeName == 'rdf:Seq')
                        {
                            lable = ' (seq container)';
                        }
                        else
                        {
                            lable = ' (alt container)';
                        }

                        if (node[0].localName)
                        {
                            td.text(node[0].localName + lable);
                        }

                        else if (node[0].baseName)
                        {
                            td.text(node[0].baseName + lable);
                        }	
                        else
                        {
                            td.text(lable);
                        }

                        var nextLi = self.firstElementChild(firstElementChild);
                        depth++;

                        var index = 0;
                        var nextElementSibling;
                        do
                        {
                            var li = nextLi;
                            var myText = '';
                            nextElementSibling = null;

                            if (firstElementChild.nodeName == 'rdf:Seq')
                            {
                                index++;
                                myText += '[' + index + ']';
                            }

                            for (var i = 0; i < li.attributes.length; i++)
                            {
                                var attribute = li.attributes[i];

                                if (attribute.localName)
                                {
                                    myText += ' [' + attribute.localName;
                                }
                                else if (attribute.baseName)
                                {
                                    myText += ' [' + attribute.baseName;
                                }

                                myText += '="' + attribute.nodeValue + '"]';
                            }

                            if (li.textContent)
                            {
                                myText += ': ' + li.textContent;
                            }
                            else if (li.text)
                            {
                                myText += ': ' + li.text;
                            }
                            else
                            {
                                myText += ': ';
                            }	

                            tr = owner.child('tr');
                            tr.css('width', '100%');

                            td = tr.child('td');
                            td.css('text-indent', depth * 2 + 'em');
                            td.text(myText);

                            nextElementSibling = self.nextElementSibling(li);
                            if (nextElementSibling)
                            {
                                nextLi = nextElementSibling;
                            }
                        }while (nextElementSibling);

                        depth--;
                    }
                    else
                    {
                        /* Non-List Items*/
                        
                        var firstElementChild = self.firstElementChild(node[0]);
                        var thisHead = firstElementChild.prefix;

                        var myText = '';

                        if ((node[0].localName || node[0].baseName) && depth != 0)
                        {
                            if (node[0].localName)
                            {
                                td.text(node[0].localName);
                            }
                            else 
                            {
                                td.text(node[0].baseName);
                            }	

                            tr = owner.child('tr');
                            tr.css('width', '100%');

                            td = tr.child('td');
                            td.css('text-indent', depth * 2 + 'em');
                            myText = '--';
                        }

                        if (myTable[thisHead])
                        {
                            if (myTable[thisHead]['value'][0] != '')
                            {
                                myText += IMu.string(myTable[thisHead]['value']) + ' ';
                                myText += '(' + thisHead + ', ' + myTable[thisHead]['URI'] + ')';
                            }
                            else if (myTable['URI'])
                            {
                                myText += thisHead + ', ' + myTable[thisHead]['URI'];
                            }
                        }

                        td.text(myText);

                        // Print any children
                        node.children().each(function()
                        {
                            var child = $(this);
                            self.show_xmp(owner, child, depth +1, myTable);
                        });
                    }
                }	
                else
                {
                    var myText = '';
                    if (node[0].localName)
                    {
                        myText = node[0].localName;
                    }
                    else if (node[0].baseName)
                    {
                        myText = node[0].baseName;
                    }	
                    
                    myText += ':	' + node.text();
                    td.text(myText);
                }
            },

            addSection: function(owner, headder)
            {
                var self = this;

                if (owner)
                {
                    var div = owner.child('fieldset', 'info');

                    if (headder)
                    {
                        var headding = div.child('legend');
                        headding.text(IMu.string(headder));
                    }

                    var table = div.child('table', 'details');
                    table.css('clear', 'both');
                    table.css('width', '100%');
                    table.attr('id', headder);

                    return table;
                }
                else
                {
                    return null;
                }
            }	
        }
    });
})(IMu.Themes.get('marrakech'));
