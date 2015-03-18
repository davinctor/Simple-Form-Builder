<?php
/* Connection with database */
$hostname = "siza.mysql.ukraine.com.ua"; // server path to MySQL
$username = "siza_krassula"; // username
$password = "28uyue6v"; // password
$dbName = "siza_krassula"; // название базы данных
 
/** Try to connect **/
$link = mysqli_connect($hostname ,$username,$password,$dbName) or die("Error " . mysqli_error($link));
?>