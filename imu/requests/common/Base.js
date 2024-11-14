IMu.Request.Base = IMu.Class.create
({
	_construct: function()
	{
		this.url = IMu.Request.getURL();

		this.port = IMu.Request.defaultPort;
        this.context = IMu.Request.defaultContext;

		this.name = undefined;

		this.async = true;

        this.onError = undefined;
        this.onSuccess = undefined;
        this.onComplete = undefined;

        this.errorHandling = undefined;

        this.result = undefined;

        if (IMu.Login.info)
        {
            this.port = IMu.Login.info.port;
            this.context = IMu.Login.info.context;
        }
	},

    request: function(info, callback)
    {
        var self = this;

        var data = self.requestData();
        for (var name in info)
            data[name] = info[name];

        self.result =
        {
            success: undefined,
            response: undefined
        }

        var ajax =
        {
            async: self.async,
            contentType: 'text/json',
            data: JSON.stringify(data),
            dataType: 'json',
            processData: false,
            type: 'POST',
            url: self.url,

            complete: function(jqXHR, textStatus)
            {
                IMu.log('Request.{0}: complete (success {1})',
                    self.name, self.result.success);

                if (self.onComplete)
                    self.onComplete.call(self, self.result);
            },

            error: function(jqXHR, textStatus, errorThrown)
            {
                IMu.log('Request.{0}: error status {1}',
                    self.name, textStatus);

                try
                {
                    var response = JSON.parse(jqXHR.responseText);
                    IMu.log('Request.{0}: error response {1}', self.name, response);
                    var error = new IMu.Error(response.id);
                    error.args = response.args;
                    error.code = response.code;
                }
                catch(e)
                {
                    if (jqXHR.status == 500)    // no method
                        var error = new IMu.Error('NoMethod');
                    else if (jqXHR.status == 0) // couldn't contact web server
                        var error = new IMu.Error('NoWebServerConnection');
                    else    // unknown error
                        var error = new IMu.Error('UnknownError');
                    error.code = 500;
                    error.args = [];
                    IMu.log('Request.{0}: error jqXHR {1}', self.name, jqXHR);
                }

                var success = self.result.success = false;
                var result = self.result.response = error;

                if (self.onError)
                    self.onError.call(self, response, success);

                if (self.errorHandling)
                {
                    if (self.errorHandling == 'callback')
                    {
                        if (callback)
                            callback.call(self, response, success);
                    }
                    else if (self.errorHandling == 'exception')
                        throw response;
                }
            },

            success: function(response, textStatus, jqXHR)
            {
                IMu.log('Request.{0}: success status {1}',
                    self.name, textStatus);
                IMu.log('Request.{0}: success response {1}',
                    self.name, response);

                var success = self.result.success = true;
                var response = self.result.response = response;

                if ('port' in response)
                    self.port = response.port;
                if ('context' in response)
                    self.context = response.context;

                if (self.onSuccess)
                    self.onSuccess.call(self, response, success);

                if (callback)
                    callback.call(self, response, success);
            }
        };

        IMu.log('Request.{0}: submitting data {1}', self.name, ajax.data);

        jQuery.ajax(ajax);

        return self.result.response;
    },

    /*!
    */
	requestData: function()
	{
		var data = {};
		data.request = this.name;
		if (this.port)
			data.port = this.port;
		if (this.context)
			data.context = this.context;
		return data;
	}
});
