<!DOCTYPE html>
<html>
<!--
** Copyright (c) 2012 KE Software Pty Ltd
-->
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="../general.css"></link>
<title>IMu Widget Framework</title>
</head>
<body>

<h2>IMu Widget Framework</h2>
<h3>Requirements</h3>
<div id="main">
	<p>The following PHP modules are required by IMu</p>
	<ul>
		<li>ctype</li>
		<li>json</li>
	</ul>
	<p>Below are the results of tests to see if these modules are available</p>
	<table>
		<tr>
			<th>Test</th>
			<th>Output</th>
			<th>Result</th>
		</tr>

		<!-- ctype -->
		<tr>
			<td>ctype</td>
<?php
try
{
	$a = ctype_alnum('3') ? 'true' : 'false';
	$b = ctype_digit('3') ? 'true' : 'false';
	$c = ctype_alpha('3') ? 'true' : 'false';
	$output = "$a, $b, $c";
}
catch (Exception $e)
{
	$output = $e->__toString();
}
$result = $output == 'true, true, false' ? 'ok' : 'error';
?>
			<td><?php echo $output ?></td>
			<td><?php echo $result ?></td>
		</tr>

		<!-- json -->
		<tr>
			<td>json_encode</td>
<?php
try
{
	$x = array('abc', 123, array('def', 456));
	$output = json_encode($x);
}
catch (Exception $e)
{
	$output = $e->__toString();
}
$result = $output == '["abc",123,["def",456]]' ? 'ok' : 'error';
?>
			<td><?php echo $output ?></td>
			<td><?php echo $result ?></td>
		</tr>

	</table>
</div>

</body>
</html>
