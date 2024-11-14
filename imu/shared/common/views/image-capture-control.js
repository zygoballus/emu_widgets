(function(theme)
{
    theme.views.register('image-capture-control', 'control',
    {
        _source: 'shared/client/image-capture-control',

        all:
        {
            _construct: function()
            {

                var self = this;

                self._super.apply(self, arguments);
            },
            _create: function()
            {

                var self = this;

                self._super();
                var ic = self.widget.owner; 
                
                var fileApi = self.content.child('div','js-fileapi-wrapper upload-btn');
                var upload = fileApi.child('div','upload-btn__txt');

                var imageInput = upload.child('input type="file"', 'imu-image-capture-input');
                imageInput.attr('accept', 'image/*;capture=camera');
                imageInput.attr('id','image-input');

                if(self.widget.getOption('allowMultiple') == true)
                    imageInput.attr('multiple','');

                imageInput.css('opacity','0');
                imageInput.css('height','1px');
                imageInput.css('width','1px');
                var button = upload.child('label','upload-button');
                var dummy = button.child('button');
                button.attr('for','image-input');
                dummy.text(IMu.string('image-capture-input'));

                button.click(function()
                {
                    imageInput.click();
                });

                var filePath = upload.child('div','file-path');
              
                var onFileAPILoaded = function ()
                {
                        self.ready = true;
                        FileAPI.event.dnd(ic[0],function(over){},function(files)
                        {
                            onImageAdd(files);
                        });

                        FileAPI.event.on(imageInput[0], 'change', function(evt)
                        {
                            var files = FileAPI.getFiles(evt);
                            onImageAdd(files);
                        });
                };
 
                if (!IMu.FileAPI._ready)
                {
                    IMu.event.on('imu-FileAPI-loaded',function()
                    {
                         onFileAPILoaded();
                    });
                 }
                 else
                 {
                    onFileAPILoaded();
                 }

                //check if multiple images can be selected.
                var onImageAdd = function (files)
                {
                    if (self.ready)
                    {
                        FileAPI.each(files,function(file)
                        {
                            var imageType = /image.*/;
                            if (!file.type.match(imageType))
                                return false;
                            self.widget.imageControl.isMultiple = true;

                            FileAPI.readAsDataURL(file,function(evt)
                            {
                                if (evt.type == 'load')
                                {
                                    self.widget.imageControl.loadCapturedImageUsingData(evt.result,file.name);
                                    self.widget.encodedImage = evt.result;
                                }
                                else if (evt.type == 'progress')
                                {
                                }
                                else
                                {
                                    FileAPI.Image(file).get(function (err,img) {
                                        if (!err)
                                        {
                                            var dataURL = img.toDataURL("image/png");
                                            IMu.log('Data url for image:' + dataURL);
                                            self.widget.imageControl.loadCapturedImageUsingData(dataURL,file.name);
                                        }
                                        else
                                        {
                                            file.xhr = FileAPI.upload({
                                                url: 'imu/requests/client/ctrl.php',
                                                files: {files: file},
                                                complete: function (err,xhr) {
                                                        var response = JSON.parse(xhr.responseText);
                                                        var dataURL = response.images.files.dataURL;
                                                        var name = xhr.files[0].name;
                                                        self.widget.imageControl.loadCapturedImageUsingData(dataURL,name);
                                                    }
                                                });
                                        }
                                    });
                                 }
                            });
                        });
                    }
                };
                var preview = self.content.child('div', 'preview');
                preview.css('height', '100%');
                preview.css('width', '100%');
                preview.css('clear', 'both');

                var controlHeight = 400;
                if (self.widget.options.imageControlHeight)
                    controlHeight = self.widget.options.imageControlHeight;

                var imageControl = self.widget.imageControl = preview.IMu('image-control',
                {
                    'height': controlHeight,
                    onChange: self.widget.options.onChange,
                    isMultiple: true,
                    defaultContext: self.getOption('defaultContext'),
                    defaultPort: self.getOption('defaultPort')
                });


                //imageControl.addEventListener("drop", drop, false);
                //
                ic.on(
                    'dragover',
                    function(e) 
                    {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                )

                ic.on(
                    'dragcenter',
                    function(e) 
                    {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                )
                
                if(!self.widget.imageControl.view)
                    self.widget.imageControl.createView();

            }
        }
    });
})(IMu.Themes.shared);
