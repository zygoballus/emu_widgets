(function(theme)
{
    theme.views.register('record-details',
    {
        _source: 'prague/client/record-details/ecatalogue',

        all:
        {
            showCatalogueDetails: function(owner, data)
            {
                var self = this;

                var div;
                var table, tableOther, divider;
                var prompts, values, tableOwner;

                /* Section: Summary
                */
                var title = "";
                if (data.CatSpecies)
                {
                    title = data.CatSpecies;
                }
                if (data.CatVariety)
                {
                    if (title != "")
                    {
                        title += " ";
                    }
                    title += "VARIETY " + data.CatVariety;
                }
                if (data.PhmAssociatedSpecies1)
                {
                    if (title != "")
                    {
                        title += " AND ";
                    }
                    title += data.PhmAssociatedSpecies1;
                }
                
                if (title)
                {
                    data['title'] = title;
                }
                else
                {
                    data['title'] = data.SummaryData;
                }

                // multimedia
                var summary = owner.child('div', 'summary');
                summary = self.showMultimedia(summary, data);
                table = self.addSection(summary); //, 'ecatalogue-section-summary');

                var supplementary = owner.child('div', 'supplementary');
                table = self.addSection(supplementary); 
                
		self.addDetail('ecatalogue-pseudo-after',
                    data.CatPseudoAfter, table);

                prompts = 
                [
                    'ecatalogue-country',
                    'ecatalogue-state',
                    'ecatalogue-county',
                    'ecatalogue-region',
                    'ecatalogue-township',
                    'ecatalogue-city',
                    'ecatalogue-mine',
                    'ecatalogue-ditrict'
                ];
                values = 
                [
                    data.ColHisCurrentCountryLocal,
                    data.ColHisCurrentStateLocal,
                    data.ColHisCurrentCountyLocal,
                    data.ColHisCurrentRegionLocal,
                    data.ColHisCurrentTownshipLocal,
                    data.ColHisCurrentCityLocal,
                    data.ColHisCurrentMineLocal,
                    data.ColHisCurrentMineDistrictLocal
                ];
                self.addLocalityTable(prompts, values, table);
                
                table = self.addSection(supplementary); 
                if (data.CatCatalogNumber)
                {
                    self.addDetail('ecatalogue-catalogue-number',
                        "CM" + data.CatCatalogNumber, table);
                }

                if(data.CatStorageID && data.CatStorageName)
                {
                    var museumLocation = "";
                        for( var i = 0; i < self.museumLocationsList.length-1; i++)
                        {
                            if (museumLocation == '')
                            {
                                if(self.museumLocationsList[i].indexOf("|") != -1)
                                {
                                    var values = self.museumLocationsList[i].split("|");
                                    if (values[0] == data.CatStorageID)
                                    {
                                        museumLocation = values[1];
                                    }
                                }
                                else
                                {
                                    museumLocation = self.museumLocationsList[i];
                                } 
                            }
                        }
                        if (museumLocation.indexOf("Collection Storage") == -1)
                        {
                            self.addDetail('ecatalogue-museum-location',
                                museumLocation, table);
                            self.addDetail('ecatalogue-case-number',
                                data.CatCaseNumber, table);
                        }
                        
                        var caseName= "";
                        for( var i = 0; i < self.caseNamesList.length-1; i++)
                        {
                            if (caseName == '')
                            {
                                if(self.caseNamesList[i].indexOf("|") != -1)
                                {
                                    var values = self.caseNamesList[i].split("|");
                                    if (values[0] == data.CatStorageID && values[1] == data.CatStorageName)
                                    {
                                        caseName = values[2];
                                    }
                                }
                                else
                                {
                                    caseName = self.caseNamesList[i];
                                } 
                            }
                        }
                        if (museumLocation.indexOf("Collection Storage") == -1)
                        {
                            self.addDetail('ecatalogue-case-name',
                                data.CatStorageID, table);
                        }
                }

                self.addDetail('ecatalogue-old-collection',
                    data.CatOldCollectionName_tab, table);
                self.addDetail('ecatalogue-dimensions',
                    data.CatDimensions, table);

                var weight = undefined;
                if (data.CatWeight)
                {
                    weight = data.CatWeight;
                    if (data.CatWeightUnit)
                    {
                        weight += " " + data.CatWeightUnit;
                    }
                }
                self.addDetail('ecatalogue-weight',
                    weight, table);
                self.addDetail('ecatalogue-color',
                    data.CatColor, table);
                    
                self.removeEmptySections(summary);
                self.removeEmptySections(supplementary);
            },

            showMultimedia: function(owner, data)
            {
                var self = this;

                var table = owner.child('table');
                var tr = table.child('tr');

                if (data.multimedia && data.multimedia.length > 0)
                {
                    var td = tr.child('td', 'multimedia-cell');
                    self.showMedia(td, data);
                }
                
                tr = table.child('tr');
                var details = tr.child('td', 'details-cell').child('div', 'details');
                var titleRow = details.child('table', 'title').child('tr');
                titleRow.child('td').text(data.title);

                return details;
            },

            showMedia: function(owner, data)
            {
                var self = this;
                var multimedia = data.multimedia;

                if (! multimedia || multimedia.length < 1)
                    return;

                owner.addClass('multimedia-cell');
                var base = owner.child('div', 'multimedia');
                var mainPlugin = base.IMuMultimedia();
                for (var i = 0; i < multimedia.length; i++)
                {
                    mainPlugin.addResourceByKey(multimedia[i].irn, data.CatSpecies);
                }

                if (self.showSaveMultimedia)
                {
                    var saveMultimediaDiv = owner.child('div', 'multimedia-show-save');
                    var saveMultimediaTr = saveMultimediaDiv.child('table').child('tr');
                    saveMultimediaTr.child('td', 'multimedia-count').text('1/' + multimedia.length);

                    var mm = new IMu.Request.Multimedia();
                    mm.setKey(multimedia[0].irn)
                    mm.setDisposition('attachment');
                    if (data.CatSpecies)
                    {
                        mm.addParam('alt', data.CatSpecies);
                    }
                    var url = mm.getURL();
                    var a = saveMultimediaTr.child('td').child('a', 'multimedia-save');
                    a.text(IMu.string(self.showSaveMultimedia));
                    a.attr('href', url);
                }

                if (multimedia.length < 2)
                    return;

                var scrollerDiv = owner.child('div', 'multimedia-scroller');
                var tr = scrollerDiv.child('table').child('tr');

                for (var i = 0; i < multimedia.length; i++)
                {
                    var irn = multimedia[i].irn;
                    var mimeType = multimedia[i].type;

                    /* add the multimedia to the secondary multimedia plugin.
                     * Note the closure in loop issue.
                    */
                    var show = (function(index, irn)
                    {
                        return function()
                        {
                            mainPlugin.show(index);

                            if (self.showSaveMultimedia)
                            {
                                saveMultimediaDiv.find('.multimedia-count').text(
                                    (index + 1) + '/' + multimedia.length);
                                var mm = new IMu.Request.Multimedia();
                                mm.setKey(irn)
                                mm.setDisposition('attachment');
                                if (data.CatSpecies)
                                {
                                    mm.addParam('alt', data.CatSpecies);
                                }
                                var url = mm.getURL();
                                saveMultimediaDiv.find('.multimedia-save').attr('href', url);
                            }
                        }
                    })(i, irn);

                    var td = tr.child('td');
                    var plugin = td.child('div').IMuMultimedia({ onClick:
                        show });

                    if (mimeType == 'image')
                    {
                        var mm = new IMu.Request.Multimedia();
                        mm.setKey(irn);
                        mm.addFilter('kind', 'thumbnail');
                        if (data.CatSpecies)
                        {
                            mm.addParam('alt', data.CatSpecies);
                        }
                        plugin.addResource(mm);
                    }
                    else
                    {
                        td.find('div').attr('class', 'imu-plugin imu-multimedia-plugin imu-multimedia-icon');
                        var src = IMu.Request.getURL('Image') + '&name=multimedia-' + mimeType;
                        plugin.addImage(src);
                    }
                }
                var options =
                {
                    scrollType: 'horizontal',
                    horizontalPager: true,
                    onResize: function()
                    {
                        if (this.content.fullWidth() > this.view.fullWidth())
                        {
                            this.left.css('visibility', 'visible');
                            this.right.css('visibility', 'visible');
                        }
                        else
                        {
                            this.left.css('visibility', 'hidden');
                            this.right.css('visibility', 'hidden');
                        }
                    }
                };
                var scroller = scrollerDiv.IMuScroller(options);
                var content = scroller.getContent();
                var parts = content.find('td');
                var offsetOne = jQuery(parts[0]).offset();
                var offsetTwo = jQuery(parts[1]).offset();
                var snap = offsetTwo.left - offsetOne.left;
                scroller.setOptions({ horizontalSnap: snap });
            }
        }
    });
})(IMu.Themes.get('prague'));
