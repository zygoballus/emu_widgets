<?php
/* Copyright (c) 2013 KE Software Pty Ltd
*/
ini_set('track_errors', 1);

$Script = $_SERVER['SCRIPT_FILENAME'];
$Top = dirname($Script);

require_once 'lib/IMu.php';
require_once IMu::$lib . '/Exception.php';
require_once IMu::$lib . '/Session.php';
require_once IMu::$lib . '/Trace.php';

$scopes = array('common', 'client', 'local');

/* Configuration */
$config = array();

/* defaults */
$config['lang'] = 'en';
$config['server-host'] = 'localhost';
$config['server-port'] = 40233;
$config['theme'] = 'prague';
$config['trace-file'] = '';
$config['trace-level'] = 1;
$config['multimedia-cache'] = 'no';

foreach ($scopes as $scope)
{
	$file = 'config/' . $scope . '.php';
	if (file_exists($file))
		require_once $file;
}

IMuTrace::setFile($config['trace-file']);
IMuTrace::setLevel($config['trace-level']);

IMuSession::setDefaultHost($config['server-host']);
IMuSession::setDefaultPort($config['server-port']);

try
{
	$values = array();
	if (count($_GET) > 0)
	{
		IMuTrace::write(2, 'setting request values from _GET');
		foreach ($_GET as $name => $value)
			$values[$name] = $value;
	}
	else if (count($_POST) > 0 || count($_FILES) > 0)
	{
		IMuTrace::write(2, 'setting request values from _POST and _FILES');
		foreach ($_POST as $name => $value)
			$values[$name] = $value;
		foreach ($_FILES as $name => $value)
			$values[$name] = $value;
	}
	else
	{
		IMuTrace::write(2, 'setting request values from raw input (JSON)');
		$values = json_decode(file_get_contents('php://input'), true);
	}
	IMuTrace::write(2, 'request values %s', $values);
	if (! isset($values) || ! array_key_exists('request', $values))
		throw new IMuException('WebNoRequest');

	$request = $values['request'];
	unset($values['request']);
	IMuTrace::write(3, 'request name %s', $request);

	IMuTrace::write(3, 'top %s', $Top);
	$file = null;
	foreach (array_reverse($scopes) as $scope)
	{
		$file = 'requests/' . $scope . '/' . $request . '.php';
		if (file_exists($file))
			break;
		$file = null;
	}
	if ($file === null)
		throw new IMuException('WebBadRequest', $request);
	IMuTrace::write(3, 'request file %s', $file);

	$class = null;
	include $file;
	if ($class === null)
		throw new IMuException('WebBadRequestClass', $request, $class);
	IMuTrace::write(3, 'request class %s', $class);

	IMuTrace::write(3, 'instantiating %s', $class);
	$object = new $class();

	IMuTrace::write(3, 'calling %s->process()', $class);
	$object->process($values);
}
catch (Exception $e)
{
	$code = $e->getCode();
	if (! $code)
		$code = 500;
	$mesg = $e->__toString();
	IMuTrace::write(2, 'exception: code %s, mesg "%s"', $code, $mesg);

	header("HTTP/1.0 $code");
	header("Content-type: text/javascript");

	$response = array();
	$response['id'] = $e->getID();
	$response['args'] = $e->getArgs();
	$response['code'] = $code;
	print json_encode($response);
}
IMuTrace::write(2, 'request complete');
?>
