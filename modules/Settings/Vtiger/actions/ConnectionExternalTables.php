<?php
class Settings_Vtiger_ConnectionExternalTables_Action extends Settings_Vtiger_Basic_Action {
	
	public function process(Vtiger_Request $request) {
		$responce = new Vtiger_Response();
		//toma los datos para la conexión desde el archivo
		$datos = parse_ini_file('dataBaseExports.ini');
		
		//toma los datos del array datos
		$host = $datos['host'];
		$database = $datos['database'];
		$user = $datos['user'];
		$password = $datos['password'];
		$tablas = $request->get('tablas');
		//variables inicializadas
		$error = '';
		$message = '';
		$resultados = null;
		
		//realiza conexión
		$conexion = PearDatabase::getInstance();
		$conexion->resetSettings('mysqli', $host, $database, $user, $password);
		$conexion->connect();
		if ($conexion->database->_errorMsg){
			$error = 'Error : '.$conexion->database->_errorMsg;
			$conexion = null;
		} else {
			foreach ($tablas as $dato) {
				$conexion->resetSettings('mysqli', $host, $database, $user, $password);
				$conexion->connect();
				$tabla = $dato['nombre'];
				$accion = $dato['accion'];
				$resultado = null;
				$createtable = '';
				$camposInsert = null;
				$insert = '';
				$inserts = null;
				$consulta = "SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?";
				$result	= $conexion->pquery($consulta, array($database, $tabla));
				if($conexion->database->_errorMsg || $conexion->num_rows($result) == 0){
					if ($accion == 'crear') {
						$resultado['creacion'] = 'error_consulta';
					}else{
						$resultado['insercion'] = 'error_consulta';
					}					
				}else{
					$createtable = 'CREATE TABLE `'.$tabla.'`(';
					foreach ($result as $key => $value) {
						$camposInsert[] = $value['COLUMN_NAME'];
						$createtable = $createtable."\n\t`".$value['COLUMN_NAME']."` ".$value['DATA_TYPE'];
						if ($value['CHARACTER_MAXIMUM_LENGTH'] != null && !($value['DATA_TYPE'] == 'text' && $value['CHARACTER_MAXIMUM_LENGTH'] == 65535)) {
							$createtable = $createtable."(".$value['CHARACTER_MAXIMUM_LENGTH'].")";
						}
						if ($value['IS_NULLABLE'] == 'NO'){
							$createtable = $createtable." not null";
						}
						
						if($key < $conexion->num_rows($result)-1)
							$createtable = $createtable.',';
					}
					$createtable = $createtable.');';
					$consulta = "SELECT * FROM `".$tabla."`";
					$result	= $conexion->pquery($consulta);
					if ($conexion->database->_errorMsg) {
						$resultado['insercion'] = 'error_consulta';
					}
					$insert = 'INSERT INTO `'.$tabla.'` (';
					foreach ($camposInsert as $key => $value) {
						$insert = $insert."`".$value."`";
						if($key !== count($camposInsert)-1)
							$insert = $insert.', ';
					}
					$insert = $insert.') VALUES (';
					foreach ($camposInsert as $key => $value) {
						$insert = $insert.'?';
						if($key !== count($camposInsert)-1)
							$insert = $insert.' ,';
					}
					$insert = $insert.')';
					$conexion->resetSettings();
					$conexion->connect();
					foreach ($result as $value) {
						$data = null;
						foreach ($camposInsert as $campo) {
							$data[] = $value[$campo];
						}
						$inserts[] = $data;
					}

					if ($accion == 'crear') {	
						$control = $conexion->pquery($createtable);
						if ($conexion->database->_errorMsg) {
							$resultado['creacion'] = 'error_crear';
						}else{
							$resultado['creacion'] = 'creada';
							if($resultado['insercion'] != 'error_consulta' && count($inserts) > 0){
								$inserciones = false;
								foreach ($inserts as $key => $value) {
									$conexion->pquery($insert, $value);
									if($conexion->database->_errorMsg){
										$inserciones = false;
										break;
									}else{
										$inserciones = true;
									}
								}
								if ($inserciones) {
									$resultado['insercion'] = 'insercion';
								}else{
									$resultado['insercion'] = 'error_insertar';
								}
							}elseif(count($inserts) == 0)
								$resultado['insercion'] = 'error_vacio';
						}
					}else{
						if($resultado['insercion'] != 'error_consulta' && count($inserts) > 0){
							$inserciones = false;
							foreach ($inserts as $key => $value) {
								$conexion->pquery($insert, $value);
								if($conexion->database->_errorMsg){
									$inserciones = false;
									break;
								}else{
									$inserciones = true;
								}
							}
							if ($inserciones) {
								$resultado['insercion'] = 'insercion';
							}else{
								$resultado['insercion'] = 'error_insertar';
							}
						}elseif(count($inserts) == 0)
							$resultado['insercion'] = 'error_vacio';
					}
				}
				$resultados[$tabla]=$resultado;
			}
		}

		if($conexion != null){
			$responce->setResult(array('success'=>true, 'data'=> $resultados));
		}else{
			if($message == '')
				$responce->setResult(array('success'=>false, 'message'=> "No se puede conectar con el servidor", 'error' => $error));
			else
				$responce->setResult(array('success'=>false, 'message'=> $message, 'error' => $error));
			$conexion = PearDatabase::getInstance();
		}
		$conexion->resetSettings();
		$conexion->connect();
		$responce->emit();
	}

	public function validateRequest(Vtiger_Request $request) { 
		$request->validateWriteAccess(); 
	}
}
?>