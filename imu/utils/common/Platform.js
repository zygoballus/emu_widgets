IMu.Platform =
{
	agent: 'unknown',

	device:
	{
		type: 'unknown',
		name: 'unknown',
		is:
		{
			// type
			desktop: false,
			mobile: false,
			phone: false,
			tablet: false,

			// name
			android: false,
			ipad: false,
			iphone: false,
			mac: false,
			pc: false,
			unix: false
		}
	},

	os:
	{
		name: 'unknown',
		version: 'unknown',
		is:
		{
			android: false,
			ios: false,
			mac: false,
			unix: false,
			windows: false
		}
	},

	browser:
	{
		name: 'unknown',
		version: 'unknown',
		is:
		{
			android: false,
			chrome: false,
			firefox: false,
			ie: false,
			konqueror: false,
			opera: false,
			safari: false
		}
	},

	window:
	{
		height: 'unknown',
		width: 'unknown',
		orientation:
		{
			name: 'unknown',
			is:
			{
				landscape: false,
				portrait: false
			}
		}
	},

	attributes: undefined
};
(function()
{
	var self = IMu.Platform;

	if (! navigator)
		return;

	self.agent = navigator.userAgent;

	var agent = self.agent.toLowerCase();
	var matches;

	/* device & os
	*/
	if (matches = agent.match(/windows nt (\d+\.\d+)/))
	{
        /* The first test below appears not to work.
        **
        ** To detect a touch device we have used the suggestion at:
        ** http://www.html5gamedevs.com/topic/1344-tip-detect-windows-tablet-and-windows-phone/
        **
        */
//      if (agent.match(/tablet pc (\d+\.\d+)/))
        if (agent.match(/\btouch\b/))
        {
            self.device.type = 'tablet';
            self.device.is.tablet = true;
        }
        else
        {
            self.device.type = 'desktop';
            self.device.is.desktop = true;
        }

		self.device.name = 'pc';
		self.device.is.pc = true;

		self.os.name = 'windows';
		if (matches[1] == '6.2')
			self.os.version = '8';
		else if (matches[1] == '6.1')
			self.os.version = '7';
		else if (matches[1] == '6.0')
			self.os.version = 'vista';
		else if (matches[1] == '5.2')
			self.os.version = 'server-2003';
		else if (matches[1] == '5.1')
			self.os.version = 'xp';
		self.os.is.windows = true;
	}
	else if (matches = agent.match(/\(ipad;.*\bos (\d+(_\d+)*)/))
	{
		self.device.type = 'tablet';
		self.device.is.mobile = true;
		self.device.is.tablet = true;

		self.device.name = 'ipad';
		self.device.is.ipad = true;

		self.os.name = 'ios';
		self.os.version = matches[1];
		self.os.is.ios = true;
	}
	else if (matches = agent.match(/\(iphone;.*\bos (\d+(_\d+)*)/))
	{
		self.device.type = 'phone';
		self.device.is.mobile = true;
		self.device.is.phone = true;

		self.device.name = 'iphone';
		self.device.is.iphone = true;

		self.os.name = 'ios';
		self.os.version = matches[1];
		self.os.is.ios = true;
	}
	else if (matches = agent.match(/\(ipod;.*\bos (\d+(_\d+)*)/))
	{
		self.device.type = 'phone';
		self.device.is.mobile = true;
		self.device.is.phone = true;

		self.device.name = 'ipod';
		self.device.is.iphone = true;

		self.os.name = 'ios';
		self.os.version = matches[1];
		self.os.is.ios = true;
	}
	else if (matches = agent.match(/\(ipod touch;.*\bos (\d+(_\d+)*)/))
	{
		self.device.type = 'phone';
		self.device.is.mobile = true;
		self.device.is.phone = true;

		self.device.name = 'ipod';
		self.device.is.iphone = true;

		self.os.name = 'ios';
		self.os.version = matches[1];
		self.os.is.ios = true;
	}
	else if (matches = agent.match(/\bandroid\s+(\d+(\.\d+)*)/))
	{
		self.device.type = 'mobile';
		self.device.is.mobile = true;

		self.device.name = 'android';
		self.device.is.android = true;

		self.os.name = 'android';
		self.os.version = matches[1];
		self.os.is.android = true;

		/* It's very hard to separate android phones from tablets
		**
		** There is scope to use User Agent Profile in the future
		** but we don't need it (yet).
		**
		** We know about a few so we hard-code checks for them here.
		*/

		// HTC
		if (agent.match(/\bhtc\b/))
		{
			self.device.type = 'phone';
			self.device.is.phone = true;

			self.device.name = 'htc-phone';
		}

		// Samsung
		else if (agent.match(/\bgt-i9300\b/))
		{
			self.device.type = 'phone';
			self.device.is.phone = true;

			self.device.name = 'samsung-phone';
		}
		else if (agent.match(/\bgt-p7500\b/))
		{
			self.device.type = 'tablet';
			self.device.is.tablet = true;

			self.device.name = 'samsung-tablet';
		}

        // Set to SOMETHING
        else
        {
			self.device.type = 'phone';
			self.device.is.phone = true;

            self.device.name = 'android-phone';
        }
	}
	else if (matches = agent.match(/\(macintosh;.*\bos [a-z]* (\d+(_\d+)*)/))
	{
		self.device.type = 'desktop';
		self.device.is.desktop = true;

		self.device.name = 'mac';
		self.device.is.mac = true;

		self.os.name = 'mac';
		self.os.version = matches[1];
		self.os.is.mac = true;
	}
	else if (matches = agent.match(/\blinux\b/))
	{
		self.device.type = 'desktop';
		self.device.is.desktop = true;

		self.device.name = 'unix';
		self.device.is.unix = true;

		self.os.name = 'unix';
		self.os.is.unix = true;
	}

	/* browser
	*/
	if (matches = agent.match(/msie[\/ ](\d+(\.\d+)*)/))
	{
		self.browser.name = 'ie';
		self.browser.version = window.parseFloat(matches[1]);
		self.browser.is.ie = true;
	}
	else if (matches = agent.match(/(chrome|crios)[\/ ](\d+(\.\d+)*)/))
	{
		self.browser.name = 'chrome';
		self.browser.version = window.parseFloat(matches[2]);
		self.browser.is.chrome = true;
	}
	else if (matches = agent.match(/firefox[\/ ](\d+(\.\d+)*)/))
	{
		self.browser.name = 'firefox';
		self.browser.version = window.parseFloat(matches[1]);
		self.browser.is.firefox = true;
	}
	else if (matches = agent.match(/opera[\/ ](\d+(\.\d+)*)/))
	{
		self.browser.name = 'opera';
		self.browser.version = window.parseFloat(matches[1]);
		self.browser.is.opera = true;
	}
	else if (matches = agent.match(/konqueror[\/ ](\d+(\.\d+)*)/))
	{
		self.browser.name = 'konqueror';
		self.browser.version = window.parseFloat(matches[1]);
		self.browser.is.konqueror = true;
	}
	else if (matches = agent.match(/android[\/ ](\d+(\.\d+)*)/))
	{
		self.browser.name = 'android';
		self.browser.version = window.parseFloat(matches[1]);
		self.browser.is.android = true;
	}
	else if (matches = agent.match(/safari[\/ ](\d+(\.\d+)*)/))
	{
		self.browser.name = 'safari';
		self.browser.version = window.parseFloat(matches[1]);
		self.browser.is.safari = true;
	}

	function recalculate()
	{
		/* orientation
		**
		** On mobile devices we ought to be able to use window.orientation
		** to determine whether the device is in portrait or landscape.
		**
		** However, vendors appear to interpret this value as being
		** the orientation of the device relative to its "natural"
		** orientation.
		**
		** This means, for example, that on an iPad 2 window.orientation = 0
		** means portrait whereas on a Samsung Galaxy Tab 10.1 running
		** Android 4.0 window.orientation = 0 means landscape.
		**  
		** Because of this we avoid window.orientation and check
		** the window's width and height directly (using jQuery).
		*/
        if (jQuery.browser.msie && self.window.orientation)
        {
            self.window.orientation.last = self.window.orientation.name;
        }

		self.window.height = jQuery(window).height();
		self.window.width = jQuery(window).width();
		if (self.window.height < self.window.width)
		{
			self.window.orientation.name = 'landscape';
			self.window.orientation.is.landscape = true;
			self.window.orientation.is.portrait = false;
		}
		else
		{
			self.window.orientation.name = 'portrait';
			self.window.orientation.is.landscape = false;
			self.window.orientation.is.portrait = true;
		}

		/* attributes
		*/
		self.attributes = {};
		for (var name in self.device.is)
			if (self.device.is[name])
				self.attributes[name] = true;
		for (var name in self.os.is)
			if (self.os.is[name])
				self.attributes[name] = true;
		for (var name in self.browser.is)
			if (self.browser.is[name])
				self.attributes[name] = true;
		for (var name in self.window.orientation.is)
			if (self.window.orientation.is[name])
				self.attributes[name] = true;
	}
	recalculate();
	IMu.Events.bind('dom-orientationchange', recalculate);
	IMu.Events.bind('dom-resize', recalculate);
})();
