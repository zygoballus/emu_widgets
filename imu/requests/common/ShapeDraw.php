<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once IMu::$lib . '/MIME.php';

$class = 'WebImage';

 /**
 ** Draw shape markers including markers that represent a cluster of shapes
 ** @example
 **   request.php?request=ShapeDraw&shapes=circle,circle&colours=9C9AFF,CEFFFF
 ** @example
 **   request.php?request=ShapeDraw&useage=1
 */
class WebImage
{
    public $radius      = 200;       // dimensions of image (w = h = 2*r)
    public $wobble      = 0.4;       // factor to displace clustered dots by
    public $opacity     = 50;        // opacity for seeing underlying dots
    public $lineWidth   = 1;         // thickness of shape border
    public $border      = '000101';  // border colour. Hex. (NB != transparency)

    protected $shapes   = 'circle'; // default shape if called with no args
    protected $colours  = 'afafaf'; // default colour if called with no args

    private $transparency = '000000';  // transparency colour. Hex
    private $coords       = null;
    private $backgc       = null;
    private $outlinec     = null;
    private $debug        = 0;      // not to be used in production

    // public

    /*
    ** main entry point
    */
    public function
    process($params)
    {
        if (! extension_loaded('gd'))
        {
            header('HTTP/1.1 500 Internal Server Error');
            print('PHP GD Library is not detected on this server');
            throw new IMuException('ShapeDrawNoGDLibrary');
        }

        // read in shape definitions
        $this->coords = $this->loadStandardShapes();

        if (isset($params['useage']))
        {
            $this->displayUseage();
            return;
        }

        if (isset($params['colours']))
            $this->colours = $params['colours'];

        if (isset($params['shapes']))
            $this->shapes = $params['shapes'];

        if (isset($params['radius']))
            $this->radius = $params['radius'];

        if (isset($params['wobble']))
            $this->wobble = $params['wobble'];

        $shapeList = preg_split('/,/', $this->shapes);
        $colourList = preg_split('/,/', $this->colours);
        $count = count($shapeList);

        // make canvas big enough to hold all shapes
        $count = count($shapeList);
        $canvasSize = 2 * $this->radius;
        if ($count == 2)
            $canvasSize *= 1 + ($this->wobble/2);
        if ($count > 2)
            $canvasSize *= 1 + ($this->wobble);

        $surface = $this->initialiseCanvas($canvasSize);

        // draw image
        $this->makeClusteredShapes($surface, $shapeList, $colourList);
        $this->outputImage($surface);

        ImageDestroy($surface);
    }

    // protected

    /*
    ** draws a circle at given position, radius and colour
    */
    protected function
    drawCircle($surface, $centreX, $centreY, $radius, $cArray)
    {
        $colour =  ImageColorAllocate(
                $surface, $cArray[0], $cArray[1], $cArray[2]);

        // draw filled shape
        ImageFilledArc($surface,
                $centreX,
                $centreY,
                $radius*2,
                $radius*2,
                0,
                360,
                $colour,
                IMG_ARC_PIE);

        // draw outline
        ImageArc($surface,
                $centreX,
                $centreY,
                $radius*2,
                $radius*2,
                0,
                359,
                $this->outlinec);

        return $surface;
    }

    /*
    ** draws a 'pie' symbol at given position, radius and colour
    */
    protected function
    drawPie($surface, $centreX, $centreY, $radius, $cArray)
    {
        $colour =  ImageColorAllocate(
                $surface, $cArray[0], $cArray[1], $cArray[2]);

        ImageSetThickness($surface, 1);
        // draw filled shape
        ImageFilledArc($surface,
                $centreX,
                $centreY,
                $radius*2,
                $radius*2,
                0,
                270,
                $colour,
                IMG_ARC_PIE);

        // draw outline
        ImageArc($surface,
                $centreX,
                $centreY,
                $radius*2,
                $radius*2,
                0,
                270,
                $this->outlinec);

        ImageLine ($surface,  $radius, $radius, $radius, 0, $this->outlinec );
        ImageLine ($surface,  $radius, $radius, 2*$radius, $radius, $this->outlinec);
        ImageSetThickness($surface, $this->lineWidth);
        return $surface;
    }

    /*
    ** draws a polygon at given position, vertices and colour
    */
    protected function
    drawPoly($surface, $centreX, $centreY, $radius, $coordList, $cArray)
    {
        $pairs = array();
        foreach ($coordList as $points)
        {
            # coords defined on 0-10 square grid - scale and translate to
            # wanted size and position
            $x = $centreX + ($points[0]-5) * $radius/5;
            $y = $centreX + ($points[1]-5) * $radius/5;
            array_push($pairs, $x, $y);
        }

        $colour =  ImageColorAllocate(
                $surface, $cArray[0], $cArray[1], $cArray[2]);

        // draw filled shape
        ImageFilledPolygon($surface, $pairs, sizeof($pairs)/2, $colour);

        // draw outline
        ImagePolygon($surface, $pairs, sizeof($pairs)/2, $this->outlinec);

        return $surface;
    }

