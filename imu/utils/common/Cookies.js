/*!
** @class IMu.Cookies
**
** Static class providing access to IMu-specific cookies in the browser.
**
** Each IMu-specific cookie can have several values.
**
** @since 2.0
*/
IMu.Cookies =
{
	cache: {},

	defaultName: 'IMu',

    /*!
    ** Checks for a cookie called ``name`` in the browser and returns its
    ** contents as an ``IMu.Cookie``.
    **
    ** If the cookie does not exist a new one is created.
    **
    ** @param name string
    **   The name of the cookie to find.
    **
    ** @param defaults object
    **   A set of default values to be set of the cookie does not already exist.
    **
    ** @returns IMu.Cookie
    **   The cookie.
    */
	get: function(name, defaults)
	{
		if (! name)
			name = this.defaultName;
		if (! (name in this.cache))
			this.cache[name] = new IMu.Cookie(name, defaults);
		return this.cache[name];
	},

	/* Low-level access */
	getCookie: function(name)
	{
		var string = document.cookie;
		var pattern = '(?:^|;\\s*)' + escape(name) + '=([^;]*)(?:;|$)';
		var regexp = new RegExp(pattern);
		var matches = string.match(regexp);
		if (matches)
            return unescape(matches[1]);
        return undefined;
	},

	setCookie: function(name, value, duration)
	{
		var cookie = escape(name) + '=';
		if (value !== undefined || value !== null)
			cookie += escape(value);
		if (duration !== undefined)
		{
			var date = new Date();
			// duration is in days */
			date.setTime(date.getTime() + duration * 24 * 60 * 60 * 1000);
			cookie += '; expires=' + date.toGMTString();
		}
		document.cookie = cookie;
	},

	checkCookies: function()
	{
		/* Check that cookies can be set correctly */
		var name = 'IMuTestCookie';
		var value = Math.floor(Math.random() * 100000);
		this.setCookie(name, value, 5);
		var test = this.getCookie(name);
		if (test - 0 != value)
			throw new IMu.Error('CookiesDisabled');
		this.setCookie(name, '', -1);
	}
};

(function()
{
	this.checkCookies();
}).apply(IMu.Cookies);

/*!
** @class IMu.Cookie
**
** Simple class allowing multiple values to be stored under one logical cookie
** name in the browser.
**
** ``IMu.Cookie`` objects are not usually created directly. Instead they get
** created  when ``IMu.Cookies.get()`` is called.
**
** @since 2.0
*/

/*!
** @example Add a cookie called "Test" to the browser's store. The "Test" cookie
** will contain two values: "alpha" and "beta".
**
** @code
**  var testCookie = IMu.Cookies.get('Test', {alpha: 1, beta: "two"});
**  testCookie.save();
*/

/*!
** @example Update the value of "beta" in the "Test" cookie.
**
** @code
**  var testCookie = IMu.Cookies.get('Test', {alpha: 1, beta: "two"});
**  testCookie.values.beta = 'zwei';
**  testCookie.save();
*/
IMu.Cookie = IMu.Class.create
({
    /*!
    ** Creates a cookie.
    **
    ** @param name string
    **   The name of the cookie to find.
    **
    ** @param defaults object
    **   A set of default values to be set of the cookie does not already
    **   exist.
    */
	_construct: function(name, defaults)
	{
		this.name = name;
		this.values = jQuery.extend({}, defaults);

		var values = IMu.Cookies.getCookie(this.name);
		if (values)
		{
			values = JSON.parse(values);
			this.values = jQuery.extend(this.values, values);
		}
	},

    /*!
    ** Removes this cookie from the cookie store.
    */
	remove: function()
	{
		IMu.Cookies.setCookie(this.name, '', -1);
	},

    /*!
    ** Saves the current set of values back to the browser's cookie store.
    */
	save: function(duration)
	{
		var values = JSON.stringify(this.values);
		IMu.Cookies.setCookie(this.name, values, duration);
	}
});
