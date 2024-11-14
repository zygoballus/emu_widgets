/**
 * Generate a request for information about or get a URL that resolves to a
 * single multimedia resource from the IMu server.
 *
 * Object properties can be used to specify:
 * <ul>
 *   <li>A particular multimedia record.</li>
 *   <li>A particular multimedia resource from a multimedia record</li>
 *   <li>On-the-fly modifications to the specified multimedia resource. This
 *   includes resizing and reformatting.</li>
 *   <li>The caching behaviour of the multimedia request.</li>
 * </ul>
 *
 * The particular multimedia record to retrieve the resource from can be
 * specified using the {@link #setKey} or {@link #setIdentifier} methods. A
 * particular resource from the multimedia record, for example, a resolution or
 * supplementary resource, can be selected based on various criteria using the
 * {@link #addFilter} method. On-the-fly modifications to the resource can be
 * specified using the {@link #addModifier} method. Information about the
 * multimedia resource specified by the previous methods can be retrieved using
 * the {@link #fetchInfo} method. The {@link #getURL} method returns a URL to
 * the multimedia resource itself.
 *
 * <br> Multimedia caching bahaviour can be specified using the
 * {@link #setCaching} method, cache information can be retrieved using the
 * {@link #fetchCacheInfo} method and the cache can be cleared using the
 * {@link #clearCache} method.
 *
 * @example
 *   // Construct the IMu.Request.Multimedia object.
 *   var mm = new IMu.Request.Multimedia();
 *
 * @class
 * @extends IMu.Request.Handler
 * @see TODO: link to documentation for Multimedia.php
 * @see TODO: link to documentation about caching.
 */
