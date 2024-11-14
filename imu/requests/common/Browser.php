<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/Request.php';

$class = 'WebBrowser';
class WebBrowser extends WebRequest
{
	public function
	process(&$request)
	{
		parent::process($request);

        if (! isset($request['method']))
		{
			$e = new IMuException('BrowserNoMethod');
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
	method_getLanguage($params)
	{
		return ($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : null;
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
