IMu.Request.Browser = IMu.Request.Base.extend
({
    _construct: function()
    {
        this._super();

        this.name = 'Browser';
    },

    getLanguage: function(callback)
    {
        var self = this;

        IMu.log('Getting accepted languages...');

        var result = undefined;
        var info = 
        {
            method: 'getLanguage',
            params:
            {
            }
        };
        this.request(info, function(response, success)
        {
            if (response.result == null && callback)
                callback(null);

            result = [];

            var languages = response.result.split(",");
            for (var i in languages)
            {
                var tmp = languages[i].split(";q=");
                var language =
                {
                    code: tmp[0],
                    priority: 1
                };
                if (tmp[1] != null)
                    language.priority = parseFloat(tmp[1]);
                result.push(language);
            }

            result.sort(function(a, b)
            {
                if (a.priority < b.priority)
                    return 1;
                if (a.priority > b.priority)
                    return -1;
                return 0;
            });

            if (callback)
                callback.call(self, result, success);
        });
    }
});
