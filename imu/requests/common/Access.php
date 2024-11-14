<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/Handler.php';

require_once IMu::$lib . '/Handler.php';

$class = 'WebAccess';
class WebAccess extends WebHandler
{
	public function
	method_getGroups($params)
	{
		return $this->handler->call('getGroups', $params);
	}

	public function
	method_getUsers($params)
	{
		return $this->handler->call('getUsers', $params);
	}

	protected function
	getHandler(&$request)
	{
		$this->handler = new IMuHandler( $this->session);
		$this->handler->setName('Access');
	}
}
?>
