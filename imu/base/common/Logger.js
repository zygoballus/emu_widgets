/**
 * @class IMu.Logger
 *
 * Static class to simplify writing to the browser's JavaScript console.
*/
IMu.Logger =
{
	indent: 0,
	on: true,

    /**
     * Writes a message to the JavaScript console if available.
     *
     * The message is formatted using the ``IMu.Format.format`` method and
     * prefixed with the current time.
     *
     * @param string format The string to be formatted, including format
     *  specifiers.
     */
	log: function()
	{
		if (! IMu.Logger.on)
			return;
		if (! window.console)
			return;
		if (! window.console.log)
			return;

		var string = IMu.Format.convert(new Date(), 'HH:MM:SS: ');
		for (var i = 0; i < IMu.Logger.indent; i++)
			string += '  ';

		var format = arguments[0];
		var params = Array.prototype.slice.call(arguments, 1);

		string += IMu.Format.vsprintf(format, params);
		window.console.log(string);
	}
};

/* ... for convenience */
IMu.log = IMu.Logger.log;
