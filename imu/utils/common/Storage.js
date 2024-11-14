(function()
{
    IMu.Storage = {};

    var str = IMu.URL.path + '/' + IMu.path + '/..';
    str = str.replace(/^https?:\/\/[^\/]*\//, '');
    IMu.log('Storage str "{0}"', str);
    var old = str.split(/\//);
    var fix = [];
    for (var i = 0; i < old.length; i++)
    {
        if (old[i] != '..')
            fix.push(old[i]);
        else if (fix.length > 0)
            fix.pop();
    }
    IMu.Storage.path = '/' + fix.join('/');
    IMu.log('Storage.path {0}', IMu.Storage.path);

    /*!
    */
    IMu.Storage.Cookie =
    {
        /* These methods are based on the cookie reader/writer descibed in
        ** https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
        */

        /*!
        ** Gets the value of a cookie.
        **
        ** If the named cookie does not exist the a copy of the $<_default>
        ** parameter is returned instead.
        **
        ** @param name string
        **   The name of the cookie.
        ** 
        ** @param _default mixed
        **   The default value to be returned if the cookie does not exist.
        **   If the value is an object a deep copy is returned.
        **
        ** @returns mixed
        **   The value of the named cookie or the default value.
        */
        get: function(name, _default)
        {
            IMu.log('Storage.Cookie.get: name {0}', name);

            var key = window.encodeURIComponent(name);
            key = key.replace(/[\-\.\+\*]/g, "\\$&");

            var regex = new RegExp('(^|;)\\s*' + key + '\\s*\\=\\s*([^;]*)');

            var match = document.cookie.match(regex);
            var value;
            if (match)
                value = JSON.parse(window.decodeURIComponent(match[2]));
            else
                value = IMu.Object.copy(_default);

            IMu.log('Storage.Cookie.get: value {0}', value);
            return value;
        },

        /*!
        ** Checks for whether a particular cookie exists.
        **
        ** @param name string
        **   The name of the cookie.
        **
        ** @returns boolean
        **   **true** if the cookie exists, **false** otherwise.
        */
        has: function(name)
        {
            IMu.log('Storage.Cookie.has: name {0}', name);

            var key = window.encodeURIComponent(name);
            key = key.replace(/[\-\.\+\*]/g, "\\$&");

            var regex = new RegExp('(^|;)\\s*' + key + '\\s*\\=');

            var match = document.cookie.match(regex);
            var result = match != null;

            IMu.log('Storage.Cookie.has: result {0}', result);
            return result;
        },

        /*!
        ** Generate a list of names of all cookies.
        **
        ** Note: certain cookies such as __utma, __utmb and so on which are
        ** used by Google Analytics are ignored.
        **
        ** @returns array
        **   The list of cookie names.
        */
        list: function()
        {
            var names = [];

            var cookie = document.cookie;
            IMu.log('Storage.Cookie.list: cookie {0}', cookie);
            for (;;)
            {
                var match = cookie.match(/^\s*(\S[^=]*)\s*=[^;]*;?(.*)$/);
                if (! match)
                    break;

                var name = match[1];

                /* Ignore special google cookies */
                if (! name.match(/^__utm.$/))
                    names.push(name);

                cookie = match[2];
            }

            return names;
        },

        /*!
        ** Removes a cookie.
        **
        ** @param name string
        **   The name of the cookie.
        */
        remove: function(name)
        {
            if (name === undefined)
                return false;

            if (! this.has(name))
                return false;

            var key = window.encodeURIComponent(name);
            key = key.replace(/[\-\.\+\*]/g, "\\$&");

            var cookie = key + '=';
            cookie += ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
            cookie += ';path=' + IMu.Storage.path;
            IMu.log('Storage.Cookie.remove: cookie {0}', cookie);

            /* TODO: if cookie is empty, remove entirely
            */
            document.cookie = cookie;

            return true;
        },

        /*!
        ** Sets the value of a cookie.
        **
        ** Values are serialised as JSON and then URI encoded.
        **
        ** @param name string
        **   The name of the cookie.
        **
        ** @param value mixed
        **   The value of the cookie.
        **
        ** @param expires mixed
        **   When the cookie should be expired.
        **
        **   This value can be a:
        **
        **   * date
        **     The cookie is set to expire at the given date and time.
        **
        **   * number
        **     The cookie is set to expire after the given period.
        **
        **     A special value of *Infinity* may be used to ensure
        **     the cookie does not expire (the expiry date is set to
        **     31 December 9999).
        **
        **   * string
        **     The string can be a number followed by:
        **
        **     * s (seconds)
        **     * m (minutes)
        **     * h (hours)
        **     * d (days)
        **     * w (weeks)
        **
        **     Otherwise, the expiry date is set directly from the given string.
        **     It is assumed that the string is in a format which is understood
        **     by the browser as a date.
        **
        ** @returns boolean
        **   An indication of whether the cookie was set successfully or not.
        */
        set: function(name, value, expires)
        {
            IMu.log('Storage.Cookie.set: name {0}', name);
            IMu.log('Storage.Cookie.set: value {0}', value);
            IMu.log('Storage.Cookie.set: expires {0}', expires);

            if (name === undefined)
                return false;

            if (/^(?:expires|max\-age|path|domain|secure)$/i.test(name))
                return false;

            var key = window.encodeURIComponent(name);

            value = window.encodeURIComponent(JSON.stringify(value));

            switch (IMu.Type.get(expires))
            {
              case 'date':
                expires = expires.toUTCString();
                break;

              case 'number':
                if (expires === Infinity)
                    expires = 'Fri, 31 Dec 9999 23:59:59 UTC';
                else
                {
                    var time = new Date(Date.now() + expires * 1000);
                    expires = time.toUTCString();
                }
                break;

              case 'string':
                var match = expires.match(/^(\d+(\.\d+)?)\s*([smhdw])/);
                if (match)
                {
                    var secs = match[1];

                    /* Note: all cases are *meant* to fall through! */
                    switch (match[3])
                    {
                      case 'w':
                        secs *= 7;
                      case 'd':
                        secs *= 24;
                      case 'h':
                        secs *= 60;
                      case 'm':
                        secs *= 60;
                    }

                    var time = new Date(Date.now() + secs * 1000);
                    expires = time.toUTCString();
                }
                /* otherwise assume valid date string! */
                break;

              default:
                expires = undefined;
                break;
            }

            var cookie = key + '=' + value;
            cookie += ';path=' + IMu.Storage.path;
            if (expires)
                cookie += ';expires=' + expires;
            IMu.log('Storage.Cookie.set: cookie {0}', cookie);

            document.cookie = cookie;

            return true;
        }
    };

    if (typeof(window.localStorage) != 'undefined')
    {
        /*!
        */
        IMu.Storage.Local =
        {
            html5: true,

            /*!
            ** Gets a variable from local storage.
            **
            ** If the variable does not exist the a copy of the $<_default>
            ** parameter is returned instead.
            **
            ** @param name string
            **   The name of the variable.
            ** 
            ** @param _default mixed
            **   The default value to be returned if the variable does not
            **   exist. If the value is an object a deep copy is returned.
            **
            ** @returns mixed
            **   The value of the variable or the default value.
            */
            get: function(name, _default)
            {
                var key = IMu.Storage.path + '/' + name;
                if (key in window.localStorage)
                    return JSON.parse(window.localStorage.getItem(key));
                return IMu.Object.copy(_default);
            },

            has: function(name)
            {
                var key = IMu.Storage.path + '/' + name;
                return key in window.localStorage;
            },

            remove: function(name)
            {
                var key = IMu.Storage.path + '/' + name;
                window.localStorage.removeItem(key);
            },

            set: function(name, value)
            {
                var key = IMu.Storage.path + '/' + name;
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        };
    }
    else
    {
        /* These methods are fallbacks for those documented above on certain
        ** older platforms.
        */
        IMu.Storage.Local =
        {
            html5: false,

            get: function(name, _default)
            {
                return IMu.Storage.Cookie.get(name, _default);
            },

            has: function(name)
            {
                return IMu.Storage.Cookie.has(name);
            },

            remove: function(name)
            {
                IMu.Storage.Cookie.remove(name);
            },

            set: function(name, value)
            {
                IMu.Storage.Cookie.set(name, value, Infinity);
            }
        };
    }

    if (typeof(window.sessionStorage) != 'undefined')
    {
        /*!
        */
        IMu.Storage.Session =
        {
            html5: true,

            /*!
            ** Gets a variable from session storage.
            **
            ** If the variable does not exist the a copy of the $<_default>
            ** parameter is returned instead.
            **
            ** @param name string
            **   The name of the variable.
            ** 
            ** @param _default mixed
            **   The default value to be returned if the variable does not
            **   exist. If the value is an object a deep copy is returned.
            **
            ** @returns mixed
            **   The value of the variable or the default value.
            */
            get: function(name, _default)
            {
                var key = IMu.Storage.path + '/' + name;
                if (key in window.sessionStorage)
                    return JSON.parse(window.sessionStorage.getItem(key));
                return IMu.Object.copy(_default);
            },

            has: function(name)
            {
                var key = IMu.Storage.path + '/' + name;
                return key in window.sessionStorage;
            },

            remove: function(name)
            {
                var key = IMu.Storage.path + '/' + name;
                window.sessionStorage.removeItem(key);
            },

            set: function(name, value)
            {
                var key = IMu.Storage.path + '/' + name;
                window.sessionStorage.setItem(key, JSON.stringify(value));
            }
        };
    }
    else
    {
        /* These methods are fallbacks for those documented above on certain
        ** older platforms.
        */
        IMu.Storage.Session =
        {
            html5: false,

            get: function(name, _default)
            {
                return IMu.Storage.Cookie.get(name, _default);
            },

            has: function(name)
            {
                return IMu.Storage.Cookie.has(name);
            },

            remove: function(name)
            {
                IMu.Storage.Cookie.remove(name);
            },

            set: function(name, value)
            {
                IMu.Storage.Cookie.set(name, value);
            }
        };
    }
})();
