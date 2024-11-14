(function(theme)
{
    theme.views.register('statistics-designer', 'designer',
    {
        _source: 'shared/common/statistics-designer',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.source = undefined;
            },

            _create: function()
            {
                this._super.apply(this, arguments);

                var self = this;
                
                self.makeDetails();
                self.makePermissions();

                self.sections = self.holder.child('div', 'sections');
                self.makeDesigner();
                self.makeButtons();
                self.newStatistic();
            },

            clearStatistic: function()
            {
                this.title.text('');
                this.clearDetails();
                this.clearPermissions();
                this.statisticDesigner.clearForm();
                this.clearTerms();
            },

            getStatistic: function()
            {
                var self = this;
                var statistic = {};

                var detailValues = self.details.getValues();
                var statisticDesignerValues = self.statisticDesigner.getValues();

                if(detailValues.id)
                    self.widget.id = detailValues.id;

                if(detailValues.title)
                    statistic.title = detailValues.title;

                if(detailValues.description)
                    statistic.description = detailValues.description;

                if(detailValues.table)
                    statistic.table = detailValues.table;

                //PERMISSION
                //
                self.getPermissions(statistic);

                if(statisticDesignerValues.type)
                    statistic.type = statisticDesignerValues.type;
                if(statisticDesignerValues.column)
                    statistic.sortColumn = statisticDesignerValues.column;

                var sections = self.sections.children('.section');
                // var searchTerms = [];

                // for (var i = 0; i < sections.length; i++)
                // {
                //     var s = jQuery(sections[i]);
                //     var terms = s.find('.terms').children('.term');

                //     for (var j = 0; j < terms.length; j++)
                //     {
                //         var term = jQuery(terms[j]).find('.form').IMu();
                //         var termValues = term.getValues();

                //         if (termValues.column && termValues.value)
                //         {
                //             switch (i)
                //             {
                //                 case 0:
                //                     searchTerms.push([termValues.column, termValues.value]);
                //                     break;
                //             }
                //         }
                //     }
                // }

                var searchTerms = sections[0].filters.getFilters();
                if(searchTerms.length > 0)
                    statistic.terms = searchTerms;

                return statistic;
            },

            newStatistic: function()
            {
                this.clearStatistic();

                this.title.text(IMu.string('statistic-designer-new-form'));
            },

            setStatistic: function(statistic)
            {
                var self = this;

                self.clearStatistic();

                if(! statistic)
                    return

                //DETAILS
                //
                var values = {};

                if (self.widget.id && self.widget.id != '_')
                    values.id = self.widget.id;

                if (statistic.title)
                    values.title = statistic.title;

                if (statistic.description)
                    values.description = statistic.description;

                if (statistic.table)
                    values.table = statistic.table;
                    
                self.details.setValues(values);

                self.details.getField('id').widget.setOption('readonly', true);

                 //PERMISSIONS
                 //
                self.setPermissions(statistic);

                //DESIGNER
                //
                var value = {};
                if(statistic.type)
                    value.type = statistic.type;
                if(statistic.column)
                    value.column = statistic.column;
                if(statistic.term)
                    value.term = statistic.term;
                if(statistic.sortColumn)
                    value.column = statistic.sortColumn;
                self.statisticDesigner.setValues(value);

                //TERMS
                //
                var sections = self.sections.children('.section');
                if(statistic.terms)
                {
                    var terms = statistic.terms;

                    sections[0].filters.setFilters(terms);

                    // for (var i = 0; i < terms.length; i++) 
                    // {
                    //     self.addTerm(jQuery(sections[0]),terms[i]);
                    // }
                }

                self.checkTable();
            },

            //Private
            //
            // addSection: function(sectionHeading)
            // {
            //     var self = this;

            //     var section = self.sections.child('div', 'section');
            //     section.addClass('border-2');

            //     var title = section.child('div', 'title');
            //     title.addClass('bg-colour-2');
            //     var tr = title.child('table').child('tbody').child('tr');

            //     var label = tr.child('td', 'label');
            //     label.css('width', '99%');
            //     label.text(IMu.string(sectionHeading));

            //     tr.child('td', 'padding');

            //     var toggle = tr.child('td', 'toggle');
            //     toggle.css('width', '1%');
            //     var sectionToggle = toggle.child('div', 'section-toggle');
            //     section.add = undefined;
            //     section.holder = undefined;
            //     var button = sectionToggle.IMu('button-control');
            //     button.addState(
            //     {
            //         name: 'opened',
            //         layout:
            //         {
            //             type: 'image',
            //             value: IMu.Request.getURL('Image') + '&name=arrow_d'
            //         },
            //         onClick: function()
            //         {
            //             if (holder !== undefined )
            //             {
            //                 holder.css('display', 'none');
            //                 this.setState('closed');
            //             }
            //         }
            //     });
            //     button.addState(
            //     {
            //         name: 'closed',
            //         layout:
            //         {
            //             type: 'image',
            //             value: IMu.Request.getURL('Image') + '&name=arrow_u'
            //         },
            //         onClick: function()
            //         {
            //             if (holder !== undefined)
            //             {
            //                 holder.css('display', 'block');
            //                 this.setState('opened');
            //             }
            //         },
            //         classes: 'rotate-180'
            //     });
            //     button.createView();

            //     var holder = section.child('div', 'holder');
            //     holder.addClass('bg-colour-1');

            //     var details = section.holder = holder.child('div', 'details');
            //     details.addClass('bg-colour-2');

            //     /* Section terms
            //     */
            //     var filters = self.makeFilters(holder);
            //     section[0].filters = filters;
            //     // var terms = holder.child('div', 'terms');
            //     // terms.addClass('bg-colour-2');

            //     // var title = terms.child('div', 'title');
            //     // var tr = title.child('table').child('tbody').child('tr');

            //     // var label = tr.child('td', 'label');
            //     // label.css('width', '1%');
            //     // label.text(IMu.string('editor-designer-terms'));

            //     // tr.child('td', 'padding');

            //     // var add = section.add = holder.child('div', 'add');
            //     // add.on('click', function()
            //     // {
            //     //     self.addTerm(section);
            //     // });

            //     // var image = add.child('img', 'image');
            //     // var url = IMu.Request.getURL('Image') + '&name=add';
            //     // image.attr('src', url);

            //     // var text = add.child('div', 'text')
            //     // text.text(IMu.string('editor-designer-add-term'));

            //     return section;
            // },
            // addTerm: function(holder, info)
            // {
            //     var self = this;

            //     var terms = holder.find('.terms');

            //     var term = terms.child('div', 'term');

            //     var form = term.child('div', 'form');

            //     form = form.IMu('form',
            //     {
            //         rows: 1,
            //     });

            //     form.addField('text',
            //     {
            //         name: 'column',
            //         label: 'editor-designer-term-column',
            //         suggest: function(suggest, prefix, callback)
            //         {
            //             var table = self.details.getValue('table');
            //             if (!table)
            //             {
            //                 callback([]);
            //                 return;
            //             }
            //             var request = new IMu.Request.Schema();
            //             request.getColumns(table, prefix, function(list)
            //             {
            //                 callback(list);
            //             });
            //         },
            //         css: 'style-1'
            //     });

            //     form.addField('text',
            //     {
            //         name: 'value',
            //         label: 'editor-designer-term-value',
            //         css: 'style-1'
            //     });

            //     form.addField('empty');
            //     form.createView();

            //     form.view.table.find('td:nth-last-child(1)').each(function()
            //     {
            //         var remove = jQuery(this).child('div', 'term-remove');
            //         var button = remove.IMu('button-control');
            //         button.addState(
            //         {
            //             layout: [
            //             {
            //                 type: 'image',
            //                 value: IMu.Request.getURL('Image') + '&name=cross'
            //             },
            //             {
            //                 type: 'text',
            //                 value: IMu.string('editor-designer-remove')
            //             }],
            //             onClick: function()
            //             {
            //                 term.remove();
            //             }
            //         });
            //         button.createView();
            //     });

            //     if (info)
            //     {
            //         var values = {};
            //         if (info[0])
            //             values.column = info[0];
            //         if (info[1])
            //             values.value = info[1];

            //         form.setValues(values);
            //     }
            // },

            clearTerms: function()
            {
                var self = this;

                var sections = self.sections.children('.section');

                for (var i = 0; i < sections.length; i++)
                {
                    sections[i].filters.clearFilters();
                    // var s = jQuery(sections[i]);
                    // var terms = s.find('.terms').children('.term');

                    // for (var j = 0; j < terms.length; j++)
                    // {
                    //     terms[j].remove();
                    // }
                }
            },

            getColumns: function()
            {
                var self = this;

                var list = [];
                var forms = self.sections.find('.form');
                for (var i = 0; i < forms.length; i++)
                {
                    var form = jQuery(forms[i]).IMu();
                    if (! form)
                        continue;
                    var field = form.getField('column');
                    if (! field || ! field.widget)
                        continue;
                    list.push(field);
                }
                return list;
            },

            makeDesigner: function()
            {
                var self = this;

                var section = self.addSection('statistics-designer-section');

                var statisticDesigner = self.statisticDesigner = section.holder.IMu('form',
                {
                    columns: 2,
                    row: 2,
                    order: 'row'
                });

                statisticDesigner.addField('selection',
                {
                    name: 'type',
                    label: 'statistics-designer-type',
                    list:
                    [
                        'bar',
                        'pie'
                    ],
                    css: 'style-1'
                });

                // statisticDesigner.addField('empty');

                // statisticDesigner.addField('text',
                // {
                //     name: 'column',
                //     label: 'statistics-designer-search-column',
                //     suggest: function(suggest, prefix, callback)
                //     {
                //         var table = self.details.getValue('table');
                //         if (!table)
                //         {
                //             callback([]);
                //             return;
                //         }
                //         var request = new IMu.Request.Schema();
                //         request.getColumns(table, prefix, function(list)
                //         {
                //             callback(list);
                //         });
                //     },
                //     css: 'style-1'
                // });
                // statisticDesigner.addField('text',
                // {
                //     name: 'term',
                //     label: 'statistics-designer-term-value',
                //     css: 'style-1'
                // });

                statisticDesigner.addField('text',
                {
                    name: 'column',
                    label: 'statistics-designer-sort-column',
                    suggest: function(suggest, prefix, callback)
                    {
                        var table = self.details.getValue('table');
                        if (!table)
                        {
                            callback([]);
                            return;
                        }
                        var request = new IMu.Request.Schema();
                        request.getColumns(table, prefix, function(list)
                        {
                            callback(list);
                        });
                    },
                    css: 'style-1'
                });

                statisticDesigner.createView();
            },

            makeDetails: function()
            {
                var self = this;
                
                var details = self.holder.child('div', 'details');
                details.addClass('txt-colour-inherit');

                details = self.details = details.IMu('form',
                {
                    columns: 2,
                    order: 'row'
                });

                details.addField('text',
                {
                    name: 'title',
                    label: 'statistics-designer-title',
                    requirement: 'suggested',
                    validateOnChange: true,
                    columnSpan: 2
                });

                details.addField('text',
                {
                    name: 'description',
                    label: 'statistics-designer-description',
                    validateOnChange: false,
                    lines: 2,
                    columnSpan: 2
                });

                details.addField('text',
                {
                    name: 'id',
                    label: 'statistics-designer-id'
                });

                details.addField('text',
                {
                    name: 'table',
                    label: 'statistics-designer-table',
                    suggest:
                    {
                        type: 'function',
                        code: function(suggest, prefix, callback)
                        {
                            self.loadTables(function(tables)
                            {
                                var list = [];
                                var regex = new RegExp('^' + prefix, 'i');
                                for (var i in tables)
                                {
                                    var table = tables[i];
                                    if (table.match(regex))
                                        list.push(table);
                                }
                                callback(list);
                            });
                        }
                    },
                    onLoseFocus: function()
                    {
                        self.checkTable();
                    }
                });
                
                details.createView();
            }
        }
    });
})(IMu.Themes.shared);
