(function(theme)
{
    theme.views.register('capture-control', 'control',
    {
        _source: 'shared/common/capture-control',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.buttons =          undefined;
                this.dropzone =         undefined;  // the area to drag-drop resources
                this.fileSystemBtn =    undefined;  // button to open filesystem browser
                this.promptArea =       undefined;  // prompts the user for interaction
                this.resourceDisplay =  undefined;  // where resources are displayed
                this.resourceSelection = undefined; // where the user can select
                                                    // a resource to display
            },

            _create: function()
            {
                this.holder = this.widget.owner.child('div', 'holder');
                this.content = this.holder.child('div', 'content');
                
                this._createButtons();
                this._createDropzone();
                this._createResourceDisplay();
                this._createResourceSelection();
            },

            /* Creates the controls for the user to interact with the widget.
            */
            _createButtons: function()
            {
                var widget = this.widget;
                
                if (widget.getOption('readOnly') || ! widget.getOption('useCaptureButtons'))
                    return;
                
                this.buttons = this.holder.child('div', 'buttons');
                var button;

                button = this.fileSystemBtn = this.buttons.child('button');
                button.text(IMu.string('capture-control-file-input'));

                IMu.FileAPI.FSButton(button, function(files)
                {
                    widget.addFiles(files);
                });
            },

            /* Creates an area that the user can drag and drop resources
            ** to be added to the widget.
            */
            _createDropzone: function()
            {
                var widget = this.widget;

                if (widget.getOption('readOnly') || ! widget.getOption('useCaptureDropzone'))
                    return;

                this.dropzone = this.content.child('div',
                    'imu-capture-control-dropzone');

                if (! this.promptArea)
                    this.promptArea = this.dropzone.child('div', 'prompt-area');

                var div = this.promptArea.child('div', 'hover-text');
                div.child('div').text(IMu.string('capture-control-hovertext'));

                IMu.FileAPI.dnd(this.dropzone, function(files)
                {
                    widget.addFiles(files);
                });
            },

            /* Creates an area to render a resource or resources
            ** for viewing or interaction by the user.
            */
            _createResourceDisplay: function()
            {
                if (! this.widget.getOption('showResources'))
                    return;
               
                var parentElem;
                if (this.dropzone)
                    parentElem = this.dropzone;
                else
                    parentElem = this.content;
                
                if (! this.promptArea)
                    this.promptArea = parentElem.child('div', 'prompt-area');
               
               
                this.resourceDisplay = jQuery('<div class=' + 
                    '"imu-capture-control-resources"></div>');
                this.resourceDisplay.insertBefore(this.promptArea);

                var div = this.promptArea.child('div', 'no-items-text').child('div');

                if (this.buttons && this.dropzone)
                    div.text(IMu.string('capture-control-drag-or-select-prompt'));
                else if (this.buttons)
                    div.text(IMu.string('capture-control-select-prompt'));
                else if (this.dropzone)
                    div.text(IMu.string('capture-control-drag-prompt'));
                else
                    div.text(IMu.string('capture-control-no-files-to-display'));
            },

            /* Creates the selection tool for users to select
            ** a resource to be displayed.
            **
            ** This is an interface method to be implemented
            ** by inherited classes.
            **
            */
            _createResourceSelection: function()
            {
                this.resourceSelection = this.content.child('div',
                    'imu-capture-control-resource-selection');
            },

            /* Adds to the resources displayed.
            */
            addResource: function(resourceData, callback)
            {
                var widget = this.widget;
               
                /* detaching and inserting resourceDisplay to force repaint 
                ** in internet explorer and Edge.
                ** without it there would be rendering issues.
                */
                this.resourceDisplay.detach(); 
                
                var resource = this.resourceDisplay.child('div', 'resource'); 
                var nameCell = resource.child('div', 'text-cell name');
                var a = nameCell.child('a');

                var removeCell = resource.child('div', 'button-cell remove');
                var button = removeCell.child('button');
                button.attr('title', IMu.string('capture-control-remove'));

                button.click(function()
                {
                    widget.removeResource(resourceData);
                });
                
                var img = button.child('img');
                var src = IMu.Request.getURL('Image') + '&name=cross';
                img.attr('src', src);
                
                this.setResourceValues(resource, resourceData);
                
                this.resourceDisplay.insertBefore(this.promptArea);
                
                if (callback)
                    callback(resource);
            },

            /* Redraws resource after title and download information
            ** has been fetched from the server.
            */
            setResourceValues: function(elem, data)
            {
                var widget = this.widget;

                var name = data.name || '';
                if (! name && data.irn)
                    name = IMu.string('capture-control-retrieving');
                 
                var a = jQuery(elem).find(".name > a")
                a.text(name);
                a.attr('title', name);

                if (data.file)
                {
                    // Resource is a local file
                    a.removeAttr('href');
                    a.removeAttr('download');
                }
                else if (data.url)
                {
                    // Resource is on another server
                    a.attr('href', data.url);
                    a.attr('download', name);
                }

                var button = jQuery(elem).find(".button-cell.remove > button");
                if (this.widget.getOption('readOnly') || data.readOnly)
                    button.hide();
                else
                    button.css('display','');
             },

            /* Clears all resources displayed.
            */
            clearResources: function()
            {
                this.resourceDisplay.empty();
            },

            removeResource: function(resource)
            {
                /* detaching and inserting resourceDisplay to force repaint in 
                ** internet explorer and Edge.
                ** without it there would be rendering issues.
                */
                this.resourceDisplay.detach(); 
                resource.remove();
                this.resourceDisplay.insertBefore(this.promptArea);
            }
        }
    });
})(IMu.Themes.shared);
