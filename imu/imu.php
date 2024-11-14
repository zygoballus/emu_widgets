<?php
class Output
{
	public function
	__construct($jsFile, $cssDir, $config)
	{
		$this->jsFile = $jsFile;
		$this->cssDir = $cssDir;
		$this->config = $config;

		$this->include = array();
		$this->import = array();

		/* Magic CSS file extensions types
		*/
		$this->exts = array
		(
			// device
			array
			(
				'desktop', 'mobile', 'phone', 'tablet',
				'android', 'ipad', 'iphone', 'mac', 'pc', 'unix'
			),
			
			// os
			array
			(
				'android', 'ios', 'mac', 'unix', 'windows'
			),

			// browser
			array
			(
				'android', 'chrome', 'firefox', 'ie', 'opera', 'safari'
			),
			
			// language
			array
			(
				'ltr', 'rtl', 'ar', 'en', 'fr'
			),
			
			// orientation
			array
			(
				'landscape', 'portrait'
			)
		);
	}

	public $jsFile;
	public $cssDir;

	public $include;
	public $import;

	public $exts;

	public $jsCode;
	public $cssList;

	protected function
	doInclude()
	{
		$this->jsCode = $this->newHeader();
		$this->jsCode .= "\"use strict\";\n";
		$this->cssList = array();
		foreach ($this->include as $item)
		{
			if (is_array($item))
			{
				if ($item['type'] == 'theme')
					$this->includeTheme($item['theme']);
			}
			else if (strpos($item, '.css') !== false)
				$this->includeCSS($item);
			else if (strpos($item, '.js') !== false)
				$this->includeJS($item);
			else
				throw new Exception("Unknown include type $item");
		}
		if (count($this->cssList) > 0)
		{
			$dir = $this->cssDir;
			if (! is_dir($dir) && ! mkdir($dir, 0777))
				throw new Exception("Can't create css directory $dir");
			foreach ($this->cssList as &$item)
			{
				$file = $item['file'];
				$handle = @fopen($file, 'w');
				if (! $handle)
					throw new Exception("Can't create $file");
				fputs($handle, $item['css']);
				fclose($handle);
				@chmod($file, 0666);
			}
		}
	}

	protected function
	includeCSS($file)
	{
		if (! is_file($file))
			return;

		$flags = array();
		for ($i = 0; $i < count($this->exts); $i++)
		{
			$flags[$i] = 0;
			for ($j = 0; $j < count($this->exts[$i]); $j++)
			{
				$part = '.' . $this->exts[$i][$j] . '.';
				if (strpos($file, $part) !== false)
				{
					$flags[$i] = $j + 1;
					break;
				}
			}
		}
		$ident = '';
		foreach ($flags as $flag)
		{
			if ($ident != '')
				$ident .= '.';
			$ident .= sprintf('%02d', $flag);
		}

		$index = 0;
		while ($index < count($this->cssList))
		{
			if ($this->cssList[$index]['ident'] == $ident)
				break;
			if ($this->cssList[$index]['ident'] > $ident)
			{
				array_splice($this->cssList, $index, 0, array(null));
				break;
			}
			$index++;
		}
		if (! isset($this->cssList[$index]))
		{
			$this->cssList[$index] = array
			(
				'ident' => $ident,
				'name' => '',
				'test' => array(),
				'attr' => array(),
				'file' => null,
				'css' => $this->newHeader()
			);

			$item = &$this->cssList[$index];
			for ($i = 0; $i < count($flags); $i++)
			{
				$j = $flags[$i] - 1;
				if ($j < 0)
					continue;
				$ext = $this->exts[$i][$j];

				if ($item['name'] != '')
					$item['name'] .= '.';
				$item['name'] .= $ext;

				if ($i == 0)
					$item['test']['device'] = $ext;
				else if ($i == 1)
					$item['test']['os'] = $ext;
				else if ($i == 2)
					$item['test']['browser'] = $ext;

				else if ($i == 3)
					$item['attr']['language'] = $ext;
				else if ($i == 4)
					$item['attr']['orientation'] = $ext;
			}
			if ($item['name'] == '')
				$item['name'] = 'main';
			$item['file'] = $this->cssDir . '/' . $item['name'] . '.css';
		}
		$item = &$this->cssList[$index];
		$item['css'] .= "\n";
		$item['css'] .= '/* Source: ' . $file . "\n";
		$item['css'] .= "*/\n";
		$item['css'] .= file_get_contents($file);
	}

	protected function
	includeJS($file)
	{
		$this->jsCode .= "\n";
		$this->jsCode .= "/* Source: $file\n";
		$this->jsCode .= "*/\n";
		$this->jsCode .= file_get_contents($file);
	}

