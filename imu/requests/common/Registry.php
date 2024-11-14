<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/Handler.php';

require_once IMu::$lib . '/Module/Registry.php';

$class = 'WebRegistry';
class WebRegistry extends WebHandler
{
	public function
	method_getValue($params)
	{
		return $this->handler->getValue($params);
	}

	public function
	method_setValue($params)
	{
		return $this->handler->setValue($params["keys"], $params["value"]);
	}

	protected function
	getHandler(&$request)
	{
		$this->session->suspend = false;

		$this->handler = new IMuRegistry($this->session);
		$this->handler->destroy = true;
	}
}
?>
