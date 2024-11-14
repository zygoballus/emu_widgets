<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/../Handler.php';

require_once IMu::$lib . '/Handler.php';

$class = 'WebForms';
class WebForms extends WebHandler
{
	public function
	method_edit($params)
	{
		return $this->handler->call('edit', $params);
	}

	public function
	method_fetch($params)
	{
		return $this->handler->call('fetch', $params);
	}

	public function
	method_list($params)
	{
		return $this->handler->call('list', $params);
	}

	public function
	method_remove($params)
	{
		return $this->handler->call('remove', $params);
	}

	public function
	method_save($params)
	{
		return $this->handler->call('save', $params);
	}

	public function
	method_search($params)
	{
		return $this->handler->call('search', $params);
	}

	public function
	method_store($params)
	{
		return $this->handler->call('store', $params);
	}

	public function
	method_use($params)
	{
		return $this->handler->call('use', $params);
	}

	protected function
	getHandler(&$request)
	{
		$this->handler = new IMuHandler( $this->session);
		$this->handler->setName('Projects::Forms');
	}
}
?>
