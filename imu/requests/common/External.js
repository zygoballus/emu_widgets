IMu.Request.External = IMu.Request.Handler.extend
({
    _construct: function()
    {
        this._super();

        this.name = 'External';
    },
    ExternalRequest: function(url,args,callback)
    {
        var argstring = '?';
        var prop;
        for (prop in args)
        {
            argstring += prop + '=' + args[prop] + '&';
        }
        argstring = argstring.substring(0,argstring.length - 1);

        var finalurl = url + argstring;

        $.ajax({
            type: "POST",
            url:finalurl,
            contentType: "application/jsonp",
            success: callback,
            error: callback,
            data: {},
            dataType: 'jsonp'
        });
    }
});
