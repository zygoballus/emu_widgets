/*!
**
** @since 2.0
*/

/*!
** @example 
**
** @code
**    
** @endcode
*/

IMu.Widgets.add('graph', 'control',
{
    _construct: function()
    {

        this._super.apply(this, arguments);
        this.classes.push('imu-graph');

        this.registerOptions(
        {
            height: undefined
        });
    },

    _ready: function()
    {
        var self = this;

        self._super.apply(self, arguments);
    },

    setOwner: function(owner)
    {
        this.owner = owner;

        this.id = this.owner.attr('id');

        if (this.id)
            jQuery.registerId(this.id);
        else
            this.id =jQuery.allocateId(this.name);
    },

    addGraph: function(type, options)
    {
        var self = this;
        if(! options.table)
            throw new IMu.Error('NonTable');
        if(! options.terms)
            options.terms = [];
        if(IMu.Type.get(options.terms) != 'array')
            throw new IMu.Error('TermFormatError');
        if(! options.sortColumn)
            throw new IMu.Error('NonSortColumn');

        switch (type)
        {
            case 'bar':
                self.drawBarChart(options);
                break;
            case 'pie':
                self.drawPieChart(options);
                break;
            case 'bullet':
                self.drawBulletChart(options);
                break
            default:
                throw new IMu.Error('BadGraphType', type);
        }
    },

    drawBarChart: function(options)
    {
        var self = this;
        self.view.beginDelay();
        var data = self.getSortSummary(options, function(result)
        {
            self.view.endDelay();
            if (result)
            {
                result = self.normalise(result,'bar');
                if (self.view)
                    self.view.drawBarChart(result, options);
            }
        });
    },

    drawPieChart: function(options)
    {
        var self = this;
        self.view.beginDelay();
        var data = self.getSortSummary(options, function(result)
        {
            self.view.endDelay();
            if (result)
            {
                result = self.normalise(result,'pie');
                if (self.view)
                    self.view.drawPieChart(result, options);
            }
        });
    },

    drawBulletChart: function(options)
    {
        var self = this;

        if(!IMu.Type.isString(options.markerLabel))
            throw new IMu.Error('BadMarkerLabelOption');

        var data = self.getSortSummary(options, function(result,options)
        {
            if(result)
            {
                var resultNormalised = self.normalise(result,'bullet');

                for (var prop in result)
                {
                    if (result.hasOwnProperty(prop))
                    {
                        var propData = result[prop];
                        if (!propData.value)
                            continue;
                    }
                }
            }
        });
    },

    /*!
     **
     ** @param term string
     */
    getSortSummary: function(options,callback)
    {
        var self  = this;

        var module = new IMu.Request.Module(options.table);

        var terms = new IMu.Terms();
        // terms.add(options.column, options.term);
        for (var i = 0; i < options.terms.length; i++) 
        {
            var term = options.terms[i];
            terms.add(term[0], term[1]);
        }        

        module.findTerms(terms, function(hits)
        {
            if(hits > 0)
            {
                this.hits = hits;
                module.sort(options.sortColumn, 'report', function(result)
                {
                    if(result)
                    {
                        if(options.title)
                            result.key = options.title;
                        result.total = this.hits;
                        if(callback)
                            callback(result,options);
                    }
                });
            }
            else
                callback();
        });
    },

    normalise: function(data,type)
    {
        var self = this;
        var array = [];
        var object = {};

        for (var prop in data)
        {
            if (data.hasOwnProperty(prop))
            {
                var propData = data[prop];
                if (propData.value || propData.count)
                {
                    var value = {};
                    value.label = propData.value;
                    value.value = parseInt(propData.count);
                    array.push(value);
                }
            }
        }

        if (type == 'bar')
        {
            object.key = 'bar chart';

            object.values = array;

            return [object];
        }
        else if (type == 'pie')
        {
            return array;
        }
        else if( type == 'bullet')
        {
            var range = data.total + (data.total/100+10);
            object.title = data.key;
            object.ranges  = [range];
            object.measures = [data.total];

            return object;
        }
    }
});
