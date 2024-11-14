<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/Handler.php';

require_once IMu::$lib . '/Module/Luts.php';

$class = 'WebLookup';
class WebLookup extends WebHandler
{
	public function
	method_lookup($params)
	{
		$name = $params['name'];
		$level = 0;
		if (isset($params['level']))
			$level = $params['level'];
		$keys = false;
		if (isset($params['keys']))
			$keys = $params['keys'];
		return $this->handler->lookup($name, -1, $level, $keys);
	}
	public function
	method_lookupAll($params)
	{
		$name = $params['name'];
		$level = 0;
		if (isset($params['level']))
			$level = $params['level'];
		$keys = false;
		if (isset($params['keys']))
			$keys = $params['keys'];
		return $this->handler->lookupAll($name, -1, $level, $keys);
	}

	public function
	method_hierarchy($params)
	{
		$name = $params['name'];
		$level = 0;
		if (isset($params['level']))
			$level = $params['level'];
		$filter = false;
		if (isset($params['filter']))
			$filter = $params['filter'];
		return $this->handler->hierarchy($name, $level, $filter, -1);
	}

	protected function
	getHandler(&$request)
	{
		$this->session->suspend = false;

		$this->handler = new IMuLuts($this->session);
		$this->handler->destroy = true;
	}
}
?>
