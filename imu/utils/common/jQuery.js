(function($)
{
	/* Global functions
	*/
    $.allocateId = function(name)
    {
        // Assign a unique id based on the number of previously allocated ids 
        // of this name and any existing ids in the document.

        if (! name)
            return;

        var count = 1;
        if (_existingIds[name])
            count = _existingIds[name] + 1;
        
        for (;;)
        {
            var id = name + count;
            if (jQuery('#' + id).length == 0)
            {
                _existingIds[name] = count;
                return id;
            }
            count++;
        }
    }
    $.registerId = function(name)
    {
        _existingIds[name] = 1;
    }
    var _existingIds = {};

	$.emToPixels = function(em)
	{
		// Note: parseFloat will ignore trailing "em" or "px"
		var value = parseFloat(em);
		var ratio = parseFloat($('body').css('font-size'));
		return value * ratio;
	}

	/* CSS convenience functions
	*/
	function cssValue(elem, name, value)
	{
		if (value !== undefined)
			elem.css(name, value);

		var value = elem.css(name);
		if (value === undefined)
			return value;
		if (value.match(/px$/))
			return Math.round(window.parseFloat(value));

		/* This shouldn't happen but jQuery <1.8 sometimes returns
		** values as percentages rather than as pixels. The problem seems to
		** be due to the webkit implementation of getComputedStyle().
		** jQuery 1.8+ seems to work around these problems nicely.
		*/
		IMu.log('cssValue: WARNING: odd value for {0}: {1}', name, value);
		return value;
	}

	// position
	$.fn.bottom = function(value)
	{
		return cssValue(this, 'bottom', value);
	}

	$.fn.left = function(value)
	{
		return cssValue(this, 'left', value);
	}

	$.fn.right = function(value)
	{
		return cssValue(this, 'right', value);
	}

	$.fn.top = function(value)
	{
		return cssValue(this, 'top', value);
	}

	// border
	$.fn.borderBottomWidth = function(value)
	{
		return cssValue(this, 'border-bottom-width', value);
	}

	$.fn.borderBottom = function(value)
	{
		return this.borderBottomWidth(value);
	}

	$.fn.borderLeftWidth = function(value)
	{
		return cssValue(this, 'border-left-width', value);
	}

	$.fn.borderLeft = function(value)
	{
		return this.borderLeftWidth(value);
	}

	$.fn.borderRightWidth = function(value)
	{
		return cssValue(this, 'border-right-width', value);
	}

	$.fn.borderRight = function(value)
	{
		return this.borderRightWidth(value);
	}

	$.fn.borderTopWidth = function(value)
	{
		return cssValue(this, 'border-top-width', value);
	}

	$.fn.borderTop = function(value)
	{
		return this.borderTopWidth(value);
	}

	// margin
	$.fn.marginBottom = function(value)
	{
		return cssValue(this, 'margin-bottom', value);
	}

	$.fn.marginLeft = function(value)
	{
		return cssValue(this, 'margin-left', value);
	}

	$.fn.marginRight = function(value)
	{
		return cssValue(this, 'margin-right', value);
	}

	$.fn.marginTop = function(value)
	{
		return cssValue(this, 'margin-top', value);
	}

	$.fn.marginHorizontal = function()
	{
		return this.marginLeft() + this.marginRight();
	}

	$.fn.marginVertical = function()
	{
		return this.marginTop() + this.marginBottom();
	}

	// padding
	$.fn.paddingBottom = function()
	{
		return cssValue(this, 'padding-bottom');
	}

	$.fn.paddingLeft = function()
	{
		return cssValue(this, 'padding-left');
	}

	$.fn.paddingRight = function()
	{
		return cssValue(this, 'padding-right');
	}

	$.fn.paddingTop = function()
	{
		return cssValue(this, 'padding-top');
	}

	$.fn.fullHeight = function(value)
	{
		if (value !== undefined)
		{
			var extra = this.outerHeight(true) - this.height();
			this.height(value - extra);
		}
		return this.outerHeight(true);
	}

	$.fn.fullWidth = function(value)
	{
		if (value !== undefined)
		{
			var extra = this.outerWidth(true) - this.width();
			this.width(value - extra);
		}
		return this.outerWidth(true);
	}

	/* adjustSize()
	**
	** Adjust size of element. Typically called for an image after loading
	** to account for earlier versions of IE which do not implement
	** max-width or max-height.
	*/
	$.fn.adjustSize = function()
	{
		var scale = 10.0;	// arbitrary value > 1

		var width = this.width();
		var maxWidth = this.css('max-width');
		if (maxWidth != undefined)
		{
			maxWidth = Math.round(maxWidth.replace('px', ''));
			if (width > maxWidth)
				scale = maxWidth / width;
		}

		var height = this.height();
		var maxHeight = this.css('max-height');
		if (maxHeight != undefined)
		{
			maxHeight = Math.round(maxHeight.replace('px', ''));
			if (height > maxHeight)
			{
				var hScale = maxHeight / height;
				if (scale > hScale)
					scale = hScale;
			}
		}

		if (scale < 1)
		{
			IMu.log('scaling {0} by {0}', this, scale);
			this.width(Math.round(width * scale));
			this.height(Math.round(height * scale));
		}

		return this;
	}

    /* child()
    ** 
    ** Create a child element and attach it to the current element.
    */
	$.fn.child = function(type, attributes)
	{
        var child;

        if (attributes && typeof attributes == 'object') // New method
        {
            var html = '<' + type;

            for (var key in attributes)
                if (attributes.hasOwnProperty(key))
                    html += ' ' + key + '="' + attributes[key] + '"';

            html += '/>';
            
            child = jQuery(html).appendTo(this);
        }
        else    // Previous method
        {
            child = jQuery('<' + type + '/>').appendTo(this);
            for (var i = 1; i < arguments.length; i++)
                child.addClass(arguments[i]);
        }

		return child;
	}

	/* IMuEllipsis()
	**
	** Truncate text so it is no longer than one line and add
	** an ellipsis (...) if necessary.
	*/
	$.fn.IMuEllipsis = function(text)
	{
		var dataName = 'imu-ellipsis';

		if (text !== undefined)
			this.data(dataName, text);
		else
		{
			text = this.data(dataName);
			if (text === undefined)
			{
				text = this.text()
				this.data(dataName, text);
			}
		}

		this.text('W');
		var min = this.height();

		this.text(text);
		if (this.height() <= min)
		{
			this.removeAttr('title');
			return;
		}
		this.attr('title', text);
		for (;;)
		{
			text = text.substr(0, text.length - 1);
			this.html(text + '&hellip;');
			if (this.height() <= min)
				break;
		}

		return this;
	}

	/* resizeOnLoad()
	**
	*/
	$.fn.resizeOnLoad = function(callback)
	{
		var self = this;

		self.imagesLoaded(function()
		{
			self.adjustSize();
			if (callback)
				callback();
		});
	}

	/* setLang()
	**
	*/
	$.fn.setLang = function()
	{
		this.attr('lang', IMu.Languages.current.code);
		this.attr('dir', IMu.Languages.current.dir);
	}

	/* visible()
	**
	** Get/set the visibility of an object.
	*/
	$.fn.visible = function(value)
	{
		if (value !== undefined)
		{
			if (value)
            {
				this.show();
                this.attr('aria-hidden', false)
            }
			else
            {
				this.hide();
                this.attr('aria-hidden', true);
            }
		}
		return this.is(':visible');
	}
})(jQuery);
