(function()
{
	/* The pattern used for parsing format strings
	*/
	var $format = /\{(\d+)(,(-?\d+))?(:([^\}]*))?\}/g;
	var $dates = /[ymdHM]+|(S+)(\.\S+)?/g;
	var $number = /^([bdfgoxX])(\d+)?$/;

    /**
     * @class IMu.Format
     *
     * Static class for formatting strings.
     */
	IMu.Format =
	{
        /**
         * Converts a JavaScript value to an appropriate string representation.
         *
         * @param mixed value The value to be converted.
         * @param string format A conversion format specifier.
         *
         * @returns string The string representation of ``value``.
         */
		convert: function(value, format)
		{
			var type = IMu.Type.get(value);
			if (type == 'undefined')
				return '(undefined)';
			if (type == 'null')
				return '(null)';
			if (type == 'array')
			{
				if (window.JSON)
					return JSON.stringify(value);
				return value.toString();
			}
			if (type == 'date')
			{
                if (! format)
                    format = 'yyyy-mm-dd';
				result = format.replace($dates, function()
				{
					var s = arguments[0];
					var c = s.charAt(0);
					var n = s.length;
					var v = '';
					switch (c)
					{
					  case 'y':
					  	v = value.getFullYear();
						if (n <= 2)
							v %= 100;
						v = v.toString();
						while (v.length < n)
							v = '0' + v;
						break;
					  case 'm':
					  	var m = value.getMonth();
						if (n <= 2)
						{
							v = (m + 1).toString();
							while (v.length < n)
								v = '0' + v;
						}
						// TODO - month name
						break;
					  case 'd':
						var d = value.getDate();
						if (n <= 2)
						{
							v = d.toString();
							while (v.length < n)
								v = '0' + v;
						}
						// TODO - day name
						break;
					  case 'H':
						v = value.getHours().toString();
						while (v.length < n)
							v = '0' + v;
						break;
					  case 'M':
						v = value.getMinutes().toString();
						while (v.length < n)
							v = '0' + v;
						break;
					  case 'S':
						v = value.getSeconds().toString();
						var i = arguments[1].length;
						while (v.length < i)
							v = '0' + v;
						if (arguments[2])
						{
							var m = value.getMilliseconds() / 1000;
							var p = arguments[2].length - 1;
							m = m.toFixed(p);
							m = m.substr(1);
							v += m;
						}
						break;
					}
					return v;
				});
				return result;
			}
			if (type == 'number')
			{
				var specifier = 'g';
				var precision = undefined;
				if (format)
				{
					var matches = format.match($number);
					if (matches)
					{
						specifier = matches[1];
						precision = matches[2];
					}
				}
				switch (specifier)
				{
				  case 'b':
				  	value = parseInt(value).toString(2);
					break;
				  case 'd':
				  	value = parseInt(value).toString(10);
					break;
				  case 'f':
				  	value = parseFloat(value);
					if (precision !== undefined && precision !== '')
						value = value.toFixed(precision);
					break;
				  case 'o':
				  	value = parseInt(value).toString(8);
					break;
				  case 'x':
				  	value = parseInt(value).toString(16).toLowerCase();
					break;
				  case 'X':
				  	value = parseInt(value).toString(16).toUpperCase();
					break;
				  default:
				  	value = value.toString();
					break;
				}
				return value;
			}
			if (type == 'object')
			{
				if (value instanceof Error)
					return value.toString();
				if (value instanceof jQuery)
				{
					if (value.length == 0)
						return '(empty)';

					var result = '';
					result = value[0].tagName.toLowerCase();
					if (value.attr('id'))
						result += '#' + value.attr('id');
					else if (value.attr('name'))
						result += '[' + value.attr('name') + ']';
					else if (value.attr('class'))
					{
						var attr = value.attr('class');
						if (attr.match(/\s+/))
							result += '.(' + attr + ')';
						else
							result += '.' + attr;
					}
					if (value.length > 1)
						result +=  '(' + value.length + ' elements)';
					return result;
				}
				if (window.JSON)
					return JSON.stringify(value);
				return value.toString();
			}

			return value.toString(format);
		},

        /*!
        ** Replaces specifiers in the ``format`` argument with string
        ** representations of values passed as additional arguments.
        **
        ** @param string format The string to be formatted, including format
        **  specifiers.
        **
        ** @returns string The formatted string.
        */
        format: function()
        {
			var format = arguments[0];
			var params = Array.prototype.slice.call(arguments, 1);
			return this.formatParams(format, params);
        },

        /*!
        ** Replaces specifiers in the ``format`` argument with string
        ** representations of values passed in the ``params`` array.
        **
        ** @param string format The string to be formatted, including format
        **  specifiers.
        **
        ** @param array params The set of parameters used to fill in place
        **  holders in the ``format`` string.
        **
        ** @returns string The formatted string.
        */
        formatParams: function(format, params)
        {
			var self = this;

			var result = format.replace($format, function()
			{
				var index = arguments[1];
				var alignment = arguments[3];
				var specifics = arguments[5];

				var value = self.convert(params[index - 0], specifics);
				if (alignment)
				{
					var before = true;
					if (alignment < 0)
					{
						before = false;
						alignment = -alignment;
					}
					if (value.length < alignment)
					{
						var pad = '';
						for (var i = value.length; i < alignment; i++)
							pad += ' ';
						if (before)
							value = pad + value;
						else
							value = value + pad;
					}
				}
				return value;
			});
			return result;
        },

        /**
         * A synonym for the ``format`` method.
         */
		sprintf: function()
		{
			var format = arguments[0];
			var params = Array.prototype.slice.call(arguments, 1);
			return this.formatParams(format, params);
		},

        /*!
        ** A synonym for the ``formatParams`` method.
        */
		vsprintf: function(format, params)
		{
            return this.formatParams(format, params);
		}
	};
})();
