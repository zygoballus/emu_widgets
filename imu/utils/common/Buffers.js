IMu.Buffers = {};

/**
 * @class IMu.Buffers.Circular
 *
 * Implements a circular buffer.
 */
IMu.Buffers.Circular = IMu.Class.create
({
    /*!
    ** @param size integer
    **   The size of the buffer.
    */
	_construct: function(size)
	{
		var self = this;

		self.buffer = new Array(size);
		self.size = size;
		self.index = 0;
		self.length = 0;
	},

    /*!
    ** Adds an arbitrary Javascript object to the buffer. The **data** object
    ** may be a simple type such as an integer or string or a more complex
    ** JavaScript structure such as an object or an array.
    **
    ** If the buffer is full the least recently added object is removed.
    **
    ** @param data mixed
    **   An arbitrary object.
    */
	add: function(data)
	{
		var self = this;

		self.buffer[self.index] = data;
		self.index = (self.index + 1) % self.size;
		if (self.length < self.size)
			self.length++;
	},

    /*!
    ** Clears the buffer.
    */
	clear: function()
	{
		var self = this;

		self.index = 0;
		self.length = 0;
	},

    /*!
    ** Gets an object from the buffer.
    **
    ** @param i integer
    **   The index of the object. The oldest item in the buffer has an index of
    **   0.
    */
	get: function(i)
	{
		var self = this;

		if (i < 0 || i >= self.length)
			return undefined;
		var first = self.length < self.size ? 0 : self.index;
		var index = (first + i) % self.size;
		return self.buffer[index];
	},

    /*!
    ** Gets the "newest" object in the buffer. This is the object added most
    ** recently.
    **
    ** @returns object
    **   The "newest" object.
    */
	getNewest: function()
	{
		var self = this;

		return self.get(self.length - 1);
	},

    /*!
    ** Gets the "oldest" object in the buffer. This is the object added least
    ** recently.
    **
    ** @returns object
    **   The "oldest" object.
    */
	getOldest: function()
	{
		var self = this;

		return self.get(0);
	},

    /*!
    ** Gets the object added before the most recent one.
    **
    ** @returns object
    **   The previously added object.
    */
	getPrevious: function()
	{
		var self = this;

		return self.get(self.length - 2);
	}
});
