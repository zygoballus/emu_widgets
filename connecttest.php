<?php
error_reporting( E_ALL );
ini_set( 'display_errors', 1 );
ini_set( 'max_execution_time', 120 );

<?php
require_once './imu/lib/IMu.php';
require_once IMu::$lib . '/Session.php';
 
$session = new IMuSession('208.103.112.150', 40233);
$session->connect();
 
require_once IMu::$lib . '/Module.php';
require_once IMu::$lib . '/Terms.php';
 
$catalogue = new IMuModule('ecatalogue', $session);
 
$search = new IMuTerms();
$search->add('CatCollectionArea', 'Art');
 
$hits = $catalogue->findTerms($search);
printf($hits);
exit(0);


// IMu server
//$config['server-host'] = '208.103.112.150';
//$config['server-port'] = 40233;

// Control test. This connection should always work.
//if ( isset( $_GET['control'] ) ) {
//	$config['server-host'] = '208.80.154.224';
//	$config['server-port'] = 80;
//}

