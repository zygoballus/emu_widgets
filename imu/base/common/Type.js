(function()
{
    var mapping = {};
    var types =
    [
        'Array',
        'Boolean',
        'Date',
        'Function',
        'Number',
        'Object',
        'RegExp',
        'String'
    ];
    for (var i = 0; i < types.length; i++)
    {
        var type = types[i];
        var key = '[object ' + type + ']';
        var name = type.toLowerCase();
        mapping[key] = name;
    }

    /**
     * @class IMu.Type
     *
     * Class providing static methods for determining types of JavaScript
     * values.
     */
    IMu.Type =
    {
        /**
         * Determines the type of the given value.
         *
         * @param mixed what The value whose type is required.
         * @returns string The type of the value.
         */
        get: function(what)
        {
            if (what === undefined)
                return 'undefined';
            if (what === null)
                return 'null';
            var key = Object.prototype.toString.call(what);
            return mapping[key] || 'object';
        },

        isArray: function(what)
        {
            return this.get(what) == 'array';
        },

        isBoolean: function(what)
        {
            return this.get(what) == 'boolean';
        },

        isDate: function(what)
        {
            return this.get(what) == 'date';
        },

        isFunction: function(what)
        {
            return this.get(what) == 'function';
        },

        isNull: function(what)
        {
            return this.get(what) == 'null';
        },

        isNumber: function(what)
        {
            return this.get(what) == 'number';
        },

        isObject: function(what)
        {
            return this.get(what) == 'object';
        },

        isRegExp: function(what)
        {
            return this.get(what) == 'regexp';
        },

        isString: function(what)
        {
            return this.get(what) == 'string';
        },

        isUndefined: function(what)
        {
            return this.get(what) == 'undefined';
        }
    };
})();
