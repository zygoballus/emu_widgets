(function(theme)
{
    theme.views.register('threed-viewer', 'viewer',
    {
        _source: 'shared/common/threed-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.statusHolder = undefined;
                self.options = {};
            },

            _create: function()
            {
                var self = this;

                self._super();

                self.holder = self.setHolderDimensions(self.widget.owner);

                self.statusHolder = self.widget.owner.child('div', 'status');
                var hid = IMu.Format.sprintf('imu-map-status-{0}', self.widget.uniqueId);
                self.statusHolder.attr('class', 'imu-map-statusHolder');
                self.statusHolder.attr('id', hid);
                self.statusHolder.hide();

                self.makeCanvas();
            },

            getNeededDisplayDimensions: function(bits)
            {
                var self = this;

                var original = jQuery(bits).html();
                var temp = '<span>' + original + '</span>';
                jQuery(bits).html(temp);
                var width = jQuery(bits).find('span:first').width();
                var height = jQuery(bits).find('span:first').height();

                jQuery(bits).html(original);
                return { 'width': width, 'height': height };
            },

            ke3Dinit: function()
            {
              var self = this;

              self.scene = new THREE.Scene();
              var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
              camera.position.z = 70;

              var light = new THREE.DirectionalLight( 0xffffff );
              light.position.set( 100, 100, 100 );
              self.scene.add( light );
              light = new THREE.DirectionalLight( 0x002288 );
              light.position.set( -100, -100, -100 );
              self.scene.add( light );
              light = new THREE.AmbientLight( 0x222222 );
              self.scene.add( light );


              var renderer = new THREE.WebGLRenderer();
              renderer.setSize(window.innerWidth, window.innerHeight);
              self.holder.append( renderer.domElement );


              self.animate = function() {
                  requestAnimationFrame( self.animate );    
                  controls.update();
              };
              self.render = function () {
                  renderer.render(self.scene, camera);
              };

              //var controls = new THREE.TrackballControls( camera, self.holder.get(0) );
              var controls = new THREE.OrbitControls( camera, self.holder.get(0) );
              controls.rotateSpeed = 1.0;
              controls.zoomSpeed = 1.2;
              controls.panSpeed = 0.8;
              controls.noZoom = false;
              controls.noPan = false;
              controls.staticMoving = true;
              controls.dynamicDampingFactor = 0.3;
              controls.keys = [ 65, 83, 68 ];
              controls.addEventListener( 'change', self.render );

            },

            makeCanvas: function()
            {
                var self = this;
                self.holder.html('<div id="threed-data"></div>');

                var camera, scene, renderer;
                var geometry, material, mesh;

                self.ke3Dinit();

                // corner marker (not necessary)
                var geometry = new THREE.SphereGeometry(1, 15, 15);
                var material = new THREE.MeshBasicMaterial({color: 0xa0a0a0});
                var sphere = new THREE.Mesh(geometry, material);
                self.scene.add(sphere);

                var img = new THREE.MeshBasicMaterial({ 
                    map:THREE.ImageUtils.loadTexture(
                        './GroundFloor.png'), transparent: true, opacity: 0.5
                });
                img.map.needsUpdate = true;
                // plane
                var plane = new THREE.Mesh(new THREE.PlaneGeometry(25, 25),img);
                plane.overdraw = true;
                plane.translateX(12);
                plane.translateY(12);
                plane.translateZ(8);
                self.scene.add(plane);

                img = new THREE.MeshBasicMaterial({ 
                    map:THREE.ImageUtils.loadTexture(
                        './FirstFloor.png'), transparent: true, opacity: 0.5
                });
                img.map.needsUpdate = true;
                // plane
                plane = new THREE.Mesh(new THREE.PlaneGeometry(25, 25),img);
                plane.overdraw = true;
                plane.translateX(12);
                plane.translateY(12);
                plane.translateZ(4);
                self.scene.add(plane);

                img = new THREE.MeshBasicMaterial({ 
                    map:THREE.ImageUtils.loadTexture(
                        './Basement.png'), transparent: true, opacity: 0.5
                });
                img.map.needsUpdate = true;
                // plane
                plane = new THREE.Mesh(new THREE.PlaneGeometry(25, 25),img);
                plane.overdraw = true;
                plane.translateX(12);
                plane.translateY(12);
                plane.translateZ(0);
                self.scene.add(plane);

                img = new THREE.MeshBasicMaterial({ 
                    map:THREE.ImageUtils.loadTexture(
                        './SitePlan.png'), transparent: true, opacity: 0.9
                });
                img.map.needsUpdate = true;
                // plane
                plane = new THREE.Mesh(new THREE.PlaneGeometry(75, 75),img);
                plane.overdraw = true;
                plane.translateX(30);
                plane.translateY(25);
                plane.translateZ(-5);
                self.scene.add(plane);

                self.addBuilding();

                self.animate();
            },

            addBuilding: function()
            {
                var self = this;
                var fName = './glasgow.js';
                //var fName = './Building.js';
                var loader = new THREE.JSONLoader();
                loader.load( fName, function(geometry){
                        var material = new THREE.MeshLambertMaterial({color: 0xa0a0a0});
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.scale.set(2.5,2.5,2.5);
                        mesh.translateX(12);
                        mesh.translateY(12);
                        mesh.translateZ(6);
                        mesh.rotation.x += 90 * Math.PI / 180;

                        self.scene.add(mesh);
                });
            },

            setHolderDimensions: function(owner)
            {
                var self = this;

                var holder = owner.find('.holder');

                // make uniq id for map holder
                var id = IMu.Format.sprintf('imu-threed-{0}', self.widget.uniqueId);
                holder.attr('id', id);

                var p = holder.parent();
                while ((p.length > 0) && (holder.width() == 0))   
                {
                    var pWidth = jQuery(p).width();
                    if (pWidth > 0)
                        holder.width(pWidth);
                    p = p.parent();
                }

                var p = holder.parent();
                while ((p.length > 0) && (holder.height() == 0))   
                {
                    var pHeight = jQuery(p).height();
                    if (pHeight > 0)
                        holder.height(pHeight);
                    p = p.parent();
                }

                // last resort
                if (holder.width() == 0)
                    holder.width(256);
                if (holder.height() == 0)
                    holder.height(256);

                return holder;
            },

            showPoints: function(pointData)
            {
                var self = this;
                //jQuery('#threed-data').empty();
                jQuery.each(
                    pointData, function(idx, point)
                    {
                        //jQuery('#threed-data').append('<div>' + point.info.id + '</div>');
                          var geometry = new THREE.CubeGeometry(1, 1, 1);
                          var colour = new THREE.Color().setRGB(Math.random(), Math.random(), Math.random());
                          var material = new THREE.MeshBasicMaterial({color: colour});
                          var cube = new THREE.Mesh(geometry, material);
                          cube.translateX(point.x/100);
                          cube.translateY(point.y/100);
                          cube.translateZ(point.z/100);
                          self.scene.add(cube);
                        
                    }
                );
                self.render();
            },

            /*
            ** display message on screen
            ** currently message will fade away in a second or two.
            */
            showStatusMessage: function(msg, keep)
            {
                var self = this;

                if (self.widget.options.showStatusMessages)
                {

                    self.statusHolder.empty().html('<span>' + msg + '</span>')
                                                .show();
                    if (! keep)
                    {
                        self.statusHolder.fadeOut(2000);
                    }
                    else
                    {
                        var img = self.statusHolder.find('span')
                                            .child('img', 'loading');
                        var src = IMu.Request.getURL('Image');
                        src += '&name=spinner';
                        img.attr('src', src);
                    }

                    var dim = self.getNeededDisplayDimensions(self.statusHolder);
                    self.statusHolder.css(
                        {
                            'width': dim.width * 1.5,
                            'height': dim.height * 1.5
                        });
                }
            }
        }
    });
})(IMu.Themes.shared);