IMu.Request.Multimedia = IMu.Request.Handler.extend(
/** @lends IMu.Request.Multimedia# */
{
	_construct: function()
	{
		var self = this;

		self._super();
		self.name = 'Multimedia';
		self.params = {};
	},

    /**
     * Adds a filter parameter.
     *
     * Filters allow you to specify the particular resolution or supplementary
     * multimedia resource based on certain characteristics of the resource.
     *
     * The operator parameter is optional and if not supplied (i.e. only two
     * parameters are used) then the default 'eq' value will be used.
     *
     * The last supplied filter 'type' overrides any previously specified
     * filter with the same type.
     *
     * @example
     *   // Select a resolution (not master, thumbnail or supplementary
     *   // resources) with a width less than 400. Note the use of the default
     *   // 'eq' operator in the first statement.
     *   mm.addFilter('kind', 'resolution');
     *   mm.addFilter('width', 'lt', '400');
     * @example
     *   // Select the first resource with a width and height greater than 300.
     *   mm.addFilter('width', 'gt', '300');
     *   mm.addFilter('height', 'gt', '300');
     * @example
     *   // Select the resource whose width and height values are both closest
     *   // to 300.
     *   mm.addFilter('width', 'bf', '300');
     *   mm.addFilter('height', 'bf', '300');
     * @example
     *   // Select the thumbnail image.
     *   mm.addFilter('kind', 'thumbnail');
     * @example
     *   // Select the first video resource.
     *   mm.addFilter('mimeType', 'video');
     * @example
     *   // Specify a 'mimeType' filter
     *   mm.addFilter('mimeType', 'video');
     *   // This filter overrides the previous one as we can only have one
     *   // filter of each 'type'.
     *   mm.addFilter('mimeType', 'audio');
     *
     * @param {string} type The filter type. Types include:
     *   <ul>
     *     <li>height: The height (pixels) of the resource (images only).</li>
     *     <li>identifier: The record identifier (MulIdentifier) column.</li>
     *     <li>index: The index of the resource in the multimedia record
     *     documents & supplementary tables (combined).</li>
     *     <li>kind: Specify the (abstract) kind of resource e.g. thumbnail,
     *     master, resolution or supplementary.</li>
     *     <li>mimeFormat: The media format of the resource.</li>
     *     <li>mimeType: The media type of the resource.</li>
     *     <li>size: The file size of the resource.</li>
     *     <li>width: The width (pixels) of the resource (images only).</li>
     *   </ul>
     * @param {string} [operator=eq] The operator. Operators include:
     *   <ul>
     *     <li>eq: Equals.</li>
     *     <li>ne: Not equals.</li>
     *     <li>lt: Less than.</li>
     *     <li>gt: Greater than.</li>
     *     <li>le: Less than or equal to.</li>
     *     <li>ge: Greater than or equal to.</li>
     *     <li>bf: Best fit. Selects the resource with the closest value.</li>
     *     <li>bg: Similar to best fit. Selects the resource with the closest
     *     value greater than or equal to the supplied value.</li>
     *     </ul>
     *     The lt, gt, le, ge, bf and bg operators can only be used with filter
     *     types that support numeric comparison.
     * @param {string|number} value. The filter value.
     */
	addFilter: function(type, operator, value)
	{
		var self = this;

        /* The 'operator' is optional. If we are only supplied two arguments
         * assume that they are 'type' & 'value' and use the default eq
         * 'operator'.
         */
        if (typeof(value) == 'undefined')
        {
            value = operator;
            operator = 'eq';
        }
        var param = {};
        param.operator = operator;
        param.type = type;
        param.value = value;

        self.addParam('filter', param);
	},

    /**
     * Adds a modifier parameter.
     *
     * Modifiers allow you to specify that an on-the-fly modification should be
     * performed on the multimedia resource. The Modification of multimedia
     * resources is computationally expensive. For this reason you should make
     * sure that you have multimedia caching enabled so that commonly
     * modified multimedia resources will be retrieved from the cache rather
     * that being modified each time they are requested.
     *
     * <br>Note: When you retrieve the {@link #fetchInfo} or {@link #getURL} of
     * a resource with a modifier, you will receive the information/URL of the
     * modified resource, not the original resource.
     *
     * <br>The last supplied modifier 'type' overrides any previously specified
     * modifier with the same type.
     *
     * @example
     *   // Convert the resource to the JPEG format.
     *   mm.addModifier('format', 'jpeg');
     * @example
     *   // Resize the resource to have a width of 300 pixels.
     *   mm.addModifier('width', '300');
     * @example
     *   // Convert the resource to the JPEG format and resize to have a height
     *   // of 90 pixels.
     *   mm.addModifier('format', 'jpeg');
     *   mm.addModifier('height', '90');
     * @example
     *   // Specify a 'format' modifier
     *   mm.addModifier('format', 'png');
     *   // The following modifier overrides the previous one as we can only
     *   // have one modifier of each 'type'.
     *   mm.addModifier('format', 'jpeg');
     *
     * @see TODO: link to documentation about caching.
     *
     * @param {string} type The modifier type. Types include:
     *   <ul>
     *     <li>height: Resize the resource to the specified height (images
     *     only).</li>
     *     <li>format: Convert the resource to the specified media format (images only).</li>
     *     <li>width: Resize the resource to the specified width (images only).</li>
     *   </ul>
     * @param {string|number} value The modifier value.
     */
	addModifier: function(type, value)
	{
		var self = this;

        var param = {};
        param.type = type;
        param.value = value;

        self.addParam('modifier', param);
	},

    /**
     * Clears the multimedia cache.
     *
     * Generates a request to clear the multimedia cache. Calls the given
     * function when the request has finished.
     *
     * @example
     *   // Clear the cache.
     *   mm.clearCache(function()
     *   {
     *     alert('The multimedia cache has been cleared');
     *   });
     *
     * @param {function} callback
     */
	clearCache: function(callback)
	{
		var self = this;

        return self.request('clearCache', undefined, callback);
	},

    /**
     * Removes all filters parameters.
     *
     * Clears all filters previously supplied using the {@link #addFilter}
     * method.
     *
     * @example
     *   // Clear object filter parameters.
     *   mm.clearFilters();
     */
    clearFilters: function()
    {
		var self = this;

		delete self.params.filter;
    },

    /**
     * Removes all modifiers parameters.
     *
     * Clears all modifiers previously supplied using the {@link #addModifier}
     * method.
     *
     * @example
     *   // Clear object modifiers parameters.
     *   mm.clearModifiers();
     */
    clearModifiers: function()
    {
		var self = this;

		delete self.params.modifier;
    },

    /**
     * Removes all parameters.
     *
     * Clears all parameters supplied using the {@link #setKey},
     * {@link #setIdentifier}, {@link #addFilter} and {@link #addModifier}
     * methods.
     *
     * @example
     *   // Clear object parameters.
     *   mm.clearParams();
     */
    clearParams: function()
    {
		var self = this;

		self.params = {};
    },

    /**
     * Retrieves information about the multimedia cache.
     *
     * Generates a request to retrieve information about the multimedia cache.
     * Calls the given function with the cache information as a parameter when
     * the request has finished. The cache information is supplied as a json
     * object.
     *
     * @example
     *   // Get cache info.
     *   mm.fetchCacheInfo(function(info)
     *   {
     *     alert(JSON.stringify(info));
     *   });
     *
     * @param {function} callback
     */
	fetchCacheInfo: function(callback)
	{
		var self = this;

        return self.request('fetchCacheInfo', undefined, callback);
	},

    /**
     * Retrieves information about a multimedia resource.
     *
     * Generates a request to retrieve information about the multimedia
     * resource specified by the {@link #setKey}, {@link #setIdentifier},
     * {@link #addFilter} and {@link #addModifier} methods. Calls the given
     * function with the information as a parameter when the request has
     * finished. The information is supplied as a json object. The information
     * retrieved is:
     * <ul>
     *   <li>height: The height (pixels) if the resource is an image</li>
     *   <li>identifier: The file name</li>
     *   <li>key: The primary key of the multimedia record the resource is
     *   associated with</li>
     *   <li>mimeFormat: The MIME format</li>
     *   <li>mimeType: The MIME type</li>
     *   <li>size: The file size (bytes)</li>
     *   <li>title: The title given to the multimedia. The value of the
     *   MulTitle column</li>
     *   <li>width: The width (pixels) if the resource is an image</li>
     * </ul>
     *
     * <br>Note: The multimedia resource itself will still be retrieved and, if
     * caching is enabled, cached even though this method only returns
     * information about the resource.
     *
     * @example
     *   // Get information about a multimedia resource.
     *   mm.fetchInfo(function(info)
     *   {
     *     // For example, info =
     *     // {"width":"742","identifier":"mn013190.jpg","mimeFormat":"jpeg",
     *     // "mimeType":"image","height":"600","size":"48493","key":3,
     *     // "title":"Throwing Stick (Jandamarra's Boomerang)"}
     *     alert(JSON.stringify(info));
     *   });
     *
     * @param {function} callback
     */
	fetchInfo: function(callback)
	{
		var self = this;

        var params = self.getFlattenedParams();
        return self.request('fetchInfo', params, callback);
	},

    /**
     * Returns the parameters set on the object.
     *
     * @example
     *   var params = mm.getParams();
     *
     * @returns {array} The parameters.
     */
	getParams: function()
	{
		var self = this;

        return self.params;
	},

    /**
     * Returns the URL to a multimedia resource.
     *
     * Returns a URL that resolves to the multimedia resource specified by
     * the {@link #setKey}, {@link #setIdentifier}, {@link #addFilter} and
     * {@link #addModifier} methods. It is possible that the combination of
     * key, identifier and modifier values does not resolve to an actual
     * multimedia resource, for example, if you specify a key that does not
     * exists in the multimedia database. In this case, resolving the URL will
     * generate an HTTP 404 (Not Found) error.
     *
     * @example
     *   // Get the url to a multimedia resource.
     *   var url = mm.getURL();
     *
     * @returns {string} The URL.
     */
	getURL: function()
	{
		var self = this;

        var url = IMu.Request.getURL('Multimedia');
        url += '&method=fetch';

        var params = self.getFlattenedParams(true);
        for (var name in params)
            url += '&' + name + '=' + params[name];
        return url;
	},

    /**
     * Sets caching behaviour.
     *
     * Specify caching behaviour for multimedia requests generated by this
     * object. Requires that caching is set up correctly. Caching behaviour can
     * be specified as a configuration setting; this is recommended over
     * setting the caching behaviour on each instance of this class.
     *
     * @example
     *   // Enable caching.
     *   mm.setCaching();
     *   // - OR -
     *   mm.setCaching(true);
     *   // - OR -
     *   mm.setCaching('yes');
     * @example
     *   // Disable caching.
     *   mm.setCaching(false);
     *   // - OR -
     *   mm.setCaching('no');
     * @example
     *   // Specify that multimedia requests MUST be served from the cache.
     *   mm.setCaching('redirect');
     *
     * @see TODO: link to documentation about caching.
     *
     * @param {string|boolean} [value=yes] The cache behaviour. Behaviours are:
     *   <ul>
     *     <li>no/false: Do not check the cache for resources or cache
     *     resources retrieved from the IMu server.</li>
     *     <li>redirect: REQUIRES that requests are redirected (using HTTP
     *     Location header) to files in the cache. Caches all resources
     *     retrieved from the IMu server.</li>
     *     <li>yes/true: Check the cache for resources and cache all resources
     *     retrieved from the IMu server.</li>
     *   </ul>
     */
	setCaching: function(value)
	{
		var self = this;

        if (typeof(value) == 'undefined')
        {
            value = 'yes';
        }
        else if (typeof(value) == 'boolean')
        {
            if (value)
                value = 'yes';
            else
                value = 'no';
        }
        self.addParam('cache', value);
	},

    /**
     * Sets the disposition parameter.
     *
     * This parameter specifies a disposition.
     *
     * @example
     *   // Specify a disposition.
     *   mm.setDisposition('attachment');
     *
     * @param {string} value The disposition.
     */
	setDisposition: function(value)
	{
		var self = this;

        self.addParam('disposition', value);
	},

    /**
     * Sets the identifier parameter.
     *
     * This parameter specifies a multimedia record by identifier, that is, the
     * file name of the master resource. If multiple records match the given
     * parameter then the first record found is used.
     *
     * @example
     *   // Specify an identifier.
     *   mm.setIdentifier('mn013190.jpg');
     * @example
     *   // Specify an identifier with a wildcard.
     *   mm.setIdentifier('mn*.jpg');
     *
     * @param {string} value The identifier. Wildcard values are allowed.
     */
	setIdentifier: function(value)
	{
		var self = this;

        self.addParam('identifier', value);
	},

    /**
     * Sets the key (irn) parameter.
     *
     * This parameter specifies the multimedia record by key.
     *
     * @example
     *   // Specify a key.
     *   mm.setKey(23);
     *
     * @param {number} value The key (irn).
     */
	setKey: function(value)
	{
		var self = this;

        self.addParam('key', value);
	},

    /**
     * Returns the parameters set on the object.
     *
     * @example
     *   var mm1 = new IMu.Request.Multimedia();
     *   mm1.setKey(23);
     *   var params = mm1.getParams();
     *
     *   var mm2 = new IMu.Request.Multimedia();
     *   mm2.setParams(params);
     *   // mm2 now has the same parameters as mm1, i.e. key = 23.
     *
     * @param {array} params The parameters.
     */
	setParams: function(params)
	{
		var self = this;

        self.params = params;
	},


    /**
     * @private
     * @description Add to the request parameters.
     *
     * Utility method to add parameters to the object.
     *
     * @param {string} name The name of the parameter to add.
     * @param {string|number} value The value of the parameter.
     */
    addParam: function(name, value)
    {
		var self = this;

        if (name == 'filter' || name == 'modifier')
        {
            var type = value.type;
            delete value.type;

            if (! self.params[name])
                self.params[name] = {};

            self.params[name][type] = value;
        }
        else
        {
            self.params[name] = value;
        }
    },

    /**
     * @private
     * @description Generate a flattened associative array of the parameters.
     *
     * Returns an associative array of the parameters with the filter &
     * modifier parts flattened and, optionallly, the parameter values escaped.
     *
     * @param {boolean} [escaped=false] A flag to indicate whether the 'value'
     * component of the parameters set on the object should be escaped when
     * generating the associative array.
     */
    getFlattenedParams: function(escaped)
    {
		var self = this;

        if (typeof(escaped) == 'undefined')
            escaped = false;

        var params = {};
        for (var name in self.params)
        {
            var value = self.params[name];

            if (name == 'filter' || name == 'modifier')
            {
                var param = '';
                for (var type in value)
                {
                    if (param != '')
                        param += ';';

                    param += type;
                    if ('operator' in value[type])
                    {
                        var op = value[type].operator;
                        param += ':' + op;
                    }

                    if (escaped)
                        param += ':' + escape(value[type].value);
                    else
                        param += ':' + value[type].value;
                }
                params[name] = param;
            }
            else
            {
                if (escaped)
                    value = escape(value);
                params[name] = value;
            }
        }
        return params;
    }
});
