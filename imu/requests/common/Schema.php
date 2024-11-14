<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/Handler.php';

require_once IMu::$lib . '/Handler.php';

$class = 'WebSchema';
class WebSchema extends WebHandler
{
	public function
	method_getColumn($params)
	{
		return $this->handler->call('getColumn', $params);
	}

	public function
	method_getColumns($params)
	{
		return $this->handler->call('getColumns', $params);
	}

	public function
	method_getTables($params)
	{
		return $this->handler->call('getTables', $params);
	}

	protected function
	getHandler(&$request)
	{
		$this->handler = new IMuHandler( $this->session);
		$this->handler->setName('Schema');
	}
}
?>
