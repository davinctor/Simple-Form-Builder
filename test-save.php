<?php
include('db.php');

$jsonData = json_decode(file_get_contents('php://input'));

$sql ='';

/* Обработка ajax запроса */
if ( isset($jsonData->save) ) {
	if ( $jsonData->save == 'property' ) {
		$block_id = "SELECT `ID` FROM `blocks` WHERE `NAME` LIKE '" . $jsonData->{'block_name'} . "'";
		$result = $link->query($block_id) or die (mysqli_error($link));
		$row = mysqli_fetch_row($result);
		$sql = "INSERT INTO `properties`(`BLOCK_ID`, `TYPE`, `NAME`, `VALUE`) 
					VALUES ('" . $row[0] . "','" . $jsonData->{'type'} . "','" . $jsonData->{'name'} . "','" . $jsonData->{'value'} . "')";
		if ($link->query($sql)) {
			echo "New record created successfully";
		} else {
		    echo "Error: " . $sql . "<br>" . mysqli_error($link);
		}
	} 
	if ( $jsonData->save == 'block' ) {
		$sql = "INSERT INTO `blocks`(`LEVEL`, `NAME`) 
					VALUES ('" . $jsonData->{'level'} . "','" . $jsonData->{'name'} . "')";
		if ($link->query($sql)) {
			echo "New record created successfully";
		} else {
		    echo "Error: " . $sql . "<br>" . mysqli_error($link);
		}
	}
}
else if (  isset($jsonData[0]->update) ) {
	$error = 0;
	for ($i = 1; $i < count($jsonData); $i++) {
		$sql = "UPDATE `properties` SET `VALUE`='" . $jsonData[$i]->value . "' WHERE `ID`=" . $jsonData[$i]->id;
		if (!$link->query($sql)) {
			$error = 1;
		}
	}
	echo ($error != 0 ?  "Error: " . mysqli_error($link) : "Update successfully" );
}

mysqli_close($link);
?>