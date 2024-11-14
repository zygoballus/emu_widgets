<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/Handler.php';

require_once IMu::$lib . '/Modules.php';

$class = 'WebModules';
class WebModules extends WebHandler
{
	public function
	method_addFetchSet($params)
	{
		$name = $params['name'];
		$set = $params['set'];
		return $this->handler->addFetchSet($name, $set);
	}

	public function
	method_addFetchSets($params)
	{
		return $this->handler->addFetchSets($params);
	}

	public function
	method_addSearchAlias($params)
	{
		$name = $params['name'];
		$set = $params['set'];
		return $this->handler->addSearchAlias($name, $set);
	}

	public function
	method_addSearchAliases($params)
	{
		return $this->handler->addSearchAliases($params);
	}

	public function
	method_addSortSet($params)
	{
		$name = $params['name'];
		$set = $params['set'];
		return $this->handler->addSortSet($name, $set);
	}

	public function
	method_addSortSets($params)
	{
		return $this->handler->addSortSets($params);
	}

	public function
	method_fetch($params)
	{
		$flag = $params['flag'];
		$offset = $params['offset'];
		$count = $params['count'];
		$columns = null;
		if (isset($params['columns']))
			$columns = $params['columns'];
		return $this->handler->fetch($flag, $offset, $count, $columns);
	}

	public function
	method_fetchMany($params)
	{
		$list = $params['list'];
		$columns = null;
		if (isset($params['columns']))
			$columns = $params['columns'];
		return $this->handler->fetchMany($list, $columns);
	}

	public function
	method_findKeys($params)
	{
		$keys = $params['keys'];
		$include = null;
		if (isset($params['include']))
			$include = $params['include'];
		return $this->handler->findKeys($keys, $include);
	}

	public function
	method_findTerms($params)
	{
		$terms = $params['terms'];
		return $this->handler->findTerms($terms);
	}

	public function
	method_getAllHits($params)
	{
		return $this->handler->getAllHits();
	}

	public function
	method_sort($params)
	{
		$set = $params['set'];
		$flags = $params['flags'];
		return $this->handler->sort($set, $flags);
	}

	protected function
	getHandler(&$request)
	{
		$this->session->suspend = true;

		$this->handler = new IMuModules($this->session);
		$this->handler->destroy = false;
	}
}
?>