	protected function
	includeTheme($theme)
	{
		$theme->save();

		$name = $theme->name;
		$id = 'theme-' . $name;

		$this->jsCode .= "\n";
		$this->jsCode .= "/* Theme: $name\n";
		$this->jsCode .= "*/\n";
		$this->jsCode .= "(function()\n";
		$this->jsCode .= "{\n";
		$this->jsCode .= "\tIMu.Themes.shared.strings.register\n";
		$this->jsCode .= "\t(\n";
		$this->jsCode .= "\t\t{\n";
		$this->jsCode .= "\t\t\t'$id':\n";
		$this->jsCode .= "\t\t\t{\n";
		$langs = array_keys($theme->titles);
		for ($i = 0; $i < count($langs); $i++)
		{
			$this->jsCode .= "\t\t\t\t" . $langs[$i] . ': ';
			$this->jsCode .= "'" . $theme->titles[$langs[$i]] . "'";
			if ($i < count($langs) - 1)
				$this->jsCode .= ',';
			$this->jsCode .= "\n";
		}
		$this->jsCode .= "\t\t\t}\n";
		$this->jsCode .= "\t\t}\n";
		$this->jsCode .= "\t);\n";
		$this->jsCode .= "\n";
		$this->jsCode .= "\tvar theme = IMu.Themes.add('$name');\n";
		$this->jsCode .= "\ttheme.load = function(callback)\n";
		$this->jsCode .= "\t{\n";
		$this->jsCode .= "\t\tvar set = IMu.Importer.addSet('$name theme');\n";
		$this->jsCode .= "\t\tset.addItem('" . $theme->jsFile . "');\n";
		$this->jsCode .= $theme->loadCSS("\t\t", false);
		$this->jsCode .= "\t\tif (callback)\n";
		$this->jsCode .= "\t\t\tset.ready(callback);\n";
		$this->jsCode .= "\t};\n";
		$this->jsCode .= "})();\n";
	}

	protected function
	loadCSS($prefix, $enabled = null)
	{
		$string = '';
		foreach ($this->cssList as $item)
			$string .= $this->loadCSSItem($prefix, $item, $enabled);
		return $string;
	}

	protected function
	loadCSSItem($prefix, $item, $enabled)
	{
		$load = "set.addItem('" . $item['file'] . "')";
		if (isset($enabled))
			$load .= '.enabled = ' . ($enabled ? 'true' : 'false');
		$load .= ';';

		if (count($item['test']) == 0)
			return "$prefix$load\n";

		if (isset($this->config['css3-enabled']))
			return '';

		$test = '';
		foreach ($item['test'] as $name => $value)
		{
			if ($test != '')
				$test .= ' && ';
			$test .= "IMu.Platform.$name.is.$value";
		}
		return "${prefix}if ($test)\n$prefix\t$load\n";
	}

	protected function
	newHeader()
	{
		$g = gmdate('Y-m-d H:i:s e');
		$d = @date('Y-m-d H:i:s e');
		return
			"/* THIS FILE IS BUILT AUTOMATICALLY.\n" .
			"** DO NOT CHANGE IT DIRECTLY.\n" .
			"**\n" .
			"** Built at: $g ($d)\n" .
			"*/\n";
	}

	protected function
	write()
	{
		if ($this->jsCode != '')
		{
			$handle = @fopen($this->jsFile, 'w');
			if (! $handle)
				throw new Exception("Can't open " . $this->jsFile);
			fputs($handle, $this->jsCode);
			fclose($handle);
			@chmod($this->jsFile, 0666);
		}
	}
}

class Main extends Output
{
	public function
	__construct($js, $css, $config)
	{
		parent::__construct($js, $css, $config);
	}

	public function
	save()
	{
		$this->doInclude();
		$this->doLoad();
		$this->write();
	}

	protected function
	doLoad()
	{
		$hasCSS = count($this->cssList) > 0;
		$hasImport = count($this->import) > 0;
		if (! $hasCSS && ! $hasImport)
			return;

		$this->jsCode .= "\n";
		$this->jsCode .= "/* Load all included css files and imported files\n";
		$this->jsCode .= "*/\n";
		$this->jsCode .= "(function()\n";
		$this->jsCode .= "{\n";
		$this->jsCode .= "\tvar set = IMu.Importer.addSet('main css/imports');\n";
		$this->jsCode .= $this->loadCSS("\t");
		foreach ($this->import as $import)
			$this->jsCode .= "\tset.addItem('" . $import . "');\n";
		$this->jsCode .= "})()\n";
	}
}

