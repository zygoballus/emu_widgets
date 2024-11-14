<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
$class = 'WebRequest';
class WebRequest
{
    public function
    __construct()
    {
		$this->session = new IMuSession();
        $this->output = 'json';
    }

    public function
    process(&$request)
    {
        if (isset($request['port']))
        {
            $this->session->port = $request['port'];
            unset($request['port']);
        }
        if (isset($request['context']))
        {
            $this->session->context = $request['context'];
            unset($request['context']);
        }

		// Done in subclass
    }

	protected $session;
    protected $output;

	protected function
	getMethod(&$request)
	{
        if (! isset($request['method']))
            throw new IMuException('RequestNoMethod');

        $method = 'method_' . $request['method'];
        unset($request['method']);

		return $method;
	}

	protected function
	getParams(&$request)
	{
        if (isset($request['params']))
        {
            $params = $request['params'];
            if (! is_array($params))
                $params = json_decode($params, true);
			unset($request['params']);
        }
        else
        {
            $params = array();
            foreach ($request as $name => $value)
			{
                $params[$name] = $value;
			}
			foreach ($params as $name => $value)
				unset($request[$name]);
        }
		return $params;
	}

	protected function
	makeResponse()
	{
		$response = array();
		$response['port'] = $this->session->port;
		if ($this->session->context)
			$response['context'] = $this->session->context;
		return $response;
	}

    protected function
    output($response)
    {
        $method = 'output_' . $this->output;
        $this->$method($response);
    }

    protected function
    output_json($response)
    {
        header('Content-type: application/json');
        print json_encode($response);
    }
}
?>
