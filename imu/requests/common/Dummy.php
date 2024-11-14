<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/Request.php';

$class = 'WebDummy';
class WebDummy extends WebRequest
{
	public function
	process($request)
	{
		parent::process($request);

        if (! isset($request['method']))
		{
			$e = new IMuException('DummyNoMethod');
			$e->setCode(400);
            throw $e;
		}
		IMuTrace::write(3, 'Dummy: request %s', $request);

        $method = $this->getMethod($request);
        $params = $this->getParams($request);

        $result = $this->$method($params);
        $this->output($result);
	}

	public function
	method_fail($params)
	{
		$e = new IMuException('DummyException');
		$e->setCode(400);
		throw $e;
	}

	public function
	method_succeed($params)
	{
		return 'this method worked';
	}

    protected function
    output_json($result)
    {
		$response = $this->makeResponse();
        $response['result'] = $result;

		parent::output_json($response);
    }
}
?>
