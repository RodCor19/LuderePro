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
		$tabla = $request->get('tabla');
		//variables inicializadas
		$error = '';
		$message = '';
		$createtable = '';
		$camposInsert = null;
		$insert = '';
		$inserts = null;
		$insertsExplode = null;
		$creacionTabla = false;
		$inserciones = false;
		//realiza conexión
		$conexion = PearDatabase::getInstance();
		$conexion->resetSettings('mysqli', $host, $database, $user, $password);
		$conexion->connect();
		if ($conexion->database->_errorMsg){
			$error = 'Error : '.$conexion->database->_errorMsg;
			$conexion = null;
		} else {
			$consulta = "SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?";
			$result	= $conexion->pquery($consulta, array($database, $tabla));
			if(!$result || count($result) == 0){
				$error = 'Error : Falló la consulta';
				$conexion = null;
			}else{
				$createtable = 'CREATE TABLE IF NOT EXISTS `'.$tabla.'`(';
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
				$control = $conexion->pquery($createtable);
				if(!$control){
					$conexion = null;
					$error = "Error : Falló la creación de tabla \n".$conexion->database->_errorMsg;
				}else{
					$creacionTabla = true;
					foreach ($inserts as $key => $value) {
						$control = $conexion->pquery($insert, $value);
						if(!$control){
							$conexion = null;
							$error = 'Error : Insert :'.$key+1;
							break;
						}else{
							$inserciones = true;
						}
					}
				}
			}
		}
		if($conexion != null){
			$responce->setResult(array('success'=>true, 'createtable'=> $creacionTabla, 'inserts' => $inserciones));
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