<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/Handler.php';

require_once IMu::$lib . '/Module.php';

$class = 'WebModule';
class WebModule extends WebHandler
{
	public function
	method_fetch($params)
	{
		$flag = $params['flag'];
		$offset = $params['offset'];
		$count = $params['count'];
		$columns = $params['columns'];
		return $this->handler->fetch($flag, $offset, $count, $columns);
	}

	public function
	method_fetchHierarchy($params)
	{
		$key = $params['key'];
		$parent = $params['parent'];
		$options = $params['options'];
		return $this->handler->fetchHierarchy($key, $parent, $options);
	}

	public function
	method_findKey($params)
	{
		return $this->handler->findKey($params['key']);
	}

	public function
	method_findKeys($params)
	{
		return $this->handler->findKeys($params['keys']);
	}

	public function
	method_findTerms($params)
	{
		$terms = $params['terms'];
		$options = null;
		if (isset($params['options']))
			$options = $params['options'];
		return $this->handler->findTerms($terms, $options);
	}

	public function
	method_insert($params)
	{
		$values = $params['values'];
		$columns = $params['columns'];
		return $this->handler->insert($values, $columns);
	}

	public function
	method_sort($params)
	{
		$columns = $params['columns'];
		$flags = $params['flags'];
		return $this->handler->sort($columns, $flags);
	}

	// public function
	// method_setMatchLimit($limit)
	// {
	// 	return $this->handler->setMatchLimit($limit);
	// }

	public function
	method_update($params)
	{
		$flag = $params['flag'];
		$offset = $params['offset'];
		$count = $params['count'];
		$values = $params['values'];
		$columns = $params['columns'];
		return $this->handler->update($flag, $offset, $count, $values, $columns);
	}

	public function
	method_updateMany($params)
	{
		$list = $params['list'];
		$values = $params['values'];
		$columns = $params['columns'];
		return $this->handler->updateMany($list,$values,$columns);
	}

	protected function
	getHandler(&$request)
	{
		$this->session->suspend = true;

		if (! isset($request['table']))
			throw new IMuException('ModuleNoTable');
		$this->handler = new IMuModule($request['table'], $this->session);
		$this->handler->destroy = false;
	}
}
?>
