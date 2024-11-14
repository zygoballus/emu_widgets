<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/Request.php';

$class = 'WebHandler';
class WebHandler extends WebRequest
{
    public function
    __construct()
    {
		parent::__construct();
        $this->handler = null;
    }

    public function
    process(&$request)
    {
		parent::process($request);

        global $config;

        $this->getHandler($request);

        if (isset($request['id']))
        {
            $this->handler->id = $request['id'];
            unset($request['id']);
        }
        if (isset($request['language']))
        {
            $this->handler->language = $request['language'];
            unset($request['language']);
        }
        else if (isset($config['language']))
        {
            $this->handler->language = $config['language'];
        }
		IMuTrace::write(3, 'Handler: request %s', $request);

		$method = $this->getMethod($request);
		$params = $this->getParams($request);

        $result = $this->$method($params);
        $this->output($result);
    }

    public function
    method_destroy($params)
    {
        $this->handler->destroy = true;
        $this->handler->request(array());
    }

    protected $handler;

    protected function
    output_json($result)
    {
		$response = $this->makeResponse();
        $response['id'] = $this->handler->id;
        $response['result'] = $result;

		parent::output_json($response);
    }
}
?>
