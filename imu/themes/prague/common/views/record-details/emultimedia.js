(function(theme)
{
	theme.views.register('record-details',
	{
		_source: 'prague/common/record-details/emultimedia',

		all:
		{
			/* Show the details of a multimedia record i.e. the 'data'
			 * parameter contains the column values for a multimedia record.
			 */
			showMultimediaDetails: function(owner, data)
			{
				var self = this;

				var base = owner.child('div', 'multimedia');
				var primary = base.child('div', 'primary');
				var table = primary.child('table');
				var tr = table.child('tr');
				var td = tr.child('td');
				self.showMedia(td, [data]);

				var details = tr.child('td').child('div', 'details');
				var div = details.child('div', 'title');
				div.text(data.title);

				self.showMultimediaDescription(details, data);

				var secondary = base.child('div', 'secondary');
				self.showMultimediaResolutions(secondary, data.resolutions);
				self.showMultimediaSupplementaries(secondary, data.irn,
						data.supplementary);

				primary = base.child('div', 'primary');
				var metadata = primary.child('div', 'multimedia-metadata');
				self.showMultimediaExifMetadata(metadata, data);
				self.showMultimediaIptcMetadata(metadata, data);
				self.showMultimediaXmpMetadata(metadata, data);

				// checkbox
				if (self.widget.options.showSelectionControl)
				{
					td = tr.child('td', 'select-cell');
					td.css('width', '1%');

					self.showSelectionControl(td, data);
				}

				return details;
			},

			showMultimediaDescription: function(owner, data)
			{
				var self = this;

				var table = owner.child('table');

				self.showTableRow(table, 'emultimedia-creator', data.creators);
				if (data.mimeType && data.mimeFormat)
				{
					self.showTableRow(table, 'emultimedia-media-type',
						data.mimeType + '/' + data.mimeFormat);
				}
				self.showTableRow(table, 'emultimedia-description',
					data.description);
				self.showTableRow(table, 'emultimedia-resource-type',
					data.resourceType);
				self.showTableRow(table, 'emultimedia-language', data.language);
				self.showTableRow(table, 'emultimedia-publisher',
					data.publisher);
				self.showTableRow(table, 'emultimedia-contributor',
					data.contributors);
				self.showTableRow(table, 'emultimedia-source', data.source);
				self.showTableRow(table, 'emultimedia-rights', data.rights);
				self.showTableRow(table, 'emultimedia-audience', data.audience);
				self.showTableRow(table, 'emultimedia-media-form',
					data.mediaForm);
				self.showTableRow(table, 'emultimedia-file-size',
					data.fileSize);
				self.showTableRow(table, 'emultimedia-check-sum',
					data.checkSum);
				self.showTableRow(table, 'emultimedia-resolution',
					data.resolution);
				if (data.width && data.height)
				{
					self.showTableRow(table, 'emultimedia-dimensions',
						data.width + 'x' + data.height);
				}
				else if (data.width)
				{
					self.showTableRow(table, 'emultimedia-width', data.width);
				}
				else if (data.height)
				{
					self.showTableRow(table, 'emultimedia-height', data.height);
				}
				self.showTableRow(table, 'emultimedia-colour-depth',
					data.colourDepth);
				self.showTableRow(table, 'emultimedia-film-length',
					data.filmLength);
				self.showTableRow(table, 'emultimedia-samples-per-second',
					data.samplesPerSecond);
				self.showTableRow(table, 'emultimedia-bits-per-sample',
					data.bitsPerSample);
				self.showTableRow(table, 'emultimedia-number-of-channels',
					data.numChannels);
				self.showTableRow(table, 'emultimedia-duration',
					data.audioDuration);
			},

			showMultimediaResolutions: function(owner, data)
			{
				var self = this;

				if (! data || data.length < 1)
					return;

				var div = owner.child('div', 'section multimedia-resolutions');
				var heading = IMu.string('emultimedia-resolutions');
				self.showSectionHeader(div, heading);

				div = div.child('div', 'items');
				var table = div.child('table');
				var tr = table.child('thead').child('tr');

				var th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-identifier'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-media-type'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-colour-space'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-type'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-colour-depth'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-num-colours'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-resolution'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-dimensions'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-file-size'));

				for (var i = 0; i < data.length; i++)
				{
					var resolution = data[i];

					tr = table.child('tr', 'item');

					var td = tr.child('td');
					td.text(resolution.identifier || '');

					td = tr.child('td');
					if (resolution.mimeType && resolution.mimeFormat)
						td.text(resolution.mimeType + '/' +
								resolution.mimeFormat);

					td = tr.child('td');
					td.text(resolution.colourSpace || '');

					td = tr.child('td');
					td.text(resolution.imageType || '');

					td = tr.child('td');
					td.text(resolution.bitsPerPixel || '');

					td = tr.child('td');
					td.text(resolution.numberColours || '');

					td = tr.child('td');
					td.text(resolution.resolution || '');

					td = tr.child('td');
					if (resolution.width && resolution.height)
						td.text(resolution.width + 'x' + resolution.height);

					td = tr.child('td');
					td.text(resolution.fileSize || '');
				}
			},

			showMultimediaSupplementaries: function(owner, key, data)
			{
				var self = this;

				if (! data || data.length < 1)
					return;

				var div = owner.child('div', 'section multimedia-supplementary');
				var heading = IMu.string('emultimedia-supplementary');
				self.showSectionHeader(div, heading);

				div = div.child('div', 'items');
				var table = div.child('table');
				var tr = table.child('thead').child('tr', 'item');

				/* Empty table header for multimedia plugin.
				 */
				var th = tr.child('th');

				th = tr.child('th');
				th.text(IMu.string('emultimedia-supplementary-identifier'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-supplementary-media-type'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-supplementary-usage'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-supplementary-dimensions'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-supplementary-file-size'));

				for (var i = 0; i < data.length; i++)
				{
					var supplementary = data[i];

					tr = table.child('tr', 'item');
					var td = tr.child('td');

					div = td.child('div');

					var mm = new IMu.Request.Multimedia();
					mm.setKey(key);
					mm.addFilter('index', supplementary.index);

					var mmPlugin = div.IMuMultimedia({onClick: false});
					mmPlugin.addResource(mm);

					td = tr.child('td');
					td.text(supplementary.identifier || '');

					td = tr.child('td');
					if (supplementary.mimeType && supplementary.mimeFormat)
						td.text(supplementary.mimeType + '/' +
								supplementary.mimeFormat);

					td = tr.child('td');
					if (supplementary.usage)
					{
						for (var j = 0; j < supplementary.usage.length; j++)
						{
							td.child('tr').child('td').text(
									supplementary.usage[j]);
						}
					}

					var td = tr.child('td');
					if (supplementary.width && supplementary.height)
						td.text(supplementary.width + 'x' +
								supplementary.height);

					var td = tr.child('td');
					td.text(supplementary.fileSize || '');
				}
			},

			showMultimediaExifMetadata: function(owner, data)
			{
				var self = this;

                if (! data.exif || ! data.exif.length)
					return;

				var div = owner.child('div', 'section metadata-exif');
				var heading = IMu.string('emultimedia-exif');
				self.showSectionHeader(div, heading);

				div = div.child('div', 'items');
				var table = div.child('table');
				var tr = table.child('thead').child('tr');

				var th = tr.child('th');
				th.text(IMu.string('emultimedia-exif-ifd'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-exif-tag'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-exif-name'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-exif-value'));

				for (var i = 0; i < data.exif.length; i++)
				{
                    var row = data.exif[i];

				   	tr = table.child('tr', 'item');
					tr.child('td').text(row.ifd || '');
					tr.child('td').text(row.tag || '');
					tr.child('td').text(row.name || '');
					tr.child('td').text(row.value || '');
				}
			},

			showMultimediaIptcMetadata: function(owner, data)
			{
				var self = this;

                if (! data.iptc || ! data.iptc.length)
                    return;

				var div = owner.child('div', 'section metadata-iptc');
				var heading = IMu.string('emultimedia-iptc');
				self.showSectionHeader(div, heading);

				div = div.child('div', 'items');
				var table = div.child('table');
				var tr = table.child('thead').child('tr');

				var th = tr.child('th');
				th.text(IMu.string('emultimedia-iptc-record'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-iptc-tag'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-iptc-name'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-iptc-value'));

				for (var i = 0; i < data.iptc.length; i++)
				{
                    var row = data.iptc[i];

				   	tr = table.child('tr', 'item');
					tr.child('td').text(row.record || '');
					tr.child('td').text(row.tag || '');
					tr.child('td').text(row.name || '');
					tr.child('td').text(row.value || '');
				}
			},

			showMultimediaXmpMetadata: function(owner, data)
			{
				var self = this;

				if (! data.XmpMetadata)
					return;

				/* Strip out control (DATA LINK ESCAPE) characters.
				*/
				var xmp = data.XmpMetadata.replace(/&#0010;/g, '');
				var items = self.parseXmp(xmp);
				if (! items)
					return;

				var div = owner.child('div', 'section metadata-xmp');
				var heading = IMu.string('emultimedia-xmp');
				self.showSectionHeader(div, heading);
				div = div.child('div', 'items');

				for (var i = 0; i < items.length; i++)
				{
					var item = items[i];
					/* We only need to know about the children of Description
					** nodes.
					*/
					if (! item.children)
						continue;

					var children = item.children;
					var nameSpaces = item.nameSpaces;
					var ns = children.nameSpace;
					var title = self.getXmpItemTitle(nameSpaces, ns);

					var sub = div.child('div', 'item');
					sub.child('div').text(title);
					self.showXmpItem(sub, nameSpaces, ns, children);
				}
			},

			showXmpItem: function(owner, nameSpaces, baseNameSpace, items)
			{
				var self = this;

				var ul = owner.child('ul');

				var ns = items.nameSpace;
				if (ns != baseNameSpace)
				{
					var title = self.getXmpItemTitle(nameSpaces, ns);
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
						if (self.isXmpContainer(item))
							self.showXmpContainer(li, item);
						else
							self.showXmpItem(li, nameSpaces, baseNameSpace,
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
				var self = this;

				return (item.localName == 'Seq' || item.localName == 'Alt' ||
						item.localName == 'Bag');

			},

			showXmpContainer: function(owner, item)
			{
				var self = this;

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
})(IMu.Themes.get('prague'));
