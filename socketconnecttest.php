<?php
error_reporting( E_ALL );
ini_set( 'display_errors', 1 );
ini_set( 'max_execution_time', 120 );

// IMu server
//$config['server-host'] = '208.103.112.159';
$config['server-host'] = '208.103.112.150';
$config['server-port'] = 40233;

// Control test. This connection should always work.
if ( isset( $_GET['control'] ) ) {
	$config['server-host'] = '208.80.154.224';
	$config['server-port'] = 80;
}

if ( isset( $_GET['host'] ) ) {
	$config['server-host'] = $_GET['host'];
}
if ( isset( $_GET['port'] ) ) {
	$config['server-port'] = $_GET['port'];
}

$socket = @fsockopen($config['server-host'], $config['server-port'], $errno, $errstr, 15);
if ($socket === false) {
	print('ErrorNo: ' . $errno . "<br>");
	print('Error: ' . $errstr . "<br>");
} else {
	print('Connected OK');
	fclose( $socket );
}
