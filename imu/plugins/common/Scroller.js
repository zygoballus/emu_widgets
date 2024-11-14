jQuery.fn.IMuScroller = function(options)
{
	var children = this.children().detach();

	var plugin = new IMu.jQuery.Scroller(this);
	this.data(plugin.pluginName, plugin);
	plugin.setOptions(options);
	plugin.create();

	if (children.length > 0)
		plugin.setContent(jQuery(children[0]));

	plugin.finalise();
	return plugin;
}

IMu.jQuery.Scroller = IMu.jQuery.Plugin.extend
({
	pluginName: 'IMuScroller',

	// called by jQuery  (see above)
	_construct: function()
	{
		var self = this;

		self._super.apply(self, arguments);
		self.owner.addClass('imu-scroller-plugin');

		self.registerOptions
		({
			/* deceleration
			**
			** Rate of deceleration when free sliding.
			** Unit is pixels per millisecond per millisecond.
			*/
			deceleration: 0.0025,

			/* horizontalPager
			**
			** Show a horizontal page control?
			*/
			horizontalPager: false,

			/* horizontalScrollbar
			*/
			horizontalScrollbar: false,

			/* horizontalSnap
			**
			*/
			horizontalSnap: 1,

			/* lockEventCount
			**
			** The number of events to receive before deciding
			** the direction to lock scrolling.
			**
			** This is used when scrollType is set to "lock".
			*/
			lockEventCount: 4,

			/* mouseDrag
			**
			** Can the user drag the contents with the mouse?
			*/
			mouseDrag: false,

			/* scrollType
			**
			** Type type of scrolling. Must be one of
			**
			**   both
			**     Scroll both horizontally and vertically at the same time.
			**
			**   horizontal
			**     Only scroll horizontally.
			**
			**   lock
			**     Lock the direction of scrolling based on the initial
			**     movement.
			**
			**   vertical
			**     Only scroll vertically.
			*/
			scrollType: 'both',

			/* touchDrag
			**
			** Can the user drag the contents by touch?
			*/
			touchDrag: true,

			/* updateInterval
			**
			** Update frequency while scrolling (in milliseconds).
			*/
			updateInterval: 20,

			/* velocityThreshold
			**
			** Velocity (in pixels/millisecond) which the initial velocity
			** (i.e. velocity at moment of release of touch or mouse)
			** must be above before any sliding will occur.
			*/
			velocityThreshold: 0.4,

			/* verticalPager
			*/
			verticalPager: false,

			/* verticalScrollbar
			*/
			verticalScrollbar: false,

			/* verticalSnap
			*/
			verticalSnap: 1,

			/* wheelMove
			*/
			wheelMove: '10%',

			/* onCreate
			*/
			onCreate: undefined,

			/* onResize
			*/
			onResize: undefined,

			/* onScroll
			*/
			onScroll: undefined,

			/* onShow
			*/
			onShow: undefined
		});

		self.holder = undefined;
		self.up = undefined;
		self.down = undefined;
		self.left = undefined;
		self.right = undefined;
		self.view = undefined;
		self.content = undefined;
		self.hScroll = undefined;
		self.vScroll = undefined;

		self.dragMode = undefined;
		self.lastEvent = undefined;
		self.nextEvent = undefined;
		self.eventCount = undefined;
		self.dragX = undefined;
		self.dragY = undefined;

		self.xVelocity = undefined;
		self.yVelocity = undefined;

		self.moveTimer = undefined;

		self.scrollTimer = undefined;
	},

	create: function()
	{
		var self = this;

		var elem;
		var src;
		var img;

		self.holder = elem = self.owner.child('div')
		elem.css('position', 'relative');
		elem.addClass('holder');

		self.view = elem = self.holder.child('div');
		elem.css('overflow', 'hidden');
		elem.css('position', 'absolute');
		elem.addClass('view');

		var options = self.options;

		if (options.scrollType == 'vertical' || ! options.horizontalPager)
		{
			self.left = undefined;
			self.right = undefined;
		}
		else
		{
			self.left = elem = self.holder.child('div');
			elem.css('position', 'absolute');
			elem.addClass('pager pager-horizontal pager-left');
			elem.attr('title', IMu.string('common-prev'));
			src = IMu.Request.getURL('Image');
			src += '&name=pager-left';
			img = elem.child('img');
			img.attr('src', src);

			self.right = elem = self.holder.child('div');
			elem.css('position', 'absolute');
			elem.addClass('pager pager-horizontal pager-right');
			elem.attr('title', IMu.string('common-next'));
			src = IMu.Request.getURL('Image');
			src += '&name=pager-right';
			img = elem.child('img');
			img.attr('src', src);
		}

		if (options.scrollType == 'horizontal' || ! options.verticalPager)
		{
			self.up = undefined;
			self.down = undefined;
		}
		else
		{
			self.up = elem = self.holder.child('div');
			elem.css('position', 'absolute');
			elem.addClass('pager pager-vertical pager-up');
			src = IMu.Request.getURL('Image');
			src += '&name=pager-up';
			img = elem.child('img');
			img.attr('src', src);

			self.down = elem = self.holder.child('div');
			elem.css('position', 'absolute');
			elem.addClass('pager pager-vertical pager-down');
			src = IMu.Request.getURL('Image');
			src += '&name=pager-down';
			img = elem.child('img');
			img.attr('src', src);
		}

		if (self.scrollType == 'vertical' || ! options.horizontalScrollbar)
			self.hScroll = undefined;
		else
			self.hScroll = self.makeScrollbar('horizontal');

		if (self.scrollType == 'horizontal' || ! options.verticalScrollbar)
			self.vScroll = undefined;
		else
			self.vScroll = self.makeScrollbar('vertical');
	},

	// public
	clear: function()
	{
		var self = this;

		if (self.content)
			self.content.empty();
	},

	getContent: function()
	{
		var self = this;

		return self.content;
	},

	getPosition: function(extra)
	{
		var self = this;

		var viewOffset = self.view.offset();
		var contentOffset = self.content.offset();

		var pos = {};
		pos.left = Math.round((viewOffset.left - contentOffset.left) * 10) / 10;
		pos.top = Math.round((viewOffset.top - contentOffset.top) * 10) / 10;

		if (extra)
		{
			var viewWidth = self.view.width();
			var viewHeight = self.view.height();

			var contentWidth = self.content.fullWidth();
			var contentHeight = self.content.fullHeight();

			pos.right = pos.left + viewWidth;
			pos.bottom = pos.top + viewHeight;

			pos.overLeft = -pos.left;
			if (pos.overLeft < 0)
				pos.overLeft = 0;
			pos.overRight = pos.right - contentWidth;
			if (pos.overRight < 0)
				pos.overRight = 0;
			pos.overHorizontal = pos.overLeft > 0 || pos.overRight > 0;

			pos.overTop = -pos.top;
			if (pos.overTop < 0)
				pos.overTop = 0;
			pos.overBottom = pos.bottom - contentHeight;
			if (pos.overBottom < 0)
				pos.overBottom = 0;
			pos.overVertical = pos.overTop > 0 || pos.overBottom > 0;
		}

		return pos;
	},

	pageDown: function()
	{
		var self = this;

		var info = {};
		info.vDuration = 800;
		info.vOffset = self.view.height();
		self.move(info);
	},

	pageLeft: function()
	{
		var self = this;

		var info = {};
		info.hDuration = 800;
		info.hOffset = -self.view.width();
		self.move(info);
	},

	pageRight: function()
	{
		var self = this;

		var info = {};
		info.hDuration = 800;
		info.hOffset = self.view.width();
		self.move(info);
	},

	pageUp: function()
	{
		var self = this;

		var info = {};
		info.vDuration = 800;
		info.vOffset = -self.view.height();
		self.move(info);
	},

	resize: function()
	{
		var self = this;

		var ownerWidth = self.owner.width();
		var ownerHeight = self.owner.height();

		self.holder.fullWidth(ownerWidth);
		self.holder.fullHeight(ownerHeight);

		var viewLeft = 0;
		var viewWidth = self.holder.width();
		var viewTop = 0;
		var viewHeight = self.holder.height();

		if (self.up)
		{
			// Assume that self.down exists too!
			var upHeight = self.up.fullHeight();
			var downHeight = self.down.fullHeight();
			self.log('resize: upHeight {0} downHeight {1}',
				upHeight, downHeight);

			self.up.fullWidth(viewWidth);

			self.down.top(viewHeight - downHeight);
			self.down.fullWidth(viewWidth);

			viewTop += upHeight;
			viewHeight -= upHeight + downHeight;
		}

		if (self.left)
		{
			// Assume that self.right exists too!
			var leftWidth = self.left.fullWidth();
			var rightWidth = self.right.fullWidth();
			self.log('resize: leftWidth {0} rightWidth {1}',
				leftWidth, rightWidth);

			self.left.left(0);
			self.left.top(viewTop);
			self.left.fullHeight(viewHeight);

			self.right.left(viewWidth - rightWidth);
			self.right.top(viewTop);
			self.right.fullHeight(viewHeight);

			viewLeft += leftWidth;
			viewWidth -= leftWidth + rightWidth;
		}

		self.view.left(viewLeft);
		self.view.top(viewTop);
		self.view.fullWidth(viewWidth);
		self.view.fullHeight(viewHeight);

		if (self.content)
		{
			if (self.options.onResize)
			{
				var info =
				{
					width: self.view.width(),
					height: self.view.height(),
					content: self.content
				};
				self.options.onResize.call(self, info);
			}
			self.show();
		}
	},

	scrollTo: function(pos)
	{
		var self = this;

		var info = {};
		info.hDuration = 600;
		info.hPosition = pos.left;
		info.vDuration = 600;
		info.vPosition = pos.top;
		self.move(info);
	},

	setContent: function(content, triggerResize)
	{
		var self = this;

		if (self.content)
			self.content.detach();
		self.content = content;
		self.content.appendTo(self.view);

		self.bindEvents();

		if (triggerResize === undefined || triggerResize)
		{
			window.setTimeout(function()
			{
				self.resize();
			}, 0);
		}
	},

	// private
	bindEvents: function()
	{
		var self = this;

		if (self.left)
		{
			self.left.bind('click', function(e)
			{
				self.pageLeft();
				return false;
			});
			// Assume that self.right exists too!
			self.right.bind('click', function(e)
			{
				self.pageRight();
				return false;
			});
		}
		if (self.up)
		{
			self.up.bind('click', function(e)
			{
				self.pageUp();
				return false;
			});
			// Assume that self.down exists too!
			self.down.bind('click', function(e)
			{
				self.pageDown();
				return false;
			});
		}

		if (self.options.mouseDrag)
		{
			self.content.bind('mousedown', function(e)
			{
				return self.contentDragStart(e);
			});
			self.content.bind('mousemove', function(e)
			{
				return self.contentDragTrack(e);
			});
			self.content.bind('mouseup', function(e)
			{
				return self.contentDragEnd(e);
			});
		}
		if (self.options.touchDrag)
		{
			self.content.bind('touchstart', function(e)
			{
				return self.contentDragStart(e);
			});
			self.content.bind('touchmove', function(e)
			{
				return self.contentDragTrack(e);
			});
			self.content.bind('touchend', function(e)
			{
				return self.contentDragEnd(e);
			});
		}

		if (self.options.wheelMove)
		{
			self.content.bind('mousewheel', function(e, delta)
			{
				return self.contentWheel(e, delta);
			});
		}

		if (self.hScroll)
		{
			var scroll = self.hScroll;

			scroll.bar.bind('click', function(e)
			{
				if (e.target == this)
					return self.horizontalJump(e);
				return true;
			});
			scroll.thumb.bind('mousedown', function(e)
			{
				return self.horizontalDragStart(e);
			});
			scroll.thumb.bind('touchstart', function(e)
			{
				return self.horizontalDragStart(e);
			});
			/* mousemove, mouseup, touchmove and touchend
			** events are allowed to bubble to the holder.
			** See below.
			*/
		}
		if (self.vScroll)
		{
			var scroll = self.vScroll;

			scroll.bar.bind('click', function(e)
			{
				if (e.target == this)
					return self.verticalJump(e);
				return true;
			});
			scroll.thumb.bind('mousedown', function(e)
			{
				return self.verticalDragStart(e);
			});
			scroll.thumb.bind('touchstart', function(e)
			{
				return self.verticalDragStart(e);
			});
			/* mousemove, mouseup, touchmove and touchend
			** events are allowed to bubble to the holder.
			** See below.
			*/
		}

        /* Bind the mousemove and mouseup events to the entire document.
        ** This effectively implements a mouse capture for the scroller.
        **
        ** Not this replaces code where the events were bound just to the
        ** holder (see commented out code).
        **
        ** I'm still not sure this is right but I think it improves things.
        **
        ** AB 26 Mar 2013
        */
//		self.holder.bind('mousemove', function(e)
		jQuery(document).bind('mousemove', function(e)
		{
			if (self.dragMode == 'horizontal')
				return self.horizontalDragTrack(e);
			if (self.dragMode == 'vertical')
				return self.verticalDragTrack(e);
			return true;
		});
//		self.holder.bind('mouseup', function(e)
		jQuery(document).bind('mouseup', function(e)
		{
			if (self.dragMode == 'horizontal')
				return self.horizontalDragEnd(e);
			if (self.dragMode == 'vertical')
				return self.verticalDragEnd(e);
			return true;
		});

//		self.holder.bind('touchmove', function(e)
		jQuery(document).bind('touchmove', function(e)
		{
			if (self.dragMode == 'horizontal')
				return self.horizontalDragTrack(e);
			if (self.dragMode == 'vertical')
				return self.verticalDragTrack(e);
			return true;
		});
//		self.holder.bind('touchend', function(e)
		jQuery(document).bind('touchend', function(e)
		{
			if (self.dragMode == 'horizontal')
				return self.horizontalDragEnd(e);
			if (self.dragMode == 'vertical')
				return self.verticalDragEnd(e);
			return true;
		});
	},

	move: function(info)
	{
		var self = this;

		if (! info)
			info = {};

		var pos = self.getPosition(true);

		/* Generate horizontal information */
		var h = {};
		h.start = pos.left;
		if ('hOffset' in info)
			h.offset = info.hOffset;
		if ('hPosition' in info)
			h.position = info.hPosition;
		if ('hVelocity' in info)
			h.velocity = info.hVelocity;
		if ('hDuration' in info)
			h.duration = info.hDuration;
		else if ('duration' in info)
			h.duration = info.duration;
		h.content = self.content.fullWidth();
		h.view = self.view.width();
		h.snap = self.getSizeOption('horizontalSnap', h.view, 1);
		h.frames = self.slide(h);

		/* Generate vertical information */
		var v = {};
		v.start = pos.top;
		if ('vPosition' in info)
			v.position = info.vPosition;
		if ('vOffset' in info)
			v.offset = info.vOffset;
		if ('vVelocity' in info)
			v.velocity = info.vVelocity;
		if ('vDuration' in info)
			v.duration = info.vDuration;
		else if ('duration' in info)
			v.duration = info.duration;
		v.content = self.content.fullHeight();
		v.view = self.view.height();
		v.snap = self.getSizeOption('verticalSnap', v.view, 1);
		v.frames = self.slide(v);

		/* Combine the frames */
		var frames = [];
		var max = Math.max(h.frames.length, v.frames.length);
		for (var i = 0; i < max; i++)
		{
			var frame = {};
			if (i < h.frames.length)
				frame.left = h.frames[i];
			else if (h.frames.length > 0)
				frame.left = h.frames[h.frames.length - 1];
			else
				frame.left = h.start;
			if (i < v.frames.length)
				frame.top = v.frames[i];
			else if (v.frames.length > 0)
				frame.top = v.frames[v.frames.length - 1];
			else
				frame.top = v.start;
			frames.push(frame);
		}

		if (self.options.onScroll)
		{
			var info =
			{
				width: self.view.width(),
				height: self.view.height(),
				content: self.content,
				frames: frames
			};
			self.options.onScroll.call(self, info);
		}

		/* Play the frame sequence */
		if (frames.length > 0)
		{
			self.startMoveTimer(function()
			{
				var frame = frames.shift();
                if (frame)
                {
                    self.setPosition(frame);
                    if (frames.length > 0)
                        return true;
                }
				return false;
			});
		}
	},

	slide: function(m)
	{
		var self = this;

		var end = m.content - m.view;

		if (end <= 0)
			return self.ease(m.start, 0, 200, 0);
		if (m.start < 0)
			return self.ease(m.start, 0, 200, 0);
		if (m.start > end)
			return self.ease(m.start, end, 200, 0);

		var finish = m.start;
		var duration = m.duration;
		if ('position' in m)
			finish = m.position;
		else if ('offset' in m)
			finish += m.offset;
		else if ('velocity' in m)
		{
			var direction = m.velocity < 0 ? -1 : 1;
			var speed = Math.abs(m.velocity);
			var deceleration = self.options.deceleration;
			duration = speed / deceleration;
			var distance = speed * duration
							- deceleration * duration * duration / 2;
			finish += direction * distance;
		}
		if (finish < 0)
			return self.ease(m.start, 0, duration, 0.6);
		if (finish > end)
			return self.ease(m.start, end, duration, 0.6);
		var adjust = finish % m.snap;
		if (adjust != 0)
		{
			var threshold = 0.5;
			if ('threshold' in m)
				threshold = m.threshold;
			if (adjust / m.snap <= threshold)
				finish -= adjust;
			else
				finish += m.snap - adjust;
		}
		return self.ease(m.start, finish, duration, 0);
	},

	ease: function(start, finish, duration, amplitude)
	{
		var self = this;

		var distance = finish - start;

		var interval = self.options.updateInterval;
		duration = Math.round(duration / interval) * interval;
		if (duration == 0 && start != finish)
			duration = interval;

		var frames = [];
		for (var time = interval; time <= duration; time += interval)
		{
			if (amplitude == 0)
			{
				var t = 1 - time / duration;
				var f = 1 - Math.pow(t, 4);
			}
			else
			{
				var s = amplitude;
				var t = time / duration - 1;
				var f = t * t * ((s + 1) * t + s) + 1;
			}

			var offset = f * distance;
			frames.push(start + offset);
		}
		return frames;
	},

	contentDragStart: function(e)
	{
		var self = this;

		/* If the event came from an element with a click handler
		** we do not start a drag. This is better than the previous
		** method of just ignoring certain types of element.
		**
		** The technique uses an "undocumented feature" of jQuery 1.8.
		** See: http://bugs.jquery.com/ticket/10589
		*/
		if (jQuery._data(e.target, 'events'))
			return true

		self.dragMode = 'content';
		self.lastEvent = self.getEventInfo(e);
		self.nextEvent = undefined;
		self.eventCount = 0;
		switch (self.options.scrollType)
		{
		  case 'both':
			self.dragX = true;
			self.dragY = true;
			break;

		  case 'horizontal':
/* NASTY
*/
/*
			self.dragX = true;
			self.dragY = false;
*/
self.dragX = undefined;
self.dragY = undefined;
			break;

		  case 'lock':
			self.dragX = undefined;
			self.dragY = undefined;
			break;

		  case 'vertical':
/*
			self.dragX = false;
			self.dragY = true;
*/
self.dragX = undefined;
self.dragY = undefined;
			break;
		}

		self.xVelocity = 0;
		self.yVelocity = 0;
		self.startMoveTimer(function()
		{
			return self.contentDragUpdate();
		});
//		return false;
		return true;
	},

	contentDragTrack: function(e)
	{
		var self = this;

		if (self.dragMode != 'content')
			return true;

		self.nextEvent = self.getEventInfo(e);
		self.eventCount++;
		return false;
	},

	contentDragUpdate: function()
	{
		var self = this;

		if (self.dragMode != 'content')
			return false;

		if (! self.nextEvent)
			return true;

		var last = self.lastEvent;
		var next = self.nextEvent;
		if (self.dragX === undefined)
		{
			if (self.eventCount < self.options.lockEventCount)
				return true;

			var x = Math.abs(last.x - next.x);
			var y = Math.abs(last.y - next.y);
			self.dragX = x > y;
			self.dragY = ! self.dragX;
if (self.dragX && self.options.scrollType == 'vertical')
{
    self.contentDragEnd();
    return;
}
if (self.dragY && self.options.scrollType == 'horizontal')
{
    self.contentDragEnd();
    return;
}
		}

		var x = self.dragX ? last.x - next.x : 0;
		var y = self.dragY ? last.y - next.y : 0;
		var t = next.when - last.when;

		var pos = self.getPosition(true);
		if (pos.overHorizontal)
			x /= 2;
		if (pos.overVertical)
			y /= 2;
		pos.left += x;
		pos.top += y;
		self.setPosition(pos);

		// Keep track of current velocity
		self.xVelocity = x / t;
		self.yVelocity = y / t;

		self.lastEvent = next;
		self.nextEvent = undefined;

		return true;
	},

	contentDragEnd: function(e)
	{
		var self = this;

		if (self.dragMode != 'content')
			return true;

		self.stopMoveTimer();
		self.dragMode = undefined;
		self.lastEvent = undefined;
		self.nextEvent = undefined;
		self.eventCount = undefined;
		self.dragX = undefined;
		self.dragY = undefined;

		var info =
		{
			hVelocity: self.xVelocity,
			vVelocity: self.yVelocity
		};
		self.move(info);

//		return false;
		return true;
	},

	contentWheel: function(e, delta)
	{
		var self = this;

		if (self.dragMode)
		{
			self.stopMoveTimer();

			self.dragMode = undefined;
			self.lastEvent = undefined;
			self.nextEvent = undefined;
			self.eventCount = undefined;
			self.dragX = undefined;
			self.dragY = undefined;
		}

		var viewHeight = self.view.height();

		var info =
		{
			vDuration: self.options.updateInterval * 3,
			vOffset: -delta * self.getSizeOption('wheelMove', viewHeight, 1)
		};
		self.move(info);

//		return false;
		return true;
	},

	horizontalJump: function(e)
	{
		var self = this;

		var scroll = self.hScroll;
		var offset = scroll.bar.offset();
		var width = scroll.bar.width();
		var x = e.pageX - offset.left;
		var proportion = x / width;

		var viewWidth = self.view.width();
		var contentWidth = self.content.fullWidth();
		var info =
		{
			hDuration: 800,
			hPosition: Math.floor(proportion * (contentWidth - viewWidth))
		};
		self.move(info);
	},

	horizontalDragStart: function(e)
	{
		var self = this;

		self.dragMode = 'horizontal';
		self.lastEvent = self.getEventInfo(e);
		self.nextEvent = undefined;
        e.preventDefault();
		self.startMoveTimer(function()
		{
			return self.horizontalDragUpdate();
		});
//		return false;
		return true;
	},

	horizontalDragTrack: function(e)
	{
		var self = this;

        e.preventDefault();
		if (self.dragMode != 'horizontal')
			return true;
		self.nextEvent = self.getEventInfo(e);
//		return false;
		return true;
	},

	horizontalDragUpdate: function()
	{
		var self = this;

		if (self.dragMode != 'horizontal')
//			return false;
			return true;
		if (! self.nextEvent)
			return true;

		var change = self.nextEvent.x - self.lastEvent.x;
		self.lastEvent = self.nextEvent;
		self.nextEvent = undefined;

		var barWidth = self.hScroll.bar.width();
		var contentWidth = self.content.fullWidth();
		var delta = Math.floor(change / barWidth * contentWidth);

		var pos = self.getPosition();
		pos.left += delta;
		self.setPosition(pos);

		return true;
	},

	horizontalDragEnd: function(e)
	{
		var self = this;

		if (self.dragMode != 'horizontal')
			return true;

		self.stopMoveTimer();
		self.dragMode = undefined;
		self.lastEvent = undefined;
		self.nextEvent = undefined;

		var info =
		{
			hDuration: 60
		};
		self.move(info);
//		return false;
		return true;
	},

	verticalJump: function(e)
	{
		var self = this;

		var scroll = self.vScroll;
		var offset = scroll.bar.offset();
		var height = scroll.bar.height();
		var y = e.pageY - offset.top;
		var proportion = y / height;

		var contentHeight = self.content.fullHeight();
		var viewHeight = self.view.height();
		var info =
		{
			vDuration: 800,
			vPosition: Math.floor(proportion * (contentHeight - viewHeight))
		};
		self.move(info);
	},

	verticalDragStart: function(e)
	{
		var self = this;

		self.dragMode = 'vertical';
		self.lastEvent = self.getEventInfo(e);
		self.nextEvent = undefined;
        e.preventDefault();
		self.startMoveTimer(function()
		{
			return self.verticalDragUpdate();
		});
//		return false;
		return true;
	},

	verticalDragTrack: function(e)
	{
		var self = this;

        e.preventDefault();
		if (self.dragMode != 'vertical')
			return true;
		self.nextEvent = self.getEventInfo(e);
//		return false;
		return true;
	},

	verticalDragUpdate: function()
	{
		var self = this;

		if (self.dragMode != 'vertical')
//			return false;
			return true;
		if (! self.nextEvent)
			return true;

		var change = self.nextEvent.y - self.lastEvent.y;
		self.lastEvent = self.nextEvent;
		self.nextEvent = undefined;

		var barHeight = self.vScroll.bar.height();
		var contentHeight = self.content.fullHeight();
		var delta = Math.floor(change / barHeight * contentHeight);

		var pos = self.getPosition();
		pos.top += delta;
		self.setPosition(pos);

		return true;
	},

	verticalDragEnd: function(e)
	{
		var self = this;

		if (self.dragMode != 'vertical')
			return true;

		self.stopMoveTimer();
		self.dragMode = undefined;
		self.lastEvent = undefined;
		self.nextEvent = undefined;

		var info =
		{
			vDuration: 60
		};
		self.move(info);

//		return false;
		return true;
	},

	startMoveTimer: function(callback)
	{
		var self = this;

		self.stopMoveTimer();
		self.moveTimer = window.setInterval(function()
		{
			if (! callback || ! callback())
			{
				self.stopMoveTimer();
			}
		}, self.options.updateInterval);
	},

	stopMoveTimer: function()
	{
		var self = this;

		if (self.moveTimer)
		{
			window.clearInterval(self.moveTimer);
			self.moveTimer = undefined;
            IMu.Events.trigger('scroller-finished', self);
		}
	},

	show: function()
	{
		var self = this;
        
		var pos = self.getPosition();

		if (self.options.onShow)
		{
			var info =
			{
				width: self.view.width(),
				height: self.view.height(),
				content: self.content,
				left: pos.left,
				top: pos.top,
				frames: [ pos ]
			};
			self.options.onShow.call(self, info);
		}

		var useTimer = false;
		if (self.showHorizontalScrollbar(pos))
			useTimer = true;
		if (self.showVerticalScrollbar(pos))
			useTimer = true;
		if (useTimer)
		{
			if (self.scrollTimer)
			{
				window.clearTimeout(self.scrollTimer);
				self.scrollTimer = undefined;
			}
			self.scrollTimer = setTimeout(function()
			{
				window.clearTimeout(self.scrollTimer);
				self.scrollTimer = undefined;

				if (self.hScroll)
					self.hScroll.bar.fadeTo(800, 0.0);
				if (self.vScroll)
					self.vScroll.bar.fadeTo(800, 0.0);
			}, 4000);
		}
	},

	showHorizontalScrollbar: function(pos)
	{
		var self = this;

		if (! self.hScroll)
			return false;

		var viewWidth = self.view.width();
		var contentWidth = self.content.fullWidth();
		if (viewWidth >= contentWidth)
			return false;

		var scroll = self.hScroll;
		var bar = scroll.bar;

		var barHeight = bar.fullHeight();
		if (barHeight == 0)
			return false;

		var viewLeft = self.view.left();
		var viewTop = self.view.top();
		var viewHeight = self.view.height();

		var barLeft = viewLeft;
		var barTop = viewHeight - barHeight;
		var barWidth = viewWidth;
		if (self.vScroll)
		{
			var vWidth = self.vScroll.bar.fullWidth();
			if (IMu.Languages.current.direction == 'rtl')
				barLeft += vWidth;
			barWidth -= vWidth;
		}
		bar.left(barLeft);
		bar.top(barTop);
		bar.fullWidth(barWidth);

		var barWidth = bar.width();

		var contentLeft = pos.left;
		var proportionLeft = contentLeft / contentWidth;
		var thumbLeft = Math.round(proportionLeft * barWidth);
		if (thumbLeft < 0)
			thumbLeft = 0;

		var contentRight = contentLeft + viewWidth - 1;
		var proportionRight = contentRight / contentWidth;
		var thumbRight = Math.round(proportionRight * barWidth);
		if (thumbRight >= barWidth)
			thumbRight = barWidth - 1;

		var thumb = scroll.thumb;

		var thumbHeight = thumb.fullHeight();
		if (thumbHeight <= 0 || thumbHeight > barHeight)
			thumbHeight = barHeight;

		var thumbWidth = thumbRight - thumbLeft + 1;
		var minWidth = Math.round(thumbHeight * 1.5);
		if (thumbWidth < minWidth)
		{
			thumbWidth = minWidth;
			if (thumbLeft > barWidth - thumbWidth)
				thumbLeft = barWidth - thumbWidth;
		}

		var thumbOffset = bar.offset();
		thumbOffset.left += thumbLeft;
		thumb.offset(thumbOffset);
		thumb.fullWidth(thumbWidth);
		thumb.fullHeight(thumbHeight);

		bar.css('opacity', scroll.opacity);

		return true;
	},

	showVerticalScrollbar: function(pos)
	{
		var self = this;

		if (! self.vScroll)
			return false;

		var viewHeight = self.view.height();
		var contentHeight = self.content.fullHeight();

		var scroll = self.vScroll;
		var bar = scroll.bar;

		var barWidth = bar.fullWidth();
		if (barWidth == 0)
			return false;

		var viewLeft = self.view.left();
		var viewTop = self.view.top();
		var viewWidth = self.view.width();

		var barLeft = viewLeft;
		if (IMu.Languages.current.dir == 'ltr')
			barLeft += viewWidth - barWidth;

        if (barLeft == bar.left() && 
		    viewHeight >= contentHeight)
			return false;

		var barTop = viewTop;
		var barHeight = viewHeight;
		if (self.hScroll)
		{
			var hHeight = self.hScroll.bar.fullHeight();
			barHeight -= hHeight;
		}
		bar.left(barLeft);
		bar.top(barTop);
		bar.fullHeight(barHeight);

		var barHeight = bar.height();

		var contentTop = pos.top;
		var proportionTop = contentTop / contentHeight;
		var thumbTop = Math.round(proportionTop * barHeight);
		if (thumbTop < 0)
			thumbTop = 0;

		var contentBottom = contentTop + viewHeight - 1;
		var proportionBottom = contentBottom / contentHeight;
		var thumbBottom = Math.round(proportionBottom * barHeight);
		if (thumbBottom >= barHeight)
			thumbBottom = barHeight - 1;

		var thumb = scroll.thumb;

		var thumbWidth = thumb.fullWidth();
		if (thumbWidth <= 0 || thumbWidth > barWidth)
			thumbWidth = barWidth;

		var thumbHeight = thumbBottom - thumbTop + 1;
		var minHeight = Math.round(thumbWidth * 1.5);
		if (thumbHeight < minHeight)
		{
			thumbHeight = minHeight;
			if (thumbTop > barHeight - thumbHeight)
				thumbTop = barHeight - thumbHeight;
		}

		var thumbOffset = bar.offset();
		thumbOffset.top += thumbTop;
		thumb.offset(thumbOffset);
		thumb.fullWidth(thumbWidth);
		thumb.fullHeight(thumbHeight);

		bar.css('opacity', scroll.opacity);

		return true;
	},

	// utility methods
	getEventInfo: function(e)
	{
		var self = this;

		var info = {};
		info.name = e.type;
		info.when = e.timeStamp || Date.now();
		if (e.originalEvent.touches)
		{
			// touch event
			info.type = 'touch';
			info.x = e.originalEvent.touches[0].pageX;
			info.y = e.originalEvent.touches[0].pageY;
		}
		else
		{
			// mouse event
			info.type = 'mouse';
			info.x = e.pageX;
			info.y = e.pageY;
		}
		return info;
	},

	getSizeOption: function(name, unit, dflt)
	{
		var self = this;

		var value = dflt;
		if (name in self.options)
		{
			var option = self.options[name];
			var pattern = /^(\d+(\.\d+)?)\s*(%|em|px)?\s*$/;

			var matches = pattern.exec(option);
			if (matches)
			{
				value = matches[1];
				if (matches[3] == '%')
					value = unit * value / 100;
				else if (matches[3] == 'em')
					value = jQuery.emToPixels(value);
			}
		}
		return value;
	},

	makeScrollbar: function(orientation)
	{
		var self = this;

		var scroll = {};

		scroll.orientation = orientation;

		var elem;

		scroll.bar = elem = self.holder.child('div');
		elem.css('position', 'absolute');
		elem.css('z-index', 9999);
		elem.addClass('scrollbar scrollbar-' + orientation);

		scroll.thumb = elem = scroll.bar.child('div');
		elem.css('position', 'absolute');
		elem.addClass('thumb thumb-' + orientation);

		scroll.opacity = scroll.bar.css('opacity');
		scroll.bar.css('opacity', 0.0);
		scroll.bar.bind('mouseenter', function()
		{
			scroll.bar.css('opacity', scroll.opacity);
		});
		scroll.bar.bind('mouseleave', function()
		{
			scroll.bar.css('opacity', 0.0);
		});

		return scroll;
	},

	setPosition: function(pos)
	{
		var self = this;

        if (pos === undefined)
            return;

		var offset = self.view.offset();
		offset.left -= pos.left;
		offset.top -= pos.top;
		self.content.offset(offset);
		self.show();
	}
});
