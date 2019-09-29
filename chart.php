<?php
	require_once 'connection.php'; // подключаем скрипт
	// подключаемся к серверу
	$code_ya = $_POST["code_ya"];
	$link = mysqli_connect($host, $user, $password, $database) 
	    or die("Ошибка " . mysqli_error($link));
	 
	// выполняем операции с базой данных

	$query = "SELECT * FROM regions WHERE code_ya = '".$code_ya."'";
	$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
	if($result){
		$row = mysqli_fetch_array($result);
		$region_id = $row['region_id'];

		$query = "SELECT * FROM neonataldeath WHERE region_id = ".$region_id;
		$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); 
		if($result) {
			$row = mysqli_fetch_array($result);
			$data = array( 
				array("1990", $row['1990']),
                array("2000", $row['2000']),
                array("2001", $row['2001']),
                array("2002", $row['2002']),
                array("2003", $row['2003']),
                array("2004", $row['2004']),
                array("2005", $row['2005']),
                array("2006", $row['2006']),
                array("2007", $row['2007']),
                array("2008", $row['2008']),
                array("2009", $row['2009']),
                array("2010", $row['2010']),
                array("2011", $row['2011']),
                array("2012", $row['2012']),
                array("2013", $row['2013']),
                array("2014", $row['2014']),
                array("2015", $row['2015']),
                array("2016", $row['2016']),
                array("2017", $row['2017']),
                array("2018", $row['2018'])
            ); 
            echo json_encode($data, JSON_FORCE_OBJECT);
		}
		
	} 
	

	// закрываем подключение
	mysqli_close($link);
?>
