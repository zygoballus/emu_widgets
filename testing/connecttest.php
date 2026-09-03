<?php
error_reporting( E_ALL );
ini_set( 'display_errors', 1 );
ini_set( 'max_execution_time', 120 );

require_once '../imu/lib/IMu.php';
require_once IMu::$lib . '/Session.php';

$session = new IMuSession('208.103.112.150', 40233);
$session->connect();
 
require_once IMu::$lib . '/Module.php';
require_once IMu::$lib . '/Terms.php';
 
$catalogue = new IMuModule('ecatalogue', $session);
 
$search = new IMuTerms();
$search->add('CatDepartment', 'Mineralogy');
 
$hits = $catalogue->findTerms($search);
printf($hits);
exit(0);