    /*
    ** display a useage message
    */
    protected function
    displayUseage()
    {
            $shapeNames = implode(',', array_keys($this->coords));
            $shapeNames = 'circle,' . $shapeNames . ',pie';
            header('Content-type: text/html');
            print("<pre>\n");
            print $this->useage($shapeNames);
            print("</pre>\n");
    }       

    /*
    ** turn passed hex RGB string to an array of decimal RGB values (0-255)
    ** [ r, g, b ]
    */
    protected function
    hexStringToColourArray($hexSt)
    {
        $hexSt = preg_replace('/#/', '', $hexSt);
        $red   = hexdec('00' . substr($hexSt, 0, 2));
        $green = hexdec('00' . substr($hexSt, 2, 2));
        $blue  = hexdec('00' . substr($hexSt, 4, 2));

        return array($red, $green, $blue);
    }

    /*
    ** set up drawing surface, including size and transparency etc
    */
    protected function
    initialiseCanvas($canvasSize)
    {
        if (!  $surface = ImageCreateTrueColor($canvasSize, $canvasSize))
        {   
            header('HTTP/1.1 500 Internal Server Error');
            print('PHP GD Library is not detected on this server (or is wrong version)');
            throw new IMuException('ShapeDrawNoGDLibrary');
        }

        $cArray = $this->hexStringToColourArray($this->transparency);
        $this->backgc = ImageColorAllocate($surface,
                                             $cArray[0],
                                             $cArray[1],
                                             $cArray[2]);
        ImageColorTransparent($surface, $this->backgc);

        // clear canvas with completely transparent background (alpha=127)
        $transparency = ImageColorAllocateAlpha($surface,
                                             $cArray[0],
                                             $cArray[1],
                                             $cArray[2],
                                             127);
        ImageFill($surface, 0, 0, $transparency);

        // outline colour/width
        $cArray = $this->hexStringToColourArray($this->border);
        $this->outlinec = ImageColorAllocate($surface,
                                             $cArray[0],
                                             $cArray[1],
                                             $cArray[2]);
        ImageSetThickness($surface, $this->lineWidth);

        return $surface;
    }


    protected function
    loadStandardShapes()
    {
        // define ccordinate on 10x10 grid
        $coords['star'] = array(
                array(2.2,1),
                array(3,4.2),
                array(0,6.5),
                array(3.5,6.5),
                array(5,10),
                array(6.5,6.5),
                array(10,6.5),
                array(7,4.2),
                array(7.8,1),
                array(5,3),
                array(2.2,1),
                );
        $coords['cross'] = array(
                array(4,0),
                array(6,0),
                array(6,4),
                array(10,4),
                array(10,6),
                array(6,6),
                array(6,10),
                array(4,10),
                array(4,6),
                array(0,6),
                array(0,4),
                array(4,4),
                array(4,0)
                );
        $coords['x'] = array(
                array(0,0),
                array(2.5,0),
                array(5.0,3.5),
                array(7.5,0),
                array(10.0,0),
                array(6.5,5.0),
                array(10.0,10.0),
                array(7.5,10.0),
                array(5.0,6.5),
                array(2.5,10.0),
                array(0,10.0),
                array(3.5,5.0),
                array(0,0)
                );
        $coords['square'] = array(
                array(0,0),
                array(0,1),
                array(1,1),
                array(1,0),
                array(0,0)
                );
        $coords['triangle'] = array(
                array(0,10),
                array(10,10),
                array(5,0),
                array(0,10)
                );

        $coords['lightning'] = array(
                array(0,0),
                array(4,2),
                array(6,0),
                array(10,5),
                array(6,3),
                array(4,5),
                array(0,0));
        $coords['rectangle'] = array(
                array(0,0),
                array(4,0),
                array(4,10),
                array(0,10),
                array(0,0));
        $coords['square'] = array(
                array(0,0),
                array(10,0),
                array(10,10),
                array(0,10),
                array(0,0));
        $coords['triangle'] = array(
                array(0,10),
                array(5,0),
                array(10,10),
                array(0,10));
        $coords['upTriangle'] = array(
                array(0,0),
                array(5,10),
                array(10,0),
                array(0,0));
        $coords['I'] = array(
                array(0,0),
                array(0,2),
                array(4,2),
                array(4,8),
                array(0,8),
                array(0,10),
                array(10,10),
                array(10,8),
                array(6,8),
                array(6,2),
                array(10,2),
                array(10,0),
                array(0,0));
        $coords['T'] = array(
                array(4,10),
                array(4,2),
                array(0,2),
                array(0,0),
                array(10,0),
                array(10,2),
                array(6,2),
                array(6,10),
                array(4,10));
        $coords['bowTie'] = array(
                array(0,0),
                array(10,10),
                array(10,0),
                array(0,10),
                array(0,0) );
        return $coords;
    }