class Theme extends Output
{
	public $name;
	public $titles;

	public function
	__construct($js, $css, $name, $config)
	{
		parent::__construct($js, $css, $config);

		$this->name = $name;
		$this->titles = array();
	}

	public function
	save()
	{
		$this->doInclude();
		$this->write();
	}
}

class Builder
{
	public function
	__construct($js, $css, $config)
	{
		$this->config = $config;
		$this->main = new Main($js, $css, $config);
		$this->theme = null;
	}

	public $main;
	public $theme;

	public function
	process($dir)
	{
		$this->doDir($dir);
		$this->main->save();
	}

	private function
	doDir($dir)
	{
		$theme = $this->theme;

		$build = $dir . '/_build';
		if (is_file($build))
		{
			$handle = fopen($build, 'r');
			if (! $handle)
				throw new Exception("Can't open $build");
			while ($line = fgets($handle))
			{
				$text = '';
				do
				{
					$line = preg_replace('/^\s+/', '', $line);
					$line = preg_replace('/#.*$/', '', $line);
					$line = preg_replace('/\s+$/', '', $line);
					if ($text != '')
						$text .= ' ';
					$text .= $line;
					if (substr($text, -1) != '\\')
						break;
					$text = preg_replace('/\s*\\\\$/', '', $text);
				} while($line = fgets($handle));
				if ($text == '')
					continue;

				$args = preg_split('/\s+/', $text);
				$name = array_shift($args);
				$this->doCommand($dir, $name, $args);
			}
			fclose($handle);
		}
		else
		{
			foreach (array('common', 'client', 'local') as $scope)
				$this->doCommand($dir, 'include', array($scope));
		}

		$this->theme = $theme;
	}

	private function
	doCommand($dir, $name, $args)
	{
		if ($name == 'import')
			$this->doImport($dir, $args);
		else if ($name == 'include')
			$this->doInclude($dir, $args);
		else if ($name == 'title')
			$this->doTitle($dir, $args);
		else if ($name == 'theme')
			$this->doTheme($dir, $args);
		else
			throw new Exception("Unknown command $name in $dir");
	}

	private function
	doImport($dir, $args)
	{
		$output = isset($this->theme) ? $this->theme : $this->main;
		foreach ($args as $arg)
		{
			$path = $dir . '/' . $arg;
			if (is_dir($path))
				$this->doDir($path);
			else if (is_file($path))
				$output->import[] = $path;
			else
			{
				$file = $path . '.js';
				if (is_file($file))
					$output->import[] = $file;
				$glob = glob($path . '*.css');
				if ($glob)
				{
					foreach ($glob as $file)
						$output->import[] = $file;
				}
			}
		}
	}

	private function
	doInclude($dir, $args)
	{
		$output = isset($this->theme) ? $this->theme : $this->main;
		foreach ($args as $arg)
		{
			$path = $dir . '/' . $arg;
/*
			if (is_dir($path))
				$this->doDir($path);
			else if (is_file($path))
				$output->include[] = $path;
			else
			{
				$file = $path . '.js';
				if (is_file($file))
					$output->include[] = $file;
				$glob = glob($path . '*.css');
				if ($glob)
				{
					foreach ($glob as $file)
						$output->include[] = $file;
				}
			}
*/
			if (is_file($path))
				$output->include[] = $path;

			$file = $path . '.js';
			if (is_file($file))
				$output->include[] = $file;
			$glob = glob($path . '*.css');
			if ($glob)
			{
				foreach ($glob as $file)
					$output->include[] = $file;
			}

			if (is_dir($path))
				$this->doDir($path);
		}
	}

	private function
	doTitle($dir, $args)
	{
		if (! isset($this->theme))
			throw new Exception("Can't use title without current theme");
		$lang = $args[0];
		$text = $args[1];
		$this->theme->titles[$lang] = $text;
	}

	private function
	doTheme($dir, $args)
	{
		$js = $dir . '/theme.js';
		$css = $dir . '/css';
		$name = $args[0];
		$this->theme = new Theme($js, $css, $name, $this->config);
		$this->main->include[] = array
		(
			'type' => 'theme',
			'theme' => $this->theme
		);
	}
}

try
{
	$config = array();
	if (is_readable("./config/setup.php"))
		include("./config/setup.php");

	$builder = new Builder('imu.js', 'css', $config);
	$builder->process('.');

	header('Content-type: text/javascript');
	readfile('imu.js');
}
catch (Exception $e)
{
	header('HTTP/1.0 ' . $e->getCode());
	header('Content-type: text/plain');
	printf("Exception: %s\r\n", $e->__toString());
}
?>
