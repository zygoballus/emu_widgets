IMu.Request.Dummy = IMu.Request.Base.extend
({
	_construct: function()
	{
		this._super();

        this.name = 'Dummy';
	},

    fail: function(callback)
    {
        var self = this;

		var info =
        {
            method: 'fail',
            params:
            {
            }
        };

        var result = undefined;

		self.request(info, function(response, success)
        {
            if (callback)
                callback.call(self, response, success);
        });

        return result;
	},

    succeed: function(callback)
    {
        var self = this;

		var info =
        {
            method: 'succeed',
            params:
            {
            }
        };

        var result = undefined;

		self.request(info, function(response, success)
        {
            if (callback)
                callback.call(self, response, success);
        });

        return result;
	}
});
