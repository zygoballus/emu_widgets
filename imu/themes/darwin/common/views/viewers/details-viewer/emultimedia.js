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
