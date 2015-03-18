<?php
include('db.php');

$sql ='';

/* Обработка ajax запроса */
if ( isset($_POST['block-props-detail']) ) {

	$sql = "SELECT `properties`.`ID`, `TYPE`, `properties`.`NAME`, `VALUE` FROM `properties`, `blocks` 
				WHERE `properties`.`BLOCK_ID` = `blocks`.`ID` AND 
					`blocks`.`NAME` LIKE '" . $_POST['block-props-detail'] . "'";

	$result = $link->query($sql) or die (mysqli_error($link));
	$i = 0;
	while($row = mysqli_fetch_row($result)) {
		$objs[$i] = new StdClass();
		$objs[$i]->id = $row[0];
		$objs[$i]->type = $row[1];
		$objs[$i]->name = $row[2];
		$objs[$i]->value = $row[3];
	    $i++;
	}

} 
 else if (isset($_POST['blocks'])) {

	$sql_block = "SELECT `LEVEL`, `blocks`.`NAME`, `ID`
				FROM `blocks`";
	
	$result_block = $link->query($sql_block) or die (mysqli_error($link));
	$i = 0;
	$j = 0;
	while($row_block = mysqli_fetch_row($result_block)) {
		$objs[$i] = new StdClass();
		$objs[$i]->{'level'} = $row_block[0];
		$objs[$i]->{'name'} = $row_block[1];
		
		$sql_block_props = "SELECT `NAME`
				FROM `properties`
				WHERE `properties`.`BLOCK_ID` = " . $row_block[2];
		$result_block_props = $link->query($sql_block_props) or die (mysqli_error($link));

		while ($row_prop = mysqli_fetch_row($result_block_props)) {
			$objs[$i]->{'properties'}[$j] = new StdClass();
			$objs[$i]->{'properties'}[$j]->{'name'} = $row_prop[0];
			$j++;
		}
		$j = 0;
	    $i++;
	}
 }

echo json_encode($objs);

mysqli_close($link);
?>