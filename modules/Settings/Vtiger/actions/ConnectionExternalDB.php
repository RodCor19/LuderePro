<?php
/*Esta acción se ejecuta para crear una conexión de bd a otra base de datos de la cual se quiera importar datos*/
class Settings_Vtiger_ConnectionExternalDB_Action extends Settings_Vtiger_Basic_Action {
	
	public function process(Vtiger_Request $request) {
		$responce = new Vtiger_Response();
		$host = $request->get('dbhost');
		$database = $request->get('dbdatabase');
		$user = $request->get('dbuser');
		$password = $request->get('dbpassword');
		$error = '';
		$message = '';
		$tuplas = null;
		$conexion = new mysqli($host, $user, $password, $database);
		if (mysqli_connect_errno()){
			$error = 'Error : '.mysqli_connect_error();
			$conexion = null;
			die();
		} else {
			$datosConexion =  array(
				'external database' =>array(
					'host' => $host,
					'user' => $user,
					'password' => $password,
					'database' => $database
				)
			);
			$this->ini($datosConexion, 'dataBaseExports.ini');
			if($result = $conexion->query('SELECT tabid, name FROM vtiger_tab WHERE presence in (0, 2);')){
				while ($fila = $result->fetch_object()) {
					$data = null;
					foreach ($fila as $key => $value) {
						if ($key == 'name') {
							$data[$key] = vtranslate($value);
						}else{
							$data[$key] = $value;
						}
					}
					$tuplas[] = $data;
				}
			}else{
				$error = mysqli_error($conexion);
				$conexion = null;
			}
		}
		if($conexion !== null){
			$responce->setResult(array('success'=>true, 'data'=> $tuplas));
		}else{
			$responce->setResult(array('success'=>false, 'message'=> "No se puede conectar con el servidor", 'error' => $error));
		}
		$responce->emit();
	}

	public function validateRequest(Vtiger_Request $request) { 
		$request->validateWriteAccess(); 
	}

	function ini($data, $file = null){
    	$output = array();
    	foreach ($data as $name => $section)
    	{
        	if (is_array($section))
       		{
            	$output[] = "[{$name}]".PHP_EOL; 
            	foreach ($section as $key => $val)
            	{
                	$output[] = "\t$key=$val".PHP_EOL;
            	}
            	$output[]='';
        	}
    	}
    	// pegamos el INI
    	$ini = join("\n", $output);
    	if ($file && is_dir(dirname($file)))
    	{
        	$tmp = fopen($file, 'w+');
        	fwrite($tmp, $ini);
        	fclose($tmp);
    	}
    	return $ini;
	}

}
?>