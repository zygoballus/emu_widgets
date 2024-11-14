<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/Request.php';

require_once IMu::$lib . '/Module.php';
require_once IMu::$lib . '/Session.php';
require_once IMu::$lib . '/Terms.php';

$class = 'WebLogin';
class WebLogin extends WebRequest
{
	public function
	process(&$request)
	{
		parent::process($request);

        if (! isset($request['method']))
		{
			$e = new IMuException('LoginNoMethod');
			$e->setCode(400);
            throw $e;
		}
		IMuTrace::write(3, 'Login: request %s', $request);

        $method = $this->getMethod($request);
        $params = $this->getParams($request);

        $result = $this->$method($params);
        $this->output($result);
	}

	public function
	method_login($params)
	{
		if (! isset($params['username']))
		{
        	$e = new IMuException('LoginNoUsername');
			$e->setCode(400);
			throw $e;
		}
		$username = $params['username'];
		IMuTrace::write(3, 'login: username %s', $username);

		$password = '';
		if (isset($params['password']))
			$password = $params['password'];

		$group = '';
		if (isset($params['group']))
			$group = $params['group'];

		IMuTrace::write(3, 'login: logging in...');
		$this->session->suspend = true;
		$this->session->login($username, $password, $group, false);
		IMuTrace::write(3, 'login: logged in ok');

		$result = array();
		$result['username'] = $username;

		$module = new IMuModule('eparties', $this->session);

		$terms = new IMuTerms();
		$terms->add('AddEmuUserId', $username);

		IMuTrace::write(3, 'login: looking for parties: %s', $terms);
		$hits = $module->findTerms($terms);
		IMuTrace::write(3, 'login: %d hits', $hits);
		if ($hits > 0)
		{
			$columns = array
			(
				'irn',
				'first=NamFirst',
				'last=NamLast',
				'full=NamFullName'
			);
			$data = $module->fetch('start', 0, 1, $columns);
			$user = $data->rows[0];
			$result['irn'] = $user['irn'];
			$result['first'] = $user['first'];
			$result['last'] = $user['last'];
			$result['full'] = $user['full'];
		}

		IMuTrace::write(3, 'login: result %s', $result);

		return $result;
	}

	protected function
	method_logout($params)
	{
		IMuTrace::write(3, 'logout: logging out...');
		$this->session->suspend = false;
		$this->session->logout();
		IMuTrace::write(3, 'login: logged out ok');

		$result = array();
		return $result;
	}

	protected function
	method_checkStatus($params)
	{
		IMuTrace::write(3, 'checkStatus: Web server OK');
		$this->session->suspend = false;
		return $this->session->checkStatus();
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