    protected function
    makeClusteredShapes($surface, $shapeList, $colourList)
    {
		srand(12);
        $count = count($shapeList);

        $deltaAngle = 0;
        if ($count > 1)
            $deltaAngle = 2 * M_PI / ($count - 1);

        for ($i = 0; $i < $count; $i++)
        {
            $imWidth =  imagesX($surface);
            $imHeight = imagesY($surface);


            $shape = $shapeList[$i];
            $newCentreX = $imWidth/2;
            $newCentreY = $imHeight/2;

            $tLayer = $this->makeTransparentLayer($this->backgc, $surface);
            if ($i != ($count-1))
            {
                $angle = ($count - $i - 1) * $deltaAngle;
				$angle *= 1.2 * rand();
                $offset = $this->wobble;

                $newCentreX = $newCentreX + ($this->radius*cos($angle)*$offset);
                $newCentreY = $newCentreY + ($this->radius*sin($angle)*$offset);
            }
            else
            {
                // final shape should be clearly on top, in middle with bigger
                // border than underlying
				ImageSetThickness($tLayer, $this->lineWidth*2);
				$this->opacity *= 1.1;
            }

            $j = $i % count($colourList);
            $cArray = $this->hexStringToColourArray($colourList[$j]);

			$radius = $this->radius;
			$opacity = $this->opacity;

            switch ($shape)
            {
                case 'square':
                case 'triangle':
                case 'upTriangle':
                case 'star':
                case 'cross':
                case 'bowTie':
                case 'x':
                case 'lightning':

                case 'rectangle':
                case 'I':
                case 'T':
                    $tLayer = $this->drawPoly($tLayer,
                         $newCentreX,
                         $newCentreY,
                         $radius,
                         $this->coords[$shape],
                         $cArray);
                    break;
                case 'pie':
                    $tLayer = $this->drawPie($tLayer,
                         $newCentreX,
                         $newCentreY,
                         $radius,
                         $cArray);
                    break;
                    break;
                case 'circle':
                default:
                    $tLayer = $this->drawCircle($tLayer,
                         $newCentreX,
                         $newCentreY,
                         $radius,
                         $cArray);
                    break;
            }
			if ($count == 1)
				$opacity = 100;

            ImageCopyMerge($surface,
                             $tLayer,
                             0,
                             0,
                             0,
                             0,
                             $imWidth,
                             $imHeight,
                             $opacity);
            ImageDestroy($tLayer);
        }
		if ($count > 1)
			ImageFilter($surface, IMG_FILTER_BRIGHTNESS, $this->transparency);
		ImageFilter($surface, IMG_FILTER_CONTRAST, -10);
    }


    protected function
    makeTransparentLayer($transparentColour, $surface)
    {
        $nsurface = ImageCreateTruecolor(imagesX($surface), imagesY($surface)); 
        ImageColorTransparent($nsurface, $transparentColour);
        ImageSetThickness($nsurface, $this->lineWidth);
        return $nsurface;
    }

    protected function
    outputImage($surface)
    {
        ImageSaveAlpha($surface, true);
        if (! $this->debug)
        {
            header('Content-type: image/png');
            ImagePng($surface);
        }
        else
        {
            header('Content-type: text/plain');
        }
    }

    protected function
    useage($shapeNames)
    {
        return <<<USAGE
* ClusterShapeGD!
* (c)2013 KE Software
* KE IMu tool for drawing clustered shapes
*
* requires the PHP GD Library 
*
* This utility will draw one or more shapes with the requested form and colour.  If
* multiple shapes are requested, it will draw them stacked on top of each other
* but spread apart to give a visual indication of the presence of each one
* rather than the top ones hiding the underlying ones.
*
* Parameters
*  shapes:       list of standard polygon shapes, comma separated.  Current
*                known shapes are: 
*                $shapeNames
*
*  colours:       Hex RGB colour strings, one for each shape.
*                 No '#', comma separated eg
*                      33aa7f,2200ff,aeb097
*
*  radius:        [optional] if passed will set the size of the shapes.
*                 Shape size will be approx (radius x 2) by (radius x 2) pixels.
*                 For multiple shapes, this will result in returning an image larger than
*                 this, big enough to hold all the clustered shapes
*                   default value: $this->radius
*
*  wobble:        [optional] if passed will change how far multiple shapes will
*                 be spread out.  Typically use values in range  0-1.
*                 0 = not spread, 1 = spread shapes by radius pixels
*                   default value: $this->wobble
*
*  useage:        [optional] if passed, the tool will print a useage message eg
*                   useage=true
*
*
* example call:
*   ./request.php?request=ShapeDraw&colours=7f0000,336699,aa9944,7f0000&shapes=circle,square,circle,triangle
<center>
<img style="border: 1px solid gray"
    src="./request.php?request=ShapeDraw&colours=7f0000,336699,aa9944,faf0e6&shapes=circle,square,circle,triangle"/>
</center>
USAGE;
    }


}
?>
