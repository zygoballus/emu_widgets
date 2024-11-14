/*!
** @class IMu.Request.Handler
**
** @extends IMu.Request.Base
*/
IMu.Request.Handler = IMu.Request.Base.extend
({
	_construct: function()
	{
		this._super();

		this.name = 'Handler';

		this.id = undefined;
		this.language = undefined;
	},

    /*!
    */
	destroy: function()
	{
	},

    /*!
    */
	request: function(method, params, callback)
	{
		var self = this;

        var info =
        {
            method: method,
            params: params
        };

        var result = undefined;

        self._super(info, function(response, success)
        {
            if (! response)
                result = 'No response';
            else
            {
                if ('id' in response)
                    self.id = response.id;

                if (success)
                    result = response.result;
                else
                    result = response;
            }

			if (callback)
				callback.call(self, result, success);
        });

		return result;
	},

    /*!
    */
	requestData: function()
	{
		var data = this._super();

		if (this.id)
			data.id = this.id;
		if (! this.language || this.language != IMu.Languages.current.code)
		{
			this.language = IMu.Languages.current.code;
			data.language = this.language;
		}

		return data;
	}
});
