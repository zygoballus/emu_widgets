<?php
require_once '../imu/lib/IMu.php';
require_once IMu::$lib . '/Session.php';

$session = new IMuSession;
$session->host = "208.103.112.150";
$session->port = 40233;
try
{
    $session->connect();
}
catch (IMuException $e)
{
    // Check for specific SessionConnect error
    if ($e->id != 'SessionConnect')
    {
        echo "Error: $e";
        exit(1);
    }
}
echo "Connection successful.<br>\n";
 
require_once IMu::$lib . '/Module.php';
require_once IMu::$lib . '/Terms.php';
 
$catalogue = new IMuModule('ecatalogue', $session);
 
$search = new IMuTerms();
$search->add('CatDepartment', 'Mineralogy');
 
$hits = $catalogue->findTerms($search);
printf($hits);
exit(0);
