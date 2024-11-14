/**
 * @class IMu.Error
 *
 * Class for IMu-specific exceptions.
 *
 * Extends the standard JavaScript Error class.
 */
IMu.Error = IMu.Class.create(Error,
{
    /**
     * Creates an error object.
     *
     * @param string id An name identifying the kind of error
     */
	_construct: function(id)
	{
		Error.apply(this);
		this.name = 'IMu.Error';
		this.id = id;
		this.args = Array.prototype.slice.call(arguments, 1);
        this.code = undefined;
	},

    /**
     * IMu.Error overrides the standard ``toString``
     *
     * @returns string A string version of the exception.
     */
	toString: function()
	{
        var id = 'error-' + this.id;
        var string = IMu.string(id);
        if (this.args.length > 0)
            string = IMu.Format.formatParams(string, this.args);

        if (string == 'error-' + this.id)
        {
    		string = this._super();
    		string += ': ' + this.id;
    		if (this.args.length > 0)
    			string += '(' + this.args.join(', ') + ')';
        }
		return string;
	}
});
