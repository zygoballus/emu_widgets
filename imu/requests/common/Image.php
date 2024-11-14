<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once IMu::$lib . '/MIME.php';

$class = 'WebImage';
class WebImage
{
	public function
	process($params)
	{
		global $config;
		global $scopes;

		IMuTrace::write(3, 'image: params %s', $params);
		if (! isset($params['name']))
			throw new IMuException('ImageNoName');
		$name = $params['name'];

		$theme = $config['theme'];
		if (isset($params['theme']))
			$theme = $params['theme'];

		$lang = $config['lang'];
		if (isset($params['lang']))
			$lang = $params['lang'];

		if ($lang == 'ar')
			$dir = 'rtl';
		else
			$dir = 'ltr';

		foreach (array('themes/' . $theme, 'shared') as $base)
		{
			foreach (array($lang, $dir, '') as $extra)
			{
				foreach (array_reverse($scopes) as $scope)
				{
					$path = $base . '/' . $scope . '/images/' . $name;
					if ($extra)
						$path .= '_' . $extra;
					$list = glob("$path.*");
					if ($list)
					{
						IMuTrace::write(3, 'image: found');
						$this->send($list[0]);
						return;
					}
				}
			}
		}
		IMuTrace::write(2, 'image: not found');
	}

	protected function
	send($file)
	{
		/* It is acutally more efficient to just generate a redirect to the
		** actual file containing the image.
		$type = IMuMIME::getType($file);
		header('Content-type: ' . $type);
		print file_get_contents($file);
		*/

		header('Location: ' . $file);
	}
}
?>
