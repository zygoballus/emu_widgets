/*!
** Displays a specialised '3 Dimensional' location map showing plotting
** locations of each record in a result set.
**
** extends `viewer <./viewer.html>`_.
**
** Currently experimental prototype, not for normal production release.
** 
*/
IMu.Widgets.add('threed-viewer', 'viewer',
{
	_construct: function()
	{
		this._super.apply(this, arguments);
		this.classes.push('imu-threed-viewer');

        this.setWidgetOptions();

        this.errorState = false;    
        this.uniqueId = this.makeUniqId();

	},

    /*!
    ** Attempt to find coordinate values in the passed structure.
    **
    ** We assume we are passed something that represents a coordinate
    ** however it may be a simple number/string or it may be a structured
    ** object (depending on how it is represented in the raw data).
    **
    ** We need to be flexible in recognising what could be a
    ** coordinate to make it easy to map various data objects.
    **
    ** eg we may be passed '151.123E' or { 'longitude': 151.123 }
    **    or { 'longitude': '151 12 3 E' } etc
    */
    getCoordinateValues: function(obj)
    {
        var self = this;

        var val = obj;
        if (jQuery.isPlainObject(obj))
        {
            for (var property in obj)
            {
                var type = jQuery.type(obj[property]);
                if (type === 'string')
                {
                    if (obj[property].match(/^\s*[0-9NESW ]+\s*$/i))
                    {
                        val = obj[property];
                        continue;
                    }
                }   
                else if (type === 'number')
                {
                    val = obj[property];
                    continue;
                }
                else if (type === 'date')
                {
                    val = obj[property];
                    continue;
                }
            }
        }
        else if (jQuery.isArray(obj))
        {
            if (obj.length > 0)
                return self.getCoordinateValues(obj[0]);
        }

        val = self.massageCoordinates(val);
        return val;
    },

    /*!
    ** Test if passed coordinates are usable.
    */
    invalidCoordinates: function(x, y, z)
    {
        var self = this;

        if (x == '')
        {
            IMu.log('setSearch: bad longitude {0} (blank)', x);
            return true;
        }
        if (y == '')
        {
            IMu.log('setSearch: bad latitude {0} (blank)', y);
            return true;
        }

        if (isNaN(x))
        {
            IMu.log('setSearch: bad longitude {0} (NaN)', x);
            return true;
        }
        if (isNaN(y))
        {
            IMu.log('setSearch: bad latitude {0} (NaN)', y);
            return true;
        }
        if (isNaN(z))
        {
            IMu.log('setSearch: bad altitude {0} (NaN)', z);
            return true;
        }

        if ( x < this.options.coordRanges.x[0]  ||
                        x >  this.options.coordRanges.x[1] )
        {
            IMu.log('setSearch: bad longitude {0} (range)', x);
            return true;
        }
        if ( y < this.options.coordRanges.y[0]  || 
                        y >  this.options.coordRanges.y[1] )
        {
            IMu.log('setSearch: bad latitude {0} (range)', y);
            return true;
        }
        if ( z < this.options.coordRanges.z[0]  || 
                        z >  this.options.coordRanges.z[1] )
        {
            IMu.log('setSearch: bad altitude {0} (range)', z);
            return true;
        }
        return false;
   },

    makeUniqId: function()
    {
        var self = this;
        var x = Math.floor(Math.random() * 10).toString();
        var id = (Math.random() * 10000).toString().replace(/\./, x);
        return id;
    },

    /*!
    ** Turn lat/longs formats into floats.
    **
    ** @param val string
    **   lat/long value in various forms
    **
    ** @code
    ** examples:
    **   '151 20 20 W'
    **   '151 20 20W'
    **   '151 20.33 W'
    **   -151.3333
    ** @endcode
    ** etc
    */
    massageCoordinates: function(val)
    {
        if (val == undefined)
            return '';

        if (typeof val == 'number')
            return val;

        if (! val.match(/^[\-0-9. NSEW]+$/))
            return val;

        var terms = val.split(' ');
        var negate = false;
            var value = 0;
        jQuery.each(
            terms,
            function(idx, term)
            {
                if (term.match(/W|S/i))
                    negate = true;    
                else if (! term.match(/N|E/i))
                {
                    var divisor = Math.pow(60, idx);
                    value += term/divisor;
                }
            }
        );
        if (negate)
            value = - value;
        return value;
    },

    /*!
    ** Make structure to represent a point.
    */
    setPointInformation: function(row, searchName, searchLabel)
    {
        var self = this;

        var info = {};
        info.id = row.SummaryData;
        info.source = row.source;
        info.irn = row.irn;
        info.searchName = searchName;
        info.searchLabel = searchLabel;
        info.rawRow = row;
        return info;
    },

    /*!
    ** Process search results.
    */
    setSearch: function(search)
    {
        var self = this;

        if (self.errorState)
        {
            self.showStatusMessage('cannot search - map is in broken state: ' +
                                    self.errorState, true);
            return;
        }

        if (search == undefined)
            return;

        self.showStatusMessage( IMu.string('map-view-getting-points'), true);
        search.fetchMany([{offset: 0, count: -1}], 'locator', function(result)
        {
            var total = 0;
            var added = 0;
            var pointsToAdd = [];
            for (var i = 0; i < result.rows.length; i++)
            {
                total++;

                var row = result.rows[i];
                if (row.x === undefined || row.x === null)
                    continue;
                if (row.y === undefined || row.y === null)
                    continue;
                    
                var irn = row.irn;
                var label = row.SummaryData;
                var x = self.getCoordinateValues(row.x);
                var y = self.getCoordinateValues(row.y);
                var z = self.getCoordinateValues(row.z);

                if (self.invalidCoordinates(x, y, z))
                    continue;

                var info = self.setPointInformation(row,
                                             'test',
                                             search.labelName);
                var pointData = {
                    'x': x,
                    'y': y,
                    'z': z,
                    'info': info
                }
                pointsToAdd.push(pointData);
                added++;
            }
            IMu.log('setSearch: points total {0} added {1}', total, added);

            if (added == 0)
            {
                self.showStatusMessage(IMu.string(
                            'map-view-no-mappable-points'), false);
            }
            else    
            {
                self.showStatusMessage(added + ' ' +
                            IMu.string(
                                'map-view-mappable-points-found'), false);
                self.view.showPoints(pointsToAdd);                
            }

        });
    },

    setWidgetOptions: function()
    {
        var self = this;
            
        var context = 'ThreeD';

        self.registerOptions
        ({
            showStatusMessages:  true,
            coordRanges: { x : [-8000, 8000], y : [-8000, 8000], z : [0, 25000] }
        });
    },

    /*!
    ** Shows message on screen.
    */
    showStatusMessage: function(msg, keep)
    {
        var self = this;

        if (self.view !== undefined)
            self.view.showStatusMessage(msg, keep);
        else
            IMu.Events.bind('imu-show',
                function()
                {
                    self.view.showStatusMessage(msg, keep);
                }
            );
    }
});
