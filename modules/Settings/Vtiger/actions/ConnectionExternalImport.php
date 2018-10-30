<?php
/*Esta acción se ejecuta para crear una conexión de bd a otra base de datos de la cual se quiera importar datos*/
class Settings_Vtiger_ConnectionExternalImport_Action extends Settings_Vtiger_Basic_Action {
	
	public function process(Vtiger_Request $request) {
		$responce = new Vtiger_Response();
		$tupla = $request->get('tupla');
		$datos = parse_ini_file('dataBaseExports.ini');
		$host = $datos['host'];
		$database = $datos['database'];
		$user = $datos['user'];
		$password = $datos['password'];
		$error = '';
		$message = '';
		$tuplas = null;
		$conexion = new mysqli($host, $user, $password, $database);
		if (mysqli_connect_errno()){
			$error = 'Error : '.mysqli_connect_error();
			$conexion = null;
			die();
		} else {
			$consulta = 'SELECT distinct '.$tupla['columnname'].' FROM vtiger_'.$tupla['columnname'].';';
			$stmt = $conexion->prepare($consulta);
			if ($stmt->execute()) {
				if($result = $stmt->get_result()){
					if ($result->num_rows > 0) {
						while ($fila = $result->fetch_object()) {
							$tuplas[] = $fila;
						}
					}				
				}else{
					$error = mysqli_error($conexion);
					$conexion = null;
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
}
?>