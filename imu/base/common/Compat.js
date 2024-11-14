(function()
{
    /* Install some functions that may be missing in earlier versions
    ** of JavaScript.
    */
    if (! Date.now)
    {
        Date.now = function()
        {
            return (new Date()).getTime();
        }
    }

    if (! Object.getPrototypeOf)
    {
        /* Based on John Resig's blog.
         * See http://ejohn.org/blog/objectgetprototypeof/
         */
        if (typeof('test'.__proto__) == 'object')
        {
            Object.getPrototypeOf = function(object)
            {
                return object.__proto__;
            }
        }
        else
        {
            Object.getPrototypeOf = function(object)
            {
                /* Note: This may break if the constructor has been modified
                 */
                return object.constructor.prototype;
            }
        }
    }

    if (! Object.keys)
    {
        /* From the MDN site.
         * See https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
         */
        Object.keys = (function()
        {
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            var hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString');
            var dontEnums =
            [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ];

            return function (obj)
            {
                if (typeof obj !== 'object' &&
                    typeof obj !== 'function' || obj === null)
                    throw new TypeError('Object.keys called on non-object')

                var result = [];
                for (var prop in obj)
                {
                    if (hasOwnProperty.call(obj, prop))
                        result.push(prop);
                }
                if (hasDontEnumBug)
                {
                    for (var i=0; i < dontEnums.length; i++)
                    {
                        if (hasOwnProperty.call(obj, dontEnums[i]))
                            result.push(dontEnums[i])
                    }
                }
                return result;
            }
        })();
    }
})();
