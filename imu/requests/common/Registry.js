IMu.Request.Registry = IMu.Request.Handler.extend
({
	_construct: function()
	{
		var self = this;

		self._super();

		self.name = 'Registry';
	},

	getValue: function(keys, callback)
	{
        var params = {};
        params.keys = keys;
		return this.request('getValue', keys, callback);
	},

    setValue: function(keys, value, callback)
    {
		var params = {};
		params.keys= keys;
		params.value = value;
		return this.request('setValue', params, callback);
    }
});
