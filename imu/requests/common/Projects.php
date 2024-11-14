<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/Handler.php';

require_once IMu::$lib . '/Handler.php';

$class = 'WebProjects';
class WebProjects extends WebHandler
{
	public function
	method_get($params)
	{
		return $this->handler->call('get', $params);
	}

	public function
	method_list($params)
	{
		return $this->handler->call('list', $params);
	}

	protected function
	getHandler(&$request)
	{
		$this->handler = new IMuHandler( $this->session);
		$this->handler->setName('Projects');
	}
}
?>
