<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once IMu::$lib . '/MIME.php';

$class = 'WebImage';

 /**
 ** @example
 **   request.php?request=ChartDraw&type=pie&values=7,10,25
 ** @example
 **   request.php?request=ChartDraw&useage=1
 */
class WebImage
{
    public $type          = 'pie';
    public $values        = '';
    public $radius        = 200;      // dimensions of image (w = h = 2*r)
    public $opacity       = 0;        // opacity for seeing underlying dots
    public $lineWidth     = 1;        // thickness of shape border
    public $border        = '000101'; // border colour. Hex. (NB != transparency)
    private $transparency = '000000'; // transparency colour. Hex
    private $debug        = 0;        // not to be used in production

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
            throw new IMuException('ChartDrawNoGDLibrary');
        }

        if (isset($params['opacity']))
            $this->opacity = $params['opacity'];

        if (isset($params['useage']))
        {
            $this->displayUseage();
            return;
        }

        if (isset($params['type']))
            $this->type = $params['type'];

        switch($this->type)
        {
            case 'pie': $this->drawPieChart($params);
                break;
            case 'bar': $this->drawBarChart($params);
                break;
            default:    
                $this->displayUseage();
                return;
                break;
        }

    }

    function drawBarChart($params)
    {
        $barSpace = 10;

        if (isset($params['values']))
            $this->values = $params['values'];

        if (isset($params['radius']))
            $this->radius = $params['radius'];

        if (isset($params['colours']))
            $this->colours = $params['colours'];


        $canvasSize = 2 * $this->radius;
        $surface = $this->initialiseCanvas($canvasSize);

        $valueSets =  preg_split('/\|/', $this->values, -1);
        $setCount = count($valueSets);

        $maxTotal = 0;
        for ($i = 0; $i < $setCount; $i++)
        {
            $valueSet = $valueSets[$i];
            $total = 0;
            $values = preg_split('/,/', $valueSet, -1);
            foreach ($values as $slice)
            {
                $total += $slice;
            }
            if ($total > $maxTotal)
                $maxTotal = $total;
        }

        for ($setIdx = 0; $setIdx < $setCount; $setIdx++)
        {
            $total = $maxTotal;
            $denom = $total;

            $valueSet = $valueSets[$setIdx];
            $values = preg_split('/,/', $valueSet, -1);

            if (isset($params['denom']))
                $denom = $params['denom'];
            $index = 0;
            $frameWidth = 2 * $this->radius;
            $count = count($values);
            if ($count > 0)
            {
                $barWidth = 3 * $frameWidth / (
                            ($setCount * $count) + ($setCount * $barSpace)
                        );
                $barSeparation = ($barWidth * $setCount) + $barSpace;

                $x0 = $setIdx * $barWidth;
                $x1 = $x0 + $barWidth;
                foreach ($values as $slice)
                {
                    $height = $frameWidth * $slice / $denom;

                    $y0 = $frameWidth;
                    $y1 = $y0 - $height;
                    $colour = $this->getColourByIndex($index++, $setIdx);
                    $c = ImageColorAllocateAlpha($surface,
                            $colour[0],
                            $colour[1],
                            $colour[2],
                            $this->opacity);
                    
                    ImageFilledRectangle($surface, $x0, $y0, $x1, $y1, $c);

                    $x0 += $barSeparation;
                    $x1 = $x0 + $barWidth;
                }
            }

        }

        header('Content-type: image/png');
        $this->outputImage($surface);
        ImageDestroy($surface);
    }

    function drawPieChart($params)
    {
        if (isset($params['values']))
            $this->values = $params['values'];

        if (isset($params['radius']))
            $this->radius = $params['radius'];

        if (isset($params['colours']))
            $this->colours = $params['colours'];

        $this->values = preg_replace('/\|.*/', '', $this->values);

        # total of values
        $total = 0;
        $values = preg_split('/,/', $this->values, -1);
        foreach ($values as $slice)
        {
            $total += $slice;
        }

        $canvasSize = 2 * $this->radius;
        $surface = $this->initialiseCanvas($canvasSize);

        if ($total > 0)
        {
            $start = 0;
            $index = 0;
            foreach ($values as $slice)
            {

                // GD appears to have issues with small arc angles.
                // Round small arcs up to 2deg
                $angle = 360 * $slice / $total;
                if ($angle <= 2)
                    $angle = 2;

                while (($start + $angle) > 360)
                    break;

                if ($start < $start + $angle)
                {
                    $colour = $this->getColourByIndex($index++, 0);
                    $radius = $this->radius;
                    $c = ImageColorAllocateAlpha($surface,
                            $colour[0],
                            $colour[1],
                            $colour[2],
                            $this->opacity);
                    ImageFilledArc($surface,
                            $radius,
                            $radius,
                            2*$radius,
                            2*$radius,
                            $start,
                            $start + $angle,
                            $c,
                            IMG_ARC_PIE);
                    ImageFilledArc($surface,
                            $radius,
                            $radius,
                            2*$radius,
                            2*$radius,
                            $start,
                            $start + $angle,
                            $this->outlinec,
                            IMG_ARC_EDGED | IMG_ARC_NOFILL);
                }
                else
                {
                    $index++;
                }
                $start += $angle;
            }
        }
        else
        {
            $radius = $this->radius;
            $c = ImageColorAllocateAlpha($surface,
                    200,
                    200,
                    200,
                    $this->opacity);
            ImageFilledArc($surface,
                    $radius,
                    $radius,
                    2*$radius,
                    2*$radius,
                    0,
                    360,
                    $c,
                    IMG_ARC_PIE);
            ImageFilledArc($surface,
                    $radius,
                    $radius,
                    2*$radius,
                    2*$radius,
                    0,
                    360,
                    $this->outlinec,
                    IMG_ARC_EDGED | IMG_ARC_NOFILL);
        }

        header('Content-type: image/png');
        $this->outputImage($surface);
        ImageDestroy($surface);
    }

    function drawLabels($params)
    {
    }

    protected function
    getColourByIndex($index, $setNumber)
    {
        $colourSets = preg_split('/\|/', $this->colours, -1);
        $colours = preg_split('/,/', $colourSets[$setNumber], -1);
        $c = '333333';
        if ($index < count($colours))
            $c = $colours[$index];
        return $this->hexStringToColourArray($c);
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
            print('PHP GD Library is not detected on this server');
            throw new IMuException('ChartDrawNoGDLibrary');
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
    displayUseage()
    {
            header('Content-type: text/html');
            print("<pre>\n");
            print $this->useage();
            print("</pre>\n");
    }       

    protected function
    useage()
    {
        $o = $this->opacity;
        return <<<USAGE
* ChartDrawGD!
* (c)2013 KE Software
* KE IMu tool for drawing charts
*
* requires the PHP GD Library 
*
* This utility will draw chart images of the requested type and with the
* requested values and colours.  
*
* Parameters
*
* type:     string describg the chart type.  Currently is one of:
*                     pie, bar
*
* values:   values to chart.  Comma separated.  For bar charts, values can
*           include multiple sets of data to be plotted together by using a '|'
*           character between them.
*
* colours:  colours to represent the values.  Comma separated in same order as
*           the values.
*
* radius:   Size of image.  Typically the image will be a square w x h =
*           2*radius x 2*radius pixels
*
* denom:    [Optional] in bar chart, use this value as the 'full scale', rather
*           than assuming 'full scale' is the total of all values.
*
* opacity:  [Optional] How transparent the image should be.
*           100 = very transparent, 0 = not transparent.  Default = 0.
*
*
<style>
   .pie  { border: 1px solid grey; float: left; clear: left; }
</style>

<div class="pie">
    example call:
        ./request.php?request=ChartDraw&type=pie&values=7,10,25&&colours=22aa44,998877,ee0088&radius=75&opacity=$o
        <img 
        src="./request.php?request=ChartDraw&type=pie&values=7,10,25&&colours=22aa44,998877,ee0088&radius=75&opacity=$o"/>
</div>

<div class="pie">
    example call:
        ./request.php?request=ChartDraw&type=bar&values=7,10,25&&colours=22aa44,998877,ee0088&radius=75&opacity=$o
        <img 
        src="./request.php?request=ChartDraw&type=bar&values=7,10,25&&colours=22aa44,998877,ee0088&radius=75&opacity=$o"/>
</div>

<div class="pie">
    example call:
        ./request.php?request=ChartDraw&type=bar&values=7,10,25|2,22,13&denom=25&&colours=22aa44,22aa44,22aa44|99aaaa,99aaaa,99aaaa&radius=75&opacity=$o
        <img 
        src="./request.php?request=ChartDraw&type=bar&values=7,10,25|2,22,13&denom=25&&colours=22aa44,22aa44,22aa44|99aaaa,99aaaa,99aaaa&radius=75&opacity=$o"/>
</div>

<div class="pie">
    example call:
        ./request.php?request=ChartDraw&type=bar&values=7,10,25&denom=25&&colours=22aa44,998877,ee0088&radius=75&opacity=$o
        <img 
        src="./request.php?request=ChartDraw&type=bar&values=7,10,25&denom=25&&colours=22aa44,998877,ee0088&radius=75&opacity=$o"/>
</div>
USAGE;
    }


}
?>
