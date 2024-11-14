<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/Request.php';

require_once IMu::$lib . '/Handler.php';

$class = 'WebReport';
class WebReport extends WebRequest
{
	public function
	process(&$request)
	{
		parent::process($request);

		$this->session->suspend = true;

		$this->handler = new IMuHandler($this->session);
		$this->handler->name = 'Report';

		$result = $this->handler->call('run', $request);
		$type = $result['type'];
		$file = $result['file'];

		header('Content-type: ' . $type);
		fpassthru($file);
	}

    protected $handler;
}
?>
