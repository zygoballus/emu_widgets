<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/Handler.php';

require_once IMu::$lib . '/Module.php';

$class = 'WebUser';
class WebUser extends WebHandler
{
	public function
	method_addEntry($params)
	{
		return $this->call('addEntry', $params);
	}

	public function
	method_addEntries($params)
	{
		return $this->call('addEntries', $params);
	}

	public function
	method_addGroup($params)
	{
		return $this->call('addGroup', $params);
	}

	public function
	method_fetch($params)
	{
		return $this->call('fetch', $params);
	}

	public function
	method_removeEntry($params)
	{
		return $this->call('removeEntry', $params);
	}

	public function
	method_removeEntries($params)
	{
		return $this->call('removeEntries', $params);
	}

	public function
	method_removeAllEntries($params)
	{
		return $this->call('removeAllEntries', $params);
	}

	public function
	method_removeGroup($params)
	{
		return $this->call('removeGroup', $params);
	}

	public function
	method_renameGroup($params)
	{
		return $this->call('renameGroup', $params);
	}

	public function
	method_selectGroup($params)
	{
		return $this->call('selectGroup', $params);
	}

	public function
	method_toggleEntry($params)
	{
		return $this->call('toggleEntry', $params);
	}

        public function
        method_toggleEntries($params)
        {
                return $this->call('toggleEntries', $params);
        }

	protected function
	getHandler(&$request)
	{
		$this->session->suspend = false;

		$this->handler = new IMuHandler($this->session);
		$this->handler->name = 'User';
		$this->handler->destroy = true;
	}

	private function
	call($method, $params)
	{
		$params['ip'] = $_SERVER['REMOTE_ADDR'];
		return $this->handler->call($method, $params);
	}
}
?>
