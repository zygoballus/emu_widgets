/* IMu uses a single namespace
*/
var IMu = {};

(function()
{
	/* Find the script element which includes imu.js.
	** From this we can work out the path to all the IMu files.
	*/
    IMu.elem = undefined;
    IMu.path = undefined;
	var elems = document.getElementsByTagName('script');
	var exp = new RegExp('^(.*)/imu(.min.js|.js|.php)$');
	for (var i = 0; i < elems.length; i++)
	{
		var elem = elems[i];
		var src = elem.getAttribute('src');
		if (src)
		{
			var matches = src.match(exp);
			if (matches)
			{
				IMu.elem = elem;
				IMu.path = matches[1];
				break;
			}
		}
	}
    if (IMu.elem === undefined || IMu.path === undefined)
    {
        var mesg = "Can't find imu.js (or equivalent)";
        alert(mesg);
        throw new Error(mesg);
    }

    /* Keep a list of callbacks to be run when IMu is ready.
    */
    var $callbacks = [];
    IMu.ready = function(callback)
    {
        $callbacks.push(callback);
        if ($callbacks.length == 1)
        {
            IMu.Events.setup();

            var language = IMu.Config.preferredLanguage;
            if (language)
            {
                IMu.log('Loading {0} as default language', language);
                IMu.Languages.select(language);
            }

            var browser = new IMu.Request.Browser();
            browser.getLanguage(function(result)
            {
                for (var i in result)
                {
                    var newLang = result[i].code;
                    if ( IMu.Languages.registered[newLang] == undefined)
                    {
                        for (var code in IMu.Languages.registered)
                        {
                            var altCode = IMu.Languages.registered[code].altCode;
                            if (newLang == altCode)
                            {
                                newLang = code;
                                break;
                            }
                        }
                    }

                    if (Globalize.cultures[newLang] != undefined)
                    {
                        if (newLang != IMu.Config.preferredLanguage)
                        {
                            IMu.log('Updating {0} as default language', newLang);
                            IMu.Languages.select(newLang);
                            IMu.Events.trigger('language-changed');
                        }
                        break;
                    }
                }
            });

            var theme = IMu.Config.preferredTheme;
            if (theme)
            {
                IMu.log('Loading {0} as default theme', theme);
                IMu.Themes.get(theme).load();
            }

            IMu.Importer.load(function()
            {
                IMu.log('Loader ready');
                if (theme)
                    IMu.Themes.select(theme);
                jQuery(document).ready(function()
                {
                    IMu.log('Document ready');
                    IMu.URL.Hash.load();
                    for (var i = 0; i < $callbacks.length; i++)
                        $callbacks[i]();
                    IMu.show();
                });
            });
        }
    };

    IMu.shown = 0;
    IMu.show = function(force)
    {
        /* This code may be needed if the DOM tree needs a little more time
        ** to settle down but currently I don't think it's necessary.
        **
        ** AB 1 Mar 2013
        var timeout = 50;
        window.setTimeout(function()
        {
            IMu.Events.trigger('imu-show');
        }, timeout);
        */

        if (IMu.shown == 0 || force)
        {
            IMu.shown++;
            IMu.Events.trigger('imu-show');
        }
    };
})();
