/*
The IMu objected-oriented inheritance system.

This is based on an article on simple class inheritance by John Resig
(author of jQuery). See http://ejohn.org/blog/simple-javascript-inheritance/
for more details.

To create a base inheritable "class" use the factory method IMu.Class.create.
Pass the class members and methods as an object.

	var myClass = IMu.Class.create
	({
		_construct: function()
		{
			// This is the class constructor.
			// It is called when an object is created.
			this.myProp = 'hello';
		},

		myMethod: function()
		{
			// This is a conventional method.
			alert(this.myProp);
		}
	});

Use the class as expected:

	var myInstance = new myClass();

To subclass an inheritable class, call the base class's extend method. New
members and methods to be added to the subclass are passed as an object.

	var mySubclass = myClass.extend
	({
		myNewMethod: function()
		{
			alert('myNewMethod is calling myMethod');
			this.myMethod();
		}
	});

	var myInstance = new mySubclass();

If you override a method you can call its immediate base method using the
special _super method.

	var myClass = IMu.Class.create
	({
		method1: function()
		{
			alert('base method1');
		}
	});

	var mySubclass = myClass.extend
	({
		method1: function()
		{
			alert('subclass method1 is calling base method1');
			this._super();	// "Magically" call myClass.method1();
		}
	});

You can also add to a class without subclassing it.

	var myClass = IMu.Class.create
	({
		method1: function()
		{
			alert('base method1');
		}
	});

	myClass.mixin
	({
		method2: function()
		{
			alert('method2');
		}
	});

myClass now includes method1 and method2. If you override a method this way
you cannot call the base method.

	var myClass = IMu.Class.create
	({
		method1: function()
		{
			alert('base method1');
		}
	});

	myClass.mixin
	({
		method1: function()
		{
			alert('new method1');
			// There is no way to call the base method1
		}
	});

Any object can be passed to the mixin method. However, an IMu.Object object
is provided to make creating "subclassed" mixins easier.

	var myMixin = IMu.Object.create
	({
		interfaceMethod: function()
		{
			alert('mixin code');
		}
	});

	var mySubMixin = myMixin.extend
	({
		interfaceMethod: function()
		{
			alert('submixin code');
			this._super();
		}
	}, true);

	var myClass = IMu.Class.create
	({
		// ...
	});

	myClass.mixin(myMixin);

You can remove a mixin dynamically as well.

	myClass.mixout(myMixin);

will remove all methods in myMixin from myClass. Any overridden methods
belonging to myClass will NOT be restored to their original state. However,
any overridden methods belonging to a base class of myClass WILL be available.
This is potentially very tricky to follow!
*/
(function()
{
	/* Flag used to ensure that class constructors are not called
	** when a new object is created just to make a prototype.
	*/
	var $magic = false;

	IMu.Class =
	{
		create: function()
		{
			var base = function(){};
			var index = 0;
			if (arguments.length > 0 && typeof(arguments[0]) == 'function')
			{
				base = arguments[0];
				index = 1;
			}

			$magic = true;
			var proto = new base();
			$magic = false;

			while (index < arguments.length)
			{
				var props = arguments[index++];
				if (! IMu.Type.isObject(props))
					continue;
				for (var name in props)
					proto[name] = IMu.Object.inherit(proto[name], props[name]);
			}

			function IMuClass()
			{
				if (! $magic && this._construct)
					this._construct.apply(this, arguments);
			}

			IMuClass.prototype = proto;

			IMuClass.prototype.constructor = IMuClass;

			IMuClass.extend = function(properties)
			{
				return IMu.Class.create(this, properties);
			};

			IMuClass.mixin = function(properties)
			{
				for (var name in properties)
					this.prototype[name] = properties[name];
			};

			IMuClass.mixout = function(properties)
			{
				for (var name in properties)
				{
					if (this.prototype.hasOwnProperty(name))
						delete this.prototype[name];
				}
			};

			return IMuClass;
		}
	};

	IMu.Mixins = {};

	IMu.Mixins.Options = IMu.Object.create
	({
		getOption: function(name)
		{
			var self = this;

			if (! self.options)
				self.options = {};
			if (name in self.options)
				return self.options[name];
			throw new IMu.Error('OptionsUnknownOption', name);
		},

		registerOptions: function(options)
		{
			var self = this;

			if (! self.options)
				self.options = {};
			for (var name in options)
				self.options[name] = options[name];
		},

        setOption: function(name, value)
        {
            var options = {};
            options[name] = value;
            this.setOptions(options);
        },

		setOptions: function(options)
		{
			var self = this;

			if (! self.options)
				return;

			var changes = [];
			for (var name in options)
			{
				if (! (name in self.options))
				{
					IMu.log('setOptions: unknown option "{0}"', name);
					continue;
				}

				var change = {};
				change.name = name;
				change.oldValue = self.options[name];
				change.newValue = options[name];
				change.apply = true;
				if (change.oldValue !== change.newValue)
					changes.push(change);
			}
			if (changes.length == 0)
				return;

			if (self.beforeChangingOptions)
				self.beforeChangingOptions(changes);

			var changed = [];
			for (var i = 0; i < changes.length; i++)
			{
				var change = changes[i];
				if (change.apply)
				{
					self.options[change.name] = change.newValue;
					delete change.apply;
					changed.push(change);
				}
			}

			if (changed.length == 0)
				return;

			if (self.afterChangingOptions)
				self.afterChangingOptions(changed);
			if (self.optionsChanged)
				self.optionsChanged(changed);
		}
	});
})();
