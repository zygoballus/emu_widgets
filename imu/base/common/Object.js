(function()
{
	/* $check
	**
	** Flag that indicates that this version of javascript can see
	** the contents of a function as text. This characteristic
	** allows method overriding to be optimised.
	**
	** Need to be VERY careful with this check as smart javascript
	** compilers such as Google's closure compiler will optimise
	** this check to the point where it doesn't work!
	*/
	var $check = /42/.test(function(){return 42;});

	IMu.Object =
	{
		copy: function(what)
		{
			if (what == null || typeof(what) != 'object')
				return what;

            /* Need to be careful with the order of these checks.
            ** In particular checking instanceof Object has to be last
            ** as Array, Date and RegExp are Objects as well.
            */
			if (what instanceof Array)
			{
				var copy = [];
				for (var i = 0; i < what.length; i++)
					copy[i] = this.copy(what[i]);
				return copy;
			}
			if (what instanceof Date)
			{
				var copy = new Date();
				copy.setTime(what.getTime());
				return copy;
			}
			if (what instanceof RegExp)
			{
				var copy = new RegExp(what.source);
				return copy;
			}
			if (what instanceof Object)
			{
				var copy = {};
				for (var name in what)
					if (what.hasOwnProperty(name))
						copy[name] = this.copy(what[name]);
				return copy;
			}
			throw new IMu.Error('ObjectCopy', IMu.Type.get(what));
		},

		create: function(props)
		{
			var what = {};
			for (var name in props)
				what[name] = props[name];

			what.extend = function(props)
			{
				var what = {};
				for (var name in this)
					what[name] = this[name];
				for (var name in props)
					what[name] = IMu.Object.inherit(this[name], props[name]);
				return what;
			};

			what.update = function(props)
			{
				for (var name in props)
					this[name] = IMu.Object.inherit(this[name], props[name]);
			};

			return what;
		},

		inherit: function(oldValue, newValue)
		{
			if (newValue === undefined)
				return oldValue;

			if (typeof(newValue) != 'function')
				return newValue;

			if ($check && ! /\b_super\b/.test(newValue))
				return newValue;

			if (typeof(oldValue) != 'function')
			{
				/* Replace the oldValue with a stub function in case
				** the newValue calls _super()
				*/
				oldValue = function() { return undefined };
			}
			return function()
			{
				var save = this._super;
				this._super = oldValue;
				var result = newValue.apply(this, arguments);
				if (! save)
					delete this._super;
				else
					this._super = save;
				return result;
			};
		}
	};
})();
