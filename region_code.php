<?php
	require_once 'connection.php'; // подключаем скрипт
	
	$coord = array();
	// подключаемся к серверу
	$link = mysqli_connect($host, $user, $password, $database) 
	    or die("Ошибка " . mysqli_error($link));
	 
	// выполняем операции с базой данных

	$query = "SELECT * FROM pc";
	$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
	if($result)
	{
	    while($row = mysqli_fetch_array($result))
		{
			array_push($coord, $row['coords']);
		}
		echo json_encode($coord);
	}
	
	// закрываем подключение
	mysqli_close($link);
?>
